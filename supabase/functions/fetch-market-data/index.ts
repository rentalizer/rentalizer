import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, propertyType = '2', bathrooms = '2' } = await req.json();

    if (!city || !city.trim()) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching market data for: ${city}, ${propertyType}BR/${bathrooms}BA`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's API keys if authenticated
    const authHeader = req.headers.get('Authorization');
    let userApiKeys = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: apiKeys } = await supabase
          .from('user_api_keys')
          .select('airdna_api_key, rental_api_key')
          .eq('user_id', user.id)
          .maybeSingle();
        
        userApiKeys = apiKeys;
      }
    }

    // Check if we have real API keys or valid OpenAI key
    const hasValidApiKeys = userApiKeys?.airdna_api_key || userApiKeys?.rental_api_key;
    const hasValidOpenAI = openaiApiKey && (openaiApiKey.startsWith('sk-') || openaiApiKey.startsWith('sk-proj-'));
    
    if (!hasValidApiKeys && !hasValidOpenAI) {
      console.log('No valid API keys available for real data');
      return new Response(
        JSON.stringify({ 
          error: 'No available data',
          message: 'Real market data requires valid API keys. Please configure your API keys or check your OpenAI configuration.',
          submarkets: []
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Try to fetch real data using AirDNA API
    if (hasValidApiKeys && userApiKeys?.airdna_api_key) {
      console.log('Fetching real market data from AirDNA...');
      try {
        // Use combined approach if we have both API keys, otherwise just AirDNA
        const realMarketData = userApiKeys.rental_api_key 
          ? await fetchCombinedMarketData(city, userApiKeys.airdna_api_key, userApiKeys.rental_api_key, propertyType, bathrooms)
          : await fetchAirDNAMarketData(city, userApiKeys.airdna_api_key, propertyType, bathrooms);
          
        if (realMarketData && realMarketData.length > 0) {
          console.log(`Successfully fetched ${realMarketData.length} real submarkets from APIs`);
          return new Response(
            JSON.stringify({
              submarkets: realMarketData,
              city: city,
              propertyType,
              bathrooms,
              dataSource: userApiKeys.rental_api_key ? 'combined_apis' : 'airdna_api'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Real APIs failed:', error);
        // Continue to OpenAI fallback
      }
    }

    // If we reach here, we only have OpenAI - try to get real neighborhoods
    const neighborhoods = await generateRealNeighborhoods(city);
    
    // If OpenAI failed to generate real neighborhoods, return no data
    if (!neighborhoods || neighborhoods.length === 0) {
      console.log('Failed to generate real neighborhoods');
      return new Response(
        JSON.stringify({ 
          error: 'No available data',
          message: 'Unable to fetch real market data for this city.',
          submarkets: []
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`No real market data available for ${city}`);

    return new Response(
      JSON.stringify({ 
        error: 'No available data',
        message: 'Real market data is not available for this city.',
        submarkets: []
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in fetch-market-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch market data',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// RentCast API integration for rental data
async function fetchRentCastRentalData(city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<any[]> {
  console.log(`Fetching RentCast rental data for ${city}`);
  
  try {
    // RentCast uses zip codes, so we'll need to search by city name first
    // This is a simplified approach - in production you'd want to get zip codes for the city
    const searchResponse = await fetch(`https://api.rentcast.io/v1/markets/search?city=${encodeURIComponent(city)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      console.error(`RentCast API error: ${searchResponse.status} ${searchResponse.statusText}`);
      throw new Error(`RentCast search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('RentCast search response:', JSON.stringify(searchData, null, 2));

    // Extract rental data and format for our use
    if (searchData && searchData.length > 0) {
      return searchData.slice(0, 8).map((market: any) => ({
        submarket: market.name || `${city} Area`,
        medianRent: market.rent_median || market.rent_average || 0,
        rentPerSqft: market.rent_per_sqft || 0
      }));
    }

    return [];
  } catch (error) {
    console.error('RentCast API integration error:', error);
    throw error;
  }
}

// Enhanced AirDNA integration with rental data combination
async function fetchCombinedMarketData(city: string, airdnaKey: string, rentcastKey: string, propertyType: string, bathrooms: string): Promise<any[]> {
  console.log(`Fetching combined market data for ${city}`);
  
  try {
    // Fetch both STR data from AirDNA and rental data from RentCast in parallel
    const [airdnaData, rentalData] = await Promise.all([
      fetchAirDNAMarketData(city, airdnaKey, propertyType, bathrooms).catch(() => []),
      rentcastKey ? fetchRentCastRentalData(city, rentcastKey, propertyType, bathrooms).catch(() => []) : []
    ]);

    console.log(`AirDNA returned ${airdnaData.length} results, RentCast returned ${rentalData.length} results`);

    // If we have both datasets, combine them for more accurate results
    if (airdnaData.length > 0 && rentalData.length > 0) {
      // Create a map of rental data by area name for lookup
      const rentalMap = new Map();
      rentalData.forEach(rental => {
        const key = rental.submarket.toLowerCase().trim();
        rentalMap.set(key, rental.medianRent);
      });

      // Enhanced AirDNA data with real rental prices where available
      const combinedData = airdnaData.map(airdata => {
        const areaKey = airdata.submarket.toLowerCase().trim();
        const realRent = rentalMap.get(areaKey);
        
        if (realRent && realRent > 0) {
          // Use real rent data for more accurate multiple
          return {
            ...airdata,
            medianRent: realRent,
            multiple: Number((airdata.strRevenue / realRent).toFixed(2))
          };
        }
        return airdata;
      });

      return combinedData.sort((a, b) => b.multiple - a.multiple);
    }

    // Return AirDNA data if that's all we have
    if (airdnaData.length > 0) {
      return airdnaData;
    }

    // If we only have rental data, we can't calculate STR multiples
    console.log('Only rental data available, cannot calculate STR multiples');
    return [];

  } catch (error) {
    console.error('Combined market data fetch error:', error);
    throw error;
  }
}
async function fetchAirDNAMarketData(city: string, apiKey: string, propertyType: string, bathrooms: string): Promise<any[]> {
  console.log(`Fetching AirDNA data for ${city} with property type ${propertyType}BR/${bathrooms}BA`);
  
  try {
    // Step 1: Search for markets/submarkets in the city
    const searchResponse = await fetch('https://api.airdna.co/api/enterprise/v2/market/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_term: city,
        pagination: {
          page_size: 20,
          offset: 0
        }
      }),
    });

    if (!searchResponse.ok) {
      console.error(`AirDNA search API error: ${searchResponse.status} ${searchResponse.statusText}`);
      throw new Error(`AirDNA search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('AirDNA search response:', JSON.stringify(searchData, null, 2));

    if (!searchData.payload?.results || searchData.payload.results.length === 0) {
      console.log('No markets found for city:', city);
      return [];
    }

    // Filter for submarkets (neighborhoods) preferentially, fallback to markets
    const submarkets = searchData.payload.results.filter((result: any) => 
      result.type === 'submarket'
    ).slice(0, 8);
    
    const marketsToFetch = submarkets.length > 0 ? submarkets : 
      searchData.payload.results.filter((result: any) => result.type === 'market').slice(0, 8);

    if (marketsToFetch.length === 0) {
      console.log('No usable markets or submarkets found');
      return [];
    }

    console.log(`Found ${marketsToFetch.length} ${submarkets.length > 0 ? 'submarkets' : 'markets'} to fetch data for`);

    // Step 2: Fetch revenue data for each submarket/market
    const marketDataPromises = marketsToFetch.map(async (market: any) => {
      try {
        const isSubmarket = market.type === 'submarket';
        const endpoint = isSubmarket 
          ? `https://api.airdna.co/api/enterprise/v2/submarket/${market.id}/revenue`
          : `https://api.airdna.co/api/enterprise/v2/market/${market.id}/revenue`;

        // Create filters for property type and bathrooms
        const filters = [];
        
        // Add bedroom filter
        if (propertyType && propertyType !== '0') {
          filters.push({
            field: 'bedrooms',
            operator: 'eq',
            value: parseInt(propertyType)
          });
        }
        
        // Add bathroom filter  
        if (bathrooms && bathrooms !== '0') {
          filters.push({
            field: 'bathrooms',
            operator: 'eq',
            value: parseInt(bathrooms)
          });
        }

        const revenueResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num_months: 12, // Get last 12 months of data
            filters: filters.length > 0 ? filters : undefined,
            currency: 'usd'
          }),
        });

        if (!revenueResponse.ok) {
          console.error(`Revenue API error for ${market.name}: ${revenueResponse.status}`);
          return null;
        }

        const revenueData = await revenueResponse.json();
        console.log(`Revenue data for ${market.name}:`, JSON.stringify(revenueData.payload?.metrics?.slice(0, 2), null, 2));

        // Extract latest revenue data
        if (revenueData.payload?.metrics && revenueData.payload.metrics.length > 0) {
          const latestMetrics = revenueData.payload.metrics[0]; // Most recent month
          const avgRevenue = latestMetrics.percentiles?.['50th'] || latestMetrics.median || 0;
          
          // Estimate rent (typically STR revenue is 1.5-2x monthly rent)
          const estimatedRent = Math.round(avgRevenue / 1.75);
          const multiple = avgRevenue / estimatedRent;

          return {
            submarket: market.name,
            strRevenue: Math.round(avgRevenue),
            medianRent: estimatedRent,
            multiple: Number(multiple.toFixed(2))
          };
        }

        return null;
      } catch (error) {
        console.error(`Error fetching revenue for ${market.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(marketDataPromises);
    const validResults = results
      .filter(result => result !== null && result.strRevenue > 0)
      .sort((a, b) => b.multiple - a.multiple);

    console.log(`Successfully processed ${validResults.length} markets with revenue data`);
    return validResults;

  } catch (error) {
    console.error('AirDNA API integration error:', error);
    throw error;
  }
}

async function generateRealNeighborhoods(city: string): Promise<string[]> {
  console.log(`Attempting to generate neighborhoods for ${city}, OpenAI key available: ${!!openaiApiKey}`);
  
  if (!openaiApiKey || !(openaiApiKey.startsWith('sk-') || openaiApiKey.startsWith('sk-proj-'))) {
    console.log('No valid OpenAI API key available');
    return [];
  }

  try {
    console.log(`Making OpenAI API call for ${city} neighborhoods...`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a local real estate expert who knows actual neighborhood names. Provide 8 real, specific neighborhood names that exist in the given city. Return ONLY the neighborhood names, one per line, no numbers, bullets, or descriptions. Use actual neighborhood names that locals would recognize.'
          },
          {
            role: 'user',
            content: `List 8 real, actual neighborhood names in ${city} that are popular for short-term rentals. Include well-known districts, historic areas, and neighborhoods that tourists visit. Use the exact names locals use.`
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('OpenAI response received:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0]?.message?.content) {
      const neighborhoods = data.choices[0].message.content
        .trim()
        .split('\n')
        .map((name: string) => name.trim())
        .filter((name: string) => name.length > 0 && !name.match(/^\d+\./) && !name.includes('•'))
        .slice(0, 8);
      
      console.log(`Successfully generated ${neighborhoods.length} AI neighborhoods for ${city}:`, neighborhoods);
      
      if (neighborhoods.length >= 4) {
        return neighborhoods;
      }
    }
    
    console.log('OpenAI response insufficient');
    return [];
  } catch (error) {
    console.error('OpenAI API error:', error);
    return [];
  }
}

// Helper functions removed - no longer generating fake data