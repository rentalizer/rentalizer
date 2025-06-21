
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

// Helper functions for localStorage with better error handling
const saveVideosToStorage = (videos: VideoContent[]) => {
  try {
    const dataToSave = JSON.stringify(videos);
    localStorage.setItem(STORAGE_KEY, dataToSave);
    console.log('✅ Videos saved to localStorage:', videos.length, 'videos');
    console.log('📦 Saved data size:', dataToSave.length, 'characters');
  } catch (error) {
    console.error('❌ Failed to save videos to localStorage:', error);
  }
};

const loadVideosFromStorage = (): VideoContent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 Loading from localStorage, found data:', !!stored);
    
    if (stored && stored !== 'null' && stored !== 'undefined') {
      const parsed = JSON.parse(stored);
      console.log('📥 Parsed data:', parsed.length, 'videos');
      
      // Convert processedAt back to Date objects if they exist
      const videos = parsed.map((video: any) => ({
        ...video,
        processedAt: video.processedAt ? new Date(video.processedAt) : undefined
      }));
      
      console.log('✅ Videos loaded from localStorage:', videos.length);
      return videos;
    } else {
      console.log('📭 No valid data found in localStorage');
    }
  } catch (error) {
    console.error('❌ Failed to load videos from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load videos from localStorage on component mount
  useEffect(() => {
    console.log('🚀 KnowledgeBaseProvider mounting, loading videos...');
    const savedVideos = loadVideosFromStorage();
    
    if (savedVideos.length > 0) {
      console.log('📚 Setting', savedVideos.length, 'videos from localStorage');
      setVideosState(savedVideos);
    } else {
      console.log('🆕 No videos found, starting fresh');
    }
    
    setIsLoaded(true);
    console.log('✅ KnowledgeBaseProvider fully loaded');
  }, []);

  const setVideos = (newVideos: VideoContent[]) => {
    console.log('🔄 setVideos called with', newVideos.length, 'videos');
    setVideosState(newVideos);
    saveVideosToStorage(newVideos);
  };

  const addVideos = (newVideos: VideoContent[]) => {
    console.log('➕ addVideos called with', newVideos.length, 'new videos');
    console.log('📊 Current videos count:', videos.length);
    
    const updatedVideos = [...videos, ...newVideos];
    console.log('📈 Total after adding:', updatedVideos.length, 'videos');
    
    setVideosState(updatedVideos);
    saveVideosToStorage(updatedVideos);
  };

  // Debug log whenever videos change
  useEffect(() => {
    if (isLoaded) {
      console.log('🔍 Videos state changed:', videos.length, 'videos');
      console.log('📝 Video details:', videos.map(v => ({ id: v.id, title: v.title, status: v.status })));
      
      // Always save to localStorage when videos change (except initial load)
      if (videos.length > 0) {
        saveVideosToStorage(videos);
      }
    }
  }, [videos, isLoaded]);

  // Debug: Log context provider state
  useEffect(() => {
    console.log('🔗 KnowledgeBaseProvider state:', {
      videosCount: videos.length,
      isLoaded,
      hasContext: true
    });
  }, [videos, isLoaded]);

  const value = {
    videos,
    setVideos,
    addVideos
  };

  return (
    <KnowledgeBaseContext.Provider value={value}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};
