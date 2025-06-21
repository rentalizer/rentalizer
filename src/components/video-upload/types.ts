
export interface VideoFile {
  id: string;
  file: File;
  title: string;
  transcript: string;
  topics: string[];
  status: 'pending' | 'generating-title' | 'ready' | 'uploaded';
}

export interface ProcessedVideo {
  id: string;
  title: string;
  url: string;
  transcript: string;
  status: 'completed';
  topics: string[];
  processedAt: Date;
}
