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
      // ALWAYS check development environment FIRST - before any user checks
      const hostname = window.location.hostname;
      const isLovableDev = hostname.includes('lovable.app') || hostname.includes('localhost') || hostname.includes('127.0.0.1');
      
      console.log('🔍 Hostname:', hostname, 'Is Lovable Dev:', isLovableDev);
      
      if (isLovableDev) {
        console.log('✅ LOVABLE DEVELOPMENT - GRANTING ADMIN ACCESS');
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      
      console.log('🔍 Checking admin role for user:', user?.id, 'email:', user?.email);
      
      if (!user) {
        console.log('❌ No user found, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // In production, check actual admin role in database
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!roleData);
        console.log('🔐 Production admin check result:', !!roleData);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  const makeAdmin = async () => {
    if (!user) return false;

    try {
      console.log('Attempting to make user admin:', user.id);
      
      // Call the database function that bypasses RLS
      const { data, error } = await supabase.rpc('make_first_admin', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Error making user admin:', error);
        return false;
      }

      if (!data) {
        console.log('Admin already exists or function returned false');
        return false;
      }

      console.log('Successfully made user admin');
      
      // Force a re-check of admin status after successful creation
      setTimeout(async () => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!roleData);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error making user admin:', error);
      return false;
    }
  };

  return { isAdmin, loading, makeAdmin };
};