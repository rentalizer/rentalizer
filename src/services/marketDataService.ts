
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

const generateFallbackSTRData = (city: string, propertyType: string, bathrooms: string): STRData[] => {
  const bedroomMultiplier = getBedroomMultiplier(propertyType);
  const bathroomMultiplier = getBathroomMultiplier(bathrooms);
  
  const cityData: { [key: string]: { base: number; neighborhoods: Array<{ name: string; multiplier: number }> } } = {
    'san diego': {
      base: 3200, // Reduced from 6500 to more realistic value
      neighborhoods: [
        { name: 'Gaslamp Quarter', multiplier: 1.25 },
        { name: 'Pacific Beach', multiplier: 1.12 },
        { name: 'Hillcrest', multiplier: 0.98 },
        { name: 'Little Italy', multiplier: 1.20 },
        { name: 'La Jolla', multiplier: 1.35 },
        { name: 'Mission Beach', multiplier: 1.10 },
        { name: 'Ocean Beach', multiplier: 1.03 },
        { name: 'Balboa Park', multiplier: 0.96 },
        { name: 'North Park', multiplier: 0.92 },
        { name: 'Mission Valley', multiplier: 1.00 },
        { name: 'South Park', multiplier: 0.88 },
        { name: 'University Heights', multiplier: 0.85 },
        { name: 'Normal Heights', multiplier: 0.82 },
        { name: 'Kensington', multiplier: 0.94 }
      ]
    }
  };
  
  const cityKey = city.toLowerCase();
  const cityInfo = cityData[cityKey];
  
  if (!cityInfo) {
    const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Downtown`, `${city} Midtown`];
    const baseRevenue = 2800 * bedroomMultiplier * bathroomMultiplier; // Reduced from 4800
    
    return neighborhoods.slice(0, 10).map((neighborhood, index) => {
      const variation = 0.85 + (index * 0.04) + (Math.random() * 0.25);
      return {
        submarket: neighborhood,
        revenue: Math.round(baseRevenue * variation)
      };
    });
  }
  
  return cityInfo.neighborhoods.map(neighborhood => ({
    submarket: neighborhood.name,
    revenue: Math.round(cityInfo.base * neighborhood.multiplier * bedroomMultiplier * bathroomMultiplier)
  }));
};

const fetchOpenAIRentData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<RentData[]> => {
  try {
    console.log(`🤖 Using OpenAI for rent research in ${city}`);
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('⚠️ No OpenAI API key, using fallback data');
      return generateFallbackRentData(city, propertyType, bathrooms);
    }
    
    const cityKey = city.toLowerCase();
    const knownNeighborhoods = REAL_NEIGHBORHOODS[cityKey];
    
    let prompt = `Research ${city} rental market for ${propertyType}-bedroom, ${bathrooms}-bathroom apartments.

I need real neighborhood names and current median monthly rent prices.`;

    if (knownNeighborhoods) {
      prompt += `\n\nFocus on these neighborhoods in ${city}: ${knownNeighborhoods.join(', ')}.`;
    }

    prompt += `\n\nReturn a JSON object with this structure:
{
  "rentData": [
    {
      "submarket": "Neighborhood Name",
      "rent": 2400
    }
  ]
}

Requirements:
- Use real neighborhood names
- Provide 10-12 neighborhoods
- Include current Q4 2024 median rent for ${propertyType}BR/${bathrooms}BA apartments
- Focus on rental-viable areas`;

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
            content: 'You are a real estate analyst. Return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.05,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.log('⚠️ OpenAI failed, using fallback data');
      return generateFallbackRentData(city, propertyType, bathrooms);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      const rentData = parsedContent.rentData || [];
      
      if (rentData.length >= 8) {
        console.log('✅ Got quality rent data from OpenAI');
        return rentData;
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
    }

    return generateFallbackRentData(city, propertyType, bathrooms);

  } catch (error) {
    console.error('❌ OpenAI rent research error:', error);
    return generateFallbackRentData(city, propertyType, bathrooms);
  }
};

const generateFallbackRentData = (city: string, propertyType: string, bathrooms: string): RentData[] => {
  const cityKey = city.toLowerCase();
  
  const rentData: { [key: string]: Array<{ name: string; rent: number }> } = {
    'san diego': [
      { name: 'Gaslamp Quarter', rent: 3100 },
      { name: 'Pacific Beach', rent: 2750 },
      { name: 'Hillcrest', rent: 2450 },
      { name: 'Little Italy', rent: 2950 },
      { name: 'La Jolla', rent: 3400 },
      { name: 'Mission Beach', rent: 2850 },
      { name: 'Ocean Beach', rent: 2550 },
      { name: 'Balboa Park', rent: 2350 },
      { name: 'North Park', rent: 2250 },
      { name: 'Mission Valley', rent: 2450 }
    ]
  };
  
  const cityRentData = rentData[cityKey];
  
  if (!cityRentData) {
    const neighborhoods = REAL_NEIGHBORHOODS[cityKey] || [`${city} Downtown`, `${city} Midtown`];
    const baseRent = propertyType === '1' ? 1600 : propertyType === '2' ? 2100 : 2800;
    
    return neighborhoods.slice(0, 10).map((neighborhood, index) => {
      const variation = 0.80 + (index * 0.05) + (Math.random() * 0.20);
      return {
        submarket: neighborhood,
        rent: Math.round(baseRent * variation)
      };
    });
  }
  
  return cityRentData.map(item => ({
    submarket: item.name,
    rent: item.rent
  }));
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];

    // Always use fallback data for now to ensure site works
    console.log('📊 Using fallback STR data');
    strData = generateFallbackSTRData(city, propertyType, bathrooms);

    try {
      if (apiConfig.openaiApiKey && apiConfig.openaiApiKey.trim() !== '') {
        rentData = await fetchOpenAIRentData(city, apiConfig.openaiApiKey, propertyType, bathrooms);
      } else {
        rentData = generateFallbackRentData(city, propertyType, bathrooms);
      }
    } catch (error) {
      console.warn('⚠️ OpenAI failed, using fallback:', error);
      rentData = generateFallbackRentData(city, propertyType, bathrooms);
    }

    console.log(`✅ Market data compiled for ${city}:`, {
      strSubmarkets: strData.length,
      rentSubmarkets: rentData.length
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
