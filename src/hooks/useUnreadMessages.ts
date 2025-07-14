
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchUnreadCount = async (forceRefresh = false) => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      // Always fetch fresh data from the server, bypassing any cache
      const { data, error } = await supabase
        .from('direct_messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread messages:', error);
        return;
      }

      const count = data?.length || 0;
      console.log('Fetched unread count:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Initial fetch
    fetchUnreadCount(true);

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('direct-messages-unread-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          // Immediately refetch count when any change occurs
          fetchUnreadCount(true);
        }
      )
      .subscribe();

    // Also listen for read status updates
    const readChannel = supabase
      .channel('direct-messages-read-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Message read status updated:', payload);
          // Refetch count when read status changes
          fetchUnreadCount(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(readChannel);
    };
  }, [user]);

  // Force refresh function for manual updates
  const refreshUnreadCount = () => {
    fetchUnreadCount(true);
  };

  return { unreadCount, refreshUnreadCount };
};
