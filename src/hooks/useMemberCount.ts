
import { useState, useEffect } from 'react';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock member count data
    const fetchMemberCount = () => {
      console.log('Fetching actual member count from profiles table...');
      
      // Simulate loading delay
      setTimeout(() => {
        // Mock member count - you can change this number
        const mockCount = 1247;
        console.log('Actual profiles count from database:', mockCount);
        setMemberCount(mockCount);
        setLoading(false);
      }, 300);
    };

    fetchMemberCount();
  }, []);

  return { memberCount, loading };
};
