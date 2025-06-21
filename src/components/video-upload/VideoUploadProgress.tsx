
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { VideoFile } from './types';

interface VideoUploadProgressProps {
  videoFiles: VideoFile[];
  onUploadAll: () => void;
  isUploading: boolean;
}

export const VideoUploadProgress = ({ 
  videoFiles, 
  onUploadAll, 
  isUploading 
}: VideoUploadProgressProps) => {
  const readyCount = videoFiles.filter(v => v.status === 'ready' && v.transcript.trim()).length;
  const progressPercentage = videoFiles.length > 0 ? (readyCount / videoFiles.length) * 100 : 0;

  if (videoFiles.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-sm text-gray-600">
          {readyCount} of {videoFiles.length} videos ready
        </p>
        <Progress value={progressPercentage} className="w-48 mt-1" />
      </div>
      {readyCount > 0 && (
        <Button 
          onClick={onUploadAll} 
          disabled={isUploading}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : `Upload ${readyCount} Video${readyCount > 1 ? 's' : ''}`}
        </Button>
      )}
    </div>
  );
};
