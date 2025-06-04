
import { CityMarketData, STRData, RentData } from '@/types';

const getBedroomMultiplier = (propertyType: string): number => {
  switch (propertyType) {
    case '1': return 0.75;
    case '2': return 1;
    case '3': return 1.25;
    default: return 1;
  }
};

const getBathroomMultiplier = (bathrooms: string): number => {
  switch (bathrooms) {
    case '1': return 0.95;
    case '2': return 1;
    case '3': return 1.05;
    default: return 1;
  }
};

const REAL_NEIGHBORHOODS = {
  'san diego': [
    'Gaslamp Quarter', 'Little Italy', 'Hillcrest', 'Mission Valley', 'La Jolla', 
    'Pacific Beach', 'Mission Beach', 'Ocean Beach', 'Balboa Park', 'North Park',
    'South Park', 'University Heights', 'Normal Heights', 'Kensington'
  ],
  'denver': [
    'LoDo', 'Capitol Hill', 'Highland', 'RiNo', 'Cherry Creek', 'Washington Park',
    'Five Points', 'Stapleton', 'Baker', 'Wash Park', 'Glenarm Place', 'Berkeley'
  ],
  'seattle': [
    'Capitol Hill', 'Belltown', 'Queen Anne', 'Fremont', 'Ballard', 'Wallingford',
    'University District', 'Georgetown', 'Pioneer Square', 'Magnolia', 'Green Lake'
  ],
  'atlanta': [
    'Midtown', 'Buckhead', 'Virginia-Highland', 'Little Five Points', 'Inman Park',
    'Old Fourth Ward', 'Poncey-Highland', 'Grant Park', 'Decatur', 'East Atlanta'
  ],
  'miami': [
    'South Beach', 'Wynwood', 'Brickell', 'Design District', 'Coral Gables',
    'Coconut Grove', 'Little Havana', 'Aventura', 'Key Biscayne', 'Midtown Miami'
  ],
  'austin': [
    'Downtown', 'South Lamar', 'East Austin', 'Zilker', 'Mueller', 'The Domain',
    'Rainey Street', 'West Campus', 'Clarksville', 'Barton Hills', 'Hyde Park'
  ],
  'nashville': [
    'Music Row', 'The Gulch', 'Green Hills', 'Belle Meade', 'East Nashville',
    'Germantown', 'Sobro', 'Hillsboro Village', 'Belmont', 'Vanderbilt'
  ],
  'phoenix': [
    'Old Town Scottsdale', 'Tempe', 'Central Phoenix', 'Arcadia', 'Biltmore',
    'Camelback East', 'Paradise Valley', 'Mesa', 'Chandler', 'Glendale'
  ],
  'tampa': [
    'Hyde Park', 'Ybor City', 'Westshore', 'Davis Islands', 'SoHo', 'Channelside',
    'Seminole Heights', 'Bayshore', 'Downtown Tampa', 'Carrollwood'
  ],
  'orlando': [
    'Winter Park', 'Thornton Park', 'College Park', 'Baldwin Park', 'Mills 50',
    'Lake Eola', 'Dr. Phillips', 'Windermere', 'Lake Nona', 'Celebration'
  ]
};

const getCityCoordinates = (city: string): { lat: number; lng: number } => {
  const cityCoords: { [key: string]: { lat: number; lng: number } } = {
    'san diego': { lat: 32.7157, lng: -117.1611 },
    'denver': { lat: 39.7392, lng: -104.9903 },
    'seattle': { lat: 47.6062, lng: -122.3321 },
    'atlanta': { lat: 33.7490, lng: -84.3880 },
    'miami': { lat: 25.7617, lng: -80.1918 },
    'austin': { lat: 30.2672, lng: -97.7431 },
    'nashville': { lat: 36.1627, lng: -86.7816 },
    'phoenix': { lat: 33.4484, lng: -112.0740 },
    'tampa': { lat: 27.9506, lng: -82.4572 },
    'orlando': { lat: 28.5383, lng: -81.3792 }
  };
  
  return cityCoords[city.toLowerCase()] || { lat: 40.7128, lng: -74.0060 };
};

const fetchMashvisorSTRData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<STRData[] | null> => {
  try {
    console.log(`🏠 Attempting to fetch REAL STR earnings from Mashvisor for ${city} (${propertyType}BR/${bathrooms}BA)`);
    console.log('🔑 API Key being used:', apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'No API key provided');
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ No Mashvisor API key provided - RETURNING NULL (NO MOCK DATA)');
      return null;
    }

    // Clean the API key of any whitespace or newlines
    const cleanApiKey = apiKey.trim().replace(/\s/g, '');
    console.log('🧹 Cleaned API Key length:', cleanApiKey.length);

    // Use the correct Mashvisor API base URL
    const url = `https://api.mashvisor.com/v1.1/client`;

    console.log('🔍 Mashvisor API URL:', url);
    console.log('🔍 Request Headers:', {
      'x-api-key': `${cleanApiKey.substring(0, 8)}...${cleanApiKey.substring(cleanApiKey.length - 4)}`,
      'Content-Type': 'application/json'
    });

    // Create AbortController for timeout - reduced to 3 seconds for faster failure
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ API call timeout triggered (3 seconds)');
      controller.abort();
    }, 3000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': cleanApiKey,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Mashvisor API Response status:', response.status);
    console.log('📡 Mashvisor API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Mashvisor API FAILED (${response.status}): ${errorText}`);
      
      // Log specific error cases
      if (response.status === 401) {
        console.log('🚫 Authentication failed - check API key');
      } else if (response.status === 403) {
        console.log('🚫 Forbidden - API key may not have required permissions');
      } else if (response.status === 429) {
        console.log('🚫 Rate limit exceeded');
      } else if (response.status >= 500) {
        console.log('🚫 Server error on Mashvisor side');
      }
      
      return null;
    }

    const data = await response.json();
    console.log('📊 RAW Mashvisor API Response data (first 500 chars):', JSON.stringify(data, null, 2).substring(0, 500));
    
    if (data.content && data.content.length > 0) {
      console.log('✅ REAL DATA CONFIRMED - Processing Mashvisor data...');
      
      const strData: STRData[] = data.content.slice(0, 6).map((item: any, index: number) => {
        const actualMonthlyEarnings = item.airbnb_revenue || item.monthly_revenue || 0;
        const monthlyRevenueWith25Percent = Math.round(actualMonthlyEarnings * 1.25);
        
        return {
          submarket: item.neighborhood || item.area || `${city} Area ${index + 1}`,
          revenue: monthlyRevenueWith25Percent
        };
      });

      console.log('✅ FINAL REAL STR DATA (with 25% buffer applied):', strData);
      return strData;
    }

    console.log('❌ No content in Mashvisor response - RETURNING NULL');
    return null;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('❌ Mashvisor API timeout (3 seconds)');
    } else {
      console.error('❌ Mashvisor API error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });
    }
    return null;
  }
};

