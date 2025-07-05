import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin role:', error);
        }

        const isUserAdmin = !!data;
        console.log('Admin check result:', { userId: user.id, isAdmin: isUserAdmin, data });
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
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