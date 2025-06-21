
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const STORAGE_KEY = 'richie-knowledge-base-videos';

// Helper functions for localStorage
const saveVideosToStorage = (videos: VideoContent[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    console.log('Videos saved to localStorage:', videos.length);
  } catch (error) {
    console.error('Failed to save videos to localStorage:', error);
  }
};

const loadVideosFromStorage = (): VideoContent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert processedAt back to Date objects if they exist
      const videos = parsed.map((video: any) => ({
        ...video,
        processedAt: video.processedAt ? new Date(video.processedAt) : undefined
      }));
      console.log('Videos loaded from localStorage:', videos.length);
      return videos;
    }
  } catch (error) {
    console.error('Failed to load videos from localStorage:', error);
  }
  return [];
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideosState] = useState<VideoContent[]>([]);

  // Load videos from localStorage on component mount
  useEffect(() => {
    const savedVideos = loadVideosFromStorage();
    if (savedVideos.length > 0) {
      setVideosState(savedVideos);
    }
  }, []);

  const setVideos = (newVideos: VideoContent[]) => {
    setVideosState(newVideos);
    saveVideosToStorage(newVideos);
  };

  const addVideos = (newVideos: VideoContent[]) => {
    const updatedVideos = [...videos, ...newVideos];
    setVideosState(updatedVideos);
    saveVideosToStorage(updatedVideos);
  };

  // Auto-save whenever videos change
  useEffect(() => {
    if (videos.length > 0) {
      saveVideosToStorage(videos);
    }
  }, [videos]);

  return (
    <KnowledgeBaseContext.Provider value={{ videos, setVideos, addVideos }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};
