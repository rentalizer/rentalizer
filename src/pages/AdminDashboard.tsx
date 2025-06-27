
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
  const [videos, setVideos] = useState<VideoItem[]>([]);
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
