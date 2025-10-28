import { io, Socket } from 'socket.io-client';

// Use the same base URL as the API, but without the /api suffix
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_BASE_URL = API_BASE_URL.replace('/api', '');

export interface WebSocketMessage {
  message: {
    _id: string;
    sender_id: string;
    recipient_id: string;
    message: string;
    sender_name: string;
    message_type: string;
    support_category: string;
    priority: string;
    status: string;
    read_at: string | null;
    created_at: string;
  };
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_admin: boolean;
  last_seen: string;
}

export interface ConversationStatus {
  conversationPartnerId: string;
  unreadCount: number;
  lastMessage?: {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
    read_at: string | null;
  };
}

export interface UserOnlineStatus {
  userId: string;
  isOnline: boolean;
}

export interface MessageStatusUpdate {
  messageId: string;
  message: any;
  updatedBy: string;
}

export interface MessagesRead {
  userId: string;
  conversationPartnerId: string;
  readCount: number;
}

export interface MessageDeleted {
  messageId: string;
  deletedBy: string;
}

export interface TypingIndicator {
  sender_id: string;
  sender: any;
  recipient_id: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  /**
   * Connect to WebSocket server
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const authToken = token || localStorage.getItem('authToken');
      
      if (!authToken) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.socket = io(WS_BASE_URL, {
        auth: {
          token: authToken
        },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
        console.log('🔌 Connected to WebSocket server with ID:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
        // Join user room for direct messages
        this.socket?.emit('join_user_room');
        
        // Request online users immediately after connection
        setTimeout(() => {
          this.getOnlineUsers();
        }, 100);
        
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
        reject(error);
    });

    this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.emit('leave_user_room');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Send a direct message
   */
  sendMessage(data: {
    recipient_id: string;
    message: string;
    message_type?: string;
    support_category?: string;
    priority?: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('new_direct_message', data);
    } else {
      console.error('WebSocket not connected');
    }
  }

  /**
   * Start typing indicator
   */
  startTyping(recipient_id: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start_dm', { recipient_id });
    }
  }

  /**
   * Stop typing indicator
   */
  stopTyping(recipient_id: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop_dm', { recipient_id });
    }
  }

  /**
   * Mark messages as read
   */
  markMessagesAsRead(conversation_partner_id: string, count?: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_messages_read', { 
        conversation_partner_id,
        count: count || 0 
      });
    }
  }

  /**
   * Delete a message
   */
  deleteMessage(message_id: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_direct_message', { message_id });
    }
  }

  /**
   * Update message status (admin only)
   */
  updateMessageStatus(data: {
    message_id: string;
    status?: string;
    priority?: string;
    support_category?: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_message_status', data);
    }
  }

  /**
   * Get online users
   */
  getOnlineUsers(): void {
    if (this.socket && this.isConnected) {
      console.log('🔍 Requesting online users...');
      this.socket.emit('get_online_users_messaging');
    } else {
      console.log('❌ Cannot request online users - WebSocket not connected');
    }
  }

  /**
   * Get conversation status
   */
  getConversationStatus(conversation_partner_id: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('get_conversation_status', { conversation_partner_id });
    }
  }

  // Event listeners
  onNewMessage(callback: (data: WebSocketMessage) => void): void {
    this.socket?.on('new_direct_message', callback);
  }

  onMessageSent(callback: (data: any) => void): void {
    this.socket?.on('message_sent', callback);
  }

  onTypingStart(callback: (data: TypingIndicator) => void): void {
    this.socket?.on('user_typing_dm', callback);
  }

  onTypingStop(callback: (data: { sender_id: string; recipient_id: string }) => void): void {
    this.socket?.on('user_stopped_typing_dm', callback);
  }

  onMessagesRead(callback: (data: MessagesRead) => void): void {
    this.socket?.on('messages_read', callback);
  }

  onMessageDeleted(callback: (data: MessageDeleted) => void): void {
    this.socket?.on('message_deleted', callback);
  }

  onMessageStatusUpdated(callback: (data: MessageStatusUpdate) => void): void {
    this.socket?.on('message_status_updated', callback);
  }

  onMessageUpdated(callback: (data: { messageId: string; message: any; updatedBy: string }) => void): void {
    this.socket?.on('message_updated', callback);
  }

  onOnlineUsersUpdate(callback: (data: { users: OnlineUser[]; count: number }) => void): void {
    if (this.socket) {
      this.socket.on('online_users_for_messaging', callback);
    } else {
      console.warn('WebSocket not connected, cannot set up online users listener');
    }
  }

  onOnlineCountUpdate(callback: (count: number) => void): void {
    if (this.socket) {
      this.socket.on('online_users_for_messaging', (data) => {
        callback(data.count);
      });
    } else {
      console.warn('WebSocket not connected, cannot set up online count listener');
    }
  }

  onConversationStatus(callback: (data: ConversationStatus) => void): void {
    this.socket?.on('conversation_status', callback);
  }

  onUserOnlineStatus(callback: (data: UserOnlineStatus) => void): void {
    this.socket?.on('user_online_status', callback);
  }

  onError(callback: (error: { message: string }) => void): void {
    this.socket?.on('error', callback);
  }

  // Remove event listeners
  offNewMessage(): void {
    this.socket?.off('new_direct_message');
  }

  offMessageSent(): void {
    this.socket?.off('message_sent');
  }

  offTypingStart(): void {
    this.socket?.off('user_typing_dm');
  }

  offTypingStop(): void {
    this.socket?.off('user_stopped_typing_dm');
  }

  offMessagesRead(): void {
    this.socket?.off('messages_read');
  }

  offMessageDeleted(): void {
    this.socket?.off('message_deleted');
  }

  offMessageStatusUpdated(): void {
    this.socket?.off('message_status_updated');
  }

  offMessageUpdated(): void {
    this.socket?.off('message_updated');
  }

  offOnlineUsersUpdate(): void {
    this.socket?.off('online_users_for_messaging');
  }

  offOnlineCountUpdate(): void {
    this.socket?.off('online_users_for_messaging');
  }

  offConversationStatus(): void {
    this.socket?.off('conversation_status');
  }

  offUserOnlineStatus(): void {
    this.socket?.off('user_online_status');
  }

  offError(): void {
    this.socket?.off('error');
  }

  // Additional methods for compatibility
  getConnectionStatus(): { isConnected: boolean; socketId?: string } {
    return { 
      isConnected: this.isConnected && this.socket?.connected === true,
      socketId: this.socket?.id 
    };
  }

  requestOnlineUsers(): void {
    this.getOnlineUsers();
  }

  removeOnlineUsersListener(callback: (users: OnlineUser[]) => void): void {
    this.socket?.off('online_users_for_messaging', callback);
  }

  removeOnlineCountListener(callback: (count: number) => void): void {
    this.socket?.off('online_users_for_messaging', callback);
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get socketInstance(): Socket | null {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
