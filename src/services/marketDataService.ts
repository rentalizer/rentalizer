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

// Sample data - ACTUAL NEIGHBORHOOD SUBMARKETS with updated values
const sampleMarketDatabase: Record<string, CityMarketData> = {
  'nashville': {
    strData: [
      { submarket: 'Downtown Nashville', revenue: 6800 },
      { submarket: 'The Gulch', revenue: 6200 },
      { submarket: 'East Nashville', revenue: 5400 },
      { submarket: '12 South', revenue: 5000 },
      { submarket: 'Midtown', revenue: 4800 },
      { submarket: 'Music Row', revenue: 4400 },
      { submarket: 'Germantown', revenue: 4000 }
    ],
    rentData: [
      { submarket: 'Downtown Nashville', rent: 2600 },
      { submarket: 'The Gulch', rent: 2500 },
      { submarket: 'East Nashville', rent: 2400 },
      { submarket: '12 South', rent: 2200 },
      { submarket: 'Midtown', rent: 2300 },
      { submarket: 'Music Row', rent: 2150 },
      { submarket: 'Germantown', rent: 2250 }
    ]
  },
  'miami': {
    strData: [
      { submarket: 'Brickell', revenue: 5800 },
      { submarket: 'Downtown Miami', revenue: 5200 },
      { submarket: 'Wynwood', revenue: 4600 },
      { submarket: 'South Beach', revenue: 6400 },
      { submarket: 'Coral Gables', revenue: 4800 }
    ],
    rentData: [
      { submarket: 'Brickell', rent: 2600 },
      { submarket: 'Downtown Miami', rent: 2400 },
      { submarket: 'Wynwood', rent: 2000 },
      { submarket: 'South Beach', rent: 2800 },
      { submarket: 'Coral Gables', rent: 2200 }
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
  },
  'denver': {
    strData: [
      { submarket: 'Downtown Denver', revenue: 5800 },
      { submarket: 'LoDo', revenue: 5500 },
      { submarket: 'Capitol Hill', revenue: 4900 },
      { submarket: 'Highlands', revenue: 4600 },
      { submarket: 'RiNo', revenue: 4300 }
    ],
    rentData: [
      { submarket: 'Downtown Denver', rent: 2400 },
      { submarket: 'LoDo', rent: 2300 },
      { submarket: 'Capitol Hill', rent: 2100 },
      { submarket: 'Highlands', rent: 2000 },
      { submarket: 'RiNo', rent: 1900 }
    ]
  },
  'seattle': {
    strData: [
      { submarket: 'Downtown Seattle', revenue: 6200 },
      { submarket: 'Capitol Hill', revenue: 5700 },
      { submarket: 'Belltown', revenue: 5400 },
      { submarket: 'Fremont', revenue: 4800 },
      { submarket: 'Ballard', revenue: 4500 }
    ],
    rentData: [
      { submarket: 'Downtown Seattle', rent: 2800 },
      { submarket: 'Capitol Hill', rent: 2600 },
      { submarket: 'Belltown', rent: 2700 },
      { submarket: 'Fremont', rent: 2200 },
      { submarket: 'Ballard', rent: 2100 }
    ]
  },
  'san diego': {
    strData: [
      { submarket: 'Gaslamp Quarter', revenue: 7200 },
      { submarket: 'Little Italy', revenue: 6800 },
      { submarket: 'Pacific Beach', revenue: 6400 },
      { submarket: 'Mission Beach', revenue: 6000 },
      { submarket: 'Hillcrest', revenue: 5600 },
      { submarket: 'North Park', revenue: 5200 },
      { submarket: 'Mission Valley', revenue: 4800 }
    ],
    rentData: [
      { submarket: 'Gaslamp Quarter', rent: 2900 },
      { submarket: 'Little Italy', rent: 2800 },
      { submarket: 'Pacific Beach', rent: 2600 },
      { submarket: 'Mission Beach', rent: 2500 },
      { submarket: 'Hillcrest', rent: 2300 },
      { submarket: 'North Park', rent: 2200 },
      { submarket: 'Mission Valley', rent: 2100 }
    ]
  }
};

// API Configuration
export interface ApiConfig {
  airdnaApiKey?: string;
  openaiApiKey?: string;
}

// AirDNA Market Data API - using market data endpoint instead of individual listings
export const fetchAirDNAListingsData = async (city: string, apiKey?: string): Promise<StrData[]> => {
  console.log(`🔍 Fetching AirDNA MARKET data for ${city} - APARTMENTS ONLY`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    try {
      console.log(`📡 Using AirDNA Market Data API - APARTMENTS ONLY`);
      
      // Try AirDNA market data endpoint first (more appropriate for market analysis)
      const marketResponse = await fetch(`https://airdna1.p.rapidapi.com/market?location=${encodeURIComponent(city)}&property_type=apartment&bedrooms=2`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 AirDNA Market Response status: ${marketResponse.status}`);
      
      if (marketResponse.ok) {
        const marketData = await marketResponse.json();
        console.log('✅ AirDNA Market API Response received!', marketData);
        
        // Parse market data response format - focus on immediate neighborhood only
        let submarkets = [];
        if (marketData.submarkets) submarkets = marketData.submarkets;
        else if (marketData.neighborhoods) submarkets = marketData.neighborhoods;
        else if (marketData.areas) submarkets = marketData.areas;
        else if (marketData.data) submarkets = marketData.data;
        else if (Array.isArray(marketData)) submarkets = marketData;
        
        if (submarkets.length > 0) {
          // Extract the specific neighborhood from the address
          const addressParts = city.toLowerCase().split(',');
          const streetAddress = addressParts[0] || '';
          const cityName = addressParts[1]?.trim() || '';
          
          const strData = submarkets.slice(0, 10)
            .filter((submarket: any) => {
              const name = submarket.name || submarket.neighborhood || submarket.area || submarket.submarket || '';
              const lowerName = name.toLowerCase();
              
              // Only include properties in the immediate neighborhood - filter more strictly
              if (cityName) {
                // Look for exact neighborhood matches or very close proximity indicators
                return lowerName.includes('downtown') || 
                       lowerName.includes('gaslamp') || 
                       lowerName.includes('little italy') ||
                       lowerName.includes('marina') ||
                       lowerName.includes('core') ||
                       lowerName.includes('urban core') ||
                       lowerName.includes('city center') ||
                       (lowerName.includes(cityName) && lowerName.length < cityName.length + 20);
              }
              
              return name.length > 0;
            })
            .map((submarket: any, index: number) => {
              // Extract market-level revenue data
              let monthlyRevenue = 0;
              
              if (submarket.avg_revenue) {
                monthlyRevenue = submarket.avg_revenue;
              } else if (submarket.monthly_revenue) {
                monthlyRevenue = submarket.monthly_revenue;
              } else if (submarket.adr && submarket.occupancy) {
                const adr = typeof submarket.adr === 'string' ? parseFloat(submarket.adr.replace(/[^0-9.]/g, '')) : submarket.adr;
                const occupancy = typeof submarket.occupancy === 'string' ? parseFloat(submarket.occupancy.replace(/[^0-9.]/g, '')) / 100 : submarket.occupancy;
                monthlyRevenue = Math.round(adr * 30 * occupancy);
              } else {
                monthlyRevenue = 4500 + (index * 300); // Fallback with variation
              }
              
              const submarketName = submarket.name || 
                                   submarket.neighborhood || 
                                   submarket.area || 
                                   submarket.submarket ||
                                   `Immediate Area ${index + 1}`;
              
              return {
                submarket: submarketName,
                revenue: monthlyRevenue
              };
            });
          
          if (strData.length > 0) {
            console.log('✅ Processed AirDNA immediate neighborhood data:', strData);
            return strData;
          }
        }
      } else {
        const errorText = await marketResponse.text();
        console.log(`❌ AirDNA Market API failed: ${marketResponse.status} - ${errorText}`);
        
        // If market endpoint fails, try the properties endpoint but filter for immediate area
        console.log(`🔄 Trying properties endpoint for immediate area...`);
        
        const propertiesResponse = await fetch(`https://airdna1.p.rapidapi.com/properties?location=${encodeURIComponent(city)}&accommodates=6&bedrooms=2&property_type=apartment`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
            'Content-Type': 'application/json'
          }
        });
        
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          console.log('✅ AirDNA Properties API Response - filtering for immediate area:', propertiesData);
          
          // Aggregate individual properties but focus on immediate neighborhood only
          let properties = [];
          if (propertiesData.properties) properties = propertiesData.properties;
          else if (propertiesData.results) properties = propertiesData.results;
          else if (propertiesData.data) properties = propertiesData.data;
          else if (Array.isArray(propertiesData)) properties = propertiesData;
          
          // Group by neighborhood and calculate averages - focus on immediate area
          const neighborhoodMap = new Map();
          const addressParts = city.toLowerCase().split(',');
          const cityName = addressParts[1]?.trim() || '';
          
          properties.forEach((property: any) => {
            const neighborhood = property.neighborhood || 
                               property.market || 
                               property.area || 
                               property.district ||
                               'Immediate Area';
            
            // Filter for immediate neighborhood only - much stricter filtering
            const neighborhoodLower = neighborhood.toLowerCase();
            const isImmediate = neighborhoodLower.includes('downtown') || 
                               neighborhoodLower.includes('gaslamp') || 
                               neighborhoodLower.includes('little italy') ||
                               neighborhoodLower.includes('marina') ||
                               neighborhoodLower.includes('core') ||
                               neighborhoodLower.includes('urban core') ||
                               neighborhoodLower.includes('city center') ||
                               (cityName && neighborhoodLower.includes(cityName) && neighborhoodLower.length < cityName.length + 20);
            
            if (!isImmediate) return; // Skip properties not in immediate area
            
            let monthlyRevenue = 0;
            if (property.revenue) {
              monthlyRevenue = property.revenue;
            } else if (property.monthly_revenue) {
              monthlyRevenue = property.monthly_revenue;
            } else if (property.adr && property.occupancy) {
              const adr = typeof property.adr === 'string' ? parseFloat(property.adr.replace(/[^0-9.]/g, '')) : property.adr;
              const occupancy = typeof property.occupancy === 'string' ? parseFloat(property.occupancy.replace(/[^0-9.]/g, '')) / 100 : property.occupancy;
              monthlyRevenue = Math.round(adr * 30 * occupancy);
            } else if (property.price) {
              const price = typeof property.price === 'string' ? parseFloat(property.price.replace(/[^0-9.]/g, '')) : property.price;
              monthlyRevenue = Math.round(price * 20); // Assume 65% occupancy
            }
            
            if (!neighborhoodMap.has(neighborhood)) {
              neighborhoodMap.set(neighborhood, []);
            }
            neighborhoodMap.get(neighborhood).push(monthlyRevenue);
          });
          
          // Calculate averages for each immediate neighborhood
          const strData = Array.from(neighborhoodMap.entries()).map(([neighborhood, revenues]) => {
            const avgRevenue = Math.round(revenues.reduce((sum: number, rev: number) => sum + rev, 0) / revenues.length);
            return {
              submarket: neighborhood,
              revenue: avgRevenue
            };
          }).slice(0, 4); // Limit to 4 immediate area submarkets
          
          if (strData.length > 0) {
            console.log('✅ Aggregated immediate neighborhood data from properties:', strData);
            return strData;
          }
        }
        
        if (marketResponse.status === 403) {
          console.log('🔄 AirDNA API key needs subscription - falling back to sample data');
        } else if (marketResponse.status === 429) {
          console.log('⏳ AirDNA rate limit exceeded - falling back to sample data');
        } else if (marketResponse.status === 404) {
          console.log('❓ AirDNA location not found - falling back to sample data');
        } else {
          console.log('⚠️ AirDNA API error - falling back to sample data');
        }
      }
    } catch (error) {
      console.error('💥 Error with AirDNA API - falling back to sample immediate area data:', error);
    }
  }
  
  // Fallback to sample immediate neighborhood data (always works)
  console.log('📋 Using sample immediate neighborhood STR data');
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  
  // For San Diego, focus on immediate downtown area
  if (cityKey.includes('san diego') || cityKey.includes('diego')) {
    return [
      { submarket: 'Gaslamp Quarter', revenue: 7200 },
      { submarket: 'Little Italy', revenue: 6800 },
      { submarket: 'Marina District', revenue: 6400 },
      { submarket: 'Downtown Core', revenue: 6000 }
    ];
  }
  
  const cityData = sampleMarketDatabase[cityKey];
  
  if (cityData) {
    console.log(`✅ Found sample immediate neighborhood data for ${city}`);
    return cityData.strData.slice(0, 4); // Limit to immediate area
  }
  
  // If no sample data, generate realistic immediate area data
  console.log(`🎲 Generating sample immediate neighborhood data for ${city}`);
  
  const addressParts = city.split(',');
  const cityName = addressParts[1]?.trim() || addressParts[0];
  
  return [
    { submarket: `Downtown ${cityName}`, revenue: 6200 },
    { submarket: `${cityName} Core`, revenue: 5800 },
    { submarket: `Urban ${cityName}`, revenue: 5400 },
    { submarket: `${cityName} Center`, revenue: 4900 }
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
