
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        console.log('Fetching actual member count from profiles table...');
        
        // Get count of user_profiles (real members with emails)
        const { count, error } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching from profiles:', error);
          setMemberCount(0);
        } else {
          console.log('Actual profiles count from database:', count);
          setMemberCount(count || 0);
        }
      } catch (error) {
        console.error('Exception fetching member count:', error);
        setMemberCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();

    // Set up real-time subscription to update count when user_profiles change
    const channel = supabase
      .channel('user-profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_profiles' 
        }, 
        () => {
          console.log('User profiles table changed, refetching count...');
          fetchMemberCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { memberCount, loading };
};
