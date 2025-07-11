
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📊 Profile query result:', { data, error });

      if (error) {
        // Only log actual errors, not "no rows found"
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }
        
        // Create a default profile structure if none exists
        const defaultProfile: Profile = {
          user_id: user.id,
          display_name: user.email?.split('@')[0] || null,
          first_name: null,
          last_name: null,
          bio: null,
          avatar_url: null
        };
        setProfile(defaultProfile);
      } else {
        // Use the fetched profile or create default if data is null
        const profileData: Profile = data || {
          user_id: user.id,
          display_name: user.email?.split('@')[0] || null,
          first_name: null,
          last_name: null,
          bio: null,
          avatar_url: null
        };
        
        console.log('✅ Profile loaded successfully:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
      // Create a fallback profile even on exception
      const fallbackProfile: Profile = {
        user_id: user.id,
        display_name: user.email?.split('@')[0] || null,
        first_name: null,
        last_name: null,
        bio: null,
        avatar_url: null
      };
      setProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (newProfile: Profile) => {
    console.log('📝 Updating profile locally:', newProfile);
    setProfile(newProfile);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile
  };
};
