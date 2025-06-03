
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video, Plus, Search, Play, Clock, Eye, Calendar, Star } from 'lucide-react';

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
}

export const VideoLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videos: VideoItem[] = [
    {
      id: '1',
      title: 'Market Research Fundamentals',
      description: 'Learn how to identify profitable rental arbitrage markets using data-driven approaches',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '45:30',
      views: 1234,
      uploadDate: '2024-12-15',
      category: 'Education',
      instructor: 'Richie Matthews',
      tags: ['market-research', 'fundamentals', 'data'],
      featured: true
    },
    {
      id: '2',
      title: 'Weekly Live Training - Property Acquisition',
      description: 'Live training session covering advanced property acquisition strategies',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '60:00',
      views: 892,
      uploadDate: '2024-12-10',
      category: 'Live Training',
      instructor: 'Richie Matthews',
      tags: ['live', 'acquisition', 'strategies'],
      isLive: true
    },
    {
      id: '3',
      title: 'Furnishing Properties on a Budget',
      description: 'Complete guide to furnishing rental properties cost-effectively',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '32:15',
      views: 756,
      uploadDate: '2024-12-08',
      category: 'Operations',
      instructor: 'Sarah Johnson',
      tags: ['furnishing', 'budget', 'cost-effective']
    },
    {
      id: '4',
      title: 'Legal Aspects of Rental Arbitrage',
      description: 'Understanding contracts, regulations, and legal considerations',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '38:45',
      views: 623,
      uploadDate: '2024-12-05',
      category: 'Legal',
      instructor: 'Mike Chen',
      tags: ['legal', 'contracts', 'regulations'],
      featured: true
    },
    {
      id: '5',
      title: 'Automation Tools for Property Management',
      description: 'Setting up automated systems for efficient property management',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '41:20',
      views: 934,
      uploadDate: '2024-12-03',
      category: 'Technology',
      instructor: 'Lisa Rodriguez',
      tags: ['automation', 'tools', 'efficiency']
    },
    {
      id: '6',
      title: 'Guest Communication Mastery',
      description: 'Best practices for professional guest communication and service',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '29:10',
      views: 567,
      uploadDate: '2024-11-28',
      category: 'Operations',
      instructor: 'David Kim',
      tags: ['communication', 'service', 'guests']
    },
    {
      id: '7',
      title: 'Scaling Your Portfolio',
      description: 'Strategies for growing from 1 to 10+ properties',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '52:30',
      views: 1089,
      uploadDate: '2024-11-25',
      category: 'Business',
      instructor: 'Emily Davis',
      tags: ['scaling', 'portfolio', 'growth']
    },
    {
      id: '8',
      title: 'Weekly Live Training - Market Analysis',
      description: 'Live Q&A session on market analysis techniques',
      thumbnail: '/placeholder-thumbnail.jpg',
      duration: '55:00',
      views: 445,
      uploadDate: '2024-11-20',
      category: 'Live Training',
      instructor: 'Richie Matthews',
      tags: ['live', 'market-analysis', 'qa']
    }
  ];

  const categories = ['all', 'Education', 'Live Training', 'Operations', 'Legal', 'Technology', 'Business'];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Education': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Live Training': 'bg-red-500/20 border-red-500/30 text-red-300',
      'Operations': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Legal': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Technology': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Business': 'bg-orange-500/20 border-orange-500/30 text-orange-300'
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
          <Card key={video.id} className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer ${video.featured ? 'ring-1 ring-yellow-400/30' : ''}`}>
            <div className="relative">
              {/* Thumbnail */}
              <div className="aspect-video bg-slate-700 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                
                {/* Live indicator */}
                {video.isLive && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                )}

                {/* Featured indicator */}
                {video.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs px-2 py-1 rounded flex items-center gap-1">
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
                  <span>By {video.instructor}</span>
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
    </div>
  );
};
