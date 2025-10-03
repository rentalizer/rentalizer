import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/config/api';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket && socket.connected) return socket;

  const token = localStorage.getItem('authToken');

  socket = io(
    API_CONFIG.BASE_URL.replace(/\/api$/, ''),
    {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      auth: token ? { token } : undefined,
      timeout: 20000,
      forceNew: true,
    }
  );

  // Add connection event listeners
  socket.on('connect', () => {
    console.log('🔌 WebSocket connected with ID:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 WebSocket connection error:', error);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinDiscussionRoom(discussionId: string) {
  const s = getSocket();
  s.emit('join_discussion', { discussionId });
}

export function leaveDiscussionRoom(discussionId: string) {
  const s = getSocket();
  s.emit('leave_discussion', { discussionId });
}


