
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

    // Get initial session with shorter timeout and better error handling
    console.log('🚀 Getting initial session...');
    const getInitialSession = async () => {
      try {
        console.log('📡 Attempting to connect to Supabase...');
        
        // Test basic connectivity first
        const startTime = Date.now();
        const { data: { session }, error } = await supabase.auth.getSession();
        const endTime = Date.now();
        
        console.log(`📊 Session request took ${endTime - startTime}ms`);
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          console.error('❌ Error details:', error.message, error.status);
        } else {
          console.log('📋 Initial session loaded successfully');
        }
        await processSession(session);
      } catch (error) {
        console.error('💥 Exception getting initial session:', error);
        console.error('💥 Error type:', typeof error);
        console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown error');
        
        if (mounted) {
          console.log('🚨 Forcing auth completion due to error');
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Shorter timeout to prevent infinite loading - 5 seconds instead of 10
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('⏰ Auth initialization timeout after 5s - forcing completion');
        console.warn('⏰ This suggests a network or configuration issue with Supabase');
        setIsLoading(false);
      }
    }, 5000);

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
    console.log('Attempting to sign in user:', email);
    setIsLoading(true);
    
    try {
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
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting to sign up user:', email);
    setIsLoading(true);
    
    try {
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
      
      // Send notification for new user signup
      if (data.user && data.user.email) {
        setTimeout(() => {
          sendNewUserNotification(data.user!.email!, data.user!.id);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    } else {
      console.log('Sign out successful');
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
          <div className="text-gray-400 text-sm">Connecting to authentication service...</div>
          <div className="text-gray-500 text-xs">Check console for details if this takes too long</div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
