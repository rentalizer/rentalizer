
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

// Use AirDNA API for STR data
const fetchAirDNAData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<STRData[]> => {
  try {
    console.log(`🏠 Fetching AirDNA data for ${city}`);
    
    const bedroomMultiplier = getBedroomMultiplier(propertyType);
    const bathroomMultiplier = getBathroomMultiplier(bathrooms);
    
    const response = await fetch(`https://api.airdna.co/v1/market/city_overview?city=${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`AirDNA API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🏠 AirDNA response:', data);

    // Process AirDNA response to extract submarket data
    const submarkets = data.submarkets || [];
    
    const strData: STRData[] = submarkets.map((submarket: any) => ({
      submarket: submarket.name,
      revenue: Math.round((submarket.adr * submarket.occupancy_rate * 30 * bedroomMultiplier * bathroomMultiplier) / 100)
    }));

    return strData;

  } catch (error) {
    console.error('❌ AirDNA error:', error);
    throw error;
  }
};

// Use OpenAI to research rent data
const fetchOpenAIRentData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<RentData[]> => {
  try {
    console.log(`🤖 Using OpenAI to research rent data for ${city}`);
    
    const prompt = `Research ${city} rental market for ${propertyType}-bedroom, ${bathrooms}-bathroom apartments. Provide real neighborhood names and median monthly rent prices.

Return a JSON object with this exact structure:
{
  "rentData": [
    {
      "submarket": "Real Neighborhood Name",
      "rent": 2200
    }
  ]
}

Provide 6-8 real neighborhoods in ${city} with accurate median rent estimates for ${propertyType}BR/${bathrooms}BA apartments.`;

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
            content: 'You are a real estate analyst. Provide accurate rental market data with real neighborhood names.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('🤖 OpenAI rent response:', content);
    
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.rentData || [];
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid OpenAI response format');
    }

  } catch (error) {
    console.error('❌ OpenAI rent research error:', error);
    throw error;
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  console.log('🔧 API Config:', { 
    hasAirDNA: !!apiConfig.airdnaApiKey, 
    hasOpenAI: !!apiConfig.openaiApiKey 
  });

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];

    // Fetch STR data from AirDNA
    if (apiConfig.airdnaApiKey) {
      try {
        strData = await fetchAirDNAData(city, apiConfig.airdnaApiKey, propertyType, bathrooms);
        console.log('✅ Got STR data from AirDNA:', strData.length, 'submarkets');
      } catch (error) {
        console.warn('⚠️ AirDNA failed:', error);
        throw new Error(`AirDNA API failed: ${error.message}`);
      }
    }

    // Fetch rent data from OpenAI
    if (apiConfig.openaiApiKey) {
      try {
        rentData = await fetchOpenAIRentData(city, apiConfig.openaiApiKey, propertyType, bathrooms);
        console.log('✅ Got rent data from OpenAI:', rentData.length, 'submarkets');
      } catch (error) {
        console.warn('⚠️ OpenAI failed:', error);
        throw new Error(`OpenAI API failed: ${error.message}`);
      }
    }

    // Check if we have both data sources
    if (strData.length === 0) {
      throw new Error(`No STR data available for ${city}. Please add your AirDNA API key.`);
    }

    if (rentData.length === 0) {
      throw new Error(`No rent data available for ${city}. Please add your OpenAI API key.`);
    }

    console.log(`✅ Market data compiled for ${city}:`, {
      strSubmarkets: strData.length,
      rentSubmarkets: rentData.length,
      avgRevenue: Math.round(strData.reduce((sum, s) => sum + s.revenue, 0) / strData.length),
      avgRent: Math.round(rentData.reduce((sum, r) => sum + r.rent, 0) / rentData.length)
    });

    return {
      strData,
      rentData
    };

  } catch (error) {
    console.error('❌ Failed to fetch market data:', error);
    throw new Error(`Failed to get market data for ${city}. ${error.message}`);
  }
};
