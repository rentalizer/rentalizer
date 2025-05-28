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

const createUserProfile = async (userId: string, email: string) => {
  try {
    console.log('Creating user profile for:', email);
    
    // Check if profile already exists
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

    // Create new profile
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const processSession = async (session: Session | null) => {
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping session processing');
        return;
      }
      
      console.log('📝 Processing session:', session ? 'Session exists' : 'No session');
      
      if (session?.user) {
        console.log('👤 User found, email:', session.user.email);
        
        // Ensure user profile exists
        await createUserProfile(session.user.id, session.user.email || '');
        
        let subscriptionStatus: 'active' | 'inactive' | 'trial' = 'trial';
        if (session.user.email?.includes('premium') || session.user.email?.includes('pro')) {
          subscriptionStatus = 'active';
          console.log('✅ User has premium/pro subscription');
        } else {
          console.log('🆓 User on trial subscription');
        }
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          subscription_status: subscriptionStatus
        });
      } else {
        console.log('❌ No user session found');
        setUser(null);
      }
      
      console.log('✅ Setting isLoading to false');
      setIsLoading(false);
    };
    
    // Set up auth state listener
    console.log('🔧 Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state change event:', event);
      await processSession(session);
    });

    // Get initial session with improved error handling
    console.log('🚀 Getting initial session...');
    const getInitialSession = async () => {
      try {
        console.log('📡 Attempting to connect to Supabase...');
        
        // Much shorter timeout for initial connection
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else {
          console.log('📋 Initial session loaded successfully');
        }
        await processSession(session);
      } catch (error) {
        console.error('💥 Exception getting initial session:', error);
        
        if (mounted) {
          console.log('🚨 Forcing auth completion due to error');
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Very short timeout for loading state
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('⏰ Auth initialization timeout after 1s - forcing completion');
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting sign in for:', email);
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timeout - please try again')), 5000)
      );
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { data, error } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('❌ Sign in error:', error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('❌ No user returned from sign in');
        throw new Error('Authentication failed - no user returned');
      }

      console.log('✅ Sign in successful for:', email);
    } catch (error) {
      console.error('💥 Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('📝 Starting sign up for:', email);
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up timeout - please try again')), 5000)
      );
      
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
      });
      
      const { data, error } = await Promise.race([
        signUpPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('❌ Sign up error:', error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('❌ No user returned from sign up');
        throw new Error('Sign up failed - no user returned');
      }

      console.log('✅ Sign up successful for:', email);
      
      // Send notification for new user signup
      if (data.user && data.user.email) {
        setTimeout(() => {
          sendNewUserNotification(data.user!.email!, data.user!.id);
        }, 2000);
      }
    } catch (error) {
      console.error('💥 Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    } else {
      console.log('✅ Sign out successful');
      setUser(null);
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

  console.log('🖥️ AuthProvider render - isLoading:', isLoading, 'user exists:', !!user, 'isSubscribed:', isSubscribed);

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
            This should only take a moment
          </div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
