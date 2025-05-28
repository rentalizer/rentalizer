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
  airdnaApiKey?: string;
  openaiApiKey?: string;
}

// AirDNA API data fetching
export const fetchAirDNAListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`🔍 Fetching AirDNA data for ${city}`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    try {
      console.log(`📡 Using AirDNA Properties API`);
      
      // AirDNA API endpoint
      const response = await fetch(`https://airdna1.p.rapidapi.com/properties?location=${encodeURIComponent(city)}&accommodates=4&bedrooms=2&property_type=entire_home`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 AirDNA Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AirDNA API Response received!', data);
        
        // Parse AirDNA response format
        let properties = [];
        if (data.properties) properties = data.properties;
        else if (data.results) properties = data.results;
        else if (data.data) properties = data.data;
        else if (Array.isArray(data)) properties = data;
        
        if (properties.length > 0) {
          const strData = properties.slice(0, 15).map((property: any, index: number) => {
            // Extract revenue/pricing data from AirDNA format
            let monthlyRevenue = 0;
            
            if (property.revenue) {
              monthlyRevenue = property.revenue;
            } else if (property.monthly_revenue) {
              monthlyRevenue = property.monthly_revenue;
            } else if (property.adr && property.occupancy) {
              // Calculate from ADR (Average Daily Rate) and occupancy
              const adr = typeof property.adr === 'string' ? parseFloat(property.adr.replace(/[^0-9.]/g, '')) : property.adr;
              const occupancy = typeof property.occupancy === 'string' ? parseFloat(property.occupancy.replace(/[^0-9.]/g, '')) / 100 : property.occupancy;
              monthlyRevenue = Math.round(adr * 30 * occupancy);
            } else if (property.price) {
              // Estimate from nightly price
              const price = typeof property.price === 'string' ? parseFloat(property.price.replace(/[^0-9.]/g, '')) : property.price;
              monthlyRevenue = Math.round(price * 20); // Assume 65% occupancy
            } else {
              monthlyRevenue = 4500 + (index * 200); // Fallback with variation
            }
            
            const neighborhood = property.neighborhood || 
                               property.market || 
                               property.area || 
                               property.district ||
                               `${city} Area ${index + 1}`;
            
            return {
              submarket: neighborhood,
              revenue: monthlyRevenue
            };
          });
          
          console.log('✅ Processed AirDNA data:', strData);
          return strData;
        } else {
          console.log('⚠️ No properties found in AirDNA response');
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ AirDNA API failed: ${response.status} - ${errorText}`);
        
        if (response.status === 403) {
          throw new Error(`AirDNA API Access Denied (403): Check your subscription status or API key permissions.`);
        } else if (response.status === 429) {
          throw new Error(`AirDNA Rate Limit Exceeded (429): You've exceeded your free tier limits.`);
        } else if (response.status === 404) {
          throw new Error(`AirDNA API Error (404): Location "${city}" not found or endpoint unavailable.`);
        } else {
          throw new Error(`AirDNA API Error (${response.status}): ${errorText}`);
        }
      }
    } catch (error) {
      console.error('💥 Error with AirDNA API:', error);
      throw error;
    }
  }
  
  // Fallback to sample data
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.strData;
  }
  
  throw new Error(`No sample data available for ${city}. Try: Nashville, Miami, or Austin.`);
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
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.rentData;
  }
  
  throw new Error(`No rental data available for ${city}`);
};

// Main market data fetching function - updated for AirDNA API
export const fetchMarketData = async (city: string, config: ApiConfig = {}): Promise<CityMarketData> => {
  try {
    console.log(`🚀 Starting market analysis for ${city}`);
    console.log(`🔧 API Configuration:`, { 
      hasAirDNAKey: !!config.airdnaApiKey, 
      hasOpenAIKey: !!config.openaiApiKey 
    });
    
    // Fetch STR data using AirDNA API
    const strData = await fetchAirDNAListingsData(city, config.airdnaApiKey);
    
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
