import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { Plus, Edit, Trash2, Upload, FileText, Settings, Video, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  category: string;
  tags: string[];
  featured?: boolean;
  videoUrl?: string;
  handouts?: { name: string; url: string; }[];
  order?: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Initialize with existing videos from VideoLibrary
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: '1',
      title: 'Competitor Analysis',
      description: 'Learn how to analyze competitors and identify market opportunities',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      duration: '35:20',
      views: 1567,
      uploadDate: '2024-12-20',
      category: 'Markets',
      tags: ['competitor-analysis', 'market-research', 'strategy'],
      featured: true,
      videoUrl: 'https://www.loom.com/share/00d9db5904784d0091b6dbeedfb61830?sid=47d7bb0b-f3eb-421b-b3f5-6aab2661f864',
      order: 1
    },
    {
      id: '2',
      title: 'Market Research Overview',
      description: 'Comprehensive guide to conducting effective market research for real estate investments',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop',
      duration: '28:45',
      views: 892,
      uploadDate: '2024-12-18',
      category: 'Markets',
      tags: ['market-research', 'analysis', 'data'],
      videoUrl: 'https://www.loom.com/share/3c9e26b352564afe8ce7073477386fec?sid=626edf09-2ab2-4c05-9762-04a719f353a6',
      order: 2
    },
    {
      id: '3',
      title: 'Hiring Your VA',
      description: 'Step-by-step guide to finding and hiring the perfect virtual assistant for your business',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=450&fit=crop',
      duration: '42:15',
      views: 1234,
      uploadDate: '2024-12-15',
      category: 'Operations',
      tags: ['virtual-assistant', 'hiring', 'automation', 'team-building'],
      videoUrl: 'https://www.loom.com/share/e1d50c6ae34d4c5882aa7587269c47aa?sid=5f9e60c2-8e27-480e-b003-ec358df9a5c5',
      order: 1
    },
    {
      id: '4',
      title: 'Hiring Your Housekeeper',
      description: 'Complete process for finding and managing housekeepers for your rental properties',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
      duration: '31:30',
      views: 743,
      uploadDate: '2024-12-12',
      category: 'Operations',
      tags: ['housekeeper', 'property-management', 'maintenance', 'staff'],
      videoUrl: 'https://www.loom.com/share/98d389450eb948a3ab0a62fc875050e8?sid=14ec2526-9ae3-45c8-a998-90727383338e',
      order: 2
    },
    {
      id: '5',
      title: 'Property Listing Optimization',
      description: 'Optimize your property listings to attract more qualified tenants and maximize occupancy',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: '25:12',
      views: 1456,
      uploadDate: '2024-12-10',
      category: 'Operations',
      tags: ['listing-optimization', 'marketing', 'tenant-acquisition'],
      videoUrl: 'https://www.loom.com/share/e323b3ad4da842ea9227e2865249afa8?sid=e8705a4d-366b-4217-a8a2-b9cf54cc777d',
      order: 3
    },
    {
      id: '6',
      title: 'Property Acquisitions Overview',
      description: 'Master the fundamentals of property acquisitions and deal analysis',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
      duration: '38:45',
      views: 2103,
      uploadDate: '2024-12-08',
      category: 'Acquisition',
      tags: ['acquisitions', 'deal-analysis', 'investment-strategy'],
      featured: true,
      videoUrl: 'https://www.loom.com/share/b6b52e6d8bfa4490b3de0481f60cee53?sid=0a9940f7-883a-4fe0-bb19-edd901ae37a3',
      order: 1
    },
    {
      id: '7',
      title: 'Property Acquisitions I',
      description: 'First part of the comprehensive property acquisitions training series',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
      duration: '45:30',
      views: 1876,
      uploadDate: '2024-12-05',
      category: 'Acquisition',
      tags: ['acquisitions', 'investment', 'real-estate', 'fundamentals'],
      videoUrl: 'https://www.loom.com/share/83d2f2b331ed4b44a7194b47c2cfc1eb?sid=b882724d-77f8-4f9a-abc0-d2709ea6b9f4',
      order: 2
    },
    {
      id: '8',
      title: 'Property Acquisitions II',
      description: 'Advanced property acquisitions strategies and deal structuring techniques',
      thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=450&fit=crop',
      duration: '52:15',
      views: 1654,
      uploadDate: '2024-12-03',
      category: 'Acquisition',
      tags: ['acquisitions', 'advanced', 'deal-structuring', 'finance'],
      videoUrl: 'https://www.loom.com/share/1a40e1be66f94774aa5ca19f2d6efe66?sid=dce96b7a-0d08-4ff3-a88e-e24e5478e8b0',
      order: 3
    },
    {
      id: '9',
      title: 'Growth Planning',
      description: 'Strategic planning for scaling your real estate investment business',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      duration: '36:40',
      views: 1432,
      uploadDate: '2024-12-01',
      category: 'Business Formation',
      tags: ['growth', 'planning', 'strategy', 'scaling'],
      videoUrl: 'https://www.loom.com/share/9054327d9dad4a94aaa206ae1ad74346?sid=82f8ce47-1769-4c00-899c-8de49194fc41',
      order: 1
    },
    {
      id: '10',
      title: 'Cashflow Analysis',
      description: 'Complete guide to analyzing and optimizing property cash flows',
      thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=450&fit=crop',
      duration: '41:25',
      views: 1798,
      uploadDate: '2024-11-28',
      category: 'Business Formation',
      tags: ['cashflow', 'analysis', 'finance', 'optimization'],
      videoUrl: 'https://www.loom.com/share/f3ef7729fb084b72ac0ac548b89ceb93?sid=75a145f2-4aad-4f7e-9066-2c1876abd228',
      order: 2
    },
    // ... rest of the videos from VideoLibrary
    {
      id: '11',
      title: 'Hosting Remotely',
      description: 'Master remote hosting strategies for managing properties from anywhere',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop',
      duration: '29:35',
      views: 967,
      uploadDate: '2024-11-25',
      category: 'Operations',
      tags: ['remote-hosting', 'property-management', 'automation', 'systems'],
      videoUrl: 'https://www.loom.com/share/bdeeb06bce7a45379822f91455676839?sid=159d9d8f-c518-45ed-8908-73e52a1fc656',
      order: 4
    },
    {
      id: '20',
      title: 'Business Formation',
      description: 'Essential guide to forming and structuring your rental arbitrage business',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop',
      duration: '39:50',
      views: 1267,
      uploadDate: '2024-11-02',
      category: 'Business Formation',
      tags: ['business-formation', 'legal-structure', 'incorporation', 'startup'],
      videoUrl: 'https://www.loom.com/share/e21ff8e94a404aa68110e44f9994a6b3?sid=a02b7adb-87a6-4b9c-bd17-e7579ab8369f',
      order: 3
    }
  ]);
  
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [newVideo, setNewVideo] = useState<Partial<VideoItem>>({
    title: '',
    description: '',
    thumbnail: '',
    duration: '',
    category: 'Business Formation',
    tags: [],
    videoUrl: '',
    order: 1
  });

  const categories = ['Business Formation', 'Markets', 'Acquisition', 'Operations'];

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Error",
        description: "Title and Video URL are required",
        variant: "destructive"
      });
      return;
    }

    const video: VideoItem = {
      id: Date.now().toString(),
      title: newVideo.title!,
      description: newVideo.description || '',
      thumbnail: newVideo.thumbnail || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: newVideo.duration || '0:00',
      views: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      category: newVideo.category!,
      tags: newVideo.tags || [],
      videoUrl: newVideo.videoUrl!,
      order: newVideo.order || 1,
      handouts: []
    };

    setVideos([...videos, video]);
    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
      duration: '',
      category: 'Business Formation',
      tags: [],
      videoUrl: '',
      order: 1
    });
    setIsAddVideoOpen(false);
    
    toast({
      title: "Success",
      description: "Video added successfully"
    });
  };

  const handleEditVideo = (video: VideoItem) => {
    setEditingVideo(video);
    setNewVideo(video);
  };

  const handleUpdateVideo = () => {
    if (!editingVideo) return;

    const updatedVideos = videos.map(v => 
      v.id === editingVideo.id ? { ...v, ...newVideo } : v
    );
    
    setVideos(updatedVideos);
    setEditingVideo(null);
    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
      duration: '',
      category: 'Business Formation',
      tags: [],
      videoUrl: '',
      order: 1
    });
    
    toast({
      title: "Success",
      description: "Video updated successfully"
    });
  };

  const handleDeleteVideo = (videoId: string) => {
    const updatedVideos = videos.filter(v => v.id !== videoId);
    setVideos(updatedVideos);
    
    toast({
      title: "Success",
      description: "Video deleted successfully"
    });
  };

  const handleFileUpload = (videoId: string, file: File) => {
    // In a real implementation, you would upload the file to your server/storage
    const fileUrl = `/handouts/${file.name}`;
    
    const updatedVideos = videos.map(video => {
      if (video.id === videoId) {
        const handouts = video.handouts || [];
        return {
          ...video,
          handouts: [...handouts, { name: file.name, url: fileUrl }]
        };
      }
      return video;
    });
    
    setVideos(updatedVideos);
    
    toast({
      title: "Success",
      description: `Handout "${file.name}" added successfully`
    });
  };

  const VideoForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={newVideo.title || ''}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
          className="bg-slate-800/50 border-cyan-500/20 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newVideo.description || ''}
          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
          className="bg-slate-800/50 border-cyan-500/20 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="videoUrl">Loom Video URL *</Label>
        <Input
          id="videoUrl"
          value={newVideo.videoUrl || ''}
          onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
          placeholder="https://www.loom.com/share/..."
          className="bg-slate-800/50 border-cyan-500/20 text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={newVideo.category} onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}>
            <SelectTrigger className="bg-slate-800/50 border-cyan-500/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            value={newVideo.order || 1}
            onChange={(e) => setNewVideo({ ...newVideo, order: parseInt(e.target.value) || 1 })}
            className="bg-slate-800/50 border-cyan-500/20 text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={newVideo.duration || ''}
            onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
            placeholder="25:30"
            className="bg-slate-800/50 border-cyan-500/20 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            value={newVideo.thumbnail || ''}
            onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
            placeholder="Image URL"
            className="bg-slate-800/50 border-cyan-500/20 text-white"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={newVideo.tags?.join(', ') || ''}
          onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          placeholder="tag1, tag2, tag3"
          className="bg-slate-800/50 border-cyan-500/20 text-white"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-cyan-300">Admin Dashboard</h1>
          </div>
          
          <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border border-cyan-500/20">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">Add New Video</DialogTitle>
              </DialogHeader>
              <VideoForm />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddVideoOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVideo}>
                  Add Video
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-300">{videos.length}</div>
            </CardContent>
          </Card>
          
          {categories.map((category, index) => (
            <Card key={category} className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Step {index + 1}: {category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-300">
                  {videos.filter(v => v.category === category).length}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Videos Management */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <Video className="h-5 w-5" />
              Manage Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No videos added yet. Click "Add Video" to get started.</p>
                </div>
              ) : (
                videos.map(video => (
                  <div key={video.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-green-500/20 border-green-500/30 text-green-300">
                          {video.category}
                        </Badge>
                        <span className="text-sm text-gray-400">Order: {video.order}</span>
                      </div>
                      <h3 className="font-medium text-white mb-1">{video.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{video.duration}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </span>
                        {video.handouts && video.handouts.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {video.handouts.length} handouts
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(video.id, file);
                        }}
                        className="hidden"
                        id={`file-${video.id}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById(`file-${video.id}`)?.click()}
                        className="border-cyan-500/30 text-cyan-300"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditVideo(video)}
                        className="border-cyan-500/30 text-cyan-300"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Video Dialog */}
        <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
          <DialogContent className="max-w-2xl bg-slate-900 border border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-cyan-300">Edit Video</DialogTitle>
            </DialogHeader>
            <VideoForm />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingVideo(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateVideo}>
                Update Video
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
