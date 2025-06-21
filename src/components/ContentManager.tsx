
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
  Trash2
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
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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

  const extractPlaylistVideos = async () => {
    if (!playlistUrl.includes('youtube.com') && !playlistUrl.includes('youtu.be')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube playlist URL",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call to extract playlist videos
      // In a real implementation, you'd call a backend service
      const mockVideos: VideoContent[] = [
        {
          id: '1',
          title: 'Richie Matthews - Complete 3X Rental Strategy Overview',
          url: 'https://youtube.com/watch?v=example1',
          transcript: '',
          status: 'pending',
          topics: ['3X Strategy', 'Rental Arbitrage'],
          duration: '45:32'
        },
        {
          id: '2',
          title: 'Property Selection Masterclass - Finding Perfect Units',
          url: 'https://youtube.com/watch?v=example2',
          transcript: '',
          status: 'pending',
          topics: ['Property Selection', 'Market Analysis'],
          duration: '38:15'
        },
        {
          id: '3',
          title: 'Student Q&A - Common Challenges & Solutions',
          url: 'https://youtube.com/watch?v=example3',
          transcript: '',
          status: 'pending',
          topics: ['Q&A Session', 'Property Management'],
          duration: '52:08'
        }
      ];

      setVideos(mockVideos);
      
      toast({
        title: "Playlist Loaded",
        description: `Found ${mockVideos.length} videos ready for processing`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract playlist videos",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processVideoTranscript = async (videoId: string) => {
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, status: 'processing' } : v
    ));

    // Simulate transcript extraction
    setTimeout(() => {
      const sampleTranscript = `Welcome everyone to today's session on the 3X rental strategy. 

Today we're going to dive deep into how to find properties that can generate 3 times the market rent through short-term rental arbitrage. 

The key is understanding that we're not buying properties - we're renting them and then subletting them on platforms like Airbnb for significantly higher rates.

First, let's talk about property selection criteria:
1. Location near tourist attractions or business districts
2. Properties that landlords are willing to rent for 12+ month leases
3. Units that can be furnished and staged attractively
4. Markets with strong short-term rental demand

The mathematics are simple: if market rent is $1000/month, we need to generate $3000/month in gross revenue to hit our 3X target. After our rent, utilities, cleaning, and other expenses, we're typically left with $1200-1500 in profit per unit.

Let me walk you through a real example from one of our students in Austin, Texas...`;

      setVideos(prev => prev.map(v => 
        v.id === videoId ? { 
          ...v, 
          status: 'completed',
          transcript: sampleTranscript,
          processedAt: new Date()
        } : v
      ));

      toast({
        title: "Transcript Extracted",
        description: "Video transcript has been processed successfully",
      });
    }, 3000);
  };

  const addManualContent = () => {
    if (!manualTitle.trim() || !manualTranscript.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and transcript",
        variant: "destructive"
      });
      return;
    }

    const newVideo: VideoContent = {
      id: Date.now().toString(),
      title: manualTitle,
      url: 'manual-upload',
      transcript: manualTranscript,
      status: 'completed',
      topics: selectedTopics,
      processedAt: new Date()
    };

    setVideos(prev => [...prev, newVideo]);
    setManualTitle('');
    setManualTranscript('');
    setSelectedTopics([]);

    toast({
      title: "Content Added",
      description: "Manual content has been added to the knowledge base",
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
    setVideos(prev => prev.filter(v => v.id !== videoId));
    toast({
      title: "Content Removed",
      description: "Video has been removed from the knowledge base",
    });
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
              <Button onClick={exportKnowledgeBase} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Knowledge Base
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="youtube" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="youtube">YouTube Extraction</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Extract from YouTube Playlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/playlist?list=PLicSHGfcR-23ZM1_guLlHc_kbLege14vA"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={extractPlaylistVideos}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Loading...' : 'Extract Videos'}
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Paste the YouTube playlist URL to automatically extract all videos and their transcripts.
              </p>
            </CardContent>
          </Card>

          {videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {video.duration}
                          </Badge>
                          {video.topics.map(topic => (
                            <Badge key={topic} variant="secondary" className="text-xs">
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
              <Input
                placeholder="Content Title (e.g., 'Property Selection Strategy Session')"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
              />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Topics (select relevant topics)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTopics.map(topic => (
                    <Badge
                      key={topic}
                      variant={selectedTopics.includes(topic) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTopics(prev => 
                          prev.includes(topic) 
                            ? prev.filter(t => t !== topic)
                            : [...prev, topic]
                        );
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Paste transcript or written content here..."
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                rows={10}
              />
              
              <Button onClick={addManualContent} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Add to Knowledge Base
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              {videos.filter(v => v.status === 'completed').length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No processed content yet. Add videos or manual content to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {videos.filter(v => v.status === 'completed').map((video) => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{video.title}</h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {video.topics.map(topic => (
                              <Badge key={topic} variant="secondary" className="text-xs">
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
