import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SmartRedirectProps {
  children: React.ReactNode;
}

/**
 * Smart redirect component that:
 * - Shows children for unauthenticated users
 * - Redirects authenticated users to /dashboard
 */
export const SmartRedirect: React.FC<SmartRedirectProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <div className="text-cyan-300 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, show the children (LandingPage)
  return <>{children}</>;
};
