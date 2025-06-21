
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface KnowledgeBaseContextType {
  videos: VideoContent[];
  setVideos: (videos: VideoContent[]) => void;
  addVideos: (newVideos: VideoContent[]) => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideosState] = useState<VideoContent[]>([]);

  const setVideos = (newVideos: VideoContent[]) => {
    setVideosState(newVideos);
  };

  const addVideos = (newVideos: VideoContent[]) => {
    setVideosState(prev => [...prev, ...newVideos]);
  };

  return (
    <KnowledgeBaseContext.Provider value={{ videos, setVideos, addVideos }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};
