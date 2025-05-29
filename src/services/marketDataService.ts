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

// Sample data - COMPREHENSIVE NEIGHBORHOOD SUBMARKETS with realistic values
// Data organized by bedroom count for more accurate pricing
const sampleMarketDatabase: Record<string, Record<string, CityMarketData>> = {
  'nashville': {
    '1': {
      strData: [
        { submarket: 'Downtown Nashville', revenue: 4800 },
        { submarket: 'The Gulch', revenue: 4400 },
        { submarket: 'East Nashville', revenue: 3800 },
        { submarket: '12 South', revenue: 3500 },
        { submarket: 'Midtown', revenue: 3400 },
        { submarket: 'Music Row', revenue: 3200 },
        { submarket: 'Germantown', revenue: 3300 },
        { submarket: 'Green Hills', revenue: 3400 },
        { submarket: 'Belle Meade', revenue: 3700 },
        { submarket: 'Vanderbilt Area', revenue: 3300 },
        { submarket: 'Sobro', revenue: 4100 },
        { submarket: 'The Nations', revenue: 3100 },
        { submarket: 'Sylvan Park', revenue: 3200 },
        { submarket: 'Berry Hill', revenue: 3000 }
      ],
      rentData: [
        { submarket: 'Downtown Nashville', rent: 1800 },
        { submarket: 'The Gulch', rent: 1750 },
        { submarket: 'East Nashville', rent: 1650 },
        { submarket: '12 South', rent: 1500 },
        { submarket: 'Midtown', rent: 1600 },
        { submarket: 'Music Row', rent: 1450 },
        { submarket: 'Germantown', rent: 1400 },
        { submarket: 'Green Hills', rent: 1500 },
        { submarket: 'Belle Meade', rent: 1650 },
        { submarket: 'Vanderbilt Area', rent: 1450 },
        { submarket: 'Sobro', rent: 1800 },
        { submarket: 'The Nations', rent: 1300 },
        { submarket: 'Sylvan Park', rent: 1350 },
        { submarket: 'Berry Hill', rent: 1250 }
      ]
    },
    '2': {
      strData: [
        { submarket: 'Downtown Nashville', revenue: 6800 },
        { submarket: 'The Gulch', revenue: 6200 },
        { submarket: 'East Nashville', revenue: 5400 },
        { submarket: '12 South', revenue: 5000 },
        { submarket: 'Midtown', revenue: 4800 },
        { submarket: 'Music Row', revenue: 4400 },
        { submarket: 'Germantown', revenue: 4600 },
        { submarket: 'Green Hills', revenue: 4800 },
        { submarket: 'Belle Meade', revenue: 5200 },
        { submarket: 'Vanderbilt Area', revenue: 4700 },
        { submarket: 'Sobro', revenue: 5800 },
        { submarket: 'The Nations', revenue: 4300 },
        { submarket: 'Sylvan Park', revenue: 4500 },
        { submarket: 'Berry Hill', revenue: 4200 }
      ],
      rentData: [
        { submarket: 'Downtown Nashville', rent: 2600 },
        { submarket: 'The Gulch', rent: 2500 },
        { submarket: 'East Nashville', rent: 2400 },
        { submarket: '12 South', rent: 2200 },
        { submarket: 'Midtown', rent: 2300 },
        { submarket: 'Music Row', rent: 2150 },
        { submarket: 'Germantown', rent: 2100 },
        { submarket: 'Green Hills', rent: 2200 },
        { submarket: 'Belle Meade', rent: 2400 },
        { submarket: 'Vanderbilt Area', rent: 2150 },
        { submarket: 'Sobro', rent: 2600 },
        { submarket: 'The Nations', rent: 1950 },
        { submarket: 'Sylvan Park', rent: 2000 },
        { submarket: 'Berry Hill', rent: 1900 }
      ]
    },
    '3': {
      strData: [
        { submarket: 'Downtown Nashville', revenue: 8800 },
        { submarket: 'The Gulch', revenue: 8200 },
        { submarket: 'East Nashville', revenue: 7200 },
        { submarket: '12 South', revenue: 6800 },
        { submarket: 'Midtown', revenue: 6500 },
        { submarket: 'Music Row', revenue: 6000 },
        { submarket: 'Germantown', revenue: 6200 },
        { submarket: 'Green Hills', revenue: 6500 },
        { submarket: 'Belle Meade', revenue: 7000 },
        { submarket: 'Vanderbilt Area', revenue: 6300 },
        { submarket: 'Sobro', revenue: 7800 },
        { submarket: 'The Nations', revenue: 5800 },
        { submarket: 'Sylvan Park', revenue: 6000 },
        { submarket: 'Berry Hill', revenue: 5600 }
      ],
      rentData: [
        { submarket: 'Downtown Nashville', rent: 3400 },
        { submarket: 'The Gulch', rent: 3300 },
        { submarket: 'East Nashville', rent: 3200 },
        { submarket: '12 South', rent: 2900 },
        { submarket: 'Midtown', rent: 3000 },
        { submarket: 'Music Row', rent: 2800 },
        { submarket: 'Germantown', rent: 2750 },
        { submarket: 'Green Hills', rent: 2900 },
        { submarket: 'Belle Meade', rent: 3200 },
        { submarket: 'Vanderbilt Area', rent: 2800 },
        { submarket: 'Sobro', rent: 3400 },
        { submarket: 'The Nations', rent: 2600 },
        { submarket: 'Sylvan Park', rent: 2650 },
        { submarket: 'Berry Hill', rent: 2500 }
      ]
    }
  },
  'miami': {
    strData: [
      { submarket: 'Brickell', revenue: 5800 },
      { submarket: 'Downtown Miami', revenue: 5200 },
      { submarket: 'Wynwood', revenue: 4600 },
      { submarket: 'South Beach', revenue: 6400 },
      { submarket: 'Coral Gables', revenue: 4800 },
      { submarket: 'Coconut Grove', revenue: 5000 },
      { submarket: 'Design District', revenue: 4700 },
      { submarket: 'Midtown Miami', revenue: 4900 },
      { submarket: 'Aventura', revenue: 4400 },
      { submarket: 'Key Biscayne', revenue: 5600 },
      { submarket: 'Bal Harbour', revenue: 6000 },
      { submarket: 'Doral', revenue: 4200 },
      { submarket: 'Miami Lakes', revenue: 4100 }
    ],
    rentData: [
      { submarket: 'Brickell', rent: 2600 },
      { submarket: 'Downtown Miami', rent: 2400 },
      { submarket: 'Wynwood', rent: 2000 },
      { submarket: 'South Beach', rent: 2800 },
      { submarket: 'Coral Gables', rent: 2200 },
      { submarket: 'Coconut Grove', rent: 2300 },
      { submarket: 'Design District', rent: 2100 },
      { submarket: 'Midtown Miami', rent: 2200 },
      { submarket: 'Aventura', rent: 2000 },
      { submarket: 'Key Biscayne', rent: 2500 },
      { submarket: 'Bal Harbour', rent: 2700 },
      { submarket: 'Doral', rent: 1900 },
      { submarket: 'Miami Lakes', rent: 1850 }
    ]
  },
  'austin': {
    strData: [
      { submarket: 'Downtown Austin', revenue: 6500 },
      { submarket: 'South Austin', revenue: 5800 },
      { submarket: 'East Austin', revenue: 5200 },
      { submarket: 'West Austin', revenue: 4800 },
      { submarket: 'North Austin', revenue: 4200 },
      { submarket: 'Zilker', revenue: 5400 },
      { submarket: 'Rainey Street', revenue: 6200 },
      { submarket: 'The Domain', revenue: 4600 },
      { submarket: 'Mueller', revenue: 4400 },
      { submarket: 'Clarksville', revenue: 5000 },
      { submarket: 'Tarrytown', revenue: 4700 },
      { submarket: 'Riverside', revenue: 4300 },
      { submarket: 'Shoal Creek', revenue: 4500 }
    ],
    rentData: [
      { submarket: 'Downtown Austin', rent: 2800 },
      { submarket: 'South Austin', rent: 2400 },
      { submarket: 'East Austin', rent: 2200 },
      { submarket: 'West Austin', rent: 2000 },
      { submarket: 'North Austin', rent: 1900 },
      { submarket: 'Zilker', rent: 2300 },
      { submarket: 'Rainey Street', rent: 2700 },
      { submarket: 'The Domain', rent: 2100 },
      { submarket: 'Mueller', rent: 2000 },
      { submarket: 'Clarksville', rent: 2200 },
      { submarket: 'Tarrytown', rent: 2100 },
      { submarket: 'Riverside', rent: 1950 },
      { submarket: 'Shoal Creek', rent: 2000 }
    ]
  },
  'denver': {
    strData: [
      { submarket: 'Downtown Denver', revenue: 5800 },
      { submarket: 'LoDo', revenue: 5500 },
      { submarket: 'Capitol Hill', revenue: 4900 },
      { submarket: 'Highlands', revenue: 4600 },
      { submarket: 'RiNo', revenue: 4300 },
      { submarket: 'Cherry Creek', revenue: 5200 },
      { submarket: 'Five Points', revenue: 4400 },
      { submarket: 'Ballpark', revenue: 5000 },
      { submarket: 'Baker', revenue: 4500 },
      { submarket: 'Congress Park', revenue: 4300 },
      { submarket: 'Wash Park', revenue: 4700 },
      { submarket: 'LoHi', revenue: 4800 },
      { submarket: 'Stapleton', revenue: 4200 }
    ],
    rentData: [
      { submarket: 'Downtown Denver', rent: 2400 },
      { submarket: 'LoDo', rent: 2300 },
      { submarket: 'Capitol Hill', rent: 2100 },
      { submarket: 'Highlands', rent: 2000 },
      { submarket: 'RiNo', rent: 1900 },
      { submarket: 'Cherry Creek', rent: 2300 },
      { submarket: 'Five Points', rent: 1950 },
      { submarket: 'Ballpark', rent: 2200 },
      { submarket: 'Baker', rent: 2000 },
      { submarket: 'Congress Park', rent: 1950 },
      { submarket: 'Wash Park', rent: 2100 },
      { submarket: 'LoHi', rent: 2200 },
      { submarket: 'Stapleton', rent: 1900 }
    ]
  },
  'seattle': {
    strData: [
      { submarket: 'Downtown Seattle', revenue: 6200 },
      { submarket: 'Capitol Hill', revenue: 5700 },
      { submarket: 'Belltown', revenue: 5400 },
      { submarket: 'Fremont', revenue: 4800 },
      { submarket: 'Ballard', revenue: 4500 },
      { submarket: 'Queen Anne', revenue: 5500 },
      { submarket: 'Pike Place', revenue: 5800 },
      { submarket: 'Pioneer Square', revenue: 5200 },
      { submarket: 'Wallingford', revenue: 4600 },
      { submarket: 'University District', revenue: 4400 },
      { submarket: 'Georgetown', revenue: 4300 },
      { submarket: 'Eastlake', revenue: 4700 },
      { submarket: 'South Lake Union', revenue: 5000 }
    ],
    rentData: [
      { submarket: 'Downtown Seattle', rent: 2800 },
      { submarket: 'Capitol Hill', rent: 2600 },
      { submarket: 'Belltown', rent: 2700 },
      { submarket: 'Fremont', rent: 2200 },
      { submarket: 'Ballard', rent: 2100 },
      { submarket: 'Queen Anne', rent: 2500 },
      { submarket: 'Pike Place', rent: 2600 },
      { submarket: 'Pioneer Square', rent: 2300 },
      { submarket: 'Wallingford', rent: 2100 },
      { submarket: 'University District', rent: 2000 },
      { submarket: 'Georgetown', rent: 1950 },
      { submarket: 'Eastlake', rent: 2100 },
      { submarket: 'South Lake Union', rent: 2200 }
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
      { submarket: 'Mission Valley', revenue: 4800 },
      { submarket: 'La Jolla', revenue: 7000 },
      { submarket: 'Ocean Beach', revenue: 5800 },
      { submarket: 'Balboa Park', revenue: 5400 },
      { submarket: 'University Heights', revenue: 5000 },
      { submarket: 'Point Loma', revenue: 5600 },
      { submarket: 'Banker\'s Hill', revenue: 5800 },
      { submarket: 'Mission Hills', revenue: 5400 },
      { submarket: 'Kensington', revenue: 4800 },
      { submarket: 'Normal Heights', revenue: 4600 }
    ],
    rentData: [
      { submarket: 'Gaslamp Quarter', rent: 2900 },
      { submarket: 'Little Italy', rent: 2800 },
      { submarket: 'Pacific Beach', rent: 2600 },
      { submarket: 'Mission Beach', rent: 2500 },
      { submarket: 'Hillcrest', rent: 2300 },
      { submarket: 'North Park', rent: 2200 },
      { submarket: 'Mission Valley', rent: 2100 },
      { submarket: 'La Jolla', rent: 3000 },
      { submarket: 'Ocean Beach', rent: 2400 },
      { submarket: 'Balboa Park', rent: 2300 },
      { submarket: 'University Heights', rent: 2100 },
      { submarket: 'Point Loma', rent: 2400 },
      { submarket: 'Banker\'s Hill', rent: 2500 },
      { submarket: 'Mission Hills', rent: 2300 },
      { submarket: 'Kensington', rent: 2100 },
      { submarket: 'Normal Heights', rent: 2000 }
    ]
  }
};

