import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileVideo, 
  X, 
  Check,
  AlertCircle,
  Wand2
} from 'lucide-react';

interface VideoFile {
  id: string;
  file: File;
  title: string;
  transcript: string;
  topics: string[];
  status: 'pending' | 'generating-title' | 'ready' | 'uploaded';
}

interface BulkVideoUploadProps {
  onVideosAdded: (videos: Array<{
    id: string;
    title: string;
    url: string;
    transcript: string;
    status: 'completed';
    topics: string[];
    processedAt: Date;
  }>) => void;
  commonTopics: string[];
}

export const BulkVideoUpload = ({ onVideosAdded, commonTopics }: BulkVideoUploadProps) => {
  const { toast } = useToast();
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateTitle = async (videoId: string, transcript: string) => {
    if (!transcript.trim()) return;

    setVideoFiles(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: 'generating-title' } : video
    ));

    try {
      const response = await fetch('/api/generate-video-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      
      setVideoFiles(prev => prev.map(video => 
        video.id === videoId ? { 
          ...video, 
          title: data.title || 'AI Generated Title',
          status: 'ready'
        } : video
      ));

    } catch (error) {
      console.error('Error generating title:', error);
      setVideoFiles(prev => prev.map(video => 
        video.id === videoId ? { 
          ...video, 
          title: `Video ${videoId.substring(0, 8)}`,
          status: 'ready'
        } : video
      ));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') || 
      file.name.toLowerCase().includes('.mp4') ||
      file.name.toLowerCase().includes('.mov') ||
      file.name.toLowerCase().includes('.avi')
    );

    if (videoFiles.length === 0) {
      toast({
        title: "No Video Files",
        description: "Please drop video files (MP4, MOV, AVI)",
        variant: "destructive"
      });
      return;
    }

    const newVideoFiles: VideoFile[] = videoFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      title: '',
      transcript: '',
      topics: [],
      status: 'pending'
    }));

    setVideoFiles(prev => [...prev, ...newVideoFiles]);

    toast({
      title: "Videos Added",
      description: `Added ${videoFiles.length} video file${videoFiles.length > 1 ? 's' : ''} for processing`,
    });
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') || 
      file.name.toLowerCase().includes('.mp4') ||
      file.name.toLowerCase().includes('.mov') ||
      file.name.toLowerCase().includes('.avi')
    );

    if (videoFiles.length > 0) {
      const newVideoFiles: VideoFile[] = videoFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        title: '',
        transcript: '',
        topics: [],
        status: 'pending'
      }));

      setVideoFiles(prev => [...prev, ...newVideoFiles]);
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
    const readyVideos = videoFiles.filter(v => v.status === 'ready');
    
    if (readyVideos.length === 0) {
      toast({
        title: "No Videos Ready",
        description: "Please add transcripts to at least one video",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const processedVideos = readyVideos.map(video => ({
        id: video.id,
        title: video.title,
        url: `local-upload-${video.file.name}`,
        transcript: video.transcript,
        status: 'completed' as const,
        topics: video.topics.length > 0 ? video.topics : ['Q&A Session'],
        processedAt: new Date()
      }));

      onVideosAdded(processedVideos);

      // Remove uploaded videos from the list
      setVideoFiles(prev => prev.filter(v => !readyVideos.includes(v)));

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${readyVideos.length} video${readyVideos.length > 1 ? 's' : ''} to knowledge base`,
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

  const readyCount = videoFiles.filter(v => v.status === 'ready').length;
  const progressPercentage = videoFiles.length > 0 ? (readyCount / videoFiles.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Bulk Video Upload
          </CardTitle>
          {videoFiles.length > 0 && (
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {readyCount} of {videoFiles.length} videos ready
                </p>
                <Progress value={progressPercentage} className="w-48 mt-1" />
              </div>
              {readyCount > 0 && (
                <Button 
                  onClick={uploadAllVideos} 
                  disabled={isUploading}
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {readyCount} Video{readyCount > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
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

      {/* Video Files List */}
      {videoFiles.length > 0 && (
        <div className="space-y-4">
          {videoFiles.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <FileVideo className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{video.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                        {video.title && (
                          <p className="text-sm font-medium mt-1">{video.title}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {video.status === 'ready' && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Ready
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
                          onClick={() => removeVideoFile(video.id)}
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
                            onClick={() => toggleTopic(video.id, topic)}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Video Transcript</label>
                        {video.transcript.trim() && !video.title && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateTitle(video.id, video.transcript)}
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
                        onChange={(e) => {
                          const transcript = e.target.value;
                          updateVideoFile(video.id, { transcript });
                          
                          // Auto-generate title when transcript is added
                          if (transcript.trim() && !video.title && video.status === 'pending') {
                            generateTitle(video.id, transcript);
                          }
                        }}
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
