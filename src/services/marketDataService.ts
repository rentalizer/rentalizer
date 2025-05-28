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

// API Configuration - updated for Airdna API
export interface ApiConfig {
  airbnbApiKey?: string; // Now using Airdna professional STR data
  openaiApiKey?: string;
}

// Airdna Professional STR Data API
export const fetchAirbnbListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`🔍 Fetching Airdna STR data for ${city}`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    try {
      console.log(`📡 Step 1: Getting market suggestions for "${city}"`);
      
      // First, get region suggestions to find the market ID
      const regionResponse = await fetch(`https://airdna1.p.rapidapi.com/suggest_market?query=${encodeURIComponent(city)}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Region API response status: ${regionResponse.status}`);

      if (!regionResponse.ok) {
        const errorText = await regionResponse.text();
        console.error(`❌ Airdna region API error: ${regionResponse.status} - ${errorText}`);
        throw new Error(`Airdna region API error: ${regionResponse.status}`);
      }

      const regionData = await regionResponse.json();
      console.log('🏙️ Airdna region data received:', regionData);

      // Extract market ID from the response - try multiple possible locations
      let marketId = null;
      
      if (regionData?.data && Array.isArray(regionData.data) && regionData.data.length > 0) {
        marketId = regionData.data[0]?.market_id || regionData.data[0]?.id;
      } else if (Array.isArray(regionData) && regionData.length > 0) {
        marketId = regionData[0]?.market_id || regionData[0]?.id;
      } else if (regionData?.market_id) {
        marketId = regionData.market_id;
      }
      
      console.log(`🎯 Extracted market ID: ${marketId}`);
      
      if (!marketId) {
        console.error(`❌ No market ID found for ${city} in response:`, regionData);
        throw new Error(`No market found for ${city}`);
      }

      console.log(`📡 Step 2: Getting property listings for market ID: ${marketId}`);

      // Get STR listings data for the market
      const listingsResponse = await fetch(`https://airdna1.p.rapidapi.com/property_listings`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          market_id: marketId,
          bedrooms: 2,
          bathrooms: 2,
          property_type: "apartment",
          room_type: "entire_home",
          limit: 100
        })
      });

      console.log(`📊 Listings API response status: ${listingsResponse.status}`);

      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        console.log('🏠 Airdna listings data received:', listingsData);
        
        // Process the professional STR data
        const processedData = processAirdnaListings(listingsData);
        console.log('✅ Airdna STR data processed successfully:', processedData);
        return processedData;
      } else {
        const errorText = await listingsResponse.text();
        console.error(`❌ Airdna listings API error: ${listingsResponse.status} - ${errorText}`);
        throw new Error(`Airdna listings API error: ${listingsResponse.status}`);
      }
    } catch (error) {
      console.error('💥 Error fetching Airdna data:', error);
      throw error;
    }
  }
  
  console.log('📋 No API key provided, falling back to sample data');
  
  // Fallback to sample data
  const cityKey = city.toLowerCase().trim().replace(/,.*/, ''); // Remove state/country part
  console.log(`🔍 Looking for sample data with key: "${cityKey}"`);
  
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    console.log('✅ Found sample data for', cityKey);
    return cityData.strData;
  }
  
  console.error(`❌ No sample data available for "${cityKey}"`);
  throw new Error(`No STR data available for ${city}`);
};

// Process Airdna professional STR data
const processAirdnaListings = (data: any): StrData[] => {
  console.log('🔄 Processing Airdna listings data...');
  
  const listings = data?.data || data?.listings || data || [];
  console.log(`📊 Found ${listings.length} listings to process`);
  
  if (!Array.isArray(listings) || listings.length === 0) {
    console.log('⚠️ No listings array found or empty array');
    return [];
  }
  
  // Group by neighborhood/submarket and calculate revenue
  const submarketData: { [key: string]: number[] } = {};
  
  listings.forEach((listing: any, index: number) => {
    const neighborhood = listing.neighborhood || listing.submarket || listing.location?.neighborhood || listing.area || `Area ${index + 1}`;
    const monthlyRevenue = listing.revenue_ltm || listing.monthly_revenue || listing.estimated_revenue || listing.revenue || 0;
    
    console.log(`🏠 Listing ${index + 1}: ${neighborhood} - $${monthlyRevenue}`);
    
    if (monthlyRevenue > 0) {
      if (!submarketData[neighborhood]) {
        submarketData[neighborhood] = [];
      }
      submarketData[neighborhood].push(monthlyRevenue);
    }
  });
  
  console.log('🗺️ Submarket groups:', Object.keys(submarketData));
  
  // Calculate top 25% performance for each neighborhood
  const results = Object.entries(submarketData).map(([neighborhood, revenues]) => {
    if (revenues.length === 0) return null;
    
    // Sort revenues and get top 25% average
    const sortedRevenues = revenues.sort((a, b) => b - a);
    const top25PercentCount = Math.max(1, Math.ceil(sortedRevenues.length * 0.25));
    const top25Revenues = sortedRevenues.slice(0, top25PercentCount);
    const averageTopRevenue = top25Revenues.reduce((sum, rev) => sum + rev, 0) / top25Revenues.length;
    
    console.log(`📈 ${neighborhood}: ${revenues.length} listings, top 25% avg: $${Math.round(averageTopRevenue)}`);
    
    return {
      submarket: neighborhood,
      revenue: Math.round(averageTopRevenue)
    };
  }).filter((item): item is StrData => item !== null && item.revenue > 0);
  
  console.log(`✅ Processed ${results.length} submarkets`);
  return results;
};

// AI-powered rental data fetching (unchanged)
export const fetchRentalDataWithAI = async (city: string, submarkets: string[], apiKey?: string): Promise<RentData[]> => {
  console.log(`🤖 Fetching rental data for ${city} submarkets using AI`);
  
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
          console.log('✅ AI rental data fetched successfully:', rentData);
          return rentData;
        } catch (parseError) {
          console.error('❌ Failed to parse AI response as JSON:', content);
          throw new Error('Invalid AI response format');
        }
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    } catch (error) {
      console.error('💥 Error fetching AI rental data:', error);
      throw error;
    }
  }
  
  // Fallback to sample data
  const cityKey = city.toLowerCase().trim().replace(/,.*/, ''); // Remove state/country part
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.rentData;
  }
  
  throw new Error(`No rental data available for ${city}`);
};

// Main market data fetching function - updated for Airdna
export const fetchMarketData = async (city: string, config: ApiConfig = {}): Promise<CityMarketData> => {
  try {
    console.log(`🚀 Starting market analysis for ${city}`);
    console.log(`🔧 API Configuration:`, { 
      hasAirdnaKey: !!config.airbnbApiKey, 
      hasOpenAIKey: !!config.openaiApiKey 
    });
    
    // Fetch STR data using professional Airdna API
    const strData = await fetchAirbnbListingsData(city, config.airbnbApiKey);
    
    // Extract submarket names for rental data lookup
    const submarkets = strData.map(item => item.submarket);
    console.log(`🏘️ Found submarkets: ${submarkets.join(', ')}`);
    
    // Fetch rental data using AI or fallback
    const rentData = await fetchRentalDataWithAI(city, submarkets, config.openaiApiKey);
    
    console.log(`✅ Market analysis complete for ${city}`);
    return { strData, rentData };
    
  } catch (error) {
    console.error(`💥 Error fetching market data for ${city}:`, error);
    throw error;
  }
};
