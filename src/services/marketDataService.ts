interface StrData {
  submarket: string;
  revenue: number;
}

interface RentData {
  submarket: string;
  rent: number;
}

interface CityMarketData {
  strData: StrData[];
  rentData: RentData[];
}

// Sample data - will be replaced with real API calls
const sampleMarketDatabase: Record<string, CityMarketData> = {
  'nashville': {
    strData: [
      { submarket: 'Downtown', revenue: 6794 },
      { submarket: 'The Gulch', revenue: 6000 },
      { submarket: 'East Nashville', revenue: 5200 },
      { submarket: '12 South', revenue: 4800 },
      { submarket: 'Midtown', revenue: 4640 },
      { submarket: 'Music Row', revenue: 4200 },
      { submarket: 'Germantown', revenue: 3800 }
    ],
    rentData: [
      { submarket: 'Downtown', rent: 2513 },
      { submarket: 'The Gulch', rent: 2456 },
      { submarket: 'East Nashville', rent: 2307 },
      { submarket: '12 South', rent: 2136 },
      { submarket: 'Midtown', rent: 2272 },
      { submarket: 'Music Row', rent: 2100 },
      { submarket: 'Germantown', rent: 2200 }
    ]
  },
  'miami': {
    strData: [
      { submarket: 'Brickell', revenue: 7200 },
      { submarket: 'South Beach', revenue: 8500 },
      { submarket: 'Downtown Miami', revenue: 6800 },
      { submarket: 'Wynwood', revenue: 5400 },
      { submarket: 'Coral Gables', revenue: 6200 }
    ],
    rentData: [
      { submarket: 'Brickell', rent: 3200 },
      { submarket: 'South Beach', rent: 3800 },
      { submarket: 'Downtown Miami', rent: 2900 },
      { submarket: 'Wynwood', rent: 2400 },
      { submarket: 'Coral Gables', rent: 2800 }
    ]
  },
  'austin': {
    strData: [
      { submarket: 'Downtown Austin', revenue: 6500 },
      { submarket: 'South Austin', revenue: 5800 },
      { submarket: 'East Austin', revenue: 5200 },
      { submarket: 'West Austin', revenue: 4800 },
      { submarket: 'North Austin', revenue: 4200 }
    ],
    rentData: [
      { submarket: 'Downtown Austin', rent: 2800 },
      { submarket: 'South Austin', rent: 2400 },
      { submarket: 'East Austin', rent: 2200 },
      { submarket: 'West Austin', rent: 2000 },
      { submarket: 'North Austin', rent: 1900 }
    ]
  }
};

// API Configuration - updated with affordable alternatives
export interface ApiConfig {
  airbnbApiKey?: string; // Airbnb public listings data
  openaiApiKey?: string;
  mashapeKey?: string;   // RapidAPI marketplace
}

// Airbnb Public Listings API (much more affordable alternative)
export const fetchAirbnbListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`Fetching Airbnb listings data for ${city}`);
  
  if (apiKey) {
    try {
      // Using RapidAPI's Airbnb listings endpoints (much cheaper ~$10-50/month)
      const response = await fetch(`https://airbnb-listings.p.rapidapi.com/v2/listingsByCity`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'airbnb-listings.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: city,
          country: 'United States',
          property_type: 'Apartment',
          room_type: 'Entire home/apt',
          bedrooms: 2,
          bathrooms: 2
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Process the listings to estimate revenue by neighborhood
        const processedData = processAirbnbListings(data);
        console.log('Airbnb listings data fetched successfully');
        return processedData;
      } else {
        throw new Error(`Airbnb API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching Airbnb listings:', error);
      throw error;
    }
  }
  
  // Fallback to sample data for now
  const cityKey = city.toLowerCase().trim();
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.strData;
  }
  
  throw new Error(`No STR data available for ${city}`);
};

// Process Airbnb listings to estimate revenue
const processAirbnbListings = (listings: any[]): StrData[] => {
  // Group by neighborhood and calculate estimated monthly revenue
  const neighborhoodData: { [key: string]: number[] } = {};
  
  listings.forEach(listing => {
    const neighborhood = listing.neighborhood || listing.location?.neighborhood || 'Unknown';
    const dailyRate = listing.price?.amount || 0;
    
    // Estimate monthly revenue: daily_rate * 22 days (70% occupancy)
    const monthlyRevenue = dailyRate * 22;
    
    if (!neighborhoodData[neighborhood]) {
      neighborhoodData[neighborhood] = [];
    }
    neighborhoodData[neighborhood].push(monthlyRevenue);
  });
  
  // Calculate median revenue per neighborhood
  return Object.entries(neighborhoodData).map(([neighborhood, revenues]) => {
    const sortedRevenues = revenues.sort((a, b) => a - b);
    const median = sortedRevenues[Math.floor(sortedRevenues.length / 2)];
    
    return {
      submarket: neighborhood,
      revenue: Math.round(median)
    };
  }).filter(item => item.revenue > 0);
};

// AI-powered rental data fetching (unchanged)
export const fetchRentalDataWithAI = async (city: string, submarkets: string[], apiKey?: string): Promise<RentData[]> => {
  console.log(`Fetching rental data for ${city} submarkets using AI`);
  
  if (apiKey) {
    try {
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
              content: 'You are a real estate data expert. Provide current median rent data for 2BR/2BA apartments in specific submarkets. Return data in JSON format with exact submarket names and monthly rent amounts.'
            },
            {
              role: 'user',
              content: `Find current median monthly rent for 2BR/2BA apartments in these ${city} submarkets: ${submarkets.join(', ')}. Return as JSON array with format: [{"submarket": "exact name", "rent": number}]`
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          const rentData = JSON.parse(content);
          console.log('AI rental data fetched successfully:', rentData);
          return rentData;
        } catch (parseError) {
          console.error('Failed to parse AI response as JSON:', content);
          throw new Error('Invalid AI response format');
        }
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching AI rental data:', error);
      throw error;
    }
  }
  
  // Fallback to sample data
  const cityKey = city.toLowerCase().trim();
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.rentData;
  }
  
  throw new Error(`No rental data available for ${city}`);
};

// Main market data fetching function - updated
export const fetchMarketData = async (city: string, config: ApiConfig = {}): Promise<CityMarketData> => {
  try {
    console.log(`Fetching market data for ${city}...`);
    
    // Fetch STR data using affordable alternative
    const strData = await fetchAirbnbListingsData(city, config.airbnbApiKey);
    
    // Extract submarket names for rental data lookup
    const submarkets = strData.map(item => item.submarket);
    
    // Fetch rental data using AI or fallback
    const rentData = await fetchRentalDataWithAI(city, submarkets, config.openaiApiKey);
    
    return { strData, rentData };
    
  } catch (error) {
    console.error(`Error fetching market data for ${city}:`, error);
    throw error;
  }
};
