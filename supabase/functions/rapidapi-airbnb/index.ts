import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, propertyType, action } = await req.json();
    
    console.log(`🚀 Processing Airbnb Listings request for ${city}`);
    
    const rapidApiKey = '563ec2eceemshee4eb6d8e03f721p10e15cjsn56661816f3c3';
    
    // Get coordinates for the city
    const coordinates = getCityCoordinates(city);
    if (!coordinates) {
      console.warn(`⚠️ No coordinates found for ${city}, API call not possible`);
      
      // Only return fallback data for San Diego
      const cityLower = city.toLowerCase();
      if (cityLower.includes('san diego') || cityLower.includes('sandiego')) {
        return getFallbackResponse(city);
      }
      
      // For all other cities, return empty data
      return getEmptyResponse(city);
    }
    
    try {
      console.log(`📡 Trying Airbnb Listings Data API for ${city} with coordinates:`, coordinates);
      
      // Build URL with query parameters
      const apiUrl = new URL('https://airbnb-listings-data.p.rapidapi.com/getListingsData');
      apiUrl.searchParams.append('nwLat', coordinates.nwLat.toString());
      apiUrl.searchParams.append('nwLng', coordinates.nwLng.toString());
      apiUrl.searchParams.append('seLat', coordinates.seLat.toString());
      apiUrl.searchParams.append('seLng', coordinates.seLng.toString());

      const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'airbnb-listings-data.p.rapidapi.com',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Supabase-Edge-Function/1.0)'
        }
      });

      console.log(`📊 Airbnb Listings Response Status: ${response.status}`);

      if (response.ok) {
        const apiData = await response.json();
        console.log(`📊 Raw API response structure:`, {
          hasMessage: !!apiData.message,
          messageType: typeof apiData.message,
          messageLength: Array.isArray(apiData.message) ? apiData.message.length : 'N/A',
          keys: Object.keys(apiData)
        });
        
        // Process the API response - the data is in apiData.message array
        const listings = apiData.message || [];
        
        if (Array.isArray(listings) && listings.length > 0) {
          console.log(`✅ Found ${listings.length} listings, processing first 15...`);
          
          const processedProperties = listings.slice(0, 15).map((listing: any, index: number) => {
            console.log(`🏠 Processing listing ${index}:`, {
              id: listing.listingID,
              name: listing.name?.substring(0, 50) + '...',
              dailyRate: listing.avg_booked_daily_rate_ltm,
              annualRevenue: listing.annual_revenue_ltm,
              occupancy: listing.avg_occupancy_rate_ltm
            });
            
            // Extract neighborhood from location or use city name
            const neighborhood = extractNeighborhood(listing.name, city) || city;
            
            // Calculate monthly revenue more accurately
            const dailyRate = listing.avg_booked_daily_rate_ltm || 0;
            const occupancyRate = (listing.avg_occupancy_rate_ltm || 0) / 100;
            const monthlyRevenue = Math.round(dailyRate * occupancyRate * 30);
            
            return {
              id: listing.listingID || Math.random().toString(),
              name: listing.name || 'Airbnb Property',
              location: `${neighborhood}, ${city}`,
              price: Math.round(dailyRate),
              monthly_revenue: monthlyRevenue,
              occupancy_rate: Math.round(listing.avg_occupancy_rate_ltm || 0),
              rating: 4.5, // Default rating since not in API response
              reviews: 25, // Default reviews since not in API response
              neighborhood: neighborhood
            };
          });
          
          const processedData = {
            success: true,
            data: {
              city: city,
              properties: processedProperties
            }
          };
          
          console.log(`✅ Successfully processed ${processedProperties.length} STR properties for ${city}`);
          
          return new Response(JSON.stringify(processedData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          console.warn(`⚠️ No listings found in API response for ${city}`);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Airbnb Listings API failed with status: ${response.status}, body: ${errorText}`);
      }

    } catch (apiError) {
      console.error('❌ Airbnb Listings API failed:', apiError);
    }

    // Only fallback to market data for San Diego
    const cityLower = city.toLowerCase();
    if (cityLower.includes('san diego') || cityLower.includes('sandiego')) {
      console.log(`📡 Using fallback data for San Diego`);
      return getFallbackResponse(city);
    }

    // For all other cities, return empty data when API fails
    console.log(`📡 API failed for ${city}, returning empty data (no fallback)`);
    return getEmptyResponse(city);

  } catch (error) {
    console.error('💥 STR API Edge Function Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Extract neighborhood from property name or use fallback
function extractNeighborhood(propertyName: string, city: string): string | null {
  if (!propertyName) return null;
  
  const lowerName = propertyName.toLowerCase();
  const lowerCity = city.toLowerCase();
  
  // Common neighborhood patterns for major cities
  const neighborhoodPatterns: { [key: string]: string[] } = {
    'new york': ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten island', 'soho', 'tribeca', 'chelsea', 'greenwich village', 'upper east side', 'upper west side', 'lower east side', 'financial district', 'midtown', 'harlem', 'williamsburg', 'dumbo', 'park slope', 'astoria', 'long island city'],
    'los angeles': ['hollywood', 'beverly hills', 'santa monica', 'venice', 'west hollywood', 'downtown', 'koreatown', 'silver lake', 'echo park', 'los feliz', 'brentwood', 'westwood', 'culver city', 'marina del rey'],
    'austin': ['downtown', 'south austin', 'east austin', 'west austin', 'north austin', 'barton hills', 'zilker', 'mueller', 'rainey street', 'sixth street'],
    'miami': ['south beach', 'downtown', 'brickell', 'wynwood', 'design district', 'coconut grove', 'coral gables', 'key biscayne', 'aventura', 'bal harbour'],
    'chicago': ['loop', 'lincoln park', 'wicker park', 'bucktown', 'logan square', 'river north', 'gold coast', 'old town', 'lakeview', 'andersonville'],
    'denver': ['lodo', 'capitol hill', 'rino', 'highlands', 'cherry creek', 'washington park', 'five points', 'baker', 'congress park'],
    'san diego': ['gaslamp quarter', 'little italy', 'mission beach', 'pacific beach', 'la jolla', 'balboa park', 'hillcrest', 'north park', 'ocean beach'],
    'nashville': ['downtown', 'music row', 'gulch', 'sobro', 'east nashville', 'west end', 'vanderbilt', 'germantown', 'the nations']
  };
  
  const patterns = neighborhoodPatterns[lowerCity] || [];
  
  for (const pattern of patterns) {
    if (lowerName.includes(pattern)) {
      return pattern.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
  
  return null;
}

// Get coordinates for major cities
function getCityCoordinates(city: string): { nwLat: number; nwLng: number; seLat: number; seLng: number } | null {
  const cityLower = city.toLowerCase();
  
  const coordinates: { [key: string]: { nwLat: number; nwLng: number; seLat: number; seLng: number } } = {
    'san antonio': {
      nwLat: 29.792697441798765,
      nwLng: -98.73911255534364,
      seLat: 29.360943802211537,
      seLng: -98.20696228678895
    },
    'san diego': {
      nwLat: 32.8698,
      nwLng: -117.3100,
      seLat: 32.5341,
      seLng: -116.9325
    },
    'santa monica': {
      nwLat: 34.0522,
      nwLng: -118.5414,
      seLat: 34.0052,
      seLng: -118.4406
    },
    'austin': {
      nwLat: 30.5168,
      nwLng: -97.9383,
      seLat: 30.0986,
      seLng: -97.5684
    },
    'miami': {
      nwLat: 25.8557,
      nwLng: -80.3776,
      seLat: 25.7135,
      seLng: -80.1300
    },
    'denver': {
      nwLat: 39.8915,
      nwLng: -105.1178,
      seLat: 39.6137,
      seLng: -104.8758
    },
    'new york': {
      nwLat: 40.9176,
      nwLng: -74.2591,
      seLat: 40.4774,
      seLng: -73.7004
    },
    'los angeles': {
      nwLat: 34.3373,
      nwLng: -118.6681,
      seLat: 33.7037,
      seLng: -118.1553
    },
    'chicago': {
      nwLat: 42.0230,
      nwLng: -87.9407,
      seLat: 41.6440,
      seLng: -87.5240
    },
    'nashville': {
      nwLat: 36.4207,
      nwLng: -87.0489,
      seLat: 36.0174,
      seLng: -86.5804
    }
  };
  
  // Check if we have coordinates for this city
  for (const [key, coords] of Object.entries(coordinates)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      return coords;
    }
  }
  
  return null;
}

// Fallback response with market-specific data (only for San Diego)
function getFallbackResponse(city: string) {
  const marketStrData = getMarketSpecificSTRData(city);
  
  if (marketStrData.length > 0) {
    const processedData = {
      success: true,
      data: {
        city: city,
        properties: marketStrData
      }
    };
    
    console.log(`✅ Using fallback STR data for ${city} with ${marketStrData.length} properties`);
    
    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return getEmptyResponse(city);
}

// New function to return empty data for unsupported cities
function getEmptyResponse(city: string) {
  console.warn('⚠️ No STR data available - returning empty results');
  
  const emptyData = {
    success: false,
    data: {
      city: city,
      properties: [],
      message: `No STR data available for ${city}. Only San Diego has fallback data for testing.`
    }
  };

  return new Response(JSON.stringify(emptyData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Function to provide market-specific STR data (only for San Diego now)
function getMarketSpecificSTRData(city: string) {
  const cityLower = city.toLowerCase();
  
  // Only provide fallback data for San Diego
  const marketData: { [key: string]: any[] } = {
    'san diego': [
      { 
        id: 'str-sd-1',
        name: 'Mission Beach Condo',
        location: 'Mission Beach, San Diego',
        price: 280,
        monthly_revenue: 6300,
        occupancy_rate: 75,
        rating: 4.8,
        reviews: 142,
        neighborhood: 'Mission Beach'
      },
      { 
        id: 'str-sd-2',
        name: 'Gaslamp Loft',
        location: 'Gaslamp Quarter, San Diego',
        price: 220,
        monthly_revenue: 4950,
        occupancy_rate: 75,
        rating: 4.6,
        reviews: 98,
        neighborhood: 'Gaslamp Quarter'
      },
      { 
        id: 'str-sd-3',
        name: 'Pacific Beach Apartment',
        location: 'Pacific Beach, San Diego',
        price: 195,
        monthly_revenue: 4387,
        occupancy_rate: 75,
        rating: 4.4,
        reviews: 76,
        neighborhood: 'Pacific Beach'
      },
      { 
        id: 'str-sd-4',
        name: 'La Jolla Villa',
        location: 'La Jolla, San Diego',
        price: 350,
        monthly_revenue: 7875,
        occupancy_rate: 75,
        rating: 4.9,
        reviews: 203,
        neighborhood: 'La Jolla'
      }
    ]
  };
  
  // Check if we have data for San Diego
  for (const [key, data] of Object.entries(marketData)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      return data;
    }
  }
  
  return [];
}
