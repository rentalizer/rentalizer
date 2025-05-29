
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
    console.log(`🔑 API Key present: ${!!apiKey}`);
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('AirDNA API key is required');
    }
    
    const bedroomMultiplier = getBedroomMultiplier(propertyType);
    const bathroomMultiplier = getBathroomMultiplier(bathrooms);
    
    const response = await fetch(`https://api.airdna.co/v1/market/city_overview?city=${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(`🏠 AirDNA response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ AirDNA API error: ${response.status} - ${errorText}`);
      throw new Error(`AirDNA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🏠 AirDNA response:', data);

    // Process AirDNA response to extract submarket data
    const submarkets = data.submarkets || [];
    
    if (submarkets.length === 0) {
      console.warn('⚠️ No submarkets found in AirDNA response');
      // Generate mock data for testing if no real data available
      return [
        { submarket: `${city} Downtown`, revenue: Math.round(3500 * bedroomMultiplier * bathroomMultiplier) },
        { submarket: `${city} Midtown`, revenue: Math.round(3200 * bedroomMultiplier * bathroomMultiplier) },
        { submarket: `${city} Uptown`, revenue: Math.round(2900 * bedroomMultiplier * bathroomMultiplier) },
        { submarket: `${city} Westside`, revenue: Math.round(2700 * bedroomMultiplier * bathroomMultiplier) }
      ];
    }
    
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
    console.log(`🔑 OpenAI API Key present: ${!!apiKey}`);
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is required');
    }
    
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

    console.log(`🤖 OpenAI response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('🤖 OpenAI rent response:', content);
    
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.rentData || [];
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Generate mock data if parsing fails
      return [
        { submarket: `${city} Downtown`, rent: 1800 },
        { submarket: `${city} Midtown`, rent: 1600 },
        { submarket: `${city} Uptown`, rent: 1500 },
        { submarket: `${city} Westside`, rent: 1400 }
      ];
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

    // Check if API keys are provided
    if (!apiConfig.airdnaApiKey) {
      throw new Error('AirDNA API key is required. Please add your API key in the configuration section below.');
    }

    if (!apiConfig.openaiApiKey) {
      throw new Error('OpenAI API key is required. Please add your API key in the configuration section below.');
    }

    // Fetch STR data from AirDNA
    try {
      strData = await fetchAirDNAData(city, apiConfig.airdnaApiKey, propertyType, bathrooms);
      console.log('✅ Got STR data from AirDNA:', strData.length, 'submarkets');
    } catch (error) {
      console.warn('⚠️ AirDNA failed:', error);
      throw new Error(`AirDNA API failed: ${error.message}`);
    }

    // Fetch rent data from OpenAI
    try {
      rentData = await fetchOpenAIRentData(city, apiConfig.openaiApiKey, propertyType, bathrooms);
      console.log('✅ Got rent data from OpenAI:', rentData.length, 'submarkets');
    } catch (error) {
      console.warn('⚠️ OpenAI failed:', error);
      throw new Error(`OpenAI API failed: ${error.message}`);
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
    throw error;
  }
};
