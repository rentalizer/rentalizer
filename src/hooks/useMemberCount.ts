
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching member count:', error);
          setMemberCount(0);
        } else {
          setMemberCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching member count:', error);
        setMemberCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();
  }, []);

  return { memberCount, loading };
};
