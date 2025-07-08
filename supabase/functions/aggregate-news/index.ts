import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  guid?: string;
  content?: string;
}

interface FeedSource {
  name: string;
  url: string;
  tags: string[];
}

// RSS Feed sources for STR industry
const feedSources: FeedSource[] = [
  {
    name: "AirDNA",
    url: "https://www.airdna.co/blog/rss.xml",
    tags: ["Analytics", "Market Trends"]
  },
  {
    name: "VRM Intel",
    url: "https://www.vrmintel.com/feed/",
    tags: ["Industry News", "Tech Updates"]
  },
  {
    name: "ShortTermRentalz",
    url: "https://shorttermrentalz.com/feed/",
    tags: ["Industry News", "Operations"]
  },
  {
    name: "BiggerPockets",
    url: "https://www.biggerpockets.com/blog/feed",
    tags: ["Investment", "Market Trends"]
  },
  {
    name: "Hospitable",
    url: "https://www.hospitable.com/blog/rss.xml",
    tags: ["Software", "Tech Updates"]
  }
];

async function parseRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    console.log(`Fetching RSS feed from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Rentalizer-News-Aggregator/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    // Simple XML parsing for RSS (you might want to use a proper XML parser)
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      const title = extractXMLValue(itemXml, 'title');
      const link = extractXMLValue(itemXml, 'link');
      const description = extractXMLValue(itemXml, 'description');
      const pubDate = extractXMLValue(itemXml, 'pubDate');
      const guid = extractXMLValue(itemXml, 'guid');
      const content = extractXMLValue(itemXml, 'content:encoded') || extractXMLValue(itemXml, 'content');
      
      if (title && link) {
        items.push({
          title: cleanText(title),
          link: link.trim(),
          description: description ? cleanText(description) : undefined,
          pubDate: pubDate?.trim(),
          guid: guid?.trim(),
          content: content ? cleanText(content) : undefined
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    return [];
  }
}

function extractXMLValue(xml: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : undefined;
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function parseDate(dateString: string): Date {
  // Try to parse various date formats
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // If parsing fails, return current date
  return new Date();
}

function generateTags(title: string, description: string, sourceTags: string[]): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags = [...sourceTags];
  
  // Auto-tag based on keywords
  if (text.includes('regulation') || text.includes('law') || text.includes('legal')) {
    tags.push('Regulations');
  }
  if (text.includes('price') || text.includes('pricing') || text.includes('revenue')) {
    tags.push('Pricing');
  }
  if (text.includes('market') || text.includes('demand') || text.includes('occupancy')) {
    tags.push('Market Trends');
  }
  if (text.includes('software') || text.includes('app') || text.includes('platform')) {
    tags.push('Software');
  }
  if (text.includes('airbnb') || text.includes('vrbo') || text.includes('booking')) {
    tags.push('Platforms');
  }
  
  return [...new Set(tags)];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting news aggregation process...');
    
    let totalNewArticles = 0;
    
    for (const source of feedSources) {
      console.log(`Processing feed for ${source.name}...`);
      
      const rssItems = await parseRSSFeed(source.url);
      console.log(`Found ${rssItems.length} items in ${source.name} feed`);
      
      for (const item of rssItems) {
        try {
          // Check if article already exists
          const { data: existing } = await supabaseClient
            .from('news_items')
            .select('id')
            .eq('url', item.link)
            .single();
          
          if (existing) {
            console.log(`Article already exists: ${item.title}`);
            continue;
          }
          
          // Parse publication date
          const publishedAt = item.pubDate ? parseDate(item.pubDate) : new Date();
          
          // Generate tags
          const tags = generateTags(
            item.title, 
            item.description || '', 
            source.tags
          );
          
          // Create summary from description or content
          let summary = item.description || item.content || '';
          if (summary.length > 300) {
            summary = summary.substring(0, 297) + '...';
          }
          
          // Insert the news item
          const { error: insertError } = await supabaseClient
            .from('news_items')
            .insert({
              title: item.title,
              url: item.link,
              source: source.name,
              summary: summary || null,
              content: item.content || null,
              published_at: publishedAt.toISOString(),
              tags: tags,
              admin_submitted: false,
              status: 'published'
            });
          
          if (insertError) {
            console.error(`Error inserting article: ${insertError.message}`);
          } else {
            console.log(`Successfully added: ${item.title}`);
            totalNewArticles++;
          }
          
        } catch (error) {
          console.error(`Error processing item: ${error.message}`);
        }
      }
    }
    
    console.log(`News aggregation completed. Added ${totalNewArticles} new articles.`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed feeds. Added ${totalNewArticles} new articles.`,
        totalNewArticles 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error in news aggregation:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})