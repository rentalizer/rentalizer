
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

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  
  // Sample data for different cities and property types
  const sampleData = getSampleMarketData(city.toLowerCase(), propertyType, bathrooms);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`✅ Market data fetched for ${city}:`, sampleData);
  return sampleData;
};

const getSampleMarketData = (city: string, propertyType: string, bathrooms: string): CityMarketData => {
  const bedroomMultiplier = getBedroomMultiplier(propertyType);
  const bathroomMultiplier = getBathroomMultiplier(bathrooms);
  const totalMultiplier = bedroomMultiplier * bathroomMultiplier;
  
  if (city.includes('denver')) {
    return {
      strData: [
        { submarket: 'RiNo', revenue: Math.round(4200 * totalMultiplier) },
        { submarket: 'LoDo', revenue: Math.round(3800 * totalMultiplier) },
        { submarket: 'Capitol Hill', revenue: Math.round(3600 * totalMultiplier) },
        { submarket: 'Highland', revenue: Math.round(3400 * totalMultiplier) },
        { submarket: 'Cherry Creek', revenue: Math.round(3200 * totalMultiplier) },
        { submarket: 'Stapleton', revenue: Math.round(3000 * totalMultiplier) },
        { submarket: 'Wash Park', revenue: Math.round(2900 * totalMultiplier) },
        { submarket: 'Platte Park', revenue: Math.round(2800 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'RiNo', rent: Math.round(2000 * totalMultiplier) },
        { submarket: 'LoDo', rent: Math.round(2200 * totalMultiplier) },
        { submarket: 'Capitol Hill', rent: Math.round(1800 * totalMultiplier) },
        { submarket: 'Highland', rent: Math.round(1900 * totalMultiplier) },
        { submarket: 'Cherry Creek', rent: Math.round(2100 * totalMultiplier) },
        { submarket: 'Stapleton', rent: Math.round(1700 * totalMultiplier) },
        { submarket: 'Wash Park', rent: Math.round(1950 * totalMultiplier) },
        { submarket: 'Platte Park', rent: Math.round(1850 * totalMultiplier) }
      ]
    };
  }
  
  if (city.includes('seattle')) {
    return {
      strData: [
        { submarket: 'Capitol Hill', revenue: Math.round(4500 * totalMultiplier) },
        { submarket: 'Belltown', revenue: Math.round(4200 * totalMultiplier) },
        { submarket: 'Fremont', revenue: Math.round(3800 * totalMultiplier) },
        { submarket: 'Queen Anne', revenue: Math.round(3600 * totalMultiplier) },
        { submarket: 'Ballard', revenue: Math.round(3400 * totalMultiplier) },
        { submarket: 'Wallingford', revenue: Math.round(3200 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Capitol Hill', rent: Math.round(2100 * totalMultiplier) },
        { submarket: 'Belltown', rent: Math.round(2300 * totalMultiplier) },
        { submarket: 'Fremont', rent: Math.round(1900 * totalMultiplier) },
        { submarket: 'Queen Anne', rent: Math.round(2200 * totalMultiplier) },
        { submarket: 'Ballard', rent: Math.round(2000 * totalMultiplier) },
        { submarket: 'Wallingford', rent: Math.round(1800 * totalMultiplier) }
      ]
    };
  }
  
  if (city.includes('atlanta')) {
    return {
      strData: [
        { submarket: 'Midtown', revenue: Math.round(3800 * totalMultiplier) },
        { submarket: 'Buckhead', revenue: Math.round(3600 * totalMultiplier) },
        { submarket: 'Virginia Highland', revenue: Math.round(3400 * totalMultiplier) },
        { submarket: 'Inman Park', revenue: Math.round(3200 * totalMultiplier) },
        { submarket: 'Old Fourth Ward', revenue: Math.round(3000 * totalMultiplier) },
        { submarket: 'Ponce City Market', revenue: Math.round(2900 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Midtown', rent: Math.round(1800 * totalMultiplier) },
        { submarket: 'Buckhead', rent: Math.round(2000 * totalMultiplier) },
        { submarket: 'Virginia Highland', rent: Math.round(1700 * totalMultiplier) },
        { submarket: 'Inman Park', rent: Math.round(1650 * totalMultiplier) },
        { submarket: 'Old Fourth Ward', rent: Math.round(1600 * totalMultiplier) },
        { submarket: 'Ponce City Market', rent: Math.round(1750 * totalMultiplier) }
      ]
    };
  }
  
  if (city.includes('austin')) {
    return {
      strData: [
        { submarket: 'Downtown', revenue: Math.round(4000 * totalMultiplier) },
        { submarket: 'South Lamar', revenue: Math.round(3700 * totalMultiplier) },
        { submarket: 'East Austin', revenue: Math.round(3500 * totalMultiplier) },
        { submarket: 'Zilker', revenue: Math.round(3300 * totalMultiplier) },
        { submarket: 'North Loop', revenue: Math.round(3100 * totalMultiplier) },
        { submarket: 'Mueller', revenue: Math.round(2900 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Downtown', rent: Math.round(1900 * totalMultiplier) },
        { submarket: 'South Lamar', rent: Math.round(1800 * totalMultiplier) },
        { submarket: 'East Austin', rent: Math.round(1700 * totalMultiplier) },
        { submarket: 'Zilker', rent: Math.round(1850 * totalMultiplier) },
        { submarket: 'North Loop', rent: Math.round(1650 * totalMultiplier) },
        { submarket: 'Mueller', rent: Math.round(1600 * totalMultiplier) }
      ]
    };
  }
  
  if (city.includes('nashville')) {
    return {
      strData: [
        { submarket: 'Music Row', revenue: Math.round(3600 * totalMultiplier) },
        { submarket: 'Downtown', revenue: Math.round(3400 * totalMultiplier) },
        { submarket: 'The Gulch', revenue: Math.round(3200 * totalMultiplier) },
        { submarket: 'Music Valley', revenue: Math.round(3000 * totalMultiplier) },
        { submarket: 'Midtown', revenue: Math.round(2800 * totalMultiplier) },
        { submarket: 'East Nashville', revenue: Math.round(2600 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Music Row', rent: Math.round(1700 * totalMultiplier) },
        { submarket: 'Downtown', rent: Math.round(1800 * totalMultiplier) },
        { submarket: 'The Gulch', rent: Math.round(1900 * totalMultiplier) },
        { submarket: 'Music Valley', rent: Math.round(1500 * totalMultiplier) },
        { submarket: 'Midtown', rent: Math.round(1600 * totalMultiplier) },
        { submarket: 'East Nashville', rent: Math.round(1400 * totalMultiplier) }
      ]
    };
  }

  if (city.includes('boston')) {
    return {
      strData: [
        { submarket: 'Back Bay', revenue: Math.round(4800 * totalMultiplier) },
        { submarket: 'North End', revenue: Math.round(4500 * totalMultiplier) },
        { submarket: 'Beacon Hill', revenue: Math.round(4200 * totalMultiplier) },
        { submarket: 'South End', revenue: Math.round(4000 * totalMultiplier) },
        { submarket: 'Cambridge', revenue: Math.round(3800 * totalMultiplier) },
        { submarket: 'Charlestown', revenue: Math.round(3600 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Back Bay', rent: Math.round(2400 * totalMultiplier) },
        { submarket: 'North End', rent: Math.round(2200 * totalMultiplier) },
        { submarket: 'Beacon Hill', rent: Math.round(2500 * totalMultiplier) },
        { submarket: 'South End', rent: Math.round(2100 * totalMultiplier) },
        { submarket: 'Cambridge', rent: Math.round(2000 * totalMultiplier) },
        { submarket: 'Charlestown', rent: Math.round(1900 * totalMultiplier) }
      ]
    };
  }

  if (city.includes('san diego')) {
    return {
      strData: [
        { submarket: 'Downtown', revenue: Math.round(3325 * totalMultiplier) },
        { submarket: 'Midtown', revenue: Math.round(3040 * totalMultiplier) },
        { submarket: 'Arts District', revenue: Math.round(2850 * totalMultiplier) },
        { submarket: 'Business District', revenue: Math.round(2660 * totalMultiplier) },
        { submarket: 'Historic District', revenue: Math.round(2470 * totalMultiplier) },
        { submarket: 'Riverside', revenue: Math.round(2280 * totalMultiplier) }
      ],
      rentData: [
        { submarket: 'Downtown', rent: Math.round(1710 * totalMultiplier) },
        { submarket: 'Midtown', rent: Math.round(1615 * totalMultiplier) },
        { submarket: 'Arts District', rent: Math.round(1520 * totalMultiplier) },
        { submarket: 'Business District', rent: Math.round(1473 * totalMultiplier) },
        { submarket: 'Historic District', rent: Math.round(1425 * totalMultiplier) },
        { submarket: 'Riverside', rent: Math.round(1330 * totalMultiplier) }
      ]
    };
  }
  
  // Default sample data for any other city
  return {
    strData: [
      { submarket: 'Downtown', revenue: Math.round(3500 * totalMultiplier) },
      { submarket: 'Midtown', revenue: Math.round(3200 * totalMultiplier) },
      { submarket: 'Arts District', revenue: Math.round(3000 * totalMultiplier) },
      { submarket: 'Business District', revenue: Math.round(2800 * totalMultiplier) },
      { submarket: 'Historic District', revenue: Math.round(2600 * totalMultiplier) },
      { submarket: 'Riverside', revenue: Math.round(2400 * totalMultiplier) }
    ],
    rentData: [
      { submarket: 'Downtown', rent: Math.round(1800 * totalMultiplier) },
      { submarket: 'Midtown', rent: Math.round(1700 * totalMultiplier) },
      { submarket: 'Arts District', rent: Math.round(1600 * totalMultiplier) },
      { submarket: 'Business District', rent: Math.round(1550 * totalMultiplier) },
      { submarket: 'Historic District', rent: Math.round(1500 * totalMultiplier) },
      { submarket: 'Riverside', rent: Math.round(1400 * totalMultiplier) }
    ]
  };
};
