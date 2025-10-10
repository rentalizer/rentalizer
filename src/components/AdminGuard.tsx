import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';

interface AdminGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * AdminGuard component ensures that only authenticated admin users
 * can access the wrapped content. Non-admin users are redirected.
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallbackPath = '/dashboard' }) => {
  const { user, isLoading } = useAuth();
  const { isAdmin } = useAdminRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-300 mx-auto" />
          <div className="text-cyan-300 text-sm">Checking admin access...</div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
