
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state change event:', event);
      
      if (session?.user) {
        console.log('👤 User found, email:', session.user.email);
        
        // Create user profile if needed
        setTimeout(() => {
          createUserProfile(session.user.id, session.user.email || '');
        }, 0);
        
        const subscriptionStatus: 'active' | 'inactive' | 'trial' = 
          (session.user.email?.includes('premium') || session.user.email?.includes('pro')) ? 'active' : 'trial';
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          subscription_status: subscriptionStatus
        });
      } else {
        console.log('❌ No user session found');
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('📡 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          setIsLoading(false);
          return;
        }

        console.log('📋 Initial session loaded:', !!session);
        
        if (session?.user) {
          const subscriptionStatus: 'active' | 'inactive' | 'trial' = 
            (session.user.email?.includes('premium') || session.user.email?.includes('pro')) ? 'active' : 'trial';
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            subscription_status: subscriptionStatus
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('💥 Exception getting initial session:', error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
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

  const signUp = async (email: string, password: string) => {
    console.log('📝 Starting sign up for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ Sign up error:', error.message);
      throw new Error(error.message);
    }

    console.log('✅ Sign up successful for:', email);
    
    if (data.user && data.user.email) {
      setTimeout(() => {
        sendNewUserNotification(data.user!.email!, data.user!.id);
      }, 2000);
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
    console.log('✅ Sign out successful');
    setUser(null);
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

  console.log('🖥️ AuthProvider render - isLoading:', isLoading, 'user exists:', !!user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="text-gray-400 text-sm">Connecting to authentication...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
