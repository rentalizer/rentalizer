
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchUnreadCount = () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      // Mock unread count - you can change this number
      const mockCount = 3;
      console.log('Fetched unread count:', mockCount);
      setUnreadCount(mockCount);
    }, 200);
  };

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Initial fetch
    fetchUnreadCount();
  }, [user]);

  // Force refresh function for manual updates
  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  return { unreadCount, refreshUnreadCount };
};
