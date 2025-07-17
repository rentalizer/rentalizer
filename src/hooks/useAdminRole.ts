import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('🔧 useAdminRole current state:', { isAdmin, loading });

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('🔍 Checking admin role for user:', user?.id, 'email:', user?.email);
      
      if (!user) {
        console.log('❌ No user found, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check actual admin role in database
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!roleData);
        console.log('🔐 Admin check result:', !!roleData);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};