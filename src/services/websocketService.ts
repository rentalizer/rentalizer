import { io, Socket } from 'socket.io-client';
import { apiService } from './api';
import { useAuth } from '@/contexts/AuthContext';

interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_admin: boolean;
  last_seen: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event listeners
  private onlineUsersListeners: ((users: OnlineUser[]) => void)[] = [];
  private onlineCountListeners: ((count: number) => void)[] = [];

  connect(token: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join the global online users room immediately
      this.socket?.emit('join_online_users');
      console.log('👥 Joined online users room');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Listen for online users updates
    this.socket.on('online_users_update', (data) => {
      console.log('📊 Online users update:', data);
      this.onlineUsersListeners.forEach(listener => listener(data.users || []));
      this.onlineCountListeners.forEach(listener => listener(data.count || 0));
    });

    // Listen for user joined
    this.socket.on('user_online', (data) => {
      console.log('👤 User came online:', data);
      // Trigger listeners to refresh online users
      this.requestOnlineUsers();
    });

    // Listen for user left
    this.socket.on('user_offline', (data) => {
      console.log('👋 User went offline:', data);
      // Trigger listeners to refresh online users
      this.requestOnlineUsers();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('leave_online_users');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  // Request current online users
  requestOnlineUsers() {
    if (this.socket && this.isConnected) {
      this.socket.emit('get_online_users');
    }
  }

  // Add event listeners
  onOnlineUsersUpdate(callback: (users: OnlineUser[]) => void) {
    this.onlineUsersListeners.push(callback);
  }

  onOnlineCountUpdate(callback: (count: number) => void) {
    this.onlineCountListeners.push(callback);
  }

  // Remove event listeners
  removeOnlineUsersListener(callback: (users: OnlineUser[]) => void) {
    this.onlineUsersListeners = this.onlineUsersListeners.filter(listener => listener !== callback);
  }

  removeOnlineCountListener(callback: (count: number) => void) {
    this.onlineCountListeners = this.onlineCountListeners.filter(listener => listener !== callback);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socket: this.socket
    };
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();

// Hook to use WebSocket service
export const useWebSocket = () => {
  const { user } = useAuth();

  const connect = () => {
    if (user) {
      const token = apiService.getAuthToken();
      if (token) {
        websocketService.connect(token);
      }
    }
  };

  const disconnect = () => {
    websocketService.disconnect();
  };

  return {
    connect,
    disconnect,
    websocketService,
    isConnected: websocketService.getConnectionStatus().isConnected
  };
};
