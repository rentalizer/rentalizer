const newsService = require('../services/newsService');
const newsAggregationService = require('../services/newsAggregationService');

class NewsController {
  /**
   * Create a new news item (manual submission)
   * POST /api/news
   */
  async createNewsItem(req, res) {
    try {
      const userId = req.user.id;
      const newsData = req.body;

      const newsItem = await newsService.createNewsItem(newsData, userId);

      res.status(201).json({
        success: true,
        message: 'News item created successfully',
        data: newsItem
      });
    } catch (error) {
      console.error('Error creating news item:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create news item'
      });
    }
  }

  /**
   * Get all news items with pagination and filtering
   * GET /api/news
   */
  async getNewsItems(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        source,
        search,
        sortBy = 'published_at',
        sortOrder = 'desc',
        status = 'published'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        source,
        search,
        sortBy,
        sortOrder,
        status
      };

      const result = await newsService.getNewsItems(options);

      res.status(200).json({
        success: true,
        message: 'News items retrieved successfully',
        data: result.newsItems,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting news items:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve news items'
      });
    }
  }

  /**
   * Get a single news item by ID
   * GET /api/news/:id
   */
  async getNewsItemById(req, res) {
    try {
      const { id } = req.params;

      const newsItem = await newsService.getNewsItemById(id);

      res.status(200).json({
        success: true,
        message: 'News item retrieved successfully',
        data: newsItem
      });
    } catch (error) {
      console.error('Error getting news item:', error);
      const statusCode = error.message === 'News item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to retrieve news item'
      });
    }
  }

  /**
   * Update a news item
   * PUT /api/news/:id
   */
  async updateNewsItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const newsItem = await newsService.updateNewsItem(id, updateData, userId);

      res.status(200).json({
        success: true,
        message: 'News item updated successfully',
        data: newsItem
      });
    } catch (error) {
      console.error('Error updating news item:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update news item'
      });
    }
  }

  /**
   * Delete a news item
   * DELETE /api/news/:id
   */
  async deleteNewsItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await newsService.deleteNewsItem(id, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error deleting news item:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete news item'
      });
    }
  }

  /**
   * Increment click count for a news item
   * POST /api/news/:id/click
   */
  async incrementClickCount(req, res) {
    try {
      const { id } = req.params;

      const newsItem = await newsService.incrementClickCount(id);

      res.status(200).json({
        success: true,
        message: 'Click count incremented',
        data: {
          id: newsItem._id,
          click_count: newsItem.click_count,
          engagement_score: newsItem.engagement_score
        }
      });
    } catch (error) {
      console.error('Error incrementing click count:', error);
      const statusCode = error.message === 'News item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to increment click count'
      });
    }
  }

  /**
   * Toggle pin status for a news item (admin only)
   * POST /api/news/:id/pin
   */
  async togglePin(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await newsService.togglePin(id, userId);

      res.status(200).json({
        success: true,
        message: result.isPinned ? 'News item pinned' : 'News item unpinned',
        data: {
          newsItem: result.newsItem,
          isPinned: result.isPinned
        }
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle pin'
      });
    }
  }

  /**
   * Toggle featured status for a news item (admin only)
   * POST /api/news/:id/feature
   */
  async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await newsService.toggleFeatured(id, userId);

      res.status(200).json({
        success: true,
        message: result.isFeatured ? 'News item featured' : 'News item unfeatured',
        data: {
          newsItem: result.newsItem,
          isFeatured: result.isFeatured
        }
      });
    } catch (error) {
      console.error('Error toggling featured:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle featured'
      });
    }
  }

  /**
   * Get trending news
   * GET /api/news/trending
   */
  async getTrendingNews(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const newsItems = await newsService.getTrendingNews(parseInt(limit));

      res.status(200).json({
        success: true,
        message: 'Trending news retrieved successfully',
        data: newsItems
      });
    } catch (error) {
      console.error('Error getting trending news:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve trending news'
      });
    }
  }

  /**
   * Get featured news
   * GET /api/news/featured
   */
  async getFeaturedNews(req, res) {
    try {
      const { limit = 5 } = req.query;
      
      const newsItems = await newsService.getFeaturedNews(parseInt(limit));

      res.status(200).json({
        success: true,
        message: 'Featured news retrieved successfully',
        data: newsItems
      });
    } catch (error) {
      console.error('Error getting featured news:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve featured news'
      });
    }
  }

  /**
   * Get news statistics
   * GET /api/news/stats
   */
  async getNewsStats(req, res) {
    try {
      const stats = await newsService.getNewsStats();

      res.status(200).json({
        success: true,
        message: 'News statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting news stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve news statistics'
      });
    }
  }

  /**
   * Get news by source statistics
   * GET /api/news/stats/by-source
   */
  async getNewsBySource(req, res) {
    try {
      const stats = await newsService.getNewsBySource();

      res.status(200).json({
        success: true,
        message: 'News by source retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting news by source:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve news by source'
      });
    }
  }

  /**
   * Search news items
   * GET /api/news/search
   */
  async searchNews(req, res) {
    try {
      const { q: searchTerm, ...options } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await newsService.searchNews(searchTerm, options);

      res.status(200).json({
        success: true,
        message: 'Search results retrieved successfully',
        data: result.newsItems,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search news'
      });
    }
  }

  /**
   * Get news items by source name
   * GET /api/news/source/:source
   */
  async getNewsBySourceName(req, res) {
    try {
      const { source } = req.params;
      const { page = 1, limit = 20, sortBy = 'published_at', sortOrder = 'desc' } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await newsService.getNewsBySourceName(source, options);

      res.status(200).json({
        success: true,
        message: `News from ${source} retrieved successfully`,
        data: result.newsItems,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting news by source:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve news by source'
      });
    }
  }

  /**
   * Trigger news aggregation (admin only)
   * POST /api/news/aggregate
   */
  async triggerAggregation(req, res) {
    try {
      const { sources, limit } = req.body;

      const result = await newsAggregationService.aggregateNews({ sources, limit });

      res.status(200).json({
        success: true,
        message: 'News aggregation completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error triggering aggregation:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to aggregate news'
      });
    }
  }

  /**
   * Fetch from a specific source (admin only)
   * POST /api/news/aggregate/:source
   */
  async fetchFromSource(req, res) {
    try {
      const { source } = req.params;

      const result = await newsAggregationService.fetchFromSpecificSource(source);

      res.status(200).json({
        success: true,
        message: `News from ${source} fetched successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error fetching from source:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch from source'
      });
    }
  }

  /**
   * Get available news sources
   * GET /api/news/sources
   */
  async getAvailableSources(req, res) {
    try {
      const sources = newsAggregationService.getAvailableSources();

      res.status(200).json({
        success: true,
        message: 'Available sources retrieved successfully',
        data: sources
      });
    } catch (error) {
      console.error('Error getting available sources:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve available sources'
      });
    }
  }

  /**
   * Toggle a news source (admin only)
   * PATCH /api/news/sources/:source
   */
  async toggleSource(req, res) {
    try {
      const { source } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'enabled field must be a boolean'
        });
      }

      const result = newsAggregationService.toggleSource(source, enabled);

      res.status(200).json({
        success: true,
        message: `Source ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error toggling source:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to toggle source'
      });
    }
  }
}

module.exports = new NewsController();

