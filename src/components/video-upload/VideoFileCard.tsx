
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileVideo, 
  X, 
  Check,
  AlertCircle,
  Wand2
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
                </p>
                {video.title && (
                  <p className="text-sm font-medium mt-1 text-green-700">{video.title}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {video.status === 'ready' && video.transcript.trim() && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Ready to Upload
                  </Badge>
                )}
                {video.status === 'generating-title' && (
                  <Badge variant="outline">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generating Title...
                  </Badge>
                )}
                {video.status === 'pending' && (
                  <Badge variant="outline">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Add Transcript
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

            <div>
              <label className="text-sm font-medium mb-2 block">Topics (select relevant topics)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonTopics.map(topic => (
                  <Badge
                    key={topic}
                    variant={video.topics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onToggleTopic(video.id, topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Video Transcript *</label>
                {video.transcript.trim() && (video.status === 'pending' || video.status === 'ready') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateTitle(video.id, video.transcript)}
                    disabled={video.status === 'generating-title'}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generate Title
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Paste or type the video transcript here..."
                value={video.transcript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                rows={6}
                className={video.transcript.trim() ? "border-green-200 bg-green-50" : ""}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
