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
      window.location.href = '/auth/login';
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
  firstName?: string;
  lastName?: string;
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

  // Error handling
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // Server responded with error status
        const message = (axiosError.response.data as any)?.message || 'Server error occurred';
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
      throw new Error(error.message || 'An unexpected error occurred');
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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