// API Configuration
export interface ApiConfig {
  airdnaApiKey?: string;
  openaiApiKey?: string;
}

// AirDNA Market Data API - updated to handle bedroom count
export const fetchAirDNAListingsData = async (city: string, apiKey?: string, bedrooms: string = '2'): Promise<StrData[]> => {
  console.log(`🔍 Fetching AirDNA MARKET data for ${city} - ${bedrooms}BR APARTMENTS ONLY`);
  console.log(`🔑 API Key provided: ${apiKey ? 'Yes' : 'No'}`);
  
  if (apiKey) {
    try {
      console.log(`📡 Using AirDNA Market Data API - ${bedrooms}BR APARTMENTS ONLY`);
      
      // Try AirDNA market data endpoint first (more appropriate for market analysis)
      const marketResponse = await fetch(`https://airdna1.p.rapidapi.com/market?location=${encodeURIComponent(city)}&property_type=apartment&bedrooms=${bedrooms}`, {
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
                // Adjust fallback revenue based on bedroom count
                const baseRevenue = bedrooms === '1' ? 3500 : bedrooms === '3' ? 6500 : 4500;
                monthlyRevenue = baseRevenue + (index * 300);
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
        
        const propertiesResponse = await fetch(`https://airdna1.p.rapidapi.com/properties?location=${encodeURIComponent(city)}&accommodates=${parseInt(bedrooms) * 2}&bedrooms=${bedrooms}&property_type=apartment`, {
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
      console.error('💥 Error with AirDNA API - falling back to sample data:', error);
    }
  }
  
  // Fallback to comprehensive sample data (always works)
  console.log(`📋 Using comprehensive sample STR data for ${bedrooms}BR`);
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  
  const cityData = sampleMarketDatabase[cityKey]?.[bedrooms];
  
  if (cityData) {
    console.log(`✅ Found comprehensive sample data for ${city} (${bedrooms}BR)`);
    return cityData.strData;
  }
  
  // If no sample data, generate realistic comprehensive data based on bedroom count
  console.log(`🎲 Generating comprehensive sample data for ${city} (${bedrooms}BR)`);
  
  const addressParts = city.split(',');
  const cityName = addressParts[1]?.trim() || addressParts[0];
  
  // Adjust revenue based on bedroom count
  const revenueMultiplier = bedrooms === '1' ? 0.7 : bedrooms === '3' ? 1.4 : 1.0;
  
  return [
    { submarket: `Downtown ${cityName}`, revenue: Math.round(6200 * revenueMultiplier) },
    { submarket: `${cityName} Core`, revenue: Math.round(5800 * revenueMultiplier) },
    { submarket: `Urban ${cityName}`, revenue: Math.round(5400 * revenueMultiplier) },
    { submarket: `${cityName} Center`, revenue: Math.round(4900 * revenueMultiplier) },
    { submarket: `${cityName} Heights`, revenue: Math.round(4600 * revenueMultiplier) },
    { submarket: `East ${cityName}`, revenue: Math.round(4400 * revenueMultiplier) },
    { submarket: `West ${cityName}`, revenue: Math.round(4300 * revenueMultiplier) },
    { submarket: `North ${cityName}`, revenue: Math.round(4200 * revenueMultiplier) },
    { submarket: `South ${cityName}`, revenue: Math.round(4100 * revenueMultiplier) }
  ];
};

// AI-powered rental data fetching (updated to handle bedroom count)
export const fetchRentalDataWithAI = async (city: string, submarkets: string[], apiKey?: string, bedrooms: string = '2'): Promise<RentData[]> => {
  console.log(`🤖 Fetching rental data for ${city} submarkets using AI (${bedrooms}BR)`);
  
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
              content: 'You are a real estate data expert. Provide current median rent data for apartments in specific submarkets. Return data in JSON format with exact submarket names and monthly rent amounts.'
            },
            {
              role: 'user',
              content: `Find current median monthly rent for ${bedrooms}BR apartments in these ${city} submarkets: ${submarkets.join(', ')}. Return as JSON array with format: [{"submarket": "exact name", "rent": number}]`
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
  console.log(`📋 Using sample rental data for ${bedrooms}BR`);
  const cityKey = city.toLowerCase().trim().replace(/,.*/, '');
  const cityData = sampleMarketDatabase[cityKey]?.[bedrooms];
  
  if (cityData) {
    return cityData.rentData;
  }
  
  // Generate matching rental data for the submarkets based on bedroom count
  const rentMultiplier = bedrooms === '1' ? 0.7 : bedrooms === '3' ? 1.4 : 1.0;
  const baseRent = 2000;
  
  return submarkets.map(submarket => ({
    submarket,
    rent: Math.round((baseRent + Math.random() * 800) * rentMultiplier) // Adjust rent based on bedroom count
  }));
};

// Main market data fetching function - updated with bedroom parameter
export const fetchMarketData = async (city: string, config: ApiConfig = {}, bedrooms: string = '2'): Promise<CityMarketData> => {
  try {
    console.log(`🚀 Starting market analysis for ${city} (${bedrooms}BR properties)`);
    console.log(`🔧 API Configuration:`, { 
      hasAirDNAKey: !!config.airdnaApiKey, 
      hasOpenAIKey: !!config.openaiApiKey 
    });
    
    // Fetch STR data using AirDNA API (with fallback to sample data)
    const strData = await fetchAirDNAListingsData(city, config.airdnaApiKey, bedrooms);
    
    // Extract submarket names for rental data lookup
    const submarkets = strData.map(item => item.submarket);
    console.log(`🏘️ Found submarkets: ${submarkets.join(', ')}`);
    
    // Fetch rental data using AI or fallback
    const rentData = await fetchRentalDataWithAI(city, submarkets, config.openaiApiKey, bedrooms);
    
    console.log(`✅ Market analysis complete for ${city} (${bedrooms}BR properties)`);
    return { strData, rentData };
    
  } catch (error) {
    console.error(`💥 Error fetching market data for ${city}:`, error);
    throw error;
  }
};
