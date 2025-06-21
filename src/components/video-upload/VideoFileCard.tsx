
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileVideo, 
  X, 
  Check,
  AlertCircle,
  Wand2,
  Clock,
  Upload
} from 'lucide-react';
import { VideoFile } from './types';
import { formatFileSize } from './videoUploadUtils';

interface VideoFileCardProps {
  video: VideoFile;
  commonTopics: string[];
  onUpdate: (id: string, updates: Partial<VideoFile>) => void;
  onRemove: (id: string) => void;
  onToggleTopic: (videoId: string, topic: string) => void;
  onGenerateTitle: (videoId: string, transcript: string) => void;
}

export const VideoFileCard = ({ 
  video, 
  commonTopics, 
  onUpdate, 
  onRemove, 
  onToggleTopic, 
  onGenerateTitle 
}: VideoFileCardProps) => {
  const handleTranscriptChange = (transcript: string) => {
    onUpdate(video.id, { transcript });
    
    // Auto-generate title when transcript is added and no title exists
    if (transcript.trim() && !video.title && video.status === 'pending') {
      onGenerateTitle(video.id, transcript);
    }
  };

  const markAsReady = () => {
    // Allow marking as ready even without transcript
    const title = video.title || `Video - ${video.file.name.replace(/\.[^/.]+$/, "")}`;
    onUpdate(video.id, { 
      status: 'ready' as const,
      title: title,
      transcript: video.transcript || 'No transcript provided'
    });
  };

  const getStatusProgress = () => {
    const status = video.status;
    const hasContent = video.title || video.transcript.trim();
    const fileSize = video.file.size;
    const isLargeFile = fileSize > 100 * 1024 * 1024; // 100MB threshold
    
    switch (status) {
      case 'pending':
        if (hasContent) {
          // If has content, show 90% (can be uploaded but not fully optimized)
          return { progress: 90, text: 'Ready for Upload', color: 'bg-green-500' };
        } else if (isLargeFile) {
          // Large files without content show lower progress
          return { progress: 25, text: 'Large File - Add Content to Optimize', color: 'bg-yellow-500' };
        } else {
          // Small files without content
          return { progress: 50, text: 'Add Content to Optimize', color: 'bg-yellow-500' };
        }
      case 'generating-title':
        return { progress: 75, text: 'Generating Title...', color: 'bg-blue-500' };
      case 'ready':
        return { progress: 100, text: 'Ready for Upload', color: 'bg-green-500' };
      case 'uploaded':
        return { progress: 100, text: 'Uploaded Successfully', color: 'bg-green-600' };
      default:
        return { progress: 0, text: 'Unknown Status', color: 'bg-gray-500' };
    }
  };

  const statusInfo = getStatusProgress();
  const isGeneratingTitle = video.status === 'generating-title';
  const isReadyForUpload = video.status === 'ready' || video.status === 'pending';
  const hasContent = video.title || video.transcript.trim();
  const isLargeFile = video.file.size > 100 * 1024 * 1024; // 100MB

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <FileVideo className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{video.file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(video.file.size)}
                  {isLargeFile && <span className="text-orange-600 ml-2">• Large File</span>}
                </p>
                {video.title && (
                  <p className="text-sm font-medium mt-1 text-green-700">{video.title}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isReadyForUpload && hasContent && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Ready to Upload
                  </Badge>
                )}
                {isReadyForUpload && !hasContent && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Can Upload (No Content)
                  </Badge>
                )}
                {isGeneratingTitle && (
                  <Badge variant="outline">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generating Title...
                  </Badge>
                )}
                {video.status === 'uploaded' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Check className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(video.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{statusInfo.text}</span>
                <span className="text-xs text-gray-500">{statusInfo.progress}%</span>
              </div>
              <div className="relative">
                <Progress value={statusInfo.progress} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${statusInfo.color}`}
                  style={{ width: `${statusInfo.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className={video.status === 'pending' && !hasContent ? 'font-medium text-yellow-600' : ''}>
                  File Added
                </span>
                <span className={hasContent && video.status === 'pending' ? 'font-medium text-green-600' : isGeneratingTitle ? 'font-medium text-blue-600' : ''}>
                  {hasContent ? 'Content Added' : 'Add Content'}
                </span>
                <span className={isReadyForUpload && hasContent ? 'font-medium text-green-600' : ''}>
                  Ready
                </span>
              </div>
            </div>

            {isLargeFile && !hasContent && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <p className="text-sm text-orange-800">
                    <strong>Large File Detected:</strong> Adding a transcript will help generate better titles and improve searchability.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Video Transcript (Optional)</label>
                {video.transcript.trim() && !isGeneratingTitle && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateTitle(video.id, video.transcript)}
                    disabled={isGeneratingTitle}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generate Title
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Paste or type the video transcript here (optional)..."
                value={video.transcript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                rows={6}
                className={video.transcript.trim() ? "border-green-200 bg-green-50" : ""}
              />
              <p className="text-xs text-gray-500">
                Videos can be uploaded without content and transcripts can be added later. Adding content now will auto-generate titles and improve organization.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
