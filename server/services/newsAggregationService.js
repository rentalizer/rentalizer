const axios = require('axios');
const NewsService = require('./newsService');

class NewsAggregationService {
  constructor() {
    // Configure RSS/API feed sources for each platform
    this.feedSources = {
      'AirDNA': {
        type: 'rss',
        url: 'https://www.airdna.co/blog/rss.xml',
        enabled: true
      },
      'Skift': {
        type: 'rss',
        url: 'https://skift.com/feed/',
        enabled: true
      },
      'VRM Intel': {
        type: 'rss',
        url: 'https://www.vrmintel.com/feed/',
        enabled: true
      },
      'ShortTermRentalz': {
        type: 'rss',
        url: 'https://shorttermrentalz.com/feed/',
        enabled: true
      },
      'Hospitable': {
        type: 'rss',
        url: 'https://www.hospitable.com/blog/rss.xml',
        enabled: true
      },
      'PriceLabs': {
        type: 'rss',
        url: 'https://www.pricelabs.co/blog/rss.xml',
        enabled: true
      },
      'Guesty': {
        type: 'rss',
        url: 'https://www.guesty.com/blog/feed/',
        enabled: true
      },
      'BiggerPockets': {
        type: 'rss',
        url: 'https://www.biggerpockets.com/blog/category/rental-properties/feed/',
        enabled: true
      }
    };

    // Default axios configuration
    this.axiosConfig = {
      timeout: 10000, // 10 seconds
      headers: {
        'User-Agent': 'Rentalizer-NewsAggregator/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/json'
      }
    };
  }

  /**
   * Parse RSS/XML feed to extract news items
   * @param {string} xmlContent - The XML content
   * @param {string} source - The source name
   * @returns {Array} Parsed news items
   */
  parseRSSFeed(xmlContent, source) {
    try {
      const items = [];
      
      // Simple XML parsing (in production, use a proper XML parser like 'xml2js' or 'fast-xml-parser')
      // For now, using regex for basic RSS parsing
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
      const linkRegex = /<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/;
      const descriptionRegex = /<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/;
      const pubDateRegex = /<pubDate>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/pubDate>/;
      const contentRegex = /<content:encoded>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/content:encoded>/;
      const guidRegex = /<guid.*?>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/guid>/;

      let match;
      while ((match = itemRegex.exec(xmlContent)) !== null) {
        const itemXml = match[1];
        
        const titleMatch = itemXml.match(titleRegex);
        const linkMatch = itemXml.match(linkRegex);
        const descriptionMatch = itemXml.match(descriptionRegex);
        const pubDateMatch = itemXml.match(pubDateRegex);
        const contentMatch = itemXml.match(contentRegex);
        const guidMatch = itemXml.match(guidRegex);

        if (titleMatch && linkMatch) {
          const title = this.decodeHTML(titleMatch[1].trim());
          const url = linkMatch[1].trim();
          const summary = descriptionMatch ? this.stripHTML(this.decodeHTML(descriptionMatch[1].trim())) : null;
          const content = contentMatch ? this.stripHTML(this.decodeHTML(contentMatch[1].trim())) : null;
          const publishedAt = pubDateMatch ? new Date(pubDateMatch[1].trim()) : new Date();
          const externalId = guidMatch ? guidMatch[1].trim() : url;

          // Extract tags from content (simple approach)
          const tags = this.extractTags(title, summary, content);

          items.push({
            source,
            title: title.substring(0, 300), // Limit to 300 chars
            url,
            summary: summary ? summary.substring(0, 1000) : null,
            content: content ? content.substring(0, 10000) : null,
            published_at: publishedAt,
            tags: tags.slice(0, 5), // Limit to 5 tags
            external_id: externalId,
            admin_submitted: false,
            status: 'published'
          });
        }
      }

      return items;
    } catch (error) {
      console.error(`Error parsing RSS feed for ${source}:`, error.message);
      return [];
    }
  }

