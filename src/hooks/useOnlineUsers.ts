import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';

interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_admin: boolean;
  last_seen: string;
}

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { isAdmin } = useAdminRole();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Create a unique channel for presence tracking
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track current user's presence
    const trackPresence = async () => {
      const userStatus = {
        user_id: user.id,
        display_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url: profile?.avatar_url,
        is_admin: isAdmin,
        last_seen: new Date().toISOString(),
      };

      await channel.track(userStatus);
    };

    // Listen for presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users: OnlineUser[] = [];
        
        Object.entries(newState).forEach(([_, presences]) => {
          if (presences && presences.length > 0) {
            // Access the payload which contains our user data
            const presence = presences[0] as any;
            if (presence.user_id) {
              users.push({
                user_id: presence.user_id,
                display_name: presence.display_name,
                avatar_url: presence.avatar_url,
                is_admin: presence.is_admin,
                last_seen: presence.last_seen
              });
            }
          }
        });

        setOnlineUsers(users);
        setOnlineCount(users.length);
        setLoading(false);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await trackPresence();
      }
    });

    // Update presence every 30 seconds to keep it fresh
    const interval = setInterval(trackPresence, 30000);

    // Cleanup
    return () => {
      clearInterval(interval);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user, profile, isAdmin]);

  // Get admin users from online users
  const adminUsers = onlineUsers.filter(user => user.is_admin);
  const adminNames = adminUsers.map(admin => admin.display_name);

  return {
    onlineUsers,
    onlineCount,
    adminUsers,
    adminNames,
    loading
  };
};
