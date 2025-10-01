
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        console.log('Fetching actual member count from backend API...');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.MEMBER_COUNT}`, {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Actual member count from database:', data.memberCount);
        setMemberCount(data.memberCount);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member count:', error);
        // Fallback to mock data if API fails
        const mockCount = 1247;
        console.log('Using fallback member count:', mockCount);
        setMemberCount(mockCount);
        setLoading(false);
      }
    };

    fetchMemberCount();
  }, []);

  return { memberCount, loading };
};
