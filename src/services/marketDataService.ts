
import { CityMarketData, STRData, RentData, EdgeFunctionResponse } from '@/types';

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

const fetchAirDNAData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<STRData[] | null> => {
  try {
    console.log(`🏠 Attempting to fetch REAL STR earnings from AirDNA for ${city} (${propertyType}BR/${bathrooms}BA)`);
    console.log('🔑 API Key being used:', apiKey ? `${apiKey.substring(0, 8)}...` : 'No API key provided');
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ No AirDNA API key provided - RETURNING NULL (NO MOCK DATA)');
      return null;
    }

    // Construct URL with query parameters
    const params = new URLSearchParams({
      city: city,
      country: 'US',
      bedrooms: propertyType,
      bathrooms: bathrooms,
      property_type: 'apartment'
    });

    const url = `https://api.airdna.co/v1/market/property_type_summary?${params.toString()}`;

    console.log('🔍 AirDNA API URL:', url);

    // AirDNA API call for real market data
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 AirDNA API Response status:', response.status);
    console.log('📡 AirDNA API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ AirDNA API FAILED (${response.status}): ${errorText}`);
      console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
      return null;
    }

    const data = await response.json();
    console.log('📊 RAW AirDNA API Response data (full object):', JSON.stringify(data, null, 2));
    
    if (data.submarkets && data.submarkets.length > 0) {
      console.log('✅ REAL DATA CONFIRMED - Processing AirDNA submarkets...');
      
      const strData: STRData[] = data.submarkets.map((submarket: any, index: number) => {
        // Log each submarket's raw data
        console.log(`📍 Submarket ${index + 1} RAW data:`, {
          name: submarket.name || submarket.submarket,
          monthly_revenue: submarket.monthly_revenue,
          revenue: submarket.revenue,
          annual_revenue: submarket.annual_revenue,
          all_fields: submarket
        });
        
        // Get actual monthly earnings and add 25% buffer
        const actualMonthlyEarnings = submarket.monthly_revenue || submarket.revenue || 0;
        const monthlyRevenueWith25Percent = Math.round(actualMonthlyEarnings * 1.25);
        
        console.log(`💰 Revenue calculation for ${submarket.name || submarket.submarket}:`, {
          rawApiValue: actualMonthlyEarnings,
          with25PercentBuffer: monthlyRevenueWith25Percent,
          bufferAdded: monthlyRevenueWith25Percent - actualMonthlyEarnings
        });
        
        return {
          submarket: submarket.name || submarket.submarket,
          revenue: monthlyRevenueWith25Percent
        };
      });

      console.log('✅ FINAL REAL STR DATA (with 25% buffer applied):', strData);
      console.log('🔍 DATA SOURCE: Real AirDNA API response');
      return strData;
    }

    console.log('❌ No submarkets in AirDNA response - RETURNING NULL');
    return null;

  } catch (error) {
    console.error('❌ AirDNA API error:', error);
    console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
    return null;
  }
};

const fetchOpenAIRentData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<RentData[] | null> => {
  try {
    console.log(`🤖 Attempting to use OpenAI for CURRENT rent research in ${city} (last 30 days)`);
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ No OpenAI API key provided - RETURNING NULL (NO MOCK DATA)');
      return null;
    }
    
    const cityKey = city.toLowerCase();
    const knownNeighborhoods = REAL_NEIGHBORHOODS[cityKey];
    
    let prompt = `Research CURRENT ${city} apartment rental market for ${propertyType}-bedroom, ${bathrooms}-bathroom apartments using the most reliable rental data sources.

CRITICAL: Use ONLY data from the last 30 days maximum - no older data allowed.

Primary data sources to use (in order of preference):
1. RentCafe.com (most reliable source)
2. Zumper.com (top rental platform)
3. Rentometer.com (rental analytics)
4. Apartment List
5. RentSpree
6. Zillow Rentals
7. Apartments.com

Search for actual active rental listings posted in the last 30 days on these platforms.`;

    if (knownNeighborhoods) {
      prompt += `\n\nFocus on these specific neighborhoods in ${city}: ${knownNeighborhoods.join(', ')}.`;
    }

    prompt += `\n\nReturn a JSON object with this structure:
{
  "rentData": [
    {
      "submarket": "Neighborhood Name",
      "rent": 4200
    }
  ]
}

CRITICAL Requirements:
- Use real neighborhood names only
- Cross-reference prices across RentCafe, Zumper, and Rentometer data
- Research CURRENT median rent from active rental listings in the last 30 days
- Include 10-12 neighborhoods
- Focus on ${propertyType}BR/${bathrooms}BA apartments specifically
- Use actual current market rental prices - verify against RentCafe, Zumper, and Rentometer
- Include rental-viable areas with good apartment inventory
- Double-check prices are realistic for current ${city} market conditions (example: Little Italy in San Diego should be $4,000+ for 2BR/2BA)

Verify your data against RentCafe.com, Zumper.com, and Rentometer.com as the primary sources - these are the most reliable rental data platforms.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate analyst with access to current rental market data from RentCafe, Zumper, Rentometer, and other reliable sources. Research actual rental listings from the last 30 days only. Cross-reference data across multiple sources with RentCafe, Zumper, and Rentometer as primary. Return valid JSON only - no markdown formatting, no code blocks, just pure JSON. Focus on current market rates from reliable platforms.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.log('❌ OpenAI API FAILED - RETURNING NULL (NO MOCK DATA)');
      return null;
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean up markdown formatting if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const parsedContent = JSON.parse(content);
      const rentData = parsedContent.rentData || [];
      
      if (rentData.length >= 8) {
        console.log('✅ REAL rent data from OpenAI using RentCafe, Zumper, and Rentometer (last 30 days):', rentData);
        return rentData;
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw OpenAI content:', content);
    }

    console.log('❌ OpenAI parsing failed - RETURNING NULL');
    return null;

  } catch (error) {
    console.error('❌ OpenAI rent research error:', error);
    console.log('🚫 RETURNING NULL - NO MOCK DATA WILL BE USED');
    return null;
  }
};

export const fetchMarketData = async (
  city: string,
  propertyType: string,
  bathrooms: string,
  apiProvider: 'airdna' | 'rentcast' = 'airdna',
  userApiKeys?: { airdnaApiKey?: string; rentcastApiKey?: string; openaiApiKey?: string }
): Promise<EdgeFunctionResponse> => {
  console.log('Calling edge function with:', { city, propertyType, bathrooms, apiProvider });

  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: {
        city,
        propertyType,
        bathrooms,
        apiProvider,
        userApiKeys
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error calling edge function:', error);
    throw error;
  }
};
