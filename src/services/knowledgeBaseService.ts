
interface VideoContent {
  id: string;
  title: string;
  url: string;
  transcript: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  topics: string[];
  duration?: string;
  processedAt?: Date;
}

export class KnowledgeBaseService {
  private static videos: VideoContent[] = [];

  static setVideos(videos: VideoContent[]) {
    this.videos = videos;
  }

  static getVideos(): VideoContent[] {
    return this.videos;
  }

  static searchVideos(query: string): VideoContent[] {
    const lowerQuery = query.toLowerCase();
    const completedVideos = this.videos.filter(v => v.status === 'completed');
    
    return completedVideos.filter(video => {
      const titleMatch = video.title.toLowerCase().includes(lowerQuery);
      const transcriptMatch = video.transcript.toLowerCase().includes(lowerQuery);
      const topicMatch = video.topics.some(topic => 
        topic.toLowerCase().includes(lowerQuery)
      );
      
      return titleMatch || transcriptMatch || topicMatch;
    });
  }

  static generateResponse(query: string): string {
    const relevantVideos = this.searchVideos(query);
    
    if (relevantVideos.length === 0) {
      return "I don't have specific information about that topic in my current knowledge base. Could you try rephrasing your question or ask about rental arbitrage, property management, scaling strategies, or other topics covered in Richie's training materials?";
    }

    // Create a response based on the most relevant video content
    const topVideo = relevantVideos[0];
    const additionalVideos = relevantVideos.slice(1, 3);
    
    let response = `Based on Richie's training materials, here's what I found:\n\n`;
    
    // Extract relevant portion of transcript (first 300 characters that contain the query)
    const queryIndex = topVideo.transcript.toLowerCase().indexOf(query.toLowerCase());
    let relevantText = '';
    
    if (queryIndex !== -1) {
      const start = Math.max(0, queryIndex - 100);
      const end = Math.min(topVideo.transcript.length, queryIndex + 300);
      relevantText = topVideo.transcript.substring(start, end);
      if (start > 0) relevantText = '...' + relevantText;
      if (end < topVideo.transcript.length) relevantText += '...';
    } else {
      relevantText = topVideo.transcript.substring(0, 300) + '...';
    }
    
    response += `From "${topVideo.title}":\n${relevantText}\n\n`;
    
    if (additionalVideos.length > 0) {
      response += `Related topics covered in other training materials:\n`;
      additionalVideos.forEach(video => {
        response += `• ${video.title}\n`;
      });
    }
    
    response += `\nThis information comes from Richie's comprehensive rental arbitrage training program. Would you like me to elaborate on any specific aspect?`;
    
    return response;
  }

  static getStats() {
    const completedVideos = this.videos.filter(v => v.status === 'completed');
    const topics = [...new Set(completedVideos.flatMap(v => v.topics))];
    
    return {
      totalVideos: completedVideos.length,
      totalTopics: topics.length,
      topics: topics
    };
  }
}
