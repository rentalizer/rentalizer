import React, { createContext, useContext, useState, useEffect } from 'react';

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
  console.log('Mock sending new user notification for:', userEmail, userId);
  // Mock notification - no actual sending
};

const createUserProfile = async (userId: string, email: string) => {
  console.log('Mock creating user profile for:', email, userId);
  // Mock profile creation - no actual creation
};

// Mock authentication credentials
const MOCK_CREDENTIALS = {
  admin: {
    email: 'admin@rentalizer.com',
    password: 'admin123',
    id: '00000000-0000-0000-0000-000000000001',
    subscription_status: 'active' as const,
    subscription_tier: 'Premium'
  },
  user: {
    email: 'user@rentalizer.com', 
    password: 'user123',
    id: '00000000-0000-0000-0000-000000000002',
    subscription_status: 'active' as const,
    subscription_tier: 'Basic'
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const fetchProfile = async (userId: string) => {
    console.log('🔍 Mock fetching profile for user:', userId);
    // Mock profile - already set in signIn/signUp
  };

  const checkSubscription = async () => {
    console.log('🔄 Mock subscription check');
    // Mock subscription - already set in user object
  };

  const upgradeSubscription = async () => {
    console.log('🔄 Mock upgrade subscription');
    // Mock upgrade - open a mock checkout page
    window.open('https://checkout.stripe.com/mock-checkout', '_blank');
  };

  const manageSubscription = async () => {
    console.log('🔄 Mock manage subscription');
    // Mock customer portal
    window.open('https://billing.stripe.com/mock-portal', '_blank');
  };

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    
    // Check if we're in Lovable development environment
    const hostname = window.location.hostname;
    const url = window.location.href;
    const isLovableDev = hostname.includes('lovable.app') || hostname.includes('localhost') || hostname.includes('127.0.0.1') || url.includes('lovable');
    
    if (isLovableDev) {
      console.log('🚀 LOVABLE DEVELOPMENT - MOCK AUTH ENABLED');
      // Don't auto-login, let users see login/signup pages
      setIsLoading(false);
      return;
    }
    
    console.log('🌐 Using real authentication only');
    
    const initTimeout = setTimeout(() => {
      console.log('⏰ Auth initialization timeout, setting loading to false');
      setIsLoading(false);
    }, 5000);

    // Mock auth state change - no real subscription needed
    console.log('🔔 Mock auth state initialized');
    clearTimeout(initTimeout);
    setIsLoading(false);

    // Mock initial session - no real session needed
    console.log('📡 Mock initial session loaded');

    return () => {
      console.log('🧹 Cleaning up mock auth');
      clearTimeout(initTimeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting mock sign in for:', email);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against mock credentials
    const credentials = Object.values(MOCK_CREDENTIALS).find(
      cred => cred.email === email && cred.password === password
    );
    
    if (!credentials) {
      console.error('❌ Mock sign in error: Invalid credentials');
      throw new Error('Invalid login credentials');
    }
    
    // Set the user
    setUser(credentials);
    
    // Create mock profile
    const mockProfile: Profile = {
      id: credentials.id,
      user_id: credentials.id,
      display_name: email.split('@')[0],
      avatar_url: null
    };
    setProfile(mockProfile);

    console.log('✅ Mock sign in successful for:', email);
  };

  const signUp = async (email: string, password: string, profileData?: { displayName?: string; firstName?: string; lastName?: string; bio?: string; avatarFile?: File }) => {
    console.log('📝 Starting mock sign up for:', email);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists in mock credentials
    const existingUser = Object.values(MOCK_CREDENTIALS).find(cred => cred.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new mock user
    const newUserId = `mock-user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email,
      subscription_status: 'trial',
      subscription_tier: 'Basic'
    };
    
    // Set the user
    setUser(newUser);
    
    // Create mock profile
    const mockProfile: Profile = {
      id: newUserId,
      user_id: newUserId,
      display_name: profileData?.displayName || email.split('@')[0],
      avatar_url: null
    };
    setProfile(mockProfile);

    console.log('✅ Mock sign up successful for:', email);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    // Mock profile update
    console.log('📝 Mock profile update:', updates);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    
    return { error: null };
  };

  const signOut = async () => {
    console.log('🚪 Mock AuthContext: Starting signOut process');
    
    // Clear local state
    setUser(null);
    setProfile(null);
    
    // Clear storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Mock AuthContext: Cleared all storage');
    } catch (e) {
      console.warn('⚠️ Mock AuthContext: Could not clear storage:', e);
    }
    
    console.log('✅ Mock AuthContext: SignOut completed successfully');
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
    upgradeSubscription,
    updateProfile,
    manageSubscription
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
