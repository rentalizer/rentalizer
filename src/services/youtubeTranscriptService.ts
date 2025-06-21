
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
      
      // Since we can't directly access YouTube's transcript API from the browser,
      // we'll provide a realistic simulation that explains the limitation
      const simulatedTranscript = `
[Transcript Processing Notice]

To extract real YouTube transcripts, this system needs:

1. YouTube Data API v3 credentials (API key)
2. Backend service to handle CORS restrictions
3. Access to YouTube's caption/transcript endpoints

Current Status: Browser-based transcript extraction is limited by:
- CORS policies preventing direct YouTube API calls
- YouTube's authentication requirements
- Rate limiting on public endpoints

Suggested Implementation:
- Set up a backend service with YouTube API credentials
- Use official YouTube Data API v3 for caption access
- Implement proper authentication and error handling

For video ID: ${videoId}
This would contain the actual spoken content from the video, including:
- Main talking points about 3X rental strategy
- Property selection criteria and tips
- Q&A responses and common solutions
- Market analysis insights
- Implementation strategies and examples

To enable real transcript extraction, please configure the YouTube Data API integration.`;

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
      
      // Since we can't access YouTube API directly from browser, 
      // we'll return a message explaining the limitation
      return [
        {
          id: 'channel_notice_1',
          url: channelUrl, // Use the actual channel URL instead of fake video URLs
          title: 'Channel Video Extraction - API Setup Required',
          duration: '0:00'
        }
      ];
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

      // Since we can't access YouTube API directly from browser,
      // we'll return a message explaining the limitation
      return [
        {
          id: 'playlist_notice_1',
          url: playlistUrl, // Use the actual playlist URL instead of fake video URLs
          title: 'Playlist Video Extraction - API Setup Required',
          duration: '0:00'
        }
      ];
    } catch (error) {
      console.error('Error extracting playlist:', error);
      throw error;
    }
  }
}

export const youtubeTranscriptService = new YouTubeTranscriptService();
