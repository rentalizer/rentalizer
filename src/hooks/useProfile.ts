
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
      console.log('🔍 useProfile: Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ useProfile: Error fetching profile:', error);
        setProfile(null);
      } else {
        console.log('✅ useProfile: Profile data:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 useProfile: Exception fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (newProfile: Profile) => {
    console.log('🔄 useProfile: Updating profile state:', newProfile);
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
