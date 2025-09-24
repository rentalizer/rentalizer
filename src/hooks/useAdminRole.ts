import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { user } = useAuth();

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'superadmin';
  }, [user?.role]); // Only depend on the role, not the entire user object

  const loading = useMemo(() => {
    return !user; // Only loading if user is not loaded yet
  }, [user]);

  return { isAdmin, loading };
};