
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  profile_complete?: boolean | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('🔍 Fetching profile for user:', user.id);
    
    // Simulate loading delay
    setTimeout(() => {
      // Mock profile data
      const mockProfile: Profile = {
        user_id: user.id,
        display_name: user.email?.split('@')[0] || 'Dev User',
        first_name: 'Dev',
        last_name: 'User',
        bio: 'Rental arbitrage enthusiast and developer',
        avatar_url: null,
        profile_complete: true
      };
      
      console.log('📊 Profile query result:', { data: mockProfile, error: null });
      console.log('✅ Profile loaded successfully:', mockProfile);
      setProfile(mockProfile);
      setLoading(false);
    }, 400);
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
