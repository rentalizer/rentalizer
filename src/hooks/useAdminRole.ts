import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if user has admin or superadmin role from our custom backend
      const isAdminUser = user.role === 'admin' || user.role === 'superadmin';
      setIsAdmin(isAdminUser);
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};