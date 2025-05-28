
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  subscription_status: 'active' | 'inactive' | 'trial';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      if (session?.user) {
        console.log('Found existing session for user:', session.user.email);
        await loadUserProfile(session.user);
      } else {
        console.log('No existing session found');
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser, isNewUser = false) => {
    try {
      console.log('Loading profile for user:', supabaseUser.email);
      
      // First try to get existing profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile:', error);
        // Set user with default trial status if we can't load profile
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          subscription_status: 'trial'
        });
        return;
      }

      if (!profile) {
        console.log('No profile found, creating one...');
        // Profile doesn't exist, try to create one
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            subscription_status: 'trial'
          })
          .select('subscription_status')
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          // Even if profile creation fails, set user with trial status
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            subscription_status: 'trial'
          });
          return;
        }

        // Send notification for new user signup
        if (isNewUser && supabaseUser.email) {
          sendNewUserNotification(supabaseUser.email, supabaseUser.id);
        }

        const validStatus = ['active', 'inactive', 'trial'].includes(newProfile?.subscription_status) 
          ? newProfile.subscription_status as 'active' | 'inactive' | 'trial'
          : 'trial';

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          subscription_status: validStatus
        });
      } else {
        console.log('Profile loaded successfully:', profile);
        
        const validStatus = ['active', 'inactive', 'trial'].includes(profile.subscription_status) 
          ? profile.subscription_status as 'active' | 'inactive' | 'trial'
          : 'trial';

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          subscription_status: validStatus
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Fallback: set user with trial status
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        subscription_status: 'trial'
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message, error);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('No user returned from sign in');
        throw new Error('Authentication failed - no user returned');
      }

      console.log('Sign in successful for:', email);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign up error:', error.message, error);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('No user returned from sign up');
        throw new Error('Sign up failed - no user returned');
      }

      console.log('Sign up successful for:', email);
      
      // Mark as new user for notification
      if (data.user && data.user.email) {
        setTimeout(() => {
          sendNewUserNotification(data.user!.email!, data.user!.id);
        }, 2000); // Slight delay to ensure profile is created
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Sign out successful');
    }
  };

  const isSubscribed = user?.subscription_status === 'active' || user?.subscription_status === 'trial';

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isSubscribed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
