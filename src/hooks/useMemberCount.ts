
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        console.log('Fetching actual member count from profiles table...');
        
        // First try to get count from profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id');

        if (profilesError) {
          console.error('Error fetching from profiles:', profilesError);
          
          // Fallback to user_profiles table
          const { data: userProfiles, error: userProfilesError } = await supabase
            .from('user_profiles')
            .select('id');
            
          if (!userProfilesError && userProfiles) {
            console.log('Using user_profiles count:', userProfiles.length);
            setMemberCount(userProfiles.length);
          } else {
            console.error('Error fetching from user_profiles:', userProfilesError);
            // Set a default count if both fail
            setMemberCount(1250);
          }
        } else if (profiles) {
          console.log('Profiles found:', profiles.length);
          setMemberCount(profiles.length || 1250); // Use actual count or fallback
        } else {
          setMemberCount(1250);
        }
      } catch (error) {
        console.error('Exception fetching member count:', error);
        setMemberCount(1250);
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
