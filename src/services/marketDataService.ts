
import { CityMarketData, STRData, RentData } from '@/types';

const getBedroomMultiplier = (propertyType: string): number => {
  switch (propertyType) {
    case '1': return 0.75;  // 1BR
    case '2': return 1;     // 2BR
    case '3': return 1.25;  // 3BR
    default: return 1;       // Default to 2BR
  }
};

const getBathroomMultiplier = (bathrooms: string): number => {
  switch (bathrooms) {
    case '1': return 0.95;  // 1 bathroom
    case '2': return 1;     // 2 bathrooms 
    case '3': return 1.05;  // 3 bathrooms
    default: return 1;      // Default
  }
};

// Generate realistic submarket names for any city
const generateSubmarkets = (cityName: string): string[] => {
  const cityBase = cityName.split(',')[0].trim();
  
  const commonSubmarketTypes = [
    'Downtown',
    'Midtown', 
    'Arts District',
    'Financial District',
    'Historic District',
    'Waterfront',
    'University Area',
    'Business District'
  ];
  
  const directionalAreas = [
    `North ${cityBase}`,
    `South ${cityBase}`,
    `East ${cityBase}`,
    `West ${cityBase}`
  ];
  
  // Combine and return 6-8 submarkets
  const allSubmarkets = [...commonSubmarketTypes, ...directionalAreas];
  return allSubmarkets.slice(0, 8);
};

// Generate realistic market data based on city characteristics
const generateMarketData = (city: string, submarkets: string[], totalMultiplier: number): CityMarketData => {
  const cityLower = city.toLowerCase();
  
  // Base revenue ranges by city type/size
  let baseRevenue = 3000;
  let baseRent = 1600;
  
  // Adjust based on known major metro characteristics
  if (cityLower.includes('san francisco') || cityLower.includes('new york') || cityLower.includes('manhattan')) {
    baseRevenue = 5500;
    baseRent = 3200;
  } else if (cityLower.includes('los angeles') || cityLower.includes('seattle') || cityLower.includes('boston') || cityLower.includes('washington')) {
    baseRevenue = 4800;
    baseRent = 2400;
  } else if (cityLower.includes('miami') || cityLower.includes('chicago') || cityLower.includes('denver') || cityLower.includes('austin')) {
    baseRevenue = 4200;
    baseRent = 2000;
  } else if (cityLower.includes('atlanta') || cityLower.includes('phoenix') || cityLower.includes('dallas') || cityLower.includes('nashville')) {
    baseRevenue = 3800;
    baseRent = 1800;
  }
  
  const strData: STRData[] = [];
  const rentData: RentData[] = [];
  
  submarkets.forEach((submarket, index) => {
    // Create variation between submarkets (downtown typically highest)
    const submarketMultiplier = submarket.toLowerCase().includes('downtown') ? 1.2 :
                               submarket.toLowerCase().includes('midtown') ? 1.1 :
                               submarket.toLowerCase().includes('arts') ? 1.05 :
                               submarket.toLowerCase().includes('financial') ? 1.15 :
                               submarket.toLowerCase().includes('waterfront') ? 1.1 :
                               0.8 + (index * 0.05); // Gradual decrease for others
    
    const revenue = Math.round(baseRevenue * submarketMultiplier * totalMultiplier);
    const rent = Math.round(baseRent * submarketMultiplier * totalMultiplier);
    
    strData.push({ submarket, revenue });
    rentData.push({ submarket, rent });
  });
  
  // Sort by revenue (highest first)
  strData.sort((a, b) => b.revenue - a.revenue);
  
  return { strData, rentData };
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  
  const bedroomMultiplier = getBedroomMultiplier(propertyType);
  const bathroomMultiplier = getBathroomMultiplier(bathrooms);
  const totalMultiplier = bedroomMultiplier * bathroomMultiplier;
  
  // Generate submarkets for the city
  const submarkets = generateSubmarkets(city);
  
  // Generate realistic market data
  const marketData = generateMarketData(city, submarkets, totalMultiplier);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`✅ Market data fetched for ${city}:`, marketData);
  return marketData;
};
