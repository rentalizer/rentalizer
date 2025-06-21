
import React from 'react';
import { VideoFileCard } from './VideoFileCard';
import { VideoFile } from './types';

interface VideoFileListProps {
  videoFiles: VideoFile[];
  commonTopics: string[];
  onUpdate: (id: string, updates: Partial<VideoFile>) => void;
  onRemove: (id: string) => void;
  onToggleTopic: (videoId: string, topic: string) => void;
  onGenerateTitle: (videoId: string, transcript: string) => void;
}

export const VideoFileList = ({ 
  videoFiles, 
  commonTopics, 
  onUpdate, 
  onRemove, 
  onToggleTopic, 
  onGenerateTitle 
}: VideoFileListProps) => {
  if (videoFiles.length === 0) return null;

  return (
    <div className="space-y-4">
      {videoFiles.map((video) => (
        <VideoFileCard
          key={video.id}
          video={video}
          commonTopics={commonTopics}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onToggleTopic={onToggleTopic}
          onGenerateTitle={onGenerateTitle}
        />
      ))}
    </div>
  );
};
