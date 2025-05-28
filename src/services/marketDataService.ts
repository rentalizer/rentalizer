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

// Sample data - APARTMENTS ONLY with updated values
const sampleMarketDatabase: Record<string, CityMarketData> = {
  'nashville': {
    strData: [
      { submarket: 'Downtown Nashville Apartments', revenue: 6800 },
      { submarket: 'The Gulch Apartments', revenue: 6200 },
      { submarket: 'East Nashville Apartments', revenue: 5400 },
      { submarket: '12 South Apartments', revenue: 5000 },
      { submarket: 'Midtown Apartments', revenue: 4800 },
      { submarket: 'Music Row Apartments', revenue: 4400 },
      { submarket: 'Germantown Apartments', revenue: 4000 }
    ],
    rentData: [
      { submarket: 'Downtown Nashville Apartments', rent: 2600 },
      { submarket: 'The Gulch Apartments', rent: 2500 },
      { submarket: 'East Nashville Apartments', rent: 2400 },
      { submarket: '12 South Apartments', rent: 2200 },
      { submarket: 'Midtown Apartments', rent: 2300 },
      { submarket: 'Music Row Apartments', rent: 2150 },
      { submarket: 'Germantown Apartments', rent: 2250 }
    ]
  },
  'miami': {
    strData: [
      { submarket: 'Brickell Apartments', revenue: 7200 },
      { submarket: 'Downtown Miami Apartments', revenue: 6800 },
      { submarket: 'Wynwood Apartments', revenue: 5400 },
      { submarket: 'South Beach Apartments', revenue: 8500 },
      { submarket: 'Coral Gables Apartments', revenue: 6200 }
    ],
    rentData: [
      { submarket: 'Brickell Apartments', rent: 3200 },
      { submarket: 'Downtown Miami Apartments', rent: 2900 },
      { submarket: 'Wynwood Apartments', rent: 2400 },
      { submarket: 'South Beach Apartments', rent: 3800 },
      { submarket: 'Coral Gables Apartments', rent: 2800 }
    ]
  },
  'austin': {
    strData: [
      { submarket: 'Downtown Austin Apartments', revenue: 6500 },
      { submarket: 'South Austin Apartments', revenue: 5800 },
      { submarket: 'East Austin Apartments', revenue: 5200 },
      { submarket: 'West Austin Apartments', revenue: 4800 },
      { submarket: 'North Austin Apartments', revenue: 4200 }
    ],
    rentData: [
      { submarket: 'Downtown Austin Apartments', rent: 2800 },
      { submarket: 'South Austin Apartments', rent: 2400 },
      { submarket: 'East Austin Apartments', rent: 2200 },
      { submarket: 'West Austin Apartments', rent: 2000 },
      { submarket: 'North Austin Apartments', rent: 1900 }
    ]
  },
  'denver': {
    strData: [
      { submarket: 'Downtown Denver Apartments', revenue: 5800 },
      { submarket: 'LoDo Apartments', revenue: 5500 },
      { submarket: 'Capitol Hill Apartments', revenue: 4900 },
      { submarket: 'Highlands Apartments', revenue: 4600 },
      { submarket: 'RiNo Apartments', revenue: 4300 }
    ],
    rentData: [
      { submarket: 'Downtown Denver Apartments', rent: 2400 },
      { submarket: 'LoDo Apartments', rent: 2300 },
      { submarket: 'Capitol Hill Apartments', rent: 2100 },
      { submarket: 'Highlands Apartments', rent: 2000 },
      { submarket: 'RiNo Apartments', rent: 1900 }
    ]
  },
  'seattle': {
    strData: [
      { submarket: 'Downtown Seattle Apartments', revenue: 6200 },
      { submarket: 'Capitol Hill Apartments', revenue: 5700 },
      { submarket: 'Belltown Apartments', revenue: 5400 },
      { submarket: 'Fremont Apartments', revenue: 4800 },
      { submarket: 'Ballard Apartments', revenue: 4500 }
    ],
    rentData: [
      { submarket: 'Downtown Seattle Apartments', rent: 2800 },
      { submarket: 'Capitol Hill Apartments', rent: 2600 },
      { submarket: 'Belltown Apartments', rent: 2700 },
      { submarket: 'Fremont Apartments', rent: 2200 },
      { submarket: 'Ballard Apartments', rent: 2100 }
    ]
  }
};

