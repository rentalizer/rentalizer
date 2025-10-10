import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on an auth page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  role?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  promoCode: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
}

export interface PromoCodeVerificationResponse {
  message: string;
  promoCode: {
    code: string;
    isActive: boolean;
    usageCount: number;
    maxUsage?: number | null;
    singleUse?: boolean;
    lastUsedAt?: string;
  };
}

export interface PromoCodeEntry {
  _id: string;
  code: string;
  description?: string | null;
  singleUse: boolean;
  maxUsage?: number | null;
  usageCount: number;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export interface PromoCodeListResponse {
  message: string;
  promoCodes: PromoCodeEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePromoCodeRequest {
  description?: string;
  prefix?: string;
  length?: number;
  singleUse?: boolean;
  maxUsage?: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Discussion types
export interface PopulatedUser {
  _id: string;
  id?: string; // Alternative ID field
  firstName?: string;
  lastName?: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  role?: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  user_id: string | PopulatedUser; // Can be either a string ID or a populated user object
  is_pinned: boolean;
  is_admin_post: boolean;
  likes: number;
  comments_count: number;
  views_count: number;
  liked_by: string[];
  tags: string[];
  attachments: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    filename: string;
    size: number;
  }>;
  is_active: boolean;
  last_activity: string;
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
  isLiked: boolean;
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  author_name?: string;
  author_avatar?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateDiscussionRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface DiscussionResponse {
  success: boolean;
  message: string;
  data: Discussion;
}

export interface DiscussionsResponse {
  success: boolean;
  message: string;
  data: Discussion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DiscussionStats {
  totalDiscussions: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  pinnedDiscussions: number;
  adminDiscussions: number;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    discussion: Discussion;
    isLiked: boolean;
    likesCount: number;
  };
}

export interface PinResponse {
  success: boolean;
  message: string;
  data: {
    discussion: Discussion;
    isPinned: boolean;
  };
}

// Comment types
export interface CommentUserRef {
  _id?: string;
  id?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string | null;
}

export interface CommentReaction {
  user: string | CommentUserRef;
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad';
}

export interface Comment {
  id: string;
  discussion: string;
  user: string | CommentUserRef;
  content: string;
  reactions?: CommentReaction[];
  reactionCounts?: Record<string, number>;
  totalReactions?: number;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeleted?: boolean;
  isModerated?: boolean;
  moderationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCommentsResponse {
  success: boolean;
  message: string;
  data: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ReactToCommentResponse {
  success: boolean;
  message: string;
  data: {
    reactionType: 'like' | 'love' | 'laugh' | 'angry' | 'sad';
    isReacted: boolean;
    reactionCounts: Record<string, number>;
  };
}

// Calendar Event types
export interface Event {
  _id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  duration: string;
  location: string;
  zoom_link?: string;
  event_type: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees: string;
  is_recurring: boolean;
  remind_members: boolean;
  created_by: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicture?: string;
  };
  cover_image?: string;
  max_attendees?: number;
  series_id?: string;
  is_active: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  duration?: string;
  location?: string;
  zoom_link?: string;
  event_type?: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees?: string;
  is_recurring?: boolean;
  remind_members?: boolean;
  max_attendees?: number;
  cover_image?: string;
  tags?: string[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  duration?: string;
  location?: string;
  zoom_link?: string;
  event_type?: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees?: string;
  is_recurring?: boolean;
  remind_members?: boolean;
  max_attendees?: number;
  cover_image?: string;
  tags?: string[];
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CalendarLinksResponse {
  success: boolean;
  message: string;
  data: {
    google: string;
    outlook: string;
    yahoo: string;
    ical: string;
  };
}

export interface EventInvitation {
  _id: string;
  event: string | Event;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicture?: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  invited_by: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
  invited_at: string;
  responded_at?: string;
  reminder_sent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInvitationsResponse {
  success: boolean;
  message: string;
  data: EventInvitation[];
}

export interface InviteUsersRequest {
  user_ids: string[];
}

export interface RSVPRequest {
  status: 'accepted' | 'declined' | 'maybe';
  notes?: string;
}

export interface EventStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalEvents: number;
    upcomingEvents: number;
    totalPastEvents: number;
    byType: Array<{
      _id: string;
      count: number;
      totalAttendees: number;
    }>;
  };
}

// API Service Class
class ApiService {
  // Authentication endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createPromoCode(data: CreatePromoCodeRequest = {}): Promise<{ message: string; promoCode: PromoCodeEntry }> {
    try {
      const response = await api.post<{ message: string; promoCode: PromoCodeEntry }>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.BASE,
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async verifyPromoCode(code: string): Promise<PromoCodeVerificationResponse> {
    try {
      const response = await api.post<PromoCodeVerificationResponse>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.VERIFY,
        { code }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getPromoCodes(params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<PromoCodeListResponse> {
    try {
      const response = await api.get<PromoCodeListResponse>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.BASE,
        { params }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updatePromoCodeStatus(code: string, isActive: boolean): Promise<{ message: string; promoCode: PromoCodeEntry }> {
    try {
      const response = await api.patch<{ message: string; promoCode: PromoCodeEntry }>(
        `${API_CONFIG.ENDPOINTS.PROMO_CODES.BASE}/${encodeURIComponent(code)}/status`,
        { isActive }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout should not fail even if server is down
      console.warn('Logout request failed:', error);
    }
  }

  // User profile endpoints
  async getProfile(): Promise<{ message: string; user: User }> {
    try {
      const response = await api.get<{ message: string; user: User }>('/user/profile');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; user: User }> {
    try {
      const response = await api.put<{ message: string; user: User }>('/user/profile', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>('/user/change-password', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>('/user/account', {
        data: { password }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    try {
      const response = await api.get<{ message: string; timestamp: string }>('/health');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Discussion endpoints
  async createDiscussion(data: CreateDiscussionRequest): Promise<DiscussionResponse> {
    try {
      const response = await api.post<DiscussionResponse>('/discussions', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getDiscussions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DiscussionsResponse> {
    try {
      const response = await api.get<DiscussionsResponse>('/discussions', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getDiscussionById(id: string): Promise<DiscussionResponse> {
    try {
      const response = await api.get<DiscussionResponse>(`/discussions/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateDiscussion(id: string, data: UpdateDiscussionRequest): Promise<DiscussionResponse> {
    try {
      const response = await api.put<DiscussionResponse>(`/discussions/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteDiscussion(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/discussions/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async likeDiscussion(id: string): Promise<LikeResponse> {
    try {
      const response = await api.post<LikeResponse>(`/discussions/${id}/like`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async pinDiscussion(id: string): Promise<PinResponse> {
    try {
      const response = await api.post<PinResponse>(`/discussions/${id}/pin`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getDiscussionStats(): Promise<{ success: boolean; message: string; data: DiscussionStats }> {
    try {
      const response = await api.get<{ success: boolean; message: string; data: DiscussionStats }>('/discussions/stats');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getPopularDiscussions(limit: number = 5): Promise<{ success: boolean; message: string; data: Discussion[] }> {
    try {
      const response = await api.get<{ success: boolean; message: string; data: Discussion[] }>('/discussions/popular', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async searchDiscussions(query: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DiscussionsResponse> {
    try {
      const response = await api.get<DiscussionsResponse>('/discussions/search', {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getDiscussionsByCategory(category: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DiscussionsResponse> {
    try {
      const response = await api.get<DiscussionsResponse>(`/discussions/category/${category}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getUserDiscussions(userId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DiscussionsResponse> {
    try {
      const response = await api.get<DiscussionsResponse>(`/discussions/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMyDiscussions(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DiscussionsResponse> {
    try {
      const response = await api.get<DiscussionsResponse>('/discussions/my', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // ===== Comments endpoints =====
  // Types for comments
  async getCommentsForDiscussion(
    discussionId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<GetCommentsResponse> {
    try {
      const response = await api.get<GetCommentsResponse>(`/comments/discussion/${discussionId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createComment(
    discussionId: string,
    content: string
  ): Promise<{ success: boolean; message: string; data: Comment }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: Comment }>(
        `/comments/discussion/${discussionId}`,
        { content }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateComment(
    commentId: string,
    content: string
  ): Promise<{ success: boolean; message: string; data: Comment }> {
    try {
      const response = await api.put<{ success: boolean; message: string; data: Comment }>(
        `/comments/${commentId}`,
        { content }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async reactToComment(
    commentId: string,
    reactionType: 'like' | 'love' | 'laugh' | 'angry' | 'sad'
  ): Promise<ReactToCommentResponse> {
    try {
      const response = await api.post<ReactToCommentResponse>(`/comments/${commentId}/react`, {
        reactionType,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getCommentStats(
    discussionId: string
  ): Promise<{ success: boolean; message: string; data: { totalComments: number; reactionStats: Record<string, number>; discussionId: string } }> {
    try {
      const response = await api.get<{ success: boolean; message: string; data: { totalComments: number; reactionStats: Record<string, number>; discussionId: string } }>(
        `/comments/stats/${discussionId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handling
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response) {
        // Server responded with error status
        const message = axiosError.response.data?.message || 'Server error occurred';
        throw new Error(message);
      } else if (axiosError.request) {
        // Request was made but no response received
        throw new Error('Network error - please check your connection');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred');
      }
    } else {
      // Non-axios error
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new Error(errorMessage);
    }
  }

  // Token management
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // ===== Calendar Event endpoints =====
  
  // Get all events with filtering and pagination
  async getEvents(params?: {
    page?: number;
    limit?: number;
    type?: 'training' | 'webinar' | 'discussion' | 'workshop';
    date_from?: string;
    date_to?: string;
    year?: number;
    month?: number;
  }): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get events for a specific month
  async getEventsForMonth(year: number, month: number): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>(`/events/month/${year}/${month}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events/upcoming', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Search events
  async searchEvents(query: string, filters?: {
    type?: 'training' | 'webinar' | 'discussion' | 'workshop';
    date_from?: string;
    date_to?: string;
  }): Promise<EventsResponse> {
    try {
      const response = await api.get<EventsResponse>('/events/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get single event by ID
  async getEventById(id: string): Promise<EventResponse> {
    try {
      const response = await api.get<EventResponse>(`/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Create new event (Admin only)
  async createEvent(data: CreateEventRequest): Promise<EventResponse> {
    try {
      const response = await api.post<EventResponse>('/events', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update event
  async updateEvent(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    try {
      const response = await api.put<EventResponse>(`/events/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get event statistics
  async getEventStats(): Promise<EventStatsResponse> {
    try {
      const response = await api.get<EventStatsResponse>('/events/stats');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get calendar links for an event
  async getCalendarLinks(eventId: string): Promise<CalendarLinksResponse> {
    try {
      const response = await api.get<CalendarLinksResponse>(`/events/${eventId}/calendar-links`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Export events as iCal
  async exportEventsAsICal(eventIds: string[]): Promise<Blob> {
    try {
      const response = await api.post('/events/export/ical', { eventIds }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Send invitations to users
  async inviteUsers(eventId: string, data: InviteUsersRequest): Promise<{ success: boolean; message: string; data: { event: string; invitations_sent: number; total_invited: number } }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: { event: string; invitations_sent: number; total_invited: number } }>(`/events/${eventId}/invite`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get event attendees
  async getEventAttendees(eventId: string): Promise<EventInvitationsResponse> {
    try {
      const response = await api.get<EventInvitationsResponse>(`/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // RSVP to an event
  async rsvpToEvent(eventId: string, data: RSVPRequest): Promise<{ success: boolean; message: string; data: EventInvitation }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: EventInvitation }>(`/events/${eventId}/rsvp`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get user's event invitations
  async getUserInvitations(status?: 'pending' | 'accepted' | 'declined' | 'maybe'): Promise<EventInvitationsResponse> {
    try {
      const response = await api.get<EventInvitationsResponse>('/events/invitations/my', {
        params: status ? { status } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get event attendance statistics
  async getEventAttendanceStats(eventId: string): Promise<{ success: boolean; message: string; data: Array<{ _id: string; count: number }> }> {
    try {
      const response = await api.get<{ success: boolean; message: string; data: Array<{ _id: string; count: number }> }>(`/events/${eventId}/stats`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get calendar integration status
  async getCalendarIntegrationStatus(): Promise<{ success: boolean; message: string; data: { google: { connected: boolean; lastSync: string | null }; outlook: { connected: boolean; lastSync: string | null }; apple: { connected: boolean; lastSync: string | null } } }> {
    try {
      const response = await api.get<{ success: boolean; message: string; data: { google: { connected: boolean; lastSync: string | null }; outlook: { connected: boolean; lastSync: string | null }; apple: { connected: boolean; lastSync: string | null } } }>('/events/integration/status');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
