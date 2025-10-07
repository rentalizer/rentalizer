
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import messagingService from '@/services/messagingService';
import websocketService from '@/services/websocketService';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const lastFetchTimeRef = useRef(0);
  const pendingUpdateRef = useRef(false);

  const fetchUnreadCount = useCallback(async (force = false) => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // If there's a pending local update, don't override it with server data
    if (!force && pendingUpdateRef.current) {
      console.log('⏭️ Skipping fetch - pending local update');
      return;
    }

    // Debounce: Don't fetch if we just updated locally within the last 10 seconds
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 10000) {
      console.log('⏭️ Skipping fetch - too soon after local update');
      return;
    }

    try {
      const response = await messagingService.getUnreadCount();
      if (response.success) {
        const newCount = response.data.unreadCount;
        console.log('📬 Fetched unread count from server:', newCount);
        
        // Only update if different to prevent unnecessary re-renders
        setUnreadCount(prevCount => {
          if (prevCount !== newCount) {
            console.log(`📬 Server count different, updating: ${prevCount} -> ${newCount}`);
            return newCount;
          }
          console.log('📬 Server count same as local, no update needed');
          return prevCount;
        });
      }
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      // Keep the existing count on error
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Initial fetch
    fetchUnreadCount();

    // Set up WebSocket listeners for real-time updates
    const handleNewMessage = (data: any) => {
      console.log('📨 New message received, updating unread count');
      // Increment unread count if the message is for the current user
      if (data.message && data.message.recipient_id === user.id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleMessagesRead = (data: any) => {
      console.log('✅ Messages marked as read, data:', data);
      
      // Mark that we have a pending local update
      pendingUpdateRef.current = true;
      lastFetchTimeRef.current = Date.now();
      
      // Directly decrement based on count if provided
      if (data.count !== undefined && data.count > 0) {
        setUnreadCount(prev => {
          const newCount = Math.max(0, prev - data.count);
          console.log(`📬 Decrementing unread locally: ${prev} - ${data.count} = ${newCount}`);
          return newCount;
        });
        
        // Clear pending flag after 15 seconds
        setTimeout(() => {
          pendingUpdateRef.current = false;
        }, 15000);
      } else {
        // Fallback: fetch from server after ensuring backend has updated
        setTimeout(() => {
          pendingUpdateRef.current = false;
          fetchUnreadCount(true);
        }, 3000);
      }
    };

    const handleMessageSent = (data: any) => {
      // When user sends a message, it doesn't affect their unread count
      console.log('📤 Message sent confirmation');
    };

    // Subscribe to WebSocket events
    websocketService.onNewMessage(handleNewMessage);
    websocketService.onMessagesRead(handleMessagesRead);
    websocketService.onMessageSent(handleMessageSent);

    // Refresh unread count periodically (every 60 seconds) as a fallback
    // This ensures the count stays accurate even if WebSocket events are missed
    // Reduced frequency since WebSocket provides real-time updates
    const refreshInterval = setInterval(() => {
      console.log('🔄 Periodic unread count refresh (fallback)');
      fetchUnreadCount(false); // Don't force - respect debouncing
    }, 60000);

    return () => {
      clearInterval(refreshInterval);
      // Note: We don't remove WebSocket listeners here since they might be used elsewhere
      // WebSocket cleanup is handled in the component that manages the connection
    };
  }, [user, fetchUnreadCount]);

  // Force refresh function for manual updates
  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  return { unreadCount, refreshUnreadCount };
};
