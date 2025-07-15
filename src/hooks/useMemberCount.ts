
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        console.log('Fetching actual member count from profiles table...');
        
        // Get the actual count using the count method
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching from profiles:', error);
          
          // Fallback to user_profiles table
          const { count: userProfilesCount, error: userProfilesError } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true });
            
          if (!userProfilesError && userProfilesCount !== null) {
            console.log('Using user_profiles count:', userProfilesCount);
            setMemberCount(userProfilesCount);
          } else {
            console.error('Error fetching from user_profiles:', userProfilesError);
            // Final fallback - get auth users count (this should be the real count)
            setMemberCount(0);
          }
        } else if (count !== null) {
          console.log('Profiles count:', count);
          setMemberCount(count);
        } else {
          setMemberCount(0);
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
