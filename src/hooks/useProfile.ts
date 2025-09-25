
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

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

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('🔍 Fetching profile for user:', user.id);
    
    try {
      // Fetch real profile data from Node.js backend
      const response = await apiService.getProfile();
      const backendUser = response.user;
      
      // Transform backend user data to Profile interface
      const profileData: Profile = {
        user_id: backendUser.id,
        display_name: backendUser.firstName && backendUser.lastName 
          ? `${backendUser.firstName} ${backendUser.lastName}`
          : backendUser.email?.split('@')[0] || 'User',
        first_name: backendUser.firstName || null,
        last_name: backendUser.lastName || null,
        bio: backendUser.bio || null,
        avatar_url: backendUser.profilePicture || null,
        profile_complete: !!(backendUser.firstName && backendUser.lastName)
      };
      
      console.log('📊 Profile query result:', { data: profileData, error: null });
      console.log('✅ Profile loaded successfully:', profileData);
      console.log('🖼️ Profile picture status:', { 
        hasProfilePicture: !!profileData.avatar_url, 
        profilePicture: profileData.avatar_url 
      });
      setProfile(profileData);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      // Fallback to user data from auth context
      const fallbackProfile: Profile = {
        user_id: user.id,
        display_name: user.email?.split('@')[0] || 'User',
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        bio: user.bio || null,
        avatar_url: user.profilePicture || null,
        profile_complete: !!(user.firstName && user.lastName)
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
