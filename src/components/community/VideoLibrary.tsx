import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video as VideoIcon, Search, Play, Clock, Eye, Calendar, Star, X, Plus, Edit, Trash2, GripVertical, Lock, Loader2, ArrowRight, Music, Building2, BarChart3, Home, Settings, FileText, NotebookPen } from 'lucide-react';
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
import { documentService } from '@/services/documentService';
import { Video, CreateVideoData, UpdateVideoData, VideoFilters } from '@/types';
import { DocumentsLibrary } from './DocumentsLibrary';
import { API_CONFIG } from '@/config/api';

const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'xls', 'xlsx', 'xlsm', 'doc', 'docx', 'ppt', 'pptx', 'ppsx', 'txt', 'md', 'csv', 'ods', 'odp', 'odt'];
const CHRONOLOGICAL_CATEGORIES = new Set([
  'Business Formation',
  'Market Research',
  'Property Acquisition',
  'Operations'
]);

const determineDocumentType = (fileName: string): 'pdf' | 'spreadsheet' | 'document' | 'presentation' | 'text' => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf') return 'pdf';
  if (['xls', 'xlsx', 'xlsm', 'csv', 'ods'].includes(ext)) return 'spreadsheet';
  if (['ppt', 'pptx', 'ppsx', 'odp'].includes(ext)) return 'presentation';
  if (['txt', 'md'].includes(ext)) return 'text';
  return 'document';
};

const getAttachmentIcon = (type: 'pdf' | 'spreadsheet' | 'document' | 'presentation' | 'text') => {
  switch (type) {
    case 'pdf':
      return <span className="text-red-400 text-lg">📄</span>;
    case 'spreadsheet':
    case 'excel':
      return <span className="text-green-400 text-lg">📊</span>;
    case 'presentation':
      return <span className="text-orange-400 text-lg">📽️</span>;
    case 'text':
      return <span className="text-blue-300 text-lg">📝</span>;
    default:
      return <span className="text-purple-300 text-lg">📁</span>;
  }
};

const orderVideosForDisplay = (category: string, items: Video[]) => {
  if (!CHRONOLOGICAL_CATEGORIES.has(category)) {
    return items;
  }

  return [...items].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;

    if (orderA === orderB) {
      const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return createdAtA - createdAtB;
    }

    return orderA - orderB;
  });
};

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

interface CategoryAlbumCardProps {
  category: string;
  videoCount: number;
  videos: Video[];
  onClick: (category: string) => void;
  getCategoryColor: (category: string) => string;
  documentCount: number;
}

