import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { Document } from '@/types';

const API_URL = `${API_CONFIG.BASE_URL}/documents`;

// Create axios instance for document API
const documentApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
documentApi.interceptors.request.use(
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
documentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - don't redirect automatically
      // Let the component handle the error gracefully
      console.warn('Authentication failed - token may be expired or invalid');
    }
    return Promise.reject(error);
  }
);

interface DocumentFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface DocumentResponse {
  success: boolean;
  data: Document[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface SingleDocumentResponse {
  success: boolean;
  data: Document;
}

interface CreateDocumentData {
  category: string;
}

class DocumentService {

  // Get all documents with filtering
  async getDocuments(filters: DocumentFilters = {}): Promise<DocumentResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await documentApi.get(`/documents?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  // Get document by ID
  async getDocumentById(documentId: string): Promise<SingleDocumentResponse> {
    try {
      const response = await documentApi.get(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  // Create new document (Admin only)
  async createDocument(documentData: CreateDocumentData, file: File): Promise<SingleDocumentResponse> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('category', documentData.category);

      const response = await documentApi.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Update document (Admin only)
  async updateDocument(documentId: string, documentData: Partial<CreateDocumentData>, file?: File): Promise<SingleDocumentResponse> {
    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('document', file);
      }
      
      if (documentData.category) {
        formData.append('category', documentData.category);
      }

      const response = await documentApi.put(`/documents/${documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete document (Admin only)
  async deleteDocument(documentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await documentApi.delete(`/documents/${documentId}`);

      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Get document categories
  async getDocumentCategories(): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await documentApi.get('/documents/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching document categories:', error);
      throw error;
    }
  }

  // Get documents by category
  async getDocumentsByCategory(category: string): Promise<DocumentResponse> {
    try {
      const response = await documentApi.get(`/documents/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      throw error;
    }
  }

  // Download document
  downloadDocument(document: Document) {
    const link = window.document.createElement('a');
    link.href = document.url.startsWith('http') ? document.url : `${API_CONFIG.BASE_URL.replace('/api', '')}${document.url}`;
    link.download = document.filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }
}

export const documentService = new DocumentService();
