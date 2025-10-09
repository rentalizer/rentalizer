import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import messagingService from '@/services/messagingService';
import websocketService from '@/services/websocketService';

export const useAdminSupportNotifications = () => {
  const [adminSupportUnreadCount, setAdminSupportUnreadCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);
  const { user } = useAuth();
  const lastFetchTimeRef = useRef(0);
  const pendingUpdateRef = useRef(false);

  const fetchAdminSupportUnreadCount = async (force = false) => {
    if (!user) {
      setAdminSupportUnreadCount(0);
      setHasNotification(false);
      return;
    }

    // If there's a pending local update, don't override it with server data
    if (!force && pendingUpdateRef.current) {
      console.log('⏭️ Skipping admin support fetch - pending local update');
      return;
    }

    // Debounce: Don't fetch if we just updated locally within the last 10 seconds
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 10000) {
      console.log('⏭️ Skipping admin support fetch - too soon after local update');
      return;
    }

    try {
      // Get conversations to find admin support unread count
      const response = await messagingService.getConversations();
      if (response.success) {
        // Calculate total unread messages from admin conversations
        const totalUnread = response.data.reduce((sum, conv) => sum + conv.unread_count, 0);
        console.log('📬 Fetched admin support unread count from server:', totalUnread);
        
        // Only update if different to prevent unnecessary re-renders
        setAdminSupportUnreadCount(prevCount => {
          if (prevCount !== totalUnread) {
            console.log(`📬 Admin support count different, updating: ${prevCount} -> ${totalUnread}`);
            setHasNotification(totalUnread > 0);
            return totalUnread;
          }
          console.log('📬 Admin support count same as local, no update needed');
          return prevCount;
        });
      }
    } catch (error) {
      console.error('Error fetching admin support unread count:', error);
      // Keep the existing count on error
    }
  };

  const clearNotification = useCallback(() => {
    console.log('🔔 Clearing admin support notification');
    setHasNotification(false);
    // Don't reset the count to 0, just hide the notification
    // The count will be updated when messages are actually marked as read
  }, []);

  useEffect(() => {
    if (!user) {
      setAdminSupportUnreadCount(0);
      setHasNotification(false);
      return;
    }

    // Initial fetch
    fetchAdminSupportUnreadCount();

    // Set up WebSocket listeners for real-time updates
    const handleNewMessage = (data: any) => {
      console.log('📨 New admin support message received, updating notification');
      // Increment unread count if the message is for the current user (from admin)
      if (data.message && data.message.recipient_id === user.id) {
        setAdminSupportUnreadCount(prev => {
          const newCount = prev + 1;
          setHasNotification(true);
          return newCount;
        });
      }
    };

    const handleMessagesRead = (data: any) => {
      console.log('✅ Admin support messages marked as read, data:', data);
      
      // Mark that we have a pending local update
      pendingUpdateRef.current = true;
      lastFetchTimeRef.current = Date.now();
      
      // Directly decrement based on count if provided
      if (data.count !== undefined && data.count > 0) {
        setAdminSupportUnreadCount(prev => {
          const newCount = Math.max(0, prev - data.count);
          console.log(`📬 Decrementing admin support unread locally: ${prev} - ${data.count} = ${newCount}`);
          setHasNotification(newCount > 0);
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
          fetchAdminSupportUnreadCount(true);
        }, 3000);
      }
    };

    const handleMessageSent = (data: any) => {
      // When user sends a message, it doesn't affect their unread count
      console.log('📤 Admin support message sent confirmation');
    };

    // Subscribe to WebSocket events
    websocketService.onNewMessage(handleNewMessage);
    websocketService.onMessagesRead(handleMessagesRead);
    websocketService.onMessageSent(handleMessageSent);

    // Refresh unread count periodically (every 60 seconds) as a fallback
    const interval = setInterval(() => {
      fetchAdminSupportUnreadCount(true);
    }, 60000);

    return () => {
      clearInterval(interval);
      // Note: We don't unsubscribe from websocket events here as they might be used by other components
      // The websocket service handles cleanup when the connection is closed
    };
  }, [user]);

  return {
    adminSupportUnreadCount,
    hasNotification,
    clearNotification,
    fetchAdminSupportUnreadCount
  };
};
