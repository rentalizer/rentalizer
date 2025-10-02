import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const messagingAPI = axios.create({
  baseURL: `${API_BASE_URL}/messages`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
messagingAPI.interceptors.request.use(
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

// Add response interceptor for error handling
messagingAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Messaging API Error:', error);
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login');
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend server is not running or not accessible');
      // Don't redirect to login for network errors
    }
    return Promise.reject(error);
  }
);

export interface Message {
  _id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  sender_name: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  support_category: 'general' | 'technical' | 'billing' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  read_at: string | null;
  created_at: string;
  updated_at: string;
  // Fallback for old field names
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  participant_id: string;
  participant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    role: string;
  };
  last_message?: {
    _id: string;
    message: string;
    sender_id: string;
    recipient_id: string;
    sender_name: string;
    created_at: string;
    read_at: string | null;
    message_type: string;
  };
  unread_count: number;
}

export interface SendMessageData {
  recipient_id: string;
  message: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
  support_category?: 'general' | 'technical' | 'billing' | 'account' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateMessageStatusData {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  support_category?: 'general' | 'technical' | 'billing' | 'account' | 'other';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MessagingStats {
  totalMessages: number;
  unreadMessages: number;
  messageTypes: Record<string, number>;
  supportCategories: Record<string, number>;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  role: string;
}

export interface SupportCategory {
  value: string;
  label: string;
}

export interface PriorityLevel {
  value: string;
  label: string;
  color: string;
}

export interface MessageStatus {
  value: string;
  label: string;
  color: string;
}

class MessagingService {
  /**
   * Send a direct message
   */
  async sendMessage(messageData: SendMessageData): Promise<ApiResponse<Message>> {
    const response = await messagingAPI.post('/', messageData);
    return response.data;
  }

  /**
   * Get user's conversations list
   */
  async getConversations(page = 1, limit = 20): Promise<ApiResponse<Conversation[]>> {
    const response = await messagingAPI.get('/conversations', {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Get conversation between current user and specified user
   */
  async getConversation(
    userId: string, 
    page = 1, 
    limit = 50, 
    sortBy = 'created_at', 
    sortOrder = 'asc'
  ): Promise<ApiResponse<Message[]>> {
    const response = await messagingAPI.get(`/conversation/${userId}`, {
      params: { page, limit, sortBy, sortOrder }
    });
    return response.data;
  }

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(userId: string): Promise<ApiResponse<any>> {
    const response = await messagingAPI.put(`/conversation/${userId}/read`);
    return response.data;
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    const response = await messagingAPI.get('/unread-count');
    return response.data;
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<ApiResponse<any>> {
    const response = await messagingAPI.delete(`/${messageId}`);
    return response.data;
  }

  /**
   * Search messages
   */
  async searchMessages(
    searchTerm: string,
    page = 1,
    limit = 20,
    conversationPartnerId?: string
  ): Promise<ApiResponse<Message[]>> {
    const response = await messagingAPI.get('/search', {
      params: { 
        q: searchTerm, 
        page, 
        limit, 
        ...(conversationPartnerId && { conversationPartnerId })
      }
    });
    return response.data;
  }

  /**
   * Get messaging statistics
   */
  async getMessagingStats(): Promise<ApiResponse<MessagingStats>> {
    const response = await messagingAPI.get('/stats');
    return response.data;
  }

  /**
   * Get admin users (admin only)
   */
  async getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
    const response = await messagingAPI.get('/admins');
    return response.data;
  }

  /**
   * Get first available admin for support
   */
  async getFirstAdmin(): Promise<ApiResponse<AdminUser>> {
    const response = await messagingAPI.get('/admin/first');
    return response.data;
  }

  /**
   * Update message status (admin only)
   */
  async updateMessageStatus(
    messageId: string, 
    updateData: UpdateMessageStatusData
  ): Promise<ApiResponse<Message>> {
    const response = await messagingAPI.put(`/${messageId}/status`, updateData);
    return response.data;
  }

  /**
   * Get support categories
   */
  async getSupportCategories(): Promise<ApiResponse<SupportCategory[]>> {
    const response = await messagingAPI.get('/support-categories');
    return response.data;
  }

  /**
   * Get priority levels
   */
  async getPriorityLevels(): Promise<ApiResponse<PriorityLevel[]>> {
    const response = await messagingAPI.get('/priority-levels');
    return response.data;
  }

  /**
   * Get message statuses
   */
  async getMessageStatuses(): Promise<ApiResponse<MessageStatus[]>> {
    const response = await messagingAPI.get('/statuses');
    return response.data;
  }

  /**
   * Get all users for admin messaging
   */
  async getAllUsers(page = 1, limit = 50, search?: string): Promise<ApiResponse<Conversation[]>> {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }
    
    const response = await messagingAPI.get('/users', { params });
    return response.data;
  }
}

export const messagingService = new MessagingService();
export default messagingService;
