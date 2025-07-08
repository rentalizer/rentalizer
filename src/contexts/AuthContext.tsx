import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  subscription_status: 'active' | 'inactive' | 'trial';
  subscription_tier?: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData?: { displayName?: string; firstName?: string; lastName?: string; bio?: string; avatarFile?: File }) => Promise<void>;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  hasEssentialsAccess: boolean;
  hasCompleteAccess: boolean;
  checkSubscription: () => Promise<void>;
  upgradeSubscription: () => Promise<void>;
  manageSubscription: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


const sendNewUserNotification = async (userEmail: string, userId: string) => {
  try {
    console.log('Sending new user notification for:', userEmail);
    
    const { data, error } = await supabase.functions.invoke('notify-new-user', {
      body: {
        user_email: userEmail,
        user_id: userId,
        signup_timestamp: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Error sending new user notification:', error);
    } else {
      console.log('New user notification sent successfully');
    }
  } catch (error) {
    console.error('Failed to send new user notification:', error);
  }
};

const createUserProfile = async (userId: string, email: string) => {
  try {
    console.log('Creating user profile for:', email);
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      return;
    }

    if (existingProfile) {
      console.log('Profile already exists for user:', userId);
      return;
    }

    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: email,
        subscription_status: email.includes('premium') || email.includes('pro') ? 'active' : 'trial'
      });

    if (insertError) {
      console.error('Error creating user profile:', insertError);
    } else {
      console.log('User profile created successfully');
    }
  } catch (error) {
    console.error('Failed to create user profile:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      console.log('🔄 Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Error checking subscription:', error);
        return;
      }

      console.log('✅ Subscription check result:', data);
      
      if (user) {
        setUser({
          ...user,
          subscription_status: data.subscribed ? 'active' : 'trial',
          subscription_tier: data.subscription_tier
        });
      }
    } catch (error) {
      console.error('💥 Exception checking subscription:', error);
    }
  };

  const upgradeSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      console.log('🔄 Creating checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('❌ Error creating checkout:', error);
      throw error;
    }
  };

  const manageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      console.log('🔄 Creating customer portal session...');
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('❌ Error opening customer portal:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    
    console.log('🌐 Using real authentication only');
    
    const initTimeout = setTimeout(() => {
      console.log('⏰ Auth initialization timeout, setting loading to false');
      setIsLoading(false);
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state change event:', event, 'Session exists:', !!session);
      
      clearTimeout(initTimeout);
      
      if (session?.user) {
        console.log('👤 User found, email:', session.user.email);
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          subscription_status: 'trial',
          subscription_tier: null
        });
        
        setTimeout(() => {
          createUserProfile(session.user.id, session.user.email || '');
          fetchProfile(session.user.id);
          checkSubscription();
        }, 0);
      } else {
        console.log('❌ No user session found');
        setUser(null);
      }
      
      setIsLoading(false);
    });

    const getInitialSession = async () => {
      try {
        console.log('📡 Getting initial session...');
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          setIsLoading(false);
          return;
        }

        console.log('📋 Initial session loaded:', !!session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            subscription_status: 'trial',
            subscription_tier: null
          });
          
          setTimeout(() => {
            checkSubscription();
          }, 0);
        }
        
        clearTimeout(initTimeout);
        setIsLoading(false);
      } catch (error) {
        console.error('💥 Exception getting initial session:', error);
        clearTimeout(initTimeout);
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Check for success/cancel URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      console.log('✅ Payment successful, checking subscription status');
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Sign in error:', error.message);
      throw new Error(error.message);
    }

    console.log('✅ Sign in successful for:', email);
  };

  const signUp = async (email: string, password: string, profileData?: { displayName?: string; firstName?: string; lastName?: string; bio?: string; avatarFile?: File }) => {
    console.log('📝 Starting sign up for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: profileData?.displayName ? { display_name: profileData.displayName } : undefined
      }
    });

    if (error) {
      console.error('❌ Sign up error:', error.message);
      throw new Error(error.message);
    }

    console.log('✅ Sign up successful for:', email);
    
    // If we have profile data and a user was created, save the profile
    if (data.user && profileData) {
      try {
        let avatarUrl = null;
        
        // Upload avatar if provided
        if (profileData.avatarFile) {
          const fileExt = profileData.avatarFile.name.split('.').pop();
          const fileName = `${data.user.id}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, profileData.avatarFile, {
              upsert: true
            });
          
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            avatarUrl = publicUrl;
          }
        }
        
        // Create profile with all the data
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            display_name: profileData.displayName || `${profileData.firstName} ${profileData.lastName}`.trim(),
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            bio: profileData.bio,
            avatar_url: avatarUrl,
            profile_complete: true
          });
          
        if (profileError) {
          console.error('❌ Error creating profile:', profileError);
        } else {
          console.log('✅ Profile created successfully');
        }
      } catch (profileError) {
        console.error('❌ Error handling profile data:', profileError);
      }
    }
    
    if (data.user && data.user.email) {
      setTimeout(() => {
        sendNewUserNotification(data.user!.email!, data.user!.id);
      }, 2000);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 AuthContext: Starting signOut process');
    try {
      // Set logout flag to prevent mock user from being set again
      setHasLoggedOut(true);
      
      // Clear local state first
      setUser(null);
      setProfile(null);
      console.log('🧹 AuthContext: Cleared local auth state');

      // Clear ALL storage before calling signOut
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 AuthContext: Cleared all storage');
      } catch (e) {
        console.warn('⚠️ AuthContext: Could not clear storage:', e);
      }

      // Call Supabase signOut with global scope to clear all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('❌ AuthContext: Supabase signOut error:', error);
        // Don't throw - we'll force logout anyway
      } else {
        console.log('✅ AuthContext: Supabase signOut successful');
      }

      // Additional cleanup - manually remove any auth-related items
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('auth') || key.includes('session'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('🧹 AuthContext: Removed auth-related keys:', keysToRemove);
      } catch (e) {
        console.warn('⚠️ AuthContext: Could not remove auth keys:', e);
      }

      // Force navigation with page reload to ensure clean state
      console.log('🔄 AuthContext: Forcing page reload and navigation');
      window.location.replace('/');
      
    } catch (error) {
      console.error('❌ AuthContext: Unexpected signOut error:', error);
      // Force logout anyway
      setHasLoggedOut(true);
      setUser(null);
      setProfile(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  const isSubscribed = user?.subscription_status === 'active';
  const hasEssentialsAccess = isSubscribed && (user?.subscription_tier === 'Professional' || user?.subscription_tier === 'Premium' || user?.subscription_tier === 'Enterprise');
  const hasCompleteAccess = isSubscribed && (user?.subscription_tier === 'Premium' || user?.subscription_tier === 'Enterprise');

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isSubscribed,
    hasEssentialsAccess,
    hasCompleteAccess,
    checkSubscription,
    upgradeSubscription: () => Promise.resolve(), // Placeholder since we handle this in components now
    updateProfile,
    manageSubscription: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        console.log('🔄 Creating customer portal session...');
        const { data, error } = await supabase.functions.invoke('customer-portal', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;

        // Open customer portal in a new tab
        window.open(data.url, '_blank');
      } catch (error) {
        console.error('❌ Error opening customer portal:', error);
        throw error;
      }
    }
  };

  console.log('🖥️ AuthProvider render - isLoading:', isLoading, 'user exists:', !!user, 'isSubscribed:', isSubscribed, 'tier:', user?.subscription_tier);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="text-gray-400 text-sm">Connecting to authentication...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            If this takes too long, please refresh the page
          </div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
