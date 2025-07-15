
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        console.log('Fetching member count from profiles table...');
        
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching member count:', error);
          setMemberCount(0);
        } else {
          console.log('Member count fetched:', count);
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

    // Set up real-time subscription to update count when profiles change
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          console.log('Profiles table changed, refetching count...');
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
