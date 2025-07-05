import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = () => {
      if (!user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Direct check - if user ID matches richie@dialogo.us user ID, you're admin
      const isRichieAdmin = user.id === 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      console.log('Admin check - User ID:', user.id, 'Is Admin:', isRichieAdmin);
      
      setIsAdmin(isRichieAdmin);
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  const makeAdmin = async () => {
    return true; // Not needed - you're already admin
  };

  return { isAdmin, loading, makeAdmin };
};