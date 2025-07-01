
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { LoginPrompt } from '@/components/LoginPrompt';
import { WelcomeSection } from '@/components/WelcomeSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { AdminEditMode } from '@/components/AdminEditMode';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if we're in development environment
  const isDevelopment = () => {
    return window.location.hostname.includes('lovable.app') || 
           window.location.hostname.includes('localhost') ||
           window.location.hostname.includes('127.0.0.1');
  };

  // Redirect to login if not authenticated (except in development or on home page)
  useEffect(() => {
    if (!isDevelopment() && !user && window.location.pathname !== '/') {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, navigate]);

  // Show login prompt for non-authenticated users
  if (!user && !isDevelopment()) {
    return <LoginPrompt />;
  }

  // Main dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />
      <AdminEditMode />

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <WelcomeSection />
          <FeaturesGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
