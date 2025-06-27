import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video, Search, Play, Clock, Eye, Calendar, Star, X, FileText, Download } from 'lucide-react';
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
  handouts?: { name: string; url: string; }[];
  order?: number;
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
      id: '12',
      title: 'Rental Application',
      description: 'Complete guide to rental application processes and tenant screening',
      thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=450&fit=crop',
      duration: '33:20',
      views: 1205,
      uploadDate: '2024-11-22',
      category: 'Operations',
      tags: ['rental-application', 'tenant-screening', 'process', 'documentation'],
      videoUrl: 'https://www.loom.com/share/7320471e7d2948b6baa646d901518797?sid=40a32dce-1bfa-4adc-aa28-d09ad53759ab',
      order: 5
    },
    {
      id: '13',
      title: 'Market Research III',
      description: 'Advanced market research techniques and data analysis methods',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      duration: '47:15',
      views: 834,
      uploadDate: '2024-11-20',
      category: 'Markets',
      tags: ['market-research', 'advanced', 'data-analysis', 'techniques'],
      videoUrl: 'https://www.loom.com/share/b32d86ef3a1041ed8974a65685b2c730?sid=4d1bf7ab-c93b-421f-a0d1-766ab3e670a1',
      order: 3
    },
    {
      id: '14',
      title: 'Market Research I',
      description: 'Introduction to market research fundamentals and basic techniques',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop',
      duration: '32:50',
      views: 1543,
      uploadDate: '2024-11-18',
      category: 'Markets',
      tags: ['market-research', 'fundamentals', 'basics', 'introduction'],
      videoUrl: 'https://www.loom.com/share/c8a80aa7e1a14893b5961fedd90a9367?sid=6aad2485-7e26-476f-b6e0-b3077a4795bc',
      order: 1
    },
    {
      id: '15',
      title: 'Operations I',
      description: 'Essential operations management for rental arbitrage businesses',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop',
      duration: '41:10',
      views: 987,
      uploadDate: '2024-11-15',
      category: 'Operations',
      tags: ['operations', 'management', 'business-processes', 'efficiency'],
      videoUrl: 'https://www.loom.com/share/97a740ea55484c369e47d3a2a64ed776?sid=60924369-0c23-4bed-b228-8c6aed7855b7',
      order: 6
    },
    {
      id: '16',
      title: 'Property Listing - Mid Term Rentals',
      description: 'Specialized strategies for marketing and listing mid-term rental properties',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: '26:45',
      views: 721,
      uploadDate: '2024-11-12',
      category: 'Operations',
      tags: ['mid-term-rentals', 'listing', 'marketing', 'specialized'],
      videoUrl: 'https://www.loom.com/share/64de8f993a974132b629bf8e37cc647c?sid=6b2a48de-ea9b-410f-804a-ddb2a7399346',
      order: 7
    },
    {
      id: '17',
      title: 'STR Ordinances',
      description: 'Understanding short-term rental regulations and compliance requirements',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop',
      duration: '38:25',
      views: 1134,
      uploadDate: '2024-11-10',
      category: 'Operations',
      tags: ['str-ordinances', 'regulations', 'compliance', 'legal'],
      videoUrl: 'https://www.loom.com/share/a9103ef043e64eab9b8432ced535d475?sid=26a2af0e-b588-49d2-bef0-b2b1809baa87',
      order: 8
    },
    {
      id: '18',
      title: 'Property Listing Optimization',
      description: 'Advanced techniques for optimizing property listings and increasing bookings',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: '34:15',
      views: 1389,
      uploadDate: '2024-11-08',
      category: 'Operations',
      tags: ['listing-optimization', 'advanced', 'bookings', 'conversion'],
      videoUrl: 'https://www.loom.com/share/f5ec35e9d58c4b849dff862b871f10f7?sid=a0efd2aa-9b8f-4423-bc96-bdd593ff4f0a',
      order: 9
    },
    {
      id: '19',
      title: 'Property Budgeting + Design',
      description: 'Complete guide to budgeting and design strategies for rental properties',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop',
      duration: '43:30',
      views: 956,
      uploadDate: '2024-11-05',
      category: 'Operations',
      tags: ['budgeting', 'design', 'renovation', 'cost-control'],
      videoUrl: 'https://www.loom.com/share/75054572e7d54180844b137ff5f61a5e?sid=802e6f04-4bcc-4376-b254-7dec00c84d0e',
      order: 10
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
    },
    {
      id: '21',
      title: 'Property Acquisition - Tools & Process',
      description: 'Comprehensive guide to tools and processes for successful property acquisitions',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
      duration: '44:20',
      views: 1876,
      uploadDate: '2024-10-30',
      category: 'Acquisition',
      tags: ['acquisition-tools', 'process', 'workflow', 'systems'],
      videoUrl: 'https://www.loom.com/share/d8e2fc55f0a74a0ab916b8b96ae9f205?sid=6ed031f1-46ee-4793-96ea-50a4533629b2',
      order: 4
    },
    {
      id: '22',
      title: 'Property Acquisition - Negotiating',
      description: 'Master negotiation techniques for better property acquisition deals',
      thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=450&fit=crop',
      duration: '37:15',
      views: 1432,
      uploadDate: '2024-10-28',
      category: 'Acquisition',
      tags: ['negotiation', 'deal-making', 'acquisition-strategy', 'communication'],
      videoUrl: 'https://www.loom.com/share/b1c026f04f1e4f578805227ad6602779?sid=b0db134e-7aac-4b34-a1b9-97fe84704fad',
      order: 5
    },
    {
      id: '23',
      title: 'Automate Operations',
      description: 'Learn how to automate your rental arbitrage operations for maximum efficiency',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=450&fit=crop',
      duration: '48:30',
      views: 1654,
      uploadDate: '2024-10-25',
      category: 'Operations',
      tags: ['automation', 'operations', 'efficiency', 'systems'],
      videoUrl: 'https://www.loom.com/share/dc6e283fcb0b491eb4b4127f74ae6c60?sid=26009eef-da26-49d4-a819-6637d1e6cf8d',
      order: 11
    },
    {
      id: '24',
      title: 'Property Listing Checklist',
      description: 'Complete checklist for optimizing your property listings',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      duration: '22:30',
      views: 456,
      uploadDate: '2024-12-27',
      category: 'Operations',
      tags: ['checklist', 'listing', 'optimization', 'process'],
      videoUrl: 'https://www.loom.com/share/44afb75c4fe841db80f03d425c273393',
      handouts: [
        { name: 'Property Listing Checklist.pdf', url: '/handouts/property-listing-checklist.pdf' }
      ],
      order: 12
    }
  ];

  const categories = ['all', 'Business Formation', 'Markets', 'Acquisition', 'Operations'];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Business Formation': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Markets': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Acquisition': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Operations': 'bg-purple-500/20 border-purple-500/30 text-purple-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const getCategoryStep = (category: string) => {
    const steps = {
      'Business Formation': '1',
      'Markets': '2',
      'Acquisition': '3',
      'Operations': '4'
    };
    return steps[category as keyof typeof steps];
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort by category order first, then by video order within category
    const categoryOrder = { 'Business Formation': 1, 'Markets': 2, 'Acquisition': 3, 'Operations': 4 };
    const aCategoryOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 5;
    const bCategoryOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 5;
    
    if (aCategoryOrder !== bCategoryOrder) {
      return aCategoryOrder - bCategoryOrder;
    }
    
    return (a.order || 0) - (b.order || 0);
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
      {/* Header - Centered */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-cyan-300">Training Videos</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {videos.length} videos
          </Badge>
        </div>
        <p className="text-gray-400 mb-6">Follow the structured learning path: Business Formation → Markets → Acquisition → Operations</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Filters - Single Row */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant={selectedCategory === 'all' ? "default" : "outline"}
          onClick={() => setSelectedCategory('all')}
          className={
            selectedCategory === 'all'
              ? "bg-cyan-600 hover:bg-cyan-700 h-16 px-6 flex flex-col"
              : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 h-16 px-6 flex flex-col"
          }
        >
          <span className="text-lg font-bold">All</span>
          <span className="text-xs">Categories</span>
        </Button>
        
        {categories.slice(1).map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-gradient-to-br from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 h-16 px-6 flex flex-col whitespace-nowrap"
                : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 h-16 px-6 flex flex-col whitespace-nowrap"
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{getCategoryStep(category)}</span>
              <span className="text-sm font-medium">{category}</span>
            </div>
            <span className="text-xs opacity-75">Step {getCategoryStep(category)}</span>
          </Button>
        ))}
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
                
                {/* Category Step */}
                <div className="absolute top-2 left-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                  <span className="font-bold">{getCategoryStep(video.category)}</span>
                </div>

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

                {/* Handouts indicator */}
                {video.handouts && video.handouts.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-cyan-300">
                    <FileText className="h-3 w-3" />
                    {video.handouts.length} handout{video.handouts.length > 1 ? 's' : ''}
                  </div>
                )}
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
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{selectedVideo.duration}</span>
                <span>{selectedVideo.views.toLocaleString()} views</span>
              </div>
              
              {/* Handouts Section */}
              {selectedVideo.handouts && selectedVideo.handouts.length > 0 && (
                <div className="border-t border-cyan-500/20 pt-4">
                  <h4 className="text-cyan-300 font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Handouts
                  </h4>
                  <div className="space-y-2">
                    {selectedVideo.handouts.map((handout, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-300" />
                          <span className="text-white">{handout.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                          onClick={() => window.open(handout.url, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