const fetchMashvisorRentData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<RentData[] | null> => {
  try {
    console.log(`🤖 Attempting to fetch REAL rent data from Mashvisor for ${city} (${propertyType}BR/${bathrooms}BA)`);
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ No Mashvisor API key provided - RETURNING NULL (NO MOCK DATA)');
      return null;
    }

    // Clean the API key
    const cleanApiKey = apiKey.trim().replace(/\s/g, '');

    // Use the same base URL for rental data
    const url = `https://api.mashvisor.com/v1.1/client`;

    console.log('🔍 Mashvisor Rental API URL:', url);

    // Create AbortController for timeout - reduced to 3 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Rental API call timeout triggered (3 seconds)');
      controller.abort();
    }, 3000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': cleanApiKey,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Mashvisor Rental API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Mashvisor Rental API FAILED (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log('📊 RAW Mashvisor Rental API Response (first 500 chars):', JSON.stringify(data, null, 2).substring(0, 500));
    
    if (data.content && data.content.length > 0) {
      console.log('✅ REAL RENTAL DATA CONFIRMED - Processing Mashvisor rental data...');
      
      const rentData: RentData[] = data.content.slice(0, 6).map((item: any, index: number) => {
        return {
          submarket: item.neighborhood || item.area || `${city} Area ${index + 1}`,
          rent: item.monthly_rent || item.rent || 0
        };
      });

      console.log('✅ FINAL REAL RENT DATA:', rentData);
      return rentData;
    }

    console.log('❌ No rental content in Mashvisor response - RETURNING NULL');
    return null;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('❌ Mashvisor Rental API timeout (3 seconds)');
    } else {
      console.error('❌ Mashvisor Rental API error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });
    }
    return null;
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 STARTING fetchMarketData for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  console.log('🔑 API Configuration:', {
    hasMashvisorKey: !!(apiConfig.airdnaApiKey && apiConfig.airdnaApiKey.trim()),
    mashvisorKeyLength: apiConfig.airdnaApiKey?.length || 0,
    hasBackupKey: !!(apiConfig.openaiApiKey && apiConfig.openaiApiKey.trim())
  });

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];

    console.log('🚀 Starting parallel API calls...');

    // Use Promise.allSettled to run both API calls in parallel with faster timeouts
    const [strResult, rentResult] = await Promise.allSettled([
      fetchMashvisorSTRData(city, apiConfig.airdnaApiKey || '', propertyType, bathrooms),
      fetchMashvisorRentData(city, apiConfig.airdnaApiKey || '', propertyType, bathrooms)
    ]);

    console.log('📊 API calls completed:', {
      strStatus: strResult.status,
      rentStatus: rentResult.status
    });

    // Handle STR data result
    if (strResult.status === 'fulfilled' && strResult.value) {
      strData = strResult.value;
      console.log('✅ Using REAL STR data from Mashvisor API');
    } else {
      console.log('❌ STR API failed - will show "NA" for STR revenue');
      if (strResult.status === 'rejected') {
        console.log('STR rejection reason:', strResult.reason);
      }
      // Create placeholder data with "NA" indicators
      const cityKey = city.toLowerCase();
      const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Area`];
      strData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        revenue: 0 // Will be displayed as "NA"
      }));
    }

    // Handle rent data result
    if (rentResult.status === 'fulfilled' && rentResult.value) {
      rentData = rentResult.value;
      console.log('✅ Using REAL rent data from Mashvisor API');
    } else {
      console.log('❌ Rent API failed - will show "NA" for rent data');
      if (rentResult.status === 'rejected') {
        console.log('Rent rejection reason:', rentResult.reason);
      }
      // Create placeholder data with "NA" indicators
      const cityKey = city.toLowerCase();
      const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Area`];
      rentData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        rent: 0 // Will be displayed as "NA"
      }));
    }

    console.log(`📊 ✅ FINAL Market data compilation complete for ${city}:`, {
      strSubmarkets: strData.length,
      rentSubmarkets: rentData.length,
      strDataSource: strResult.status === 'fulfilled' && strResult.value ? 'Real Mashvisor API' : 'API Failed - Showing NA',
      rentDataSource: rentResult.status === 'fulfilled' && rentResult.value ? 'Real Mashvisor API' : 'API Failed - Showing NA'
    });

    return {
      strData,
      rentData
    };

  } catch (error) {
    console.error('❌ FATAL ERROR in fetchMarketData:', error);
    throw error;
  }
};
