
// YouTube transcript extraction service
export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface VideoDetails {
  title: string;
  description: string;
  duration: string;
  channelTitle: string;
}

class YouTubeTranscriptService {
  private apiKey: string | null = null;

  constructor() {
    // For now, we'll use a public API approach
    // In production, you'd want to use YouTube Data API v3
  }

  async extractVideoId(url: string): Promise<string | null> {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  async getVideoDetails(videoId: string): Promise<VideoDetails | null> {
    try {
      // Using a public API to get video details
      const response = await fetch(`https://noembed.com/embed?url=https://youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      
      return {
        title: data.title || 'Unknown Title',
        description: data.description || '',
        duration: this.formatDuration(data.duration || 0),
        channelTitle: data.author_name || 'Unknown Channel'
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  async extractTranscript(videoId: string): Promise<string> {
    try {
      console.log('Attempting to extract transcript for video ID:', videoId);
      
      // Simulated transcript content for demo
      const simulatedTranscript = `
Welcome to today's session on the 3X rental strategy. I'm going to walk you through the complete process of finding, analyzing, and securing profitable rental properties that can generate 3 times your monthly expenses.

First, let's talk about property selection. The key is to focus on areas with high rental demand, good schools, and growing job markets. I always look for properties that are priced below market value but in neighborhoods that are on the upswing.

Next, we'll cover the 3X calculation itself. This means if your monthly expenses are $2,000, you need to find properties that can generate at least $6,000 in monthly rental income. This gives you a substantial buffer for maintenance, vacancies, and profit.

Let me show you a real example. I recently acquired a property in Austin for $180,000. After renovations of about $15,000, I was able to get it rented for $2,800 per month. With total monthly expenses of about $900, this property generates over 3X returns.

The key strategies I use include:
- Off-market property sourcing through wholesalers
- Creative financing to minimize down payments
- Value-add renovations that maximize rent potential
- Professional property management for hands-off income

Now, let's talk about scaling this approach. Once you have one successful property, you can use the equity and cash flow to acquire more properties. I call this the "snowball effect" - each property makes the next one easier to acquire.

For Q&A, remember that every market is different. What works in Austin might not work in Seattle. Always do your local market research and build relationships with local investors and professionals.

The most important thing is to start. Even if you can't find a perfect 3X property right away, a 2X property that you can improve to 3X is still a great investment.

Any questions about the 3X strategy? Remember, this is about creating sustainable, long-term wealth through real estate investing.`;

      return simulatedTranscript;
      
    } catch (error) {
      console.error('Error extracting transcript:', error);
      throw new Error('Failed to extract transcript from YouTube video');
    }
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async extractFromUrl(url: string): Promise<Array<{ id: string; url: string; title: string; duration: string }>> {
    console.log('Processing URL:', url);
    
    // Check if it's a playlist URL
    if (url.includes('list=')) {
      return this.extractPlaylistVideos(url);
    }
    
    // Check if it's a channel URL
    if (url.includes('/@') || url.includes('/channel/') || url.includes('/c/')) {
      return this.extractChannelVideos(url);
    }
    
    // Check if it's a single video URL
    const videoId = await this.extractVideoId(url);
    if (videoId) {
      return this.extractSingleVideo(url, videoId);
    }
    
    throw new Error('Invalid YouTube URL. Please provide a channel URL, playlist URL, or individual video URL.');
  }

  async extractChannelVideos(channelUrl: string): Promise<Array<{ id: string; url: string; title: string; duration: string }>> {
    try {
      console.log('Extracting from channel:', channelUrl);
      
      // Generate multiple demo videos for channel extraction
      const channelVideos = [];
      const videoTitles = [
        "3X Strategy: Property Selection Fundamentals",
        "Market Analysis for Rental Properties",
        "Creative Financing Techniques",
        "Property Management Best Practices",
        "Scaling Your Rental Portfolio",
        "Legal Compliance for Landlords",
        "Rental Arbitrage Deep Dive",
        "Automation Tools for Property Managers",
        "Guest Communication Strategies",
        "Pricing Strategy for Maximum ROI",
        "Property Renovation on a Budget",
        "Tax Strategies for Real Estate Investors",
        "Building Your Real Estate Network",
        "Due Diligence Checklist",
        "Emergency Fund Planning",
        "Insurance for Rental Properties",
        "Eviction Process and Prevention",
        "Seasonal Rental Strategies",
        "Technology Stack for Investors",
        "Exit Strategies and Portfolio Optimization"
      ];

      for (let i = 0; i < Math.min(50, videoTitles.length); i++) {
        channelVideos.push({
          id: `channel_video_${i + 1}_${Date.now()}`,
          url: `${channelUrl}?v=demo_${i + 1}`,
          title: videoTitles[i] || `Channel Video ${i + 1}`,
          duration: `${Math.floor(Math.random() * 30) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
      }

      return channelVideos;
    } catch (error) {
      console.error('Error extracting channel videos:', error);
      throw new Error('Failed to extract videos from YouTube channel');
    }
  }

  async extractSingleVideo(url: string, videoId: string): Promise<Array<{ id: string; url: string; title: string; duration: string }>> {
    try {
      const details = await this.getVideoDetails(videoId);
      
      return [{
        id: videoId,
        url: url,
        title: details?.title || 'Unknown Video',
        duration: details?.duration || '0:00'
      }];
    } catch (error) {
      console.error('Error extracting single video:', error);
      throw new Error('Failed to extract video information');
    }
  }

  async extractPlaylistVideos(playlistUrl: string): Promise<Array<{ id: string; url: string; title: string; duration: string }>> {
    try {
      // Extract playlist ID from URL
      const playlistMatch = playlistUrl.match(/[?&]list=([^&]+)/);
      if (!playlistMatch) {
        throw new Error('Invalid playlist URL');
      }

      console.log('Extracting from playlist:', playlistMatch[1]);

      // Generate multiple demo videos for playlist extraction
      const playlistVideos = [];
      const videoTitles = [
        "Complete 3X Strategy Course - Introduction",
        "Finding Your First Rental Property",
        "Calculating True Cash Flow",
        "Negotiation Tactics That Work",
        "Property Inspection Checklist",
        "Financing Options Explained",
        "Setting Up Property Management",
        "Tenant Screening Process",
        "Maintenance and Repairs 101",
        "Maximizing Rental Income",
        "Legal Protection Strategies",
        "Building Your Investment Team",
        "Market Cycle Understanding",
        "Portfolio Diversification",
        "Advanced Tax Strategies",
        "Technology and Automation",
        "Scaling to 10+ Properties",
        "International Real Estate",
        "Real Estate Syndications",
        "Building Generational Wealth"
      ];

      for (let i = 0; i < Math.min(50, videoTitles.length); i++) {
        playlistVideos.push({
          id: `playlist_video_${i + 1}_${Date.now()}`,
          url: `${playlistUrl}&index=${i + 1}`,
          title: videoTitles[i] || `Playlist Video ${i + 1}`,
          duration: `${Math.floor(Math.random() * 45) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
      }

      return playlistVideos;
    } catch (error) {
      console.error('Error extracting playlist:', error);
      throw error;
    }
  }
}

export const youtubeTranscriptService = new YouTubeTranscriptService();
