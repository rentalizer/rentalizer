import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video as VideoIcon, Search, Play, Clock, Eye, Calendar, Star, X, Plus, Edit, Trash2, GripVertical, Lock, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { videoService } from '@/services/videoService';
import { Video, CreateVideoData, UpdateVideoData, VideoFilters } from '@/types';

interface SortableVideoCardProps {
  video: Video;
  isAdmin: boolean;
  isAuthenticated: boolean;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onToggleFeatured: (videoId: string) => void;
  onClick: (video: Video) => void;
  getCategoryColor: (category: string) => string;
}

const SortableVideoCard = ({ video, isAdmin, isAuthenticated, onEdit, onDelete, onToggleFeatured, onClick, getCategoryColor }: SortableVideoCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: video._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer ${video.featured ? 'ring-1 ring-cyan-400/30' : ''} relative group`}>
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-slate-700/80 hover:bg-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(video);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 bg-red-900/80 hover:bg-red-800"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video._id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={video.featured ? "default" : "secondary"}
              className={`h-8 w-8 p-0 ${video.featured 
                ? 'bg-cyan-600/80 hover:bg-cyan-500 text-white' 
                : 'bg-slate-700/80 hover:bg-slate-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(video._id);
              }}
            >
              <Star className="h-3 w-3" />
            </Button>
            <div
              {...attributes}
              {...listeners}
              className="h-8 w-8 flex items-center justify-center bg-slate-700/80 hover:bg-slate-600 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3 w-3 text-gray-300" />
            </div>
          </div>
        )}

        <div onClick={() => onClick(video)}>
          <div className="relative">
            {/* Thumbnail */}
            <div className="aspect-video bg-slate-700 rounded-t-lg relative overflow-hidden">
              <img
                src={video.thumbnail.startsWith('/uploads/') ? `http://localhost:5000${video.thumbnail}` : video.thumbnail}
                alt={video.title}
                className={`w-full h-full object-cover transition-all ${!isAuthenticated ? 'filter grayscale opacity-50' : ''}`}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMzM0MTU1Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMi41IiByPSIzMCIgZmlsbD0iIzk0QTNCOCIvPgo8cG9seWdvbiBwb2ludHM9IjE5MCwxMDAuNSAyMTAsOTAuNSAyMTAsMTM0LjUgMTkwLDEyNC41IiBmaWxsPSIjMzM0MTU1Ii8+Cjwvc3ZnPgo=';
                }}
              />
              
              {/* Member access overlay for non-authenticated users */}
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                  <Lock className="h-8 w-8 mb-2 text-cyan-400" />
                  <span className="text-sm font-medium">Member Access</span>
                  <span className="text-xs text-gray-300">Required</span>
                </div>
              )}
              
              {/* Play button overlay for authenticated users */}
              {isAuthenticated && (
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
              )}
              
              
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

            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export const VideoLibrary = () => {
  const { isAdmin } = useAdminRole();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [categories, setCategories] = useState<string[]>(['all', 'Category 1', 'Category 2', 'Category 3']);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Form state for new video
  const [newVideo, setNewVideo] = useState<CreateVideoData>({
    title: '',
    description: '',
    thumbnail: '',
    category: 'Category 1',
    videoUrl: '',
    tags: [],
    featured: false
  });

  const isMountedRef = useRef(true);
  const hasInitiallyLoadedRef = useRef(false);
  const loadVideosRef = useRef<typeof loadVideos>();

  // API integration functions
  const loadVideos = useCallback(async (filters?: Partial<VideoFilters>) => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      const requestFilters: VideoFilters = {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        category: filters?.category,
        search: filters?.search,
        sortBy: 'order',
        sortOrder: 'asc'
      };

      console.log('Loading videos with filters:', requestFilters);
      const response = await videoService.getVideos(requestFilters);
      
      if (isMountedRef.current) {
        setVideos(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error loading videos:', error);
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [toast]);

  // Store the latest loadVideos function in ref
  loadVideosRef.current = loadVideos;

  const loadCategories = useCallback(async () => {
    try {
      const response = await videoService.getVideoCategories();
      console.log('Categories API response:', response.data);
      // If API returns empty categories, use the default categories
      const apiCategories = response.data.length > 0 ? response.data : ['Category 1', 'Category 2', 'Category 3'];
      const finalCategories = ['all', ...apiCategories];
      console.log('Final categories:', finalCategories);
      setCategories(finalCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories if API fails
      setCategories(['all', 'Category 1', 'Category 2', 'Category 3']);
    }
  }, []);

  // Load categories once on mount (categories are static)
  useEffect(() => {
    loadCategories();
  }, [loadCategories]); // loadCategories is stable (useCallback with empty deps)

  // Load videos on mount
  useEffect(() => {
    console.log('🎬 Initial video load effect triggered');
    if (!hasInitiallyLoadedRef.current && loadVideosRef.current) {
      console.log('🎬 Loading videos for the first time');
      loadVideosRef.current();
      hasInitiallyLoadedRef.current = true;
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Handle category and search changes with debouncing
  useEffect(() => {
    console.log('🔍 Category/search change effect triggered:', { selectedCategory, searchTerm });
    // Skip if we haven't initially loaded yet
    if (!hasInitiallyLoadedRef.current || !loadVideosRef.current) {
      console.log('🔍 Skipping - not initially loaded yet');
      return;
    }
    
    const timeoutId = setTimeout(() => {
      console.log('🔍 Loading videos with filters:', { selectedCategory, searchTerm });
      loadVideosRef.current!({ 
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined
      });
    }, searchTerm ? 500 : 0); // Debounce only for search, immediate for category

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]); // No loadVideos dependency needed

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'Category 1': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Category 2': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Category 3': 'bg-purple-500/20 border-purple-500/30 text-purple-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const handleVideoClick = async (video: Video) => {
    if (!user) {
      toast({
        title: "Member Access Required",
        description: "Please log in to access training videos.",
        variant: "destructive"
      });
      return;
    }
    
    if (video.videoUrl) {
      setSelectedVideo(video);
      // Increment view count
      try {
        await videoService.incrementViews(video._id);
        // Update local state
        setVideos(prevVideos => 
          prevVideos.map(v => 
            v._id === video._id ? { ...v, views: v.views + 1 } : v
          )
        );
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    }
  };

  const getEmbedUrl = (loomUrl: string) => {
    const videoId = loomUrl.split('/share/')[1]?.split('?')[0];
    return `https://www.loom.com/embed/${videoId}`;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = videos.findIndex((item) => item._id === active.id);
      const newIndex = videos.findIndex((item) => item._id === over?.id);
      
      const newItems = arrayMove(videos, oldIndex, newIndex);
      const videoOrders = newItems.map((item, index) => ({
        videoId: item._id,
        order: index + 1
      }));

      try {
        await videoService.reorderVideos(videoOrders);
        setVideos(newItems.map((item, index) => ({ ...item, order: index + 1 })));
      
      toast({
        title: "Video reordered",
        description: "Video position has been updated successfully.",
      });
      } catch (error) {
        console.error('Error reordering videos:', error);
        toast({
          title: "Error",
          description: "Failed to reorder videos. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddVideo = async () => {
    // Check authentication first
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add videos.",
        variant: "destructive"
      });
      return;
    }

    if (!newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in title and video URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await videoService.createVideo(newVideo);
      setVideos(prevVideos => [...prevVideos, response.data]);
    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
        category: 'Category 1',
      videoUrl: '',
      tags: [],
      featured: false
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Video added",
      description: "New video has been added successfully.",
    });
    } catch (error: unknown) {
      console.error('Error creating video:', error);
      
      // Handle authentication errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please log in to create videos. Your session may have expired.",
            variant: "destructive"
          });
          return;
        }
        
        // Handle validation errors
        if (axiosError.response?.status === 400) {
          const errorMessage = axiosError.response?.data?.message || "Please check your input and try again.";
          toast({
            title: "Validation Error",
            description: errorMessage,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Generic error
      toast({
        title: "Error",
        description: "Failed to create video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setNewVideo({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      category: video.category,
      videoUrl: video.videoUrl,
      tags: video.tags,
      featured: video.featured
    });
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo || !newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in title and video URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await videoService.updateVideo(editingVideo._id, newVideo);
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === editingVideo._id ? response.data : video
        )
      );
    setEditingVideo(null);
    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
        category: 'Category 1',
      videoUrl: '',
      tags: [],
      featured: false
    });
    
    toast({
      title: "Video updated",
      description: "Video has been updated successfully.",
    });
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive"
      });
    }
  };


  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(videoId);
        setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      toast({
        title: "Video deleted",
        description: "Video has been deleted successfully.",
      });
      } catch (error) {
        console.error('Error deleting video:', error);
        toast({
          title: "Error",
          description: "Failed to delete video. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleFeatured = async (videoId: string) => {
    try {
      const response = await videoService.toggleFeatured(videoId);
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === videoId ? response.data : video
        )
      );
      
      const newStatus = response.data.featured;
    toast({
      title: newStatus ? "Video featured" : "Video unfeatured",
      description: `Video has been ${newStatus ? 'added to' : 'removed from'} featured content.`,
    });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Training Videos</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </div>
            ) : (
              `${pagination.total} videos`
            )}
          </Badge>
        </div>
        
        {/* Admin Add Button */}
        {isAdmin && user && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-slate-900 border border-cyan-500/20">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">Add New Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                    className="bg-slate-800/50 border-cyan-500/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                    className="bg-slate-800/50 border-cyan-500/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl" className="text-gray-300">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={newVideo.videoUrl}
                    onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                    placeholder="https://www.loom.com/share/..."
                    className="bg-slate-800/50 border-cyan-500/20 text-white"
                  />
                </div>
                <ImageUpload
                    value={newVideo.thumbnail}
                  onChange={(value) => setNewVideo({...newVideo, thumbnail: value})}
                />
                <div>
                  <Label htmlFor="category" className="text-gray-300">Category</Label>
                  <Select value={newVideo.category} onValueChange={(value) => setNewVideo({...newVideo, category: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/20">
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newVideo.featured}
                    onChange={(e) => setNewVideo({...newVideo, featured: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="featured" className="text-gray-300">Featured</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddVideo} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                    Add Video
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
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

      {/* Videos Grid with Drag and Drop */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-gray-400">Loading videos...</p>
          </div>
        </div>
      ) : (
        <>
      {isAdmin ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={videos.map(v => v._id)} strategy={verticalListSortingStrategy}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(video => (
                <SortableVideoCard
                      key={video._id}
                  video={video}
                  isAdmin={isAdmin}
                  isAuthenticated={!!user}
                  onEdit={handleEditVideo}
                  onDelete={handleDeleteVideo}
                  onToggleFeatured={handleToggleFeatured}
                  onClick={handleVideoClick}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
            <SortableVideoCard
                  key={video._id}
              video={video}
              isAdmin={false}
              isAuthenticated={!!user}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleFeatured={() => {}}
              onClick={handleVideoClick}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}

          {videos.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
                <VideoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No videos found</h3>
                <p className="text-gray-400">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search terms or filters' 
                    : 'No videos have been added yet'
                  }
                </p>
          </CardContent>
        </Card>
          )}
        </>
      )}

      {/* Edit Video Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-w-md bg-slate-900 border border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">Edit Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-gray-300">Title</Label>
              <Input
                id="edit-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                className="bg-slate-800/50 border-cyan-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-gray-300">Description</Label>
              <Textarea
                id="edit-description"
                value={newVideo.description}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                className="bg-slate-800/50 border-cyan-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-videoUrl" className="text-gray-300">Video URL</Label>
              <Input
                id="edit-videoUrl"
                value={newVideo.videoUrl}
                onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                className="bg-slate-800/50 border-cyan-500/20 text-white"
              />
            </div>
            <ImageUpload
              value={newVideo.thumbnail}
              onChange={(value) => setNewVideo({...newVideo, thumbnail: value})}
            />
            <div>
              <Label htmlFor="edit-category" className="text-gray-300">Category</Label>
              <Select value={newVideo.category} onValueChange={(value) => setNewVideo({...newVideo, category: value})}>
                <SelectTrigger className="bg-slate-800/50 border-cyan-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/20">
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={newVideo.featured}
                onChange={(e) => setNewVideo({...newVideo, featured: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="edit-featured" className="text-gray-300">Featured</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateVideo} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                Update Video
              </Button>
              <Button variant="outline" onClick={() => setEditingVideo(null)} className="border-gray-600 text-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">
              {selectedVideo?.title}
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
                <span>{selectedVideo.views.toLocaleString()} views</span>
              </div>
              
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};