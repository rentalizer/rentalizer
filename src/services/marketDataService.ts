import { CityMarketData, STRData, RentData } from '@/types';

const getBedroomMultiplier = (propertyType: string): number => {
  switch (propertyType) {
    case '1': return 0.75;  // 1BR
    case '2': return 1;     // 2BR
    case '3': return 1.25;  // 3BR
    default: return 1;       // Default to 2BR
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR properties)`);
  
  // Sample data for different cities and property types
  const sampleData = getSampleMarketData(city.toLowerCase(), propertyType);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`✅ Market data fetched for ${city}:`, sampleData);
  return sampleData;
};

const getSampleMarketData = (city: string, propertyType: string): CityMarketData => {
  const bedroomMultiplier = getBedroomMultiplier(propertyType);
  
  if (city.includes('denver')) {
    return {
      strData: [
        { submarket: 'RiNo', revenue: Math.round(4200 * bedroomMultiplier) },
        { submarket: 'LoDo', revenue: Math.round(3800 * bedroomMultiplier) },
        { submarket: 'Capitol Hill', revenue: Math.round(3600 * bedroomMultiplier) },
        { submarket: 'Highland', revenue: Math.round(3400 * bedroomMultiplier) },
        { submarket: 'Cherry Creek', revenue: Math.round(3200 * bedroomMultiplier) },
        { submarket: 'Stapleton', revenue: Math.round(3000 * bedroomMultiplier) },
        { submarket: 'Wash Park', revenue: Math.round(2900 * bedroomMultiplier) },
        { submarket: 'Platte Park', revenue: Math.round(2800 * bedroomMultiplier) }
      ],
      rentData: [
        { submarket: 'RiNo', rent: Math.round(2000 * bedroomMultiplier) },
        { submarket: 'LoDo', rent: Math.round(2200 * bedroomMultiplier) },
        { submarket: 'Capitol Hill', rent: Math.round(1800 * bedroomMultiplier) },
        { submarket: 'Highland', rent: Math.round(1900 * bedroomMultiplier) },
        { submarket: 'Cherry Creek', rent: Math.round(2100 * bedroomMultiplier) },
        { submarket: 'Stapleton', rent: Math.round(1700 * bedroomMultiplier) },
        { submarket: 'Wash Park', rent: Math.round(1950 * bedroomMultiplier) },
        { submarket: 'Platte Park', rent: Math.round(1850 * bedroomMultiplier) }
      ]
    };
  }
  
  if (city.includes('seattle')) {
    return {
      strData: [
        { submarket: 'Capitol Hill', revenue: Math.round(4500 * bedroomMultiplier) },
        { submarket: 'Belltown', revenue: Math.round(4200 * bedroomMultiplier) },
        { submarket: 'Fremont', revenue: Math.round(3800 * bedroomMultiplier) },
        { submarket: 'Queen Anne', revenue: Math.round(3600 * bedroomMultiplier) },
        { submarket: 'Ballard', revenue: Math.round(3400 * bedroomMultiplier) },
        { submarket: 'Wallingford', revenue: Math.round(3200 * bedroomMultiplier) }
      ],
      rentData: [
        { submarket: 'Capitol Hill', rent: Math.round(2100 * bedroomMultiplier) },
        { submarket: 'Belltown', rent: Math.round(2300 * bedroomMultiplier) },
        { submarket: 'Fremont', rent: Math.round(1900 * bedroomMultiplier) },
        { submarket: 'Queen Anne', rent: Math.round(2200 * bedroomMultiplier) },
        { submarket: 'Ballard', rent: Math.round(2000 * bedroomMultiplier) },
        { submarket: 'Wallingford', rent: Math.round(1800 * bedroomMultiplier) }
      ]
    };
  }
  
  if (city.includes('atlanta')) {
    return {
      strData: [
        { submarket: 'Midtown', revenue: Math.round(3800 * bedroomMultiplier) },
        { submarket: 'Buckhead', revenue: Math.round(3600 * bedroomMultiplier) },
        { submarket: 'Virginia Highland', revenue: Math.round(3400 * bedroomMultiplier) },
        { submarket: 'Inman Park', revenue: Math.round(3200 * bedroomMultiplier) },
        { submarket: 'Old Fourth Ward', revenue: Math.round(3000 * bedroomMultiplier) },
        { submarket: 'Ponce City Market', revenue: Math.round(2900 * bedroomMultiplier) }
      ],
      rentData: [
        { submarket: 'Midtown', rent: Math.round(1800 * bedroomMultiplier) },
        { submarket: 'Buckhead', rent: Math.round(2000 * bedroomMultiplier) },
        { submarket: 'Virginia Highland', rent: Math.round(1700 * bedroomMultiplier) },
        { submarket: 'Inman Park', rent: Math.round(1650 * bedroomMultiplier) },
        { submarket: 'Old Fourth Ward', rent: Math.round(1600 * bedroomMultiplier) },
        { submarket: 'Ponce City Market', rent: Math.round(1750 * bedroomMultiplier) }
      ]
    };
  }
  
  if (city.includes('austin')) {
    return {
      strData: [
        { submarket: 'Downtown', revenue: Math.round(4000 * bedroomMultiplier) },
        { submarket: 'South Lamar', revenue: Math.round(3700 * bedroomMultiplier) },
        { submarket: 'East Austin', revenue: Math.round(3500 * bedroomMultiplier) },
        { submarket: 'Zilker', revenue: Math.round(3300 * bedroomMultiplier) },
        { submarket: 'North Loop', revenue: Math.round(3100 * bedroomMultiplier) },
        { submarket: 'Mueller', revenue: Math.round(2900 * bedroomMultiplier) }
      ],
      rentData: [
        { submarket: 'Downtown', rent: Math.round(1900 * bedroomMultiplier) },
        { submarket: 'South Lamar', rent: Math.round(1800 * bedroomMultiplier) },
        { submarket: 'East Austin', rent: Math.round(1700 * bedroomMultiplier) },
        { submarket: 'Zilker', rent: Math.round(1850 * bedroomMultiplier) },
        { submarket: 'North Loop', rent: Math.round(1650 * bedroomMultiplier) },
        { submarket: 'Mueller', rent: Math.round(1600 * bedroomMultiplier) }
      ]
    };
  }
  
  if (city.includes('nashville')) {
    return {
      strData: [
        { submarket: 'Music Row', revenue: Math.round(3600 * bedroomMultiplier) },
        { submarket: 'Downtown', revenue: Math.round(3400 * bedroomMultiplier) },
        { submarket: 'The Gulch', revenue: Math.round(3200 * bedroomMultiplier) },
        { submarket: 'Music Valley', revenue: Math.round(3000 * bedroomMultiplier) },
        { submarket: 'Midtown', revenue: Math.round(2800 * bedroomMultiplier) },
        { submarket: 'East Nashville', revenue: Math.round(2600 * bedroomMultiplier) }
      ],
      rentData: [
        { submarket: 'Music Row', rent: Math.round(1700 * bedroomMultiplier) },
        { submarket: 'Downtown', rent: Math.round(1800 * bedroomMultiplier) },
        { submarket: 'The Gulch', rent: Math.round(1900 * bedroomMultiplier) },
        { submarket: 'Music Valley', rent: Math.round(1500 * bedroomMultiplier) },
        { submarket: 'Midtown', rent: Math.round(1600 * bedroomMultiplier) },
        { submarket: 'East Nashville', rent: Math.round(1400 * bedroomMultiplier) }
      ]
    };
  }
  
  // Default sample data for any other city
  return {
    strData: [
      { submarket: 'Downtown', revenue: Math.round(3500 * bedroomMultiplier) },
      { submarket: 'Midtown', revenue: Math.round(3200 * bedroomMultiplier) },
      { submarket: 'Arts District', revenue: Math.round(3000 * bedroomMultiplier) },
      { submarket: 'Business District', revenue: Math.round(2800 * bedroomMultiplier) },
      { submarket: 'Historic District', revenue: Math.round(2600 * bedroomMultiplier) },
      { submarket: 'Riverside', revenue: Math.round(2400 * bedroomMultiplier) }
    ],
    rentData: [
      { submarket: 'Downtown', rent: Math.round(1800 * bedroomMultiplier) },
      { submarket: 'Midtown', rent: Math.round(1700 * bedroomMultiplier) },
      { submarket: 'Arts District', rent: Math.round(1600 * bedroomMultiplier) },
      { submarket: 'Business District', rent: Math.round(1550 * bedroomMultiplier) },
      { submarket: 'Historic District', rent: Math.round(1500 * bedroomMultiplier) },
      { submarket: 'Riverside', rent: Math.round(1400 * bedroomMultiplier) }
    ]
  };
};
