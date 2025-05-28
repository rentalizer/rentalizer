
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

// API Configuration
export interface ApiConfig {
  airbnbApiKey?: string;
  openaiApiKey?: string;
}

// Airbnb Search API - Updated with more reliable endpoints
export const fetchAirbnbListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`🔍 Fetching Airbnb Search data for ${city}`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    // More common RapidAPI endpoint patterns for Airbnb APIs
    const endpoints = [
      // Most common pattern for RapidAPI Airbnb APIs
      `https://airbnb-search.p.rapidapi.com/search`,
      `https://airbnb-search.p.rapidapi.com/listings`,
      `https://airbnb-search.p.rapidapi.com/properties`,
      // Alternative patterns
      `https://airbnb-search.p.rapidapi.com/api/search`,
      `https://airbnb-search.p.rapidapi.com/v1/search`,
      // Simple test endpoint
      `https://airbnb-search.p.rapidapi.com/`
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying endpoint: ${endpoint}`);
        
        // Try different parameter formats
        const searchParams = new URLSearchParams({
          location: city,
          checkin: '2024-06-01',
          checkout: '2024-06-07',
          adults: '2',
          room_type: 'Entire home/apt',
          property_type: 'Apartment',
          min_bedrooms: '2'
        });

        const urlWithParams = `${endpoint}?${searchParams.toString()}`;
        console.log(`🔗 Full URL: ${urlWithParams}`);
        
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'airbnb-search.p.rapidapi.com',
            'Content-Type': 'application/json'
          }
        });

        console.log(`📊 Response status for ${endpoint}: ${response.status}`);
        console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Response received! Structure:', Object.keys(data));
          console.log('🔍 First few items:', JSON.stringify(data, null, 2).substring(0, 500));
          
          // Try to extract listings from different possible response structures
          let listings = [];
          if (data.listings) listings = data.listings;
          else if (data.results) listings = data.results;
          else if (data.data) listings = data.data;
          else if (Array.isArray(data)) listings = data;
          else if (data.search_results) listings = data.search_results;
          
          console.log(`📈 Found ${listings.length} listings`);
          
          if (listings.length > 0) {
            // Convert API response to our format
            const strData = listings.slice(0, 10).map((listing: any, index: number) => {
              // Try different price field names
              let price = listing.price || listing.nightly_price || listing.rate || listing.cost || 150;
              if (typeof price === 'string') {
                price = parseInt(price.replace(/[^0-9]/g, '')) || 150;
              }
              
              // Estimate monthly revenue (price * 20 days average occupancy)
              const monthlyRevenue = price * 20;
              
              return {
                submarket: listing.neighborhood || listing.area || listing.location || `${city} Area ${index + 1}`,
                revenue: monthlyRevenue
              };
            });
            
            console.log('✅ Successfully converted API data:', strData);
            return strData;
          }
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint ${endpoint} failed: ${response.status} - ${errorText}`);
          
          // Check for specific error messages
          if (response.status === 403) {
            console.log('🔒 403 error - checking subscription details...');
          } else if (response.status === 429) {
            console.log('⏰ Rate limit hit');
          }
        }
      } catch (error) {
        console.log(`💥 Error with endpoint ${endpoint}:`, error);
      }
    }
    
    // If all endpoints fail, provide helpful error message
    console.log('❌ All endpoints failed. Checking API subscription...');
    throw new Error(`
      Unable to connect to Airbnb Search API. This could be because:
      
      1. The API endpoint URL has changed
      2. Your subscription needs to be activated (sometimes takes a few minutes)
      3. The API requires different parameters
      4. You may need to subscribe to a different Airbnb API
      
      Try refreshing the page in a few minutes, or check RapidAPI for other Airbnb APIs.
      Using sample data for now.
    `);
  }
  
  console.log('📋 No API key provided, falling back to sample data');
  
  // Fallback to sample data
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  console.log(`🔍 Looking for sample data with key: "${cityKey}"`);
  
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    console.log('✅ Found sample data for', cityKey);
    return cityData.strData;
  }
  
  console.error(`❌ No sample data available for "${cityKey}"`);
  throw new Error(`No STR data available for ${city}`);
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

// Main market data fetching function - updated for Airbnb Search API
export const fetchMarketData = async (city: string, config: ApiConfig = {}): Promise<CityMarketData> => {
  try {
    console.log(`🚀 Starting market analysis for ${city}`);
    console.log(`🔧 API Configuration:`, { 
      hasAirbnbKey: !!config.airbnbApiKey, 
      hasOpenAIKey: !!config.openaiApiKey 
    });
    
    // Fetch STR data using Airbnb Search API
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
