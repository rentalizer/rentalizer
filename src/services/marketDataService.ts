
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

// Fetch real STR data from AirDNA API
const fetchAirDNAData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<STRData[]> => {
  try {
    console.log(`🔗 Calling AirDNA API for ${city} (${propertyType}BR/${bathrooms}BA)`);
    
    const params = new URLSearchParams({
      location: city,
      property_type: `${propertyType}br_${bathrooms}ba`,
      metrics: 'revenue,occupancy,adr'
    });

    const response = await fetch(`https://api.airdna.co/v1/market/property_type_data?${params.toString()}`, {
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
    console.log('📊 AirDNA response:', data);

    // Parse AirDNA response to extract submarket data
    return data.submarkets?.map((submarket: any) => ({
      submarket: submarket.name,
      revenue: submarket.monthly_revenue || submarket.revenue || 0
    })) || [];

  } catch (error) {
    console.error('❌ AirDNA API error:', error);
    throw error;
  }
};

// Fetch real rent data from RentSpree or similar API
const fetchRentData = async (city: string, propertyType: string, bathrooms: string): Promise<RentData[]> => {
  try {
    console.log(`🏠 Fetching rent data for ${city} (${propertyType}BR/${bathrooms}BA)`);
    
    const params = new URLSearchParams({
      city: city,
      bedrooms: propertyType,
      bathrooms: bathrooms,
      property_type: 'apartment'
    });

    const response = await fetch(`https://api.rentspree.com/v1/market/rent_data?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Rent API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🏠 Rent data response:', data);

    return data.neighborhoods?.map((neighborhood: any) => ({
      submarket: neighborhood.name,
      rent: neighborhood.median_rent || neighborhood.rent || 0
    })) || [];

  } catch (error) {
    console.error('❌ Rent API error:', error);
    throw error;
  }
};

// Enhanced OpenAI integration for market research
const fetchOpenAIMarketData = async (city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<{ submarkets: string[], insights: any }> => {
  try {
    console.log(`🤖 Using OpenAI for market research: ${city}`);
    
    const prompt = `Research the real estate market for ${city}. Provide actual neighborhood/submarket names where ${propertyType}-bedroom, ${bathrooms}-bathroom apartments would be good for short-term rentals. Return a JSON object with an array of actual neighborhood names and market insights.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate market analyst. Provide accurate, real neighborhood names and market data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch {
      // Fallback if JSON parsing fails
      return {
        submarkets: [],
        insights: { note: 'Could not parse AI response' }
      };
    }

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    throw error;
  }
};

export const fetchMarketData = async (
  city: string,
  apiConfig: { airdnaApiKey?: string; openaiApiKey?: string },
  propertyType: string = '2',
  bathrooms: string = '1'
): Promise<CityMarketData> => {
  console.log(`🔍 Fetching REAL market data for ${city} (${propertyType}BR/${bathrooms}BA properties)`);
  console.log('🔧 API Config:', { 
    hasAirDNA: !!apiConfig.airdnaApiKey, 
    hasOpenAI: !!apiConfig.openaiApiKey 
  });

  try {
    let strData: STRData[] = [];
    let rentData: RentData[] = [];
    let submarkets: string[] = [];

    // Try to fetch real data from APIs if keys are provided
    if (apiConfig.airdnaApiKey) {
      try {
        strData = await fetchAirDNAData(city, apiConfig.airdnaApiKey, propertyType, bathrooms);
        console.log('✅ Got real STR data from AirDNA:', strData.length, 'submarkets');
      } catch (error) {
        console.warn('⚠️ AirDNA failed, will try fallback');
      }
    }

    // Get real rent data
    try {
      rentData = await fetchRentData(city, propertyType, bathrooms);
      console.log('✅ Got real rent data:', rentData.length, 'submarkets');
    } catch (error) {
      console.warn('⚠️ Rent API failed, will try fallback');
    }

    // Use OpenAI to research real submarkets if available
    if (apiConfig.openaiApiKey) {
      try {
        const aiData = await fetchOpenAIMarketData(city, apiConfig.openaiApiKey, propertyType, bathrooms);
        submarkets = aiData.submarkets || [];
        console.log('✅ Got real submarkets from AI research:', submarkets.length);
      } catch (error) {
        console.warn('⚠️ OpenAI research failed');
      }
    }

    // If we don't have real data, throw an error
    if (strData.length === 0 && rentData.length === 0 && submarkets.length === 0) {
      throw new Error('Unable to fetch real market data. Please check your API keys and try again.');
    }

    // Combine and match data from different sources
    const combinedSubmarkets = [...new Set([
      ...strData.map(s => s.submarket),
      ...rentData.map(r => r.submarket),
      ...submarkets
    ])];

    // Create final data structure with real data
    const finalStrData: STRData[] = combinedSubmarkets.map(submarket => {
      const existing = strData.find(s => s.submarket === submarket);
      return {
        submarket,
        revenue: existing?.revenue || 0
      };
    });

    const finalRentData: RentData[] = combinedSubmarkets.map(submarket => {
      const existing = rentData.find(r => r.submarket === submarket);
      return {
        submarket,
        rent: existing?.rent || 0
      };
    });

    console.log(`✅ REAL market data compiled for ${city}:`, {
      submarkets: combinedSubmarkets.length,
      strDataPoints: finalStrData.filter(s => s.revenue > 0).length,
      rentDataPoints: finalRentData.filter(r => r.rent > 0).length
    });

    return {
      strData: finalStrData,
      rentData: finalRentData
    };

  } catch (error) {
    console.error('❌ Failed to fetch real market data:', error);
    throw new Error(`Failed to get real market data for ${city}. ${error.message}`);
  }
};