const CategoryAlbumCard = ({ category, videoCount, videos, onClick, getCategoryColor, documentCount }: CategoryAlbumCardProps) => {
  const getCategoryIcon = (category: string, size: 'small' | 'large' = 'small') => {
    const sizeClass = size === 'large' ? 'h-24 w-24' : 'h-4 w-4';
    switch (category) {
      case 'Business Formation':
        return <Building2 className={`${sizeClass} text-blue-300`} />;
      case 'Market Research':
        return <BarChart3 className={`${sizeClass} text-cyan-300`} />;
      case 'Property Acquisition':
        return <Home className={`${sizeClass} text-purple-300`} />;
      case 'Operations':
        return <Settings className={`${sizeClass} text-green-300`} />;
      case 'Documents Library':
        return <NotebookPen className={`${sizeClass} text-orange-300`} />;
      case 'Training Replays':
        return <FileText className={`${sizeClass} text-amber-300`} />;
      default:
        return <VideoIcon className={`${sizeClass} text-gray-300`} />;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Business Formation':
        return 'Starting your rental business from scratch';
      case 'Market Research':
        return 'Analyzing markets and finding opportunities';
      case 'Property Acquisition':
        return 'Finding and purchasing rental properties';
      case 'Operations':
        return 'Managing and optimizing your properties';
      case 'Documents Library':
        return 'Templates, guides, and reference materials';
      case 'Training Replays':
        return 'On-demand access to our live training sessions';
      default:
        return 'Training videos and resources';
    }
  };

  // Get category-specific placeholder image
  const getCategoryPlaceholder = (category: string) => {
    const placeholders = {
      'Business Formation': '/thumbnail/business_formation.png',
      'Market Research': '/thumbnail/market_research.png',
      'Property Acquisition': '/thumbnail/property_acquisition.png',
      'Operations': '/thumbnail/operations.png'
    };
    return placeholders[category as keyof typeof placeholders] || '/thumbnail/business_formation.png';
  };

  const albumCover = getCategoryPlaceholder(category);

  return (
    <Card 
      className="bg-slate-700/80 border-cyan-500/40 hover:border-cyan-500/60 transition-all cursor-pointer group hover:scale-105 shadow-lg hover:shadow-xl"
      onClick={() => onClick(category)}
    >
      <div className="relative">
        {/* Album Cover with Icon */}
        <div className="aspect-video bg-slate-800/60 rounded-t-lg relative overflow-hidden flex items-center justify-center border border-slate-500/30">
          {/* Category Icon as Background */}
          <div className="flex items-center justify-center w-full h-full">
            <div className="opacity-100">
              {getCategoryIcon(category, 'large')}
            </div>
          </div>
          
          {/* Video count badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {category === 'Documents Library' ? (
              <>
                <FileText className="h-3 w-3" />
                {documentCount}
              </>
            ) : (
              <>
                <VideoIcon className="h-3 w-3" />
                {videoCount}
              </>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-3 bg-slate-800/60">
        <div className="space-y-2">
          {/* Category Icon and Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              {getCategoryIcon(category, 'small')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors text-sm">
                {category}
              </h3>
              <p className="text-xs text-gray-400">
                {getCategoryDescription(category)}
              </p>
            </div>
          </div>

          {/* Category badge and view button */}
          <div className="flex items-center justify-between">
            <Badge className={`${getCategoryColor(category)} text-xs`}>
              {category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-cyan-300 transition-colors">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
      <Card className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer ${video.featured ? 'ring-1 ring-cyan-400/30' : ''} relative group flex h-full flex-col`}>
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

        <div onClick={() => onClick(video)} className="flex flex-1 flex-col">
          <div className="relative">
            {/* Thumbnail */}
            <div className="aspect-video bg-slate-700 rounded-t-lg relative overflow-hidden">
              <img
                src={video.thumbnail.startsWith('/uploads/') ? `${API_CONFIG.BASE_URL.replace('/api', '')}${video.thumbnail}` : video.thumbnail}
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

          <CardContent className="flex flex-1 flex-col p-4">
            <div className="flex h-full flex-col gap-3">
              {/* Title */}
              <h3 className="font-semibold text-white hover:text-cyan-300 transition-colors">
                {video.title.length > 25 ? video.title.slice(0, 30) + "..." : video.title}
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
              
              {/* Attachment info */}
              <div className="mt-auto">
                <div className="flex min-h-[2.5rem] items-center gap-2 rounded-md border border-slate-600/60 bg-slate-700/40 px-3 py-2 text-xs">
                  {video.attachment ? (
                    <>
                      {getAttachmentIcon(video.attachment.type)}
                      <span className="block max-w-[10rem] truncate text-cyan-300">{video.attachment.filename}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500">No supporting document</span>
                    </>
                  )}
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
  const [categories, setCategories] = useState<string[]>(['all', 'Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Documents Library', 'Training Replays']);
  const [documentCount, setDocumentCount] = useState(0);
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
    category: 'Business Formation',
    videoUrl: '',
    tags: [],
    featured: false,
    attachment: null
  });
  
  // Track attachment file separately
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const isMountedRef = useRef(true);
  const hasInitiallyLoadedRef = useRef(false);
  const loadVideosRef = useRef<typeof loadVideos>();

  // Helper function to sort videos: featured first, then by order (newest first)
  const sortVideosByFeatured = (videos: Video[]) => {
    return videos.sort((a, b) => {
      // Featured videos go to top
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // If both have same featured status, sort by order (newest first - higher order numbers first)
      return b.order - a.order;
    });
  };

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
        sortOrder: 'desc'
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
      const apiCategories = response.data.length > 0 ? response.data : ['Business Formation', 'Market Research', 'Property Acquisition', 'Operations'];
      const finalCategories = ['all', ...apiCategories];
      console.log('Final categories:', finalCategories);
      setCategories(finalCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories if API fails
      setCategories(['all', 'Business Formation', 'Market Research', 'Property Acquisition', 'Operations']);
    }
  }, []);

  // Load document count on mount
  const loadDocumentCount = useCallback(async () => {
    try {
      const response = await documentService.getDocuments({});
      setDocumentCount(response.data.length);
    } catch (error) {
      console.error('Error loading document count:', error);
      // Set to 0 if error
      setDocumentCount(0);
    }
  }, []);

  // Load categories and document count once on mount
  useEffect(() => {
    loadCategories();
    loadDocumentCount();
  }, [loadCategories, loadDocumentCount]); // Both functions are stable (useCallback with empty deps)

  // Load videos on mount
  useEffect(() => {
    if (!hasInitiallyLoadedRef.current && loadVideosRef.current) {
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
    // Skip if we haven't initially loaded yet
    if (!hasInitiallyLoadedRef.current || !loadVideosRef.current) return;
    
    const timeoutId = setTimeout(() => {
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
      'Business Formation': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Market Research': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Property Acquisition': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Operations': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Documents Library': 'bg-orange-500/20 border-orange-500/30 text-orange-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
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
      // Find the active and over videos
      const activeVideo = videos.find(video => video._id === active.id);
      const overVideo = videos.find(video => video._id === over?.id);
      
      if (!activeVideo || !overVideo) return;
      
      // Only allow reordering within the same category
      if (activeVideo.category !== overVideo.category) {
        toast({
          title: "Cannot reorder",
          description: "Videos can only be reordered within the same category.",
          variant: "destructive"
        });
        return;
      }
      
      // Get videos in the same category
      let categoryVideos = videos.filter(video => video.category === activeVideo.category);
      categoryVideos = orderVideosForDisplay(activeVideo.category, categoryVideos);
      const oldIndex = categoryVideos.findIndex((item) => item._id === active.id);
      const newIndex = categoryVideos.findIndex((item) => item._id === over?.id);
      
      const newCategoryItems = arrayMove(categoryVideos, oldIndex, newIndex);
      const useChronologicalOrdering = CHRONOLOGICAL_CATEGORIES.has(activeVideo.category);
      const getOrderValue = (index: number, length: number) =>
        useChronologicalOrdering ? index + 1 : length - index;

      // Update the order for videos in this category
      const videoOrders = newCategoryItems.map((item, index) => ({
        videoId: item._id,
        order: getOrderValue(index, newCategoryItems.length)
      }));

      try {
        await videoService.reorderVideos(videoOrders);
        
        // Update local state
        setVideos(prevVideos => {
          const updatedVideos = [...prevVideos];
          newCategoryItems.forEach((item, index) => {
            const videoIndex = updatedVideos.findIndex(v => v._id === item._id);
            if (videoIndex !== -1) {
              updatedVideos[videoIndex] = { 
                ...updatedVideos[videoIndex], 
                order: getOrderValue(index, newCategoryItems.length) 
              };
            }
          });
          return updatedVideos;
        });
      
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
      const response = await videoService.createVideo(newVideo, attachmentFile || undefined);
      setVideos(prevVideos => {
        const updatedVideos = [...prevVideos, response.data];
        return sortVideosByFeatured(updatedVideos);
      });
      
      // If video has attachment, refresh document count
      if (response.data.attachment) {
        setDocumentCount(prev => prev + 1);
      }

    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
        category: 'Business Formation',
      videoUrl: '',
      tags: [],
      featured: false,
      attachment: null
    });
    setAttachmentFile(null);
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
    setAttachmentFile(null); // Reset attachment file when editing
    setNewVideo({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      category: video.category,
      videoUrl: video.videoUrl,
      tags: video.tags,
      featured: video.featured,
      attachment: video.attachment // Include existing attachment
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
      const response = await videoService.updateVideo(editingVideo._id, newVideo, attachmentFile || undefined);
      setVideos(prevVideos => {
        const updatedVideos = prevVideos.map(video => 
          video._id === editingVideo._id ? response.data : video
        );
        return sortVideosByFeatured(updatedVideos);
      });
      
      // If video has attachment, refresh document count
      const hadAttachment = !!editingVideo.attachment;
      const hasAttachmentNow = !!response.data.attachment;

      if (hasAttachmentNow && !hadAttachment) {
        setDocumentCount(prev => prev + 1);
      } else if (!hasAttachmentNow && hadAttachment) {
        setDocumentCount(prev => Math.max(prev - 1, 0));
      }

    setEditingVideo(null);
    setNewVideo({
      title: '',
      description: '',
      thumbnail: '',
        category: 'Business Formation',
      videoUrl: '',
      tags: [],
      featured: false,
      attachment: null
    });
    setAttachmentFile(null);
    
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
        const videoToDelete = videos.find(video => video._id === videoId);
        await videoService.deleteVideo(videoId);
        setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      if (videoToDelete?.attachment) {
        setDocumentCount(prev => Math.max(prev - 1, 0));
      }
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
      
      // Update the video and re-sort the array to prioritize featured videos
      setVideos(prevVideos => {
        const updatedVideos = prevVideos.map(video => 
          video._id === videoId ? response.data : video
        );
        return sortVideosByFeatured(updatedVideos);
      });
      
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

  const selectedAttachment = selectedVideo?.attachment ?? null;
  const hasSelectedAttachment =
    !!(
      selectedAttachment &&
      selectedAttachment.url &&
      selectedAttachment.url.trim() !== '' &&
      selectedAttachment.filename &&
      selectedAttachment.filename.trim() !== ''
    );
  const selectedAttachmentSizeLabel = (() => {
    if (
      !hasSelectedAttachment ||
      !selectedAttachment ||
      typeof selectedAttachment.size !== 'number' ||
      !Number.isFinite(selectedAttachment.size)
    ) {
      return null;
    }
    return `${(selectedAttachment.size / 1024).toFixed(1)} KB`;
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-3">
            {selectedCategory === 'all' ? (
              <>
                <VideoIcon className="h-10 w-10 text-cyan-300" />
                Training Replays & Documents
              </>
            ) : selectedCategory === 'Documents Library' ? (
              <>
                <FileText className="h-10 w-10 text-cyan-300" />
                Training Documents
              </>
            ) : (
              <>
                <VideoIcon className="h-10 w-10 text-cyan-300" />
                Training Videos
              </>
            )}
          </h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </div>
            ) : (
              selectedCategory === 'all' 
                ? '5 categories'
                : selectedCategory === 'Documents Library'
                ? `${documentCount} documents`
                : `${videos.filter(v => v.category === selectedCategory).length} videos`
            )}
          </Badge>
        </div>
        
        {/* Admin Add Button */}
        <div className="flex-1 flex justify-end">
        {isAdmin && user && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] bg-slate-900 border border-cyan-500/20 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">Add New Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pr-2">
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
                
                {/* File Attachment Field */}
                <div>
                  <Label htmlFor="attachment" className="text-gray-300">Support Document (Optional)</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="attachment"
                      accept=".pdf,.xls,.xlsx,.xlsm,.doc,.docx,.ppt,.pptx,.ppsx,.txt,.md,.csv,.ods,.odp,.odt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > MAX_DOCUMENT_SIZE) {
                            toast({
                              title: "File too large",
                              description: "File must be 20MB or smaller.",
                              variant: "destructive"
                            });
                            e.target.value = '';
                            return;
                          }

                          const extension = file.name.split('.').pop()?.toLowerCase() || '';
                          if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
                            toast({
                              title: "Unsupported file type",
                              description: "Please upload PDF, Office, text, or CSV documents.",
                              variant: "destructive"
                            });
                            e.target.value = '';
                            return;
                          }

                          const fileType = determineDocumentType(file.name);

                          setAttachmentFile(file);

                          setNewVideo({
                            ...newVideo,
                            attachment: {
                              filename: file.name,
                              url: '',
                              type: fileType,
                              size: file.size
                            }
                          });
                        }
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                    />
                    <p className="text-xs text-gray-400 mt-1">Upload PDF, Office, text, or CSV files up to 20MB</p>
                  </div>
                </div>
                
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
      </div>

      {/* Search - Only show when in a specific category */}
      {selectedCategory !== 'all' && selectedCategory !== 'Documents Library' && (
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos in this category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Videos organized by category columns */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-gray-400">Loading videos...</p>
          </div>
        </div>
      ) : (
        <>
          {(() => {
            // Define the category columns - these should ALWAYS show regardless of video count
            const categoryColumns = ['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Documents Library'];
            
            // Group videos by category - initialize all categories with empty arrays
            const videosByCategory = categoryColumns.reduce((acc, category) => {
              const filteredVideos = videos.filter(video => video.category === category);
              acc[category] = orderVideosForDisplay(category, filteredVideos);
              return acc;
            }, {} as Record<string, Video[]>);

            // If a specific category is selected, show the detailed view
            if (selectedCategory !== 'all') {
              // Show Documents Library for Documents Library category
              if (selectedCategory === 'Documents Library') {
                return <DocumentsLibrary 
                  key="documents-library" // Force remount to refresh data
                  onBack={() => setSelectedCategory('all')} 
                  onDocumentCountChange={setDocumentCount}
                />;
              }
              
              const categoryVideos = videosByCategory[selectedCategory] || [];
              
              return (
                <div className="space-y-6">
                  {/* Back button */}
                  <div className="flex items-center gap-4 mb-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCategory('all')}
                      className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                      Back to Albums
                    </Button>
                    <h3 className="text-xl font-semibold text-cyan-300">{selectedCategory}</h3>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
                      {categoryVideos.length} videos
                    </Badge>
                  </div>
                  
                  <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {categoryVideos.length === 0 ? (
                      <Card className="bg-slate-800/50 border-cyan-500/20">
                        <CardContent className="text-center py-12">
                          <VideoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No videos found</h3>
                          <p className="text-gray-400">
                            {searchTerm 
                              ? 'Try adjusting your search terms or filters' 
                              : `No videos have been added to ${selectedCategory} yet`
                            }
                          </p>
                        </CardContent>
                      </Card>
                    ) : isAdmin ? (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={categoryVideos.map(v => v._id)} strategy={verticalListSortingStrategy}>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categoryVideos.map(video => (
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
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryVideos.map(video => (
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
                  </div>
                </div>
              );
            }

            // Show album view (2x2 grid of category cards)
            return (
              <div className="space-y-6">
                {videos.length === 0 && !loading ? (
                  <Card className="bg-slate-800/50 border-cyan-500/20">
                    <CardContent className="text-center py-12">
                      <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No training albums available</h3>
                      <p className="text-gray-400">
                        Training videos will be organized into categories once they are added.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {categoryColumns.map(category => {
                      const categoryVideos = videosByCategory[category] || [];
                      
                      return (
                        <CategoryAlbumCard
                          key={category}
                          category={category}
                          videoCount={categoryVideos.length}
                          videos={categoryVideos}
                          onClick={handleCategoryClick}
                          getCategoryColor={getCategoryColor}
                          documentCount={documentCount}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </>
      )}

      {/* Edit Video Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-w-md max-h-[90vh] bg-slate-900 border border-cyan-500/20 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">Edit Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pr-2">
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
            
            {/* File Attachment Field */}
            <div>
              <Label htmlFor="edit-attachment" className="text-gray-300">Support Document (Optional)</Label>
              <div className="mt-2">
                {newVideo.attachment && (
                  <div className="mb-2 p-2 bg-slate-800/50 rounded border border-cyan-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAttachmentIcon(newVideo.attachment.type)}
                      <span className="text-sm text-gray-300">{newVideo.attachment.filename}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setNewVideo({...newVideo, attachment: null})}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  type="file"
                  id="edit-attachment"
                  accept=".pdf,.xls,.xlsx,.xlsm,.doc,.docx,.ppt,.pptx,.ppsx,.txt,.md,.csv,.ods,.odp,.odt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > MAX_DOCUMENT_SIZE) {
                        toast({
                          title: "File too large",
                          description: "File must be 20MB or smaller.",
                          variant: "destructive"
                        });
                        e.target.value = '';
                        return;
                      }

                      const extension = file.name.split('.').pop()?.toLowerCase() || '';
                      if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
                        toast({
                          title: "Unsupported file type",
                          description: "Please upload PDF, Office, text, or CSV documents.",
                          variant: "destructive"
                        });
                        e.target.value = '';
                        return;
                      }

                      const fileType = determineDocumentType(file.name);

                      setAttachmentFile(file);

                      setNewVideo({
                        ...newVideo,
                        attachment: {
                          filename: file.name,
                          url: '',
                          type: fileType,
                          size: file.size
                        }
                      });
                    }
                  }}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                />
                <p className="text-xs text-gray-400 mt-1">Upload PDF, Office, text, or CSV files up to 20MB</p>
              </div>
            </div>
            
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
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/20 overflow-y-auto">
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
              {/* Description */}
              {selectedVideo.description && (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Description</h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedVideo.description}
                  </p>
                </div>
              )}
              
              {/* Attachment */}
              {hasSelectedAttachment && selectedAttachment && (
                <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAttachmentIcon(selectedAttachment.type)}
                      <div>
                        <p className="text-xs text-white font-medium">{selectedAttachment.filename}</p>
                        {selectedAttachmentSizeLabel && (
                          <p className="text-xs text-gray-400">
                            {selectedAttachmentSizeLabel}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Open attachment in new tab
                        const fullUrl = selectedAttachment.url.startsWith('http')
                          ? selectedAttachment.url
                          : `${API_CONFIG.BASE_URL.replace('/api', '')}${selectedAttachment.url}`;
                        window.open(fullUrl, '_blank');
                      }}
                      className="h-7 px-3 text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              )}
              
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
