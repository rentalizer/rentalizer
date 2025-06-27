
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video, Plus, Search, Play, Clock, Eye, Calendar, Star, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  category: string;
  instructor: string;
  tags: string[];
  featured?: boolean;
  isLive?: boolean;
  videoUrl?: string;
}

export const VideoLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = [
    {
      id: '0',
      title: 'Competitor Analysis',
      description: 'Learn how to analyze competitors and identify market opportunities',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      duration: '35:20',
      views: 1567,
      uploadDate: '2024-12-20',
      category: 'Market Research',
      instructor: 'Richie Matthews',
      tags: ['competitor-analysis', 'market-research', 'strategy'],
      featured: true,
      videoUrl: 'https://www.loom.com/share/00d9db5904784d0091b6dbeedfb61830?sid=47d7bb0b-f3eb-421b-b3f5-6aab2661f864'
    }
  ];

  const categories = ['all', 'Market Research', 'Property Acquisitions', 'Automations', 'Property Management'];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Market Research': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Property Acquisitions': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Automations': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Property Management': 'bg-slate-500/20 border-slate-500/30 text-slate-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoClick = (video: VideoItem) => {
    if (video.videoUrl) {
      setSelectedVideo(video);
    }
  };

  const getEmbedUrl = (loomUrl: string) => {
    const videoId = loomUrl.split('/share/')[1]?.split('?')[0];
    return `https://www.loom.com/embed/${videoId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Video Library</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {videos.length} videos
          </Badge>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 whitespace-nowrap"
              }
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <Card 
            key={video.id} 
            className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer ${video.featured ? 'ring-1 ring-cyan-400/30' : ''}`}
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative">
              {/* Thumbnail */}
              <div className="aspect-video bg-slate-700 rounded-t-lg relative overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMzM0MTU1Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMi41IiByPSIzMCIgZmlsbD0iIzk0QTNCOCIvPgo8cG9seWdvbiBwb2ludHM9IjE5MCwxMDAuNSAyMTAsOTAuNSAyMTAsMTM0LjUgMTkwLDEyNC41IiBmaWxsPSIjMzM0MTU1Ii8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                
                {/* Live indicator */}
                {video.isLive && (
                  <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                )}

                {/* Featured indicator */}
                {video.featured && (
                  <div className="absolute top-2 right-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                  {video.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm line-clamp-2">{video.description}</p>

                {/* Meta info */}
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(video.category)}>
                    {video.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3 w-3" />
                    {video.views.toLocaleString()}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="border-purple-500/30 text-purple-300 text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No videos found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 flex items-center justify-between">
              {selectedVideo?.title}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo?.videoUrl && (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(selectedVideo.videoUrl)}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}
          
          {selectedVideo && (
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">{selectedVideo.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{selectedVideo.duration}</span>
                <span>{selectedVideo.views.toLocaleString()} views</span>
                <span>{new Date(selectedVideo.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
