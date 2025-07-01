
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  subscription_status: 'active' | 'inactive' | 'trial';
  subscription_tier?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  hasEssentialsAccess: boolean;
  hasCompleteAccess: boolean;
  checkSubscription: () => Promise<void>;
  upgradeSubscription: () => Promise<void>;
  manageSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if we're in development environment (Lovable editor)
const isDevelopment = () => {
  return window.location.hostname.includes('lovable.app') || 
         window.location.hostname.includes('localhost') ||
         window.location.hostname.includes('127.0.0.1');
};

// Create a mock user for development
const createMockUser = (): User => ({
  id: 'dev-user-id',
  email: 'dev@example.com',
  subscription_status: 'active',
  subscription_tier: 'Premium'
});

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
    
    // If in development, set mock user and skip auth
    if (isDevelopment()) {
      console.log('🔧 Development mode detected, using mock user');
      setUser(createMockUser());
      setIsLoading(false);
      return;
    }
    
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

  const isSubscribed = user?.subscription_status === 'active';
  const hasEssentialsAccess = isSubscribed && (user?.subscription_tier === 'Professional' || user?.subscription_tier === 'Premium' || user?.subscription_tier === 'Enterprise');
  const hasCompleteAccess = isSubscribed && (user?.subscription_tier === 'Premium' || user?.subscription_tier === 'Enterprise');

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isSubscribed,
    hasEssentialsAccess,
    hasCompleteAccess,
    checkSubscription,
    upgradeSubscription: () => Promise.resolve(), // Placeholder since we handle this in components now
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

  console.log('🖥️ AuthProvider render - isLoading:', isLoading, 'user exists:', !!user, 'isSubscribed:', isSubscribed, 'tier:', user?.subscription_tier, 'isDev:', isDevelopment());

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
