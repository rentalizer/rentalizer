
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileVideo, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VideoFile } from './types';
import { generateVideoId, isVideoFile } from './videoUploadUtils';

interface VideoUploadAreaProps {
  onVideosAdded: (videos: VideoFile[]) => void;
}

export const VideoUploadArea = ({ onVideosAdded }: VideoUploadAreaProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (files: File[]) => {
    const videoFiles = files.filter(isVideoFile);

    if (videoFiles.length === 0) {
      toast({
        title: "No Video Files",
        description: "Please drop video files (MP4, MOV, AVI)",
        variant: "destructive"
      });
      return;
    }

    const newVideoFiles: VideoFile[] = videoFiles.map(file => ({
      id: generateVideoId(),
      file,
      title: '',
      transcript: '',
      topics: [],
      status: 'pending'
    }));

    onVideosAdded(newVideoFiles);

    toast({
      title: "Videos Added",
      description: `Added ${videoFiles.length} video file${videoFiles.length > 1 ? 's' : ''} for processing`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5" />
          Bulk Video Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileVideo className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">
            Drop video files here or click to browse
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Supports MP4, MOV, AVI files. AI will generate titles automatically.
          </p>
          <input
            type="file"
            multiple
            accept="video/*,.mp4,.mov,.avi"
            onChange={handleFileInput}
            className="hidden"
            id="video-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
