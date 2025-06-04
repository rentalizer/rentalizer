
import { CityMarketData, STRData, RentData } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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

const fetchMashvisorDataViaEdgeFunction = async (city: string, propertyType: string, bathrooms: string): Promise<{ strData: STRData[] | null; rentData: RentData[] | null }> => {
  try {
    console.log(`🏠 Calling Mashvisor Edge Function for ${city} (${propertyType}BR/${bathrooms}BA)`);
    
    const { data, error } = await supabase.functions.invoke('mashvisor-api', {
      body: {
        city,
        propertyType,
        bathrooms
      }
    });

    if (error) {
      console.error('❌ Edge Function Error:', error);
      return { strData: null, rentData: null };
    }

    if (!data || !data.success) {
      console.error('❌ Edge Function returned error:', data);
      return { strData: null, rentData: null };
    }

    console.log('✅ Edge Function Success - Processing Mashvisor data...');
    const apiData = data.data;

    // Check if we have actual data from Mashvisor API
    if (apiData && (apiData.content || apiData.properties || apiData.listings)) {
      console.log('✅ REAL MASHVISOR DATA - Processing...');
      
      // Handle different possible response structures from Mashvisor
      const dataArray = apiData.content || apiData.properties || apiData.listings || [];
      
      if (dataArray && dataArray.length > 0) {
        const strData: STRData[] = dataArray.slice(0, 6).map((item: any, index: number) => {
          // Try different property names that Mashvisor might use for revenue data
          const revenue = item.airbnb_revenue || item.monthly_revenue || item.str_revenue || item.rental_income || 0;
          const adjustedRevenue = Math.round(revenue * 1.25); // Add 25% markup
          
          return {
            submarket: item.neighborhood || item.area || item.address || `${city} Area ${index + 1}`,
            revenue: adjustedRevenue
          };
        });

        const rentData: RentData[] = dataArray.slice(0, 6).map((item: any, index: number) => {
          const rent = item.monthly_rent || item.rent || item.traditional_rental || 0;
          
          return {
            submarket: item.neighborhood || item.area || item.address || `${city} Area ${index + 1}`,
            rent: rent
          };
        });

        console.log('✅ FINAL MASHVISOR DATA:', { strData, rentData });
        return { strData, rentData };
      }
    }

    console.log('❌ No usable content in Mashvisor response, response structure:', Object.keys(apiData || {}));
    return { strData: null, rentData: null };

  } catch (error: any) {
    console.error('❌ Mashvisor Edge Function call error:', error);
    return { strData: null, rentData: null };
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { mashvisorApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 STARTING fetchMarketData for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  console.log('🔑 Using Supabase Edge Function for Mashvisor API');

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];

    console.log('🚀 Calling Mashvisor Edge Function...');

    const { strData: apiStrData, rentData: apiRentData } = await fetchMashvisorDataViaEdgeFunction(city, propertyType, bathrooms);

    if (apiStrData && apiRentData && apiStrData.length > 0 && apiRentData.length > 0) {
      strData = apiStrData;
      rentData = apiRentData;
      console.log('✅ Using REAL data from Mashvisor API via Edge Function');
    } else {
      console.log('❌ Mashvisor Edge Function failed or returned no data - will show "NA" for all data');
      // Create placeholder data with "NA" indicators
      const cityKey = city.toLowerCase();
      const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Area`];
      
      strData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        revenue: 0 // Will be displayed as "NA"
      }));
      
      rentData = neighborhoods.slice(0, 6).map(neighborhood => ({
        submarket: neighborhood,
        rent: 0 // Will be displayed as "NA"
      }));
    }

    console.log(`📊 ✅ FINAL Market data compilation complete for ${city}:`, {
      strSubmarkets: strData.length,
      rentSubmarkets: rentData.length,
      dataSource: apiStrData && apiRentData && apiStrData.length > 0 ? 'Real Mashvisor API via Edge Function' : 'Mashvisor Edge Function Failed - Showing NA'
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
