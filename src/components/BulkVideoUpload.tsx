
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { VideoUploadArea } from './video-upload/VideoUploadArea';
import { VideoUploadProgress } from './video-upload/VideoUploadProgress';
import { VideoFileList } from './video-upload/VideoFileList';
import { VideoFile, ProcessedVideo } from './video-upload/types';
import { generateVideoTitle } from './video-upload/videoUploadUtils';

interface BulkVideoUploadProps {
  onVideosAdded: (videos: ProcessedVideo[]) => void;
  commonTopics: string[];
}

export const BulkVideoUpload = ({ onVideosAdded, commonTopics }: BulkVideoUploadProps) => {
  const { toast } = useToast();
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideosAdded = (newVideos: VideoFile[]) => {
    setVideoFiles(prev => [...prev, ...newVideos]);
  };

  const handleGenerateTitle = async (videoId: string, transcript: string) => {
    if (!transcript.trim()) return;

    setVideoFiles(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'generating-title' as const } : video
    ));

    try {
      const title = await generateVideoTitle(videoId, transcript);
      
      setVideoFiles(prev => prev.map(video => 
        video.id === videoId ? { 
          ...video, 
          title: title || `Video ${videoId.substring(0, 8)}`,
          status: 'ready' as const
        } : video
      ));

    } catch (error) {
      console.error('Error generating title:', error);
      setVideoFiles(prev => prev.map(video => 
        video.id === videoId ? { 
          ...video, 
          title: `Video ${videoId.substring(0, 8)}`,
          status: 'ready' as const
        } : video
      ));
      
      toast({
        title: "Title Generation Failed",
        description: "Using fallback title. You can edit it manually.",
        variant: "destructive"
      });
    }
  };

  const updateVideoFile = (id: string, updates: Partial<VideoFile>) => {
    setVideoFiles(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  const removeVideoFile = (id: string) => {
    setVideoFiles(prev => prev.filter(video => video.id !== id));
  };

  const toggleTopic = (videoId: string, topic: string) => {
    setVideoFiles(prev => prev.map(video => 
      video.id === videoId
        ? {
            ...video,
            topics: video.topics.includes(topic)
              ? video.topics.filter(t => t !== topic)
              : [...video.topics, topic]
          }
        : video
    ));
  };

  const uploadAllVideos = async () => {
    // Include both ready and pending videos for upload
    const uploadableVideos = videoFiles.filter(v => 
      v.status === 'ready' || v.status === 'pending'
    );
    
    if (uploadableVideos.length === 0) {
      toast({
        title: "No Videos to Upload",
        description: "Please add some videos first",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const processedVideos: ProcessedVideo[] = uploadableVideos.map(video => ({
        id: video.id,
        title: video.title || `Video - ${video.file.name.replace(/\.[^/.]+$/, "")}`,
        url: `local-upload-${video.file.name}`,
        transcript: video.transcript || 'No transcript provided',
        status: 'completed' as const,
        topics: video.topics.length > 0 ? video.topics : ['Q&A Session'],
        processedAt: new Date()
      }));

      onVideosAdded(processedVideos);

      // Remove uploaded videos from the list
      setVideoFiles(prev => prev.filter(v => !uploadableVideos.includes(v)));

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${uploadableVideos.length} video${uploadableVideos.length > 1 ? 's' : ''} to knowledge base`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload videos to knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Bulk Video Upload
            </CardTitle>
            <VideoUploadProgress 
              videoFiles={videoFiles}
              onUploadAll={uploadAllVideos}
              isUploading={isUploading}
            />
          </div>
        </CardHeader>
      </Card>

      <VideoUploadArea onVideosAdded={handleVideosAdded} />

      <VideoFileList 
        videoFiles={videoFiles}
        commonTopics={commonTopics}
        onUpdate={updateVideoFile}
        onRemove={removeVideoFile}
        onToggleTopic={toggleTopic}
        onGenerateTitle={handleGenerateTitle}
      />
    </div>
  );
};
