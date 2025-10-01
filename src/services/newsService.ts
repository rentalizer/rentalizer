/**
 * News Service
 * Handles all news-related API calls to the Node.js backend
 */

import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

// Types
export interface NewsItem {
  _id: string;
  source: string;
  title: string;
  url: string;
  summary: string | null;
  content: string | null;
  published_at: string;
  created_at?: string;
  updated_at?: string;
  tags: string[];
  featured_image_url: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  click_count: number;
  engagement_score: number;
  admin_submitted: boolean;
  submitted_by: any;
  status: string;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleNewsResponse {
  success: boolean;
  message: string;
  data: NewsItem;
}

export interface NewsStats {
  totalNews: number;
  totalViews: number;
  totalClicks: number;
  totalEngagement: number;
  pinnedNews: number;
  featuredNews: number;
  adminSubmittedNews: number;
}

export interface NewsSource {
  name: string;
  enabled: boolean;
  type: string;
  url: string;
}

export interface AggregationResult {
  success: boolean;
  totalFetched: number;
  totalNewArticles: number;
  totalSkipped: number;
  totalErrors: number;
  fetchResults: any[];
}

// Base URL for news API
const NEWS_API_URL = `${API_CONFIG.BASE_URL}/news`;

// Axios instance with default config
const newsAxios = axios.create({
  baseURL: NEWS_API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Helper to get auth token
const getAuthToken = (): string | null => {
  // Check multiple possible token storage keys for compatibility
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('authToken') ||
         sessionStorage.getItem('token');
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Error handler
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; errors?: any[] }>;
    const message = axiosError.response?.data?.message || axiosError.message || 'An error occurred';
    console.error('News API Error:', message, axiosError.response?.data);
    throw new Error(message);
  }
  throw error;
};

/**
 * News Service
 */
export const newsService = {
  /**
   * Get all news items with pagination and filtering
   */
  async getNews(params: {
    page?: number;
    limit?: number;
    source?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
  } = {}): Promise<NewsResponse> {
    try {
      const response = await newsAxios.get<NewsResponse>('/', { params });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get a single news item by ID
   * Automatically increments view count
   */
  async getNewsById(id: string): Promise<SingleNewsResponse> {
    try {
      const response = await newsAxios.get<SingleNewsResponse>(`/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get trending news (highest engagement)
   */
  async getTrendingNews(limit: number = 10): Promise<NewsResponse> {
    try {
      const response = await newsAxios.get<NewsResponse>('/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get featured news
   */
  async getFeaturedNews(limit: number = 5): Promise<NewsResponse> {
    try {
      const response = await newsAxios.get<NewsResponse>('/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get news statistics
   */
  async getStats(): Promise<NewsStats> {
    try {
      const response = await newsAxios.get<{ success: boolean; data: NewsStats }>('/stats');
      return response.data.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Search news items
   */
  async searchNews(searchTerm: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<NewsResponse> {
    try {
      const response = await newsAxios.get<NewsResponse>('/search', {
        params: { q: searchTerm, ...params }
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get available news sources
   */
  async getSources(): Promise<NewsSource[]> {
    try {
      const response = await newsAxios.get<{ success: boolean; data: NewsSource[] }>('/sources');
      return response.data.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Track click on a news item (for analytics)
   * No authentication required
   */
  async trackClick(id: string): Promise<void> {
    try {
      await newsAxios.post(`/${id}/click`);
    } catch (error) {
      // Don't throw error for tracking - just log it
      console.error('Failed to track click:', error);
    }
  },

  /**
   * Create a new news item (manual submission)
   * Requires authentication
   */
  async createNews(newsData: {
    title: string;
    url: string;
    source?: string;
    summary?: string;
    content?: string;
    tags?: string[];
    featured_image_url?: string;
    published_at?: string;
  }): Promise<SingleNewsResponse> {
    try {
      const response = await newsAxios.post<SingleNewsResponse>('/', newsData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Update a news item
   * Requires authentication (owner or admin)
   */
  async updateNews(id: string, updateData: Partial<NewsItem>): Promise<SingleNewsResponse> {
    try {
      const response = await newsAxios.put<SingleNewsResponse>(`/${id}`, updateData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Delete a news item
   * Requires authentication (owner or admin)
   */
  async deleteNews(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await newsAxios.delete<{ success: boolean; message: string }>(`/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Toggle pin status (admin only)
   */
  async togglePin(id: string): Promise<SingleNewsResponse> {
    try {
      const response = await newsAxios.post<SingleNewsResponse>(`/${id}/pin`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Toggle featured status (admin only)
   */
  async toggleFeatured(id: string): Promise<SingleNewsResponse> {
    try {
      const response = await newsAxios.post<SingleNewsResponse>(`/${id}/feature`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Trigger news aggregation from RSS feeds (admin only)
   */
  async aggregateNews(sources?: string[], limit?: number): Promise<AggregationResult> {
    try {
      const response = await newsAxios.post<{ success: boolean; data: AggregationResult }>(
        '/aggregate',
        { sources, limit },
        {
          headers: getAuthHeaders(),
          timeout: 60000 // 60 seconds for aggregation
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Fetch news from a specific source (admin only)
   */
  async fetchFromSource(source: string): Promise<AggregationResult> {
    try {
      const response = await newsAxios.post<{ success: boolean; data: AggregationResult }>(
        `/aggregate/${source}`,
        {},
        {
          headers: getAuthHeaders(),
          timeout: 30000 // 30 seconds
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default newsService;

