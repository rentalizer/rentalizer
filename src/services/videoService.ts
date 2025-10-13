import axios, { AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api';
import { Video, CreateVideoData, UpdateVideoData, VideoFilters } from '@/types';

// Video API endpoints
const VIDEO_ENDPOINTS = {
  VIDEOS: '/videos',
  FEATURED: '/videos/featured',
  CATEGORIES: '/videos/categories',
  SEARCH: '/videos/search',
  CATEGORY: (category: string) => `/videos/category/${encodeURIComponent(category)}`,
  VIDEO_BY_ID: (id: string) => `/videos/${id}`,
  VIDEO_VIEW: (id: string) => `/videos/${id}/view`,
  VIDEO_FEATURED: (id: string) => `/videos/${id}/featured`,
  REORDER: '/videos/reorder',
  STATS: '/videos/admin/stats',
  BULK: '/videos/bulk',
  UPLOAD_THUMBNAIL: '/upload/thumbnail',
};

// Create axios instance for video API
const videoApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
videoApi.interceptors.request.use(
  (config) => {
    // Check for both 'token' and 'authToken' keys
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
videoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - don't redirect automatically
      // Let the component handle the error gracefully
      console.warn('Authentication failed - token may be expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchTerm?: string;
}


export interface VideoOrder {
  videoId: string;
  order: number;
}

export interface VideoStats {
  totalVideos: number;
  activeVideos: number;
  featuredVideos: number;
  totalViews: number;
  recentVideos: number;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
}

export interface VideoFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface BulkUpdateData {
  videoIds: string[];
  updateData: Partial<UpdateVideoData>;
}

// Video API service class
class VideoService {
  // Get all videos with filtering and pagination
  async getVideos(filters: VideoFilters = {}): Promise<ApiResponse<Video[]>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response: AxiosResponse<ApiResponse<Video[]>> = await videoApi.get(
      `${VIDEO_ENDPOINTS.VIDEOS}?${params.toString()}`
    );
    return response.data;
  }

  // Get video by ID
  async getVideoById(id: string): Promise<ApiResponse<Video>> {
    const response: AxiosResponse<ApiResponse<Video>> = await videoApi.get(
      VIDEO_ENDPOINTS.VIDEO_BY_ID(id)
    );
    return response.data;
  }

  // Get featured videos
  async getFeaturedVideos(limit: number = 5): Promise<ApiResponse<Video[]>> {
    const response: AxiosResponse<ApiResponse<Video[]>> = await videoApi.get(
      `${VIDEO_ENDPOINTS.FEATURED}?limit=${limit}`
    );
    return response.data;
  }

  // Get videos by category
  async getVideosByCategory(category: string, limit: number = 10): Promise<ApiResponse<Video[]>> {
    const response: AxiosResponse<ApiResponse<Video[]>> = await videoApi.get(
      `${VIDEO_ENDPOINTS.CATEGORY(category)}?limit=${limit}`
    );
    return response.data;
  }

  // Search videos
  async searchVideos(params: SearchParams): Promise<ApiResponse<Video[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);

    const response: AxiosResponse<ApiResponse<Video[]>> = await videoApi.get(
      `${VIDEO_ENDPOINTS.SEARCH}?${searchParams.toString()}`
    );
    return response.data;
  }

  // Get video categories
  async getVideoCategories(): Promise<ApiResponse<string[]>> {
    const response: AxiosResponse<ApiResponse<string[]>> = await videoApi.get(
      VIDEO_ENDPOINTS.CATEGORIES
    );
    return response.data;
  }

  // Increment video views
  async incrementViews(id: string): Promise<ApiResponse<{ views: number }>> {
    const response: AxiosResponse<ApiResponse<{ views: number }>> = await videoApi.post(
      VIDEO_ENDPOINTS.VIDEO_VIEW(id)
    );
    return response.data;
  }

  // Admin operations
  // Create new video
  async createVideo(videoData: CreateVideoData, attachmentFile?: File): Promise<ApiResponse<Video>> {
    const formData = new FormData();
    
    // Add video data fields
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('thumbnail', videoData.thumbnail);
    formData.append('category', videoData.category);
    formData.append('videoUrl', videoData.videoUrl);
    
    if (videoData.tags && videoData.tags.length > 0) {
      formData.append('tags', JSON.stringify(videoData.tags));
    }
    
    if (videoData.featured !== undefined) {
      formData.append('featured', videoData.featured.toString());
    }
    
    if (videoData.isLive !== undefined) {
      formData.append('isLive', videoData.isLive.toString());
    }
    
    // Add attachment if provided
    if (attachmentFile) {
      formData.append('document', attachmentFile);
    }
    
    // If attachment data is already provided (without file), include it
    if (videoData.attachment && !attachmentFile) {
      formData.append('attachment', JSON.stringify(videoData.attachment));
    }

    const response: AxiosResponse<ApiResponse<Video>> = await videoApi.post(
      VIDEO_ENDPOINTS.VIDEOS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Update video
  async updateVideo(id: string, updateData: UpdateVideoData, attachmentFile?: File): Promise<ApiResponse<Video>> {
    const formData = new FormData();
    
    // Add update data fields
    if (updateData.title) formData.append('title', updateData.title);
    if (updateData.description) formData.append('description', updateData.description);
    if (updateData.thumbnail) formData.append('thumbnail', updateData.thumbnail);
    if (updateData.category) formData.append('category', updateData.category);
    if (updateData.videoUrl) formData.append('videoUrl', updateData.videoUrl);
    
    if (updateData.tags && updateData.tags.length > 0) {
      formData.append('tags', JSON.stringify(updateData.tags));
    }
    
    if (updateData.featured !== undefined) {
      formData.append('featured', updateData.featured.toString());
    }
    
    if (updateData.isLive !== undefined) {
      formData.append('isLive', updateData.isLive.toString());
    }
    
    if (updateData.isActive !== undefined) {
      formData.append('isActive', updateData.isActive.toString());
    }
    
    // Add attachment if provided
    if (attachmentFile) {
      formData.append('document', attachmentFile);
    }
    
    // If attachment data is already provided (without file), include it
    if (updateData.attachment && !attachmentFile) {
      formData.append('attachment', JSON.stringify(updateData.attachment));
    } else if (updateData.attachment === null && !attachmentFile) {
      formData.append('attachment', 'null');
    }

    const response: AxiosResponse<ApiResponse<Video>> = await videoApi.put(
      VIDEO_ENDPOINTS.VIDEO_BY_ID(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Delete video
  async deleteVideo(id: string): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await videoApi.delete(
      VIDEO_ENDPOINTS.VIDEO_BY_ID(id)
    );
    return response.data;
  }

  // Toggle featured status
  async toggleFeatured(id: string): Promise<ApiResponse<Video>> {
    const response: AxiosResponse<ApiResponse<Video>> = await videoApi.patch(
      VIDEO_ENDPOINTS.VIDEO_FEATURED(id)
    );
    return response.data;
  }

  // Reorder videos
  async reorderVideos(videoOrders: VideoOrder[]): Promise<ApiResponse<Video[]>> {
    const response: AxiosResponse<ApiResponse<Video[]>> = await videoApi.put(
      VIDEO_ENDPOINTS.REORDER,
      { videoOrders }
    );
    return response.data;
  }

  // Get video statistics
  async getVideoStats(): Promise<ApiResponse<VideoStats>> {
    const response: AxiosResponse<ApiResponse<VideoStats>> = await videoApi.get(
      VIDEO_ENDPOINTS.STATS
    );
    return response.data;
  }

  // Bulk update videos
  async bulkUpdateVideos(bulkData: BulkUpdateData): Promise<ApiResponse<{ modifiedCount: number }>> {
    const response: AxiosResponse<ApiResponse<{ modifiedCount: number }>> = await videoApi.put(
      VIDEO_ENDPOINTS.BULK,
      bulkData
    );
    return response.data;
  }

  // Upload thumbnail image
  async uploadThumbnail(file: File): Promise<AxiosResponse<{ success: boolean; data: { key: string; url: string; size: number; mimetype: string } }>> {
    const formData = new FormData();
    formData.append('thumbnail', file);

    return videoApi.post(VIDEO_ENDPOINTS.UPLOAD_THUMBNAIL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete thumbnail image
  async deleteThumbnail(payload: { key?: string; url?: string } | string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
    const data = typeof payload === 'string' ? { key: payload } : payload;

    return videoApi.delete('/upload/thumbnail', {
      data,
    });
  }
}

// Export singleton instance
export const videoService = new VideoService();
export default videoService;
