
import { useState, useEffect, useMemo } from 'react';
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
  const { user, isLoading } = useAuth();
  
  // Transform user data from AuthContext to Profile interface
  // No need to fetch - AuthContext already has this data!
  const profile = useMemo<Profile | null>(() => {
    if (!user) return null;
    
    return {
      user_id: user.id,
      display_name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.email?.split('@')[0] || 'User',
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      bio: user.bio || null,
      avatar_url: user.profilePicture || null,
      profile_complete: !!(user.firstName && user.lastName)
    };
  }, [user]);

  // Only fetch profile when explicitly requested (e.g., after an update)
  const fetchProfile = async () => {
    if (!user) {
      return;
    }

    console.log('🔄 Explicitly fetching profile for user:', user.id);
    
    try {
      const response = await apiService.getProfile();
      console.log('✅ Profile refreshed:', response.user);
      // Note: This will update the AuthContext through the updateProfile call
      return response.user;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      throw error;
    }
  };

  const updateProfile = (newProfile: Profile) => {
    console.log('📝 Updating profile locally:', newProfile);
    // This is now just for local state - the actual update should go through AuthContext
  };

  return {
    profile,
    loading: isLoading,
    fetchProfile,
    updateProfile
  };
};
