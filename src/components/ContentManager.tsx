
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BulkTranscriptUpload } from './BulkTranscriptUpload';
import { KnowledgeChat } from './KnowledgeChat';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { youtubeTranscriptService } from '@/services/youtubeTranscriptService';
import { 
  Upload, 
  Youtube, 
  FileText, 
  Download, 
  Check, 
  Clock, 
  AlertCircle,
  Database,
  Play,
  Trash2,
  MessageSquare
} from 'lucide-react';

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

export const ContentManager = () => {
  const { toast } = useToast();
  const { videos, setVideos, addVideos } = useKnowledgeBase();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');

  const commonTopics = [
    'Property Selection',
    '3X Strategy', 
    'Rental Arbitrage',
    'Market Analysis',
    'Deal Structure',
    'Property Management',
    'Scaling Strategies',
    'Legal Compliance',
    'Automation',
    'Guest Communication',
    'Pricing Strategy',
    'Q&A Session'
  ];

  const extractFromYouTube = async () => {
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const extractedVideos = await youtubeTranscriptService.extractFromUrl(youtubeUrl);
      
      const videoContent: VideoContent[] = extractedVideos.map((video, index) => ({
        id: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        title: video.title,
        url: video.url,
        transcript: '',
        status: 'pending' as const,
        topics: [],
        duration: video.duration
      }));

      setVideos(videoContent);
      
      toast({
        title: "YouTube Content Loaded",
        description: `Found ${videoContent.length} video(s). Note: Real YouTube API integration required for actual transcript extraction.`,
      });
    } catch (error) {
      console.error('Error extracting YouTube content:', error);
      toast({
        title: "Error",
        description: "Failed to extract YouTube content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processVideoTranscript = async (videoId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, status: 'processing' } : v
    ));

    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) throw new Error('Video not found');

      const transcript = await youtubeTranscriptService.extractTranscript(videoId);
      
      setVideos(videos.map(v => 
        v.id === videoId ? { 
          ...v, 
          status: 'completed',
          transcript: transcript,
          topics: ['Q&A Session'],
          processedAt: new Date()
        } : v
      ));

      toast({
        title: "Processing Complete",
        description: "Note: This is simulated content. Real YouTube API required.",
      });
    } catch (error) {
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, status: 'error' } : v
      ));
      
      toast({
        title: "Processing Failed",
        description: "YouTube API integration required",
        variant: "destructive"
      });
    }
  };

  const addManualContent = () => {
    if (!manualTranscript.trim()) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a transcript",
        variant: "destructive"
      });
      return;
    }

    const newVideo: VideoContent = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Content ${Date.now().toString().substring(0, 8)}`,
      url: 'manual-upload',
      transcript: manualTranscript,
      status: 'completed',
      topics: ['Q&A Session'],
      processedAt: new Date()
    };

    addVideos([newVideo]);
    setManualTranscript('');

    toast({
      title: "Content Added",
      description: "Manual content added to knowledge base",
    });
  };

  const exportKnowledgeBase = () => {
    const completedVideos = videos.filter(v => v.status === 'completed');
    const knowledgeBase = {
      totalVideos: completedVideos.length,
      lastUpdated: new Date().toISOString(),
      content: completedVideos.map(v => ({
        title: v.title,
        topics: v.topics,
        transcript: v.transcript,
        url: v.url
      }))
    };

    const blob = new Blob([JSON.stringify(knowledgeBase, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'richie-knowledge-base.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Knowledge base exported successfully",
    });
  };

  const deleteVideo = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId));
    toast({
      title: "Content Removed",
      description: "Video removed from knowledge base",
    });
  };

  const clearAllVideos = () => {
    setVideos([]);
    toast({
      title: "All Content Cleared",
      description: "All videos have been removed",
    });
  };

  const handleTranscriptsAdded = (newTranscripts: any[]) => {
    addVideos(newTranscripts);
  };

  const completedCount = videos.filter(v => v.status === 'completed').length;
  const progressPercentage = videos.length > 0 ? (completedCount / videos.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Richie's Knowledge Base Manager
          </CardTitle>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {completedCount} of {videos.length} videos processed
              </p>
              <Progress value={progressPercentage} className="w-48 mt-1" />
            </div>
            {videos.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={exportKnowledgeBase} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={clearAllVideos} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="bulk-upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-upload" className="space-y-4">
          <BulkTranscriptUpload 
            onTranscriptsAdded={handleTranscriptsAdded}
            commonTopics={commonTopics}
          />
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Extract from YouTube
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={extractFromYouTube}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Loading...' : 'Extract'}
                </Button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Demo system. Real YouTube API integration required.
                </p>
              </div>
            </CardContent>
          </Card>

          {videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Videos ({videos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <div key={`${video.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {video.duration || '0:00'}
                          </Badge>
                          {video.topics.map((topic, topicIndex) => (
                            <Badge key={`${topic}-${topicIndex}`} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => processVideoTranscript(video.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        {video.status === 'processing' && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Processing...
                          </Badge>
                        )}
                        {video.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                        {video.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Add Manual Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Transcript</label>
                <Textarea
                  placeholder="Paste transcript or content here..."
                  value={manualTranscript}
                  onChange={(e) => setManualTranscript(e.target.value)}
                  rows={10}
                />
              </div>
              
              <Button 
                onClick={addManualContent} 
                className="w-full"
                disabled={!manualTranscript.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add to Knowledge Base
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library ({completedCount} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {completedCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No content yet. Add transcripts or YouTube links to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.filter(v => v.status === 'completed').map((video, index) => (
                    <div key={`completed-${video.id}-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{video.title}</h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {video.topics.map((topic, topicIndex) => (
                              <Badge key={`manage-${topic}-${topicIndex}`} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {video.transcript.substring(0, 200)}...
                          </p>
                          {video.processedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Added: {video.processedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteVideo(video.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
