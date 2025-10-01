import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { websocketService } from '@/services/websocketService';
import { apiService } from '@/services/api';

interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_admin: boolean;
  last_seen: string;
}

// Fallback mock data for when WebSocket is not available
const mockOnlineUsers: OnlineUser[] = [
  {
    user_id: '00000000-0000-0000-0000-000000000001',
    display_name: 'Dev User',
    avatar_url: null,
    is_admin: true,
    last_seen: new Date().toISOString(),
  },
  {
    user_id: '00000000-0000-0000-0000-000000000002',
    display_name: 'John Smith',
    avatar_url: null,
    is_admin: false,
    last_seen: new Date(Date.now() - 30000).toISOString(),
  },
  {
    user_id: '00000000-0000-0000-0000-000000000003',
    display_name: 'Sarah Johnson',
    avatar_url: null,
    is_admin: false,
    last_seen: new Date(Date.now() - 60000).toISOString(),
  },
];

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useWebSocket, setUseWebSocket] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Set up WebSocket event listeners (WebSocket connection is managed by AuthContext)
    const handleOnlineUsersUpdate = (users: OnlineUser[]) => {
      console.log('📊 Received online users update:', users);
      setOnlineUsers(users);
      setLoading(false);
      setUseWebSocket(true);
    };

    const handleOnlineCountUpdate = (count: number) => {
      console.log('📈 Received online count update:', count);
      setOnlineCount(count);
    };

    websocketService.onOnlineUsersUpdate(handleOnlineUsersUpdate);
    websocketService.onOnlineCountUpdate(handleOnlineCountUpdate);

    // Request initial online users (if WebSocket is connected)
    const connectionStatus = websocketService.getConnectionStatus();
    if (connectionStatus.isConnected) {
      websocketService.requestOnlineUsers();
    } else {
      // If WebSocket is not connected, use fallback data
      console.log('WebSocket not connected, using fallback data');
      setUseWebSocket(false);
      
      const timer = setTimeout(() => {
        // Add current user to mock data if not already present
        const currentUserInList = mockOnlineUsers.find(u => u.user_id === user.id);
        if (!currentUserInList) {
          const currentUser: OnlineUser = {
            user_id: user.id,
            display_name: user.email?.split('@')[0] || 'Anonymous',
            avatar_url: null,
            is_admin: isAdmin,
            last_seen: new Date().toISOString(),
          };
          mockOnlineUsers.unshift(currentUser);
        }

        setOnlineUsers([...mockOnlineUsers]);
        setOnlineCount(mockOnlineUsers.length);
        setLoading(false);
      }, 500);

      return () => {
        clearTimeout(timer);
        websocketService.removeOnlineUsersListener(handleOnlineUsersUpdate);
        websocketService.removeOnlineCountListener(handleOnlineCountUpdate);
      };
    }

    // Cleanup function
    return () => {
      websocketService.removeOnlineUsersListener(handleOnlineUsersUpdate);
      websocketService.removeOnlineCountListener(handleOnlineCountUpdate);
    };
  }, [user, isAdmin]);

  // Get admin users from online users
  const adminUsers = onlineUsers.filter(user => user.is_admin);
  const adminNames = adminUsers.map(admin => admin.display_name);

  return {
    onlineUsers,
    onlineCount,
    adminUsers,
    adminNames,
    loading,
    useWebSocket // Indicates whether we're using real WebSocket data or fallback
  };
};
