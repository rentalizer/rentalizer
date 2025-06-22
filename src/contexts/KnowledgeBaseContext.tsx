
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

const saveVideosToStorage = (videos: VideoContent[]) => {
  try {
    const dataToSave = JSON.stringify(videos);
    localStorage.setItem(STORAGE_KEY, dataToSave);
    console.log('✅ SAVED TO STORAGE:', videos.length, 'videos');
  } catch (error) {
    console.error('❌ FAILED TO SAVE:', error);
  }
};

const loadVideosFromStorage = (): VideoContent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 LOADING FROM STORAGE:', !!stored);
    
    if (stored && stored !== 'null' && stored !== 'undefined') {
      const parsed = JSON.parse(stored);
      console.log('📥 FOUND DATA:', parsed.length, 'videos');
      
      const videos = parsed.map((video: any) => ({
        ...video,
        processedAt: video.processedAt ? new Date(video.processedAt) : undefined
      }));
      
      console.log('✅ LOADED FROM STORAGE:', videos.length, 'videos');
      console.log('📋 LOADED VIDEOS:', videos.map(v => ({ id: v.id, title: v.title, status: v.status })));
      return videos;
    } else {
      console.log('📭 NO DATA IN STORAGE');
    }
  } catch (error) {
    console.error('❌ FAILED TO LOAD:', error);
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

  // Load videos from localStorage on mount
  useEffect(() => {
    console.log('🚀 CONTEXT PROVIDER MOUNTING');
    const savedVideos = loadVideosFromStorage();
    
    console.log('📊 SETTING STATE WITH:', savedVideos.length, 'videos');
    setVideosState(savedVideos);
    setIsLoaded(true);
    console.log('✅ CONTEXT PROVIDER LOADED');
  }, []);

  const setVideos = (newVideos: VideoContent[]) => {
    console.log('🔄 SET VIDEOS CALLED:', newVideos.length, 'videos');
    setVideosState(newVideos);
    saveVideosToStorage(newVideos);
  };

  const addVideos = (newVideos: VideoContent[]) => {
    console.log('➕ ADD VIDEOS CALLED:', newVideos.length, 'new videos');
    console.log('📊 CURRENT STATE:', videos.length, 'videos');
    
    const updatedVideos = [...videos, ...newVideos];
    console.log('📈 TOTAL AFTER ADD:', updatedVideos.length, 'videos');
    
    setVideosState(updatedVideos);
    saveVideosToStorage(updatedVideos);
  };

  // Debug state changes
  useEffect(() => {
    if (isLoaded) {
      console.log('🔍 STATE CHANGED - VIDEOS COUNT:', videos.length);
      console.log('📝 CURRENT VIDEOS:', videos.map(v => ({ 
        id: v.id, 
        title: v.title, 
        status: v.status,
        hasTranscript: !!v.transcript 
      })));
    }
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