  /**
   * Decode HTML entities
   * @param {string} text - Text with HTML entities
   * @returns {string} Decoded text
   */
  decodeHTML(text) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&nbsp;': ' '
    };
    
    return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
  }

  /**
   * Strip HTML tags from text
   * @param {string} html - HTML content
   * @returns {string} Plain text
   */
  stripHTML(html) {
    if (!html) return '';
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract relevant tags from content
   * @param {string} title - Article title
   * @param {string} summary - Article summary
   * @param {string} content - Article content
   * @returns {Array} Extracted tags
   */
  extractTags(title, summary, content) {
    const keywords = [
      'airbnb', 'vrbo', 'booking', 'vacation rental', 'short-term rental',
      'property management', 'hosting', 'pricing', 'revenue', 'occupancy',
      'regulation', 'market', 'investment', 'technology', 'automation',
      'cleaning', 'maintenance', 'guest', 'review', 'listing'
    ];

    const text = `${title} ${summary || ''} ${content || ''}`.toLowerCase();
    const foundTags = [];

    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        foundTags.push(keyword);
      }
    });

    return foundTags;
  }

  /**
   * Fetch news from a single source
   * @param {string} sourceName - The source name
   * @param {Object} sourceConfig - The source configuration
   * @returns {Promise<Array>} Fetched news items
   */
  async fetchFromSource(sourceName, sourceConfig) {
    try {
      console.log(`📰 Fetching news from ${sourceName}...`);
      
      const response = await axios.get(sourceConfig.url, this.axiosConfig);
      
      if (response.status === 200) {
        const items = this.parseRSSFeed(response.data, sourceName);
        console.log(`✅ Fetched ${items.length} items from ${sourceName}`);
        return items;
      } else {
        console.warn(`⚠️ Unexpected status ${response.status} from ${sourceName}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching from ${sourceName}:`, error.message);
      return [];
    }
  }

  /**
   * Aggregate news from all enabled sources
   * @param {Object} options - Aggregation options
   * @returns {Promise<Object>} Aggregation results
   */
  async aggregateNews(options = {}) {
    try {
      const {
        sources = Object.keys(this.feedSources),
        limit = null
      } = options;

      console.log('🔄 Starting news aggregation...');
      console.log(`📋 Sources to fetch: ${sources.join(', ')}`);

      const allNewsItems = [];
      const fetchPromises = [];

      // Fetch from all sources in parallel
      for (const sourceName of sources) {
        const sourceConfig = this.feedSources[sourceName];
        
        if (sourceConfig && sourceConfig.enabled) {
          fetchPromises.push(
            this.fetchFromSource(sourceName, sourceConfig)
              .then(items => {
                allNewsItems.push(...items);
                return { source: sourceName, count: items.length };
              })
              .catch(error => {
                console.error(`Error with ${sourceName}:`, error.message);
                return { source: sourceName, count: 0, error: error.message };
              })
          );
        }
      }

      // Wait for all fetches to complete
      const fetchResults = await Promise.all(fetchPromises);

      console.log(`📊 Total items fetched: ${allNewsItems.length}`);

      // Sort by published date (newest first)
      allNewsItems.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

      // Apply limit if specified
      const itemsToSave = limit ? allNewsItems.slice(0, limit) : allNewsItems;

      // Bulk create news items in database
      const saveResult = await NewsService.bulkCreateNewsItems(itemsToSave);

      console.log(`✅ News aggregation complete!`);
      console.log(`   - Created: ${saveResult.created}`);
      console.log(`   - Skipped: ${saveResult.skipped}`);
      console.log(`   - Errors: ${saveResult.errors}`);

      return {
        success: true,
        totalFetched: allNewsItems.length,
        totalNewArticles: saveResult.created,
        totalSkipped: saveResult.skipped,
        totalErrors: saveResult.errors,
        fetchResults,
        saveResult
      };
    } catch (error) {
      console.error('❌ News aggregation failed:', error.message);
      throw new Error(`Failed to aggregate news: ${error.message}`);
    }
  }

  /**
   * Fetch news from a specific source
   * @param {string} sourceName - The source name
   * @returns {Promise<Object>} Fetch results
   */
  async fetchFromSpecificSource(sourceName) {
    try {
      const sourceConfig = this.feedSources[sourceName];
      
      if (!sourceConfig) {
        throw new Error(`Unknown source: ${sourceName}`);
      }

      if (!sourceConfig.enabled) {
        throw new Error(`Source is disabled: ${sourceName}`);
      }

      const items = await this.fetchFromSource(sourceName, sourceConfig);
      const saveResult = await NewsService.bulkCreateNewsItems(items);

      return {
        success: true,
        source: sourceName,
        totalFetched: items.length,
        totalNewArticles: saveResult.created,
        totalSkipped: saveResult.skipped,
        totalErrors: saveResult.errors,
        saveResult
      };
    } catch (error) {
      throw new Error(`Failed to fetch from ${sourceName}: ${error.message}`);
    }
  }

  /**
   * Get list of available sources
   * @returns {Array} Available sources
   */
  getAvailableSources() {
    return Object.keys(this.feedSources).map(sourceName => ({
      name: sourceName,
      enabled: this.feedSources[sourceName].enabled,
      type: this.feedSources[sourceName].type,
      url: this.feedSources[sourceName].url
    }));
  }

  /**
   * Enable or disable a source
   * @param {string} sourceName - The source name
   * @param {boolean} enabled - Enable or disable
   * @returns {Object} Updated source config
   */
  toggleSource(sourceName, enabled) {
    if (!this.feedSources[sourceName]) {
      throw new Error(`Unknown source: ${sourceName}`);
    }

    this.feedSources[sourceName].enabled = enabled;
    
    return {
      source: sourceName,
      enabled: this.feedSources[sourceName].enabled
    };
  }
}

module.exports = new NewsAggregationService();

