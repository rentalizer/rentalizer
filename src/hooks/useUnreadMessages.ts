
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
      // Clear any existing cache and fetch fresh data
      const { data, error } = await supabase
        .from('direct_messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread messages:', error);
        setUnreadCount(0);
        return;
      }

      const count = data?.length || 0;
      console.log('Current unread count for user:', user.id, 'Count:', count);
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

    // Initial fetch with force refresh
    fetchUnreadCount(true);

    // Set up realtime subscription for changes to direct_messages
    const channel = supabase
      .channel('unread-messages-counter')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
        },
        (payload) => {
          console.log('Direct message change detected:', payload);
          // Refetch count whenever any message is added, updated, or deleted
          setTimeout(() => fetchUnreadCount(true), 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Force refresh function for manual updates
  const refreshUnreadCount = () => {
    console.log('Manual refresh of unread count triggered');
    fetchUnreadCount(true);
  };

  // Reset count function
  const resetUnreadCount = () => {
    console.log('Resetting unread count to 0');
    setUnreadCount(0);
  };

  return { unreadCount, refreshUnreadCount, resetUnreadCount };
};
