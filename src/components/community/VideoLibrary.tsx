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
      id: '1',
      title: 'Competitor Analysis',
      description: 'Learn how to analyze competitors and identify market opportunities',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      duration: '35:20',
      views: 1567,
      uploadDate: '2024-12-20',
      category: 'Market Research',
      tags: ['competitor-analysis', 'market-research', 'strategy'],
      featured: true,
      videoUrl: 'https://www.loom.com/share/00d9db5904784d0091b6dbeedfb61830?sid=47d7bb0b-f3eb-421b-b3f5-6aab2661f864'
    },
    {
      id: '2',
      title: 'Market Research Overview',
      description: 'Comprehensive guide to conducting effective market research for real estate investments',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop',
      duration: '28:45',
      views: 892,
      uploadDate: '2024-12-18',
      category: 'Market Research',
      tags: ['market-research', 'analysis', 'data'],
      videoUrl: 'https://www.loom.com/share/3c9e26b352564afe8ce7073477386fec?sid=626edf09-2ab2-4c05-9762-04a719f353a6'
    },
    {
      id: '3',
      title: 'Hiring Your VA',
      description: 'Step-by-step guide to finding and hiring the perfect virtual assistant for your business',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=450&fit=crop',
      duration: '42:15',
      views: 1234,
      uploadDate: '2024-12-15',
      category: 'Automations',
      tags: ['virtual-assistant', 'hiring', 'automation', 'team-building'],
      videoUrl: 'https://www.loom.com/share/e1d50c6ae34d4c5882aa7587269c47aa?sid=5f9e60c2-8e27-480e-b003-ec358df9a5c5'
    },
    {
      id: '4',
      title: 'Hiring Your Housekeeper',
      description: 'Complete process for finding and managing housekeepers for your rental properties',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
      duration: '31:30',
      views: 743,
      uploadDate: '2024-12-12',
      category: 'Property Management',
      tags: ['housekeeper', 'property-management', 'maintenance', 'staff'],
      videoUrl: 'https://www.loom.com/share/98d389450eb948a3ab0a62fc875050e8?sid=14ec2526-9ae3-45c8-a998-90727383338e'
    },
    {
      id: '5',
      title: 'Property Listing Optimization',
      description: 'Optimize your property listings to attract more qualified tenants and maximize occupancy',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: '25:12',
      views: 1456,
      uploadDate: '2024-12-10',
      category: 'Property Management',
      tags: ['listing-optimization', 'marketing', 'tenant-acquisition'],
      videoUrl: 'https://www.loom.com/share/e323b3ad4da842ea9227e2865249afa8?sid=e8705a4d-366b-4217-a8a2-b9cf54cc777d'
    },
    {
      id: '6',
      title: 'Property Acquisitions Overview',
      description: 'Master the fundamentals of property acquisitions and deal analysis',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
      duration: '38:45',
      views: 2103,
      uploadDate: '2024-12-08',
      category: 'Property Acquisitions',
      tags: ['acquisitions', 'deal-analysis', 'investment-strategy'],
      featured: true,
      videoUrl: 'https://www.loom.com/share/b6b52e6d8bfa4490b3de0481f60cee53?sid=0a9940f7-883a-4fe0-bb19-edd901ae37a3'
    },
    {
      id: '7',
      title: 'Property Acquisitions I',
      description: 'First part of the comprehensive property acquisitions training series',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
      duration: '45:30',
      views: 1876,
      uploadDate: '2024-12-05',
      category: 'Property Acquisitions',
      tags: ['acquisitions', 'investment', 'real-estate', 'fundamentals'],
      videoUrl: 'https://www.loom.com/share/83d2f2b331ed4b44a7194b47c2cfc1eb?sid=b882724d-77f8-4f9a-abc0-d2709ea6b9f4'
    },
    {
      id: '8',
      title: 'Property Acquisitions II',
      description: 'Advanced property acquisitions strategies and deal structuring techniques',
      thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=450&fit=crop',
      duration: '52:15',
      views: 1654,
      uploadDate: '2024-12-03',
      category: 'Property Acquisitions',
      tags: ['acquisitions', 'advanced', 'deal-structuring', 'finance'],
      videoUrl: 'https://www.loom.com/share/1a40e1be66f94774aa5ca19f2d6efe66?sid=dce96b7a-0d08-4ff3-a88e-e24e5478e8b0'
    },
    {
      id: '9',
      title: 'Growth Planning',
      description: 'Strategic planning for scaling your real estate investment business',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      duration: '36:40',
      views: 1432,
      uploadDate: '2024-12-01',
      category: 'Business Strategy',
      tags: ['growth', 'planning', 'strategy', 'scaling'],
      videoUrl: 'https://www.loom.com/share/9054327d9dad4a94aaa206ae1ad74346?sid=82f8ce47-1769-4c00-899c-8de49194fc41'
    },
    {
      id: '10',
      title: 'Cashflow Analysis',
      description: 'Complete guide to analyzing and optimizing property cash flows',
      thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=450&fit=crop',
      duration: '41:25',
      views: 1798,
      uploadDate: '2024-11-28',
      category: 'Financial Analysis',
      tags: ['cashflow', 'analysis', 'finance', 'optimization'],
      videoUrl: 'https://www.loom.com/share/f3ef7729fb084b72ac0ac548b89ceb93?sid=75a145f2-4aad-4f7e-9066-2c1876abd228'
    }
  ];

  const categories = ['all', 'Market Research', 'Property Acquisitions', 'Automations', 'Property Management', 'Business Strategy', 'Financial Analysis'];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Market Research': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Property Acquisitions': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Automations': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Property Management': 'bg-slate-500/20 border-slate-500/30 text-slate-300',
      'Business Strategy': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Financial Analysis': 'bg-orange-500/20 border-orange-500/30 text-orange-300'
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