// API Configuration
export interface ApiConfig {
  airdnaApiKey?: string;
  openaiApiKey?: string;
}

// AirDNA API data fetching with improved error handling - APARTMENTS ONLY
export const fetchAirDNAListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`🔍 Fetching AirDNA data for ${city} - APARTMENTS ONLY`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    try {
      console.log(`📡 Using AirDNA Properties API - APARTMENTS ONLY`);
      
      // STRICT apartment-only API endpoint - 2BR/2BA apartments ONLY that accommodate 6 people
      const response = await fetch(`https://airdna1.p.rapidapi.com/properties?location=${encodeURIComponent(city)}&accommodates=6&bedrooms=2&property_type=apartment`, {
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
        
        // Parse AirDNA response format and FILTER for apartments only
        let properties = [];
        if (data.properties) properties = data.properties;
        else if (data.results) properties = data.results;
        else if (data.data) properties = data.data;
        else if (Array.isArray(data)) properties = data;
        
        // Additional filtering to ensure ONLY apartments
        properties = properties.filter((property: any) => {
          const propertyType = (property.property_type || property.type || '').toLowerCase();
          return propertyType.includes('apartment') || propertyType.includes('condo');
        });
        
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
              submarket: `${neighborhood} Apartments`, // Ensure "Apartments" suffix
              revenue: monthlyRevenue
            };
          });
          
          console.log('✅ Processed AirDNA apartment data:', strData);
          return strData;
        } else {
          console.log('⚠️ No apartment properties found in AirDNA response');
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ AirDNA API failed: ${response.status} - ${errorText}`);
        
        if (response.status === 403) {
          console.log('🔄 AirDNA API key needs subscription - falling back to sample data');
          // Don't throw error, fall back to sample data
        } else if (response.status === 429) {
          console.log('⏳ AirDNA rate limit exceeded - falling back to sample data');
        } else if (response.status === 404) {
          console.log('❓ AirDNA location not found - falling back to sample data');
        } else {
          console.log('⚠️ AirDNA API error - falling back to sample data');
        }
      }
    } catch (error) {
      console.error('💥 Error with AirDNA API - falling back to sample apartment data:', error);
    }
  }
  
  // Fallback to sample apartment data (always works)
  console.log('📋 Using sample apartment STR data');
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    console.log(`✅ Found sample apartment data for ${city}`);
    return cityData.strData;
  }
  
  // If no sample data, generate realistic sample data for any city - APARTMENTS ONLY
  console.log(`🎲 Generating sample apartment data for ${city}`);
  return [
    { submarket: `Downtown ${city} Apartments`, revenue: 6200 },
    { submarket: `${city} Center Apartments`, revenue: 5800 },
    { submarket: `Historic ${city} Apartments`, revenue: 5400 },
    { submarket: `${city} Heights Apartments`, revenue: 4900 },
    { submarket: `East ${city} Apartments`, revenue: 4600 },
    { submarket: `West ${city} Apartments`, revenue: 4300 },
    { submarket: `South ${city} Apartments`, revenue: 4000 }
  ];
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
        }
      } else {
        console.log(`⚠️ OpenAI API error: ${response.status} - falling back to sample data`);
      }
    } catch (error) {
      console.error('💥 Error fetching AI rental data - falling back to sample data:', error);
    }
  }
  
  // Fallback to sample data
  console.log('📋 Using sample rental data');
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    return cityData.rentData;
  }
  
  // Generate matching rental data for the submarkets
  return submarkets.map(submarket => ({
    submarket,
    rent: Math.round(2000 + Math.random() * 800) // Random rent between $2000-$2800
  }));
};

// Main market data fetching function - updated with better error handling
export const fetchMarketData = async (city: string, config: ApiConfig = {}): Promise<CityMarketData> => {
  try {
    console.log(`🚀 Starting market analysis for ${city}`);
    console.log(`🔧 API Configuration:`, { 
      hasAirDNAKey: !!config.airdnaApiKey, 
      hasOpenAIKey: !!config.openaiApiKey 
    });
    
    // Fetch STR data using AirDNA API (with fallback to sample data)
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
