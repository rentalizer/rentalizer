
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
    console.log('🔑 API Key being used:', apiKey ? `${apiKey.substring(0, 8)}...` : 'No API key provided');
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ No Mashvisor API key provided - RETURNING NULL (NO MOCK DATA)');
      return null;
    }

    // Use the correct Mashvisor API base URL from your example
    const url = `https://api.mashvisor.com/v1.1/client`;

    console.log('🔍 Mashvisor API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 Mashvisor API Response status:', response.status);
    console.log('📡 Mashvisor API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Mashvisor API FAILED (${response.status}): ${errorText}`);
      console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
      return null;
    }

    const data = await response.json();
    console.log('📊 RAW Mashvisor API Response data (full object):', JSON.stringify(data, null, 2));
    
    if (data.content && data.content.length > 0) {
      console.log('✅ REAL DATA CONFIRMED - Processing Mashvisor data...');
      
      const strData: STRData[] = data.content.map((item: any, index: number) => {
        console.log(`📍 Item ${index + 1} RAW data:`, {
          neighborhood: item.neighborhood || item.area,
          airbnb_revenue: item.airbnb_revenue,
          monthly_revenue: item.monthly_revenue,
          all_fields: item
        });
        
        // Get actual monthly earnings and add 25% buffer
        const actualMonthlyEarnings = item.airbnb_revenue || item.monthly_revenue || 0;
        const monthlyRevenueWith25Percent = Math.round(actualMonthlyEarnings * 1.25);
        
        console.log(`💰 Revenue calculation for ${item.neighborhood || item.area}:`, {
          rawApiValue: actualMonthlyEarnings,
          with25PercentBuffer: monthlyRevenueWith25Percent,
          bufferAdded: monthlyRevenueWith25Percent - actualMonthlyEarnings
        });
        
        return {
          submarket: item.neighborhood || item.area || `${city} Area ${index + 1}`,
          revenue: monthlyRevenueWith25Percent
        };
      });

      console.log('✅ FINAL REAL STR DATA (with 25% buffer applied):', strData);
      console.log('🔍 DATA SOURCE: Real Mashvisor API response');
      return strData;
    }

    console.log('❌ No content in Mashvisor response - RETURNING NULL');
    return null;

  } catch (error) {
    console.error('❌ Mashvisor API error:', error);
    console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
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

    // Use the same base URL for rental data
    const url = `https://api.mashvisor.com/v1.1/client`;

    console.log('🔍 Mashvisor Rental API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 Mashvisor Rental API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Mashvisor Rental API FAILED (${response.status}): ${errorText}`);
      console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
      return null;
    }

    const data = await response.json();
    console.log('📊 RAW Mashvisor Rental API Response:', JSON.stringify(data, null, 2));
    
    if (data.content && data.content.length > 0) {
      console.log('✅ REAL RENTAL DATA CONFIRMED - Processing Mashvisor rental data...');
      
      const rentData: RentData[] = data.content.map((item: any, index: number) => {
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

  } catch (error) {
    console.error('❌ Mashvisor Rental API error:', error);
    console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
    return null;
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  console.log('🔑 API Configuration:', {
    hasMashvisorKey: !!(apiConfig.airdnaApiKey && apiConfig.airdnaApiKey.trim()),
    hasBackupKey: !!(apiConfig.openaiApiKey && apiConfig.openaiApiKey.trim())
  });

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];

    // Fetch STR data from Mashvisor - only real data, no fallbacks
    const strResult = await fetchMashvisorSTRData(city, apiConfig.airdnaApiKey || '', propertyType, bathrooms);
    if (strResult) {
      strData = strResult;
      console.log('✅ Using REAL STR data from Mashvisor API');
    } else {
      console.log('❌ STR API failed - will show "NA" for STR revenue');
      // Create placeholder data with "NA" indicators
      const cityKey = city.toLowerCase();
      const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Area`];
      strData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        revenue: 0 // Will be displayed as "NA"
      }));
    }

    // Fetch rent data from Mashvisor - only real data, no fallbacks
    const rentResult = await fetchMashvisorRentData(city, apiConfig.airdnaApiKey || '', propertyType, bathrooms);
    if (rentResult) {
      rentData = rentResult;
      console.log('✅ Using REAL rent data from Mashvisor API');
    } else {
      console.log('❌ Rent API failed - will show "NA" for rent data');
      // Create placeholder data with "NA" indicators
      const cityKey = city.toLowerCase();
      const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Area`];
      rentData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        rent: 0 // Will be displayed as "NA"
      }));
    }

    console.log(`📊 Market data compilation complete for ${city}:`, {
      strSubmarkets: strData.length,
      rentSubmarkets: rentData.length,
      strDataSource: strResult ? 'Real Mashvisor API' : 'API Failed - Showing NA',
      rentDataSource: rentResult ? 'Real Mashvisor API' : 'API Failed - Showing NA'
    });

    return {
      strData,
      rentData
    };

  } catch (error) {
    console.error('❌ Failed to fetch market data:', error);
    throw error;
  }
};
