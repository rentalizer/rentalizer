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
          .single();
        
        userApiKeys = apiKeys;
      }
    }

    // Get the AirDNA API key (user's key or system key)
    const airdnaApiKey = userApiKeys?.airdna_api_key || Deno.env.get('AIRDNA_API_KEY');
    console.log('AirDNA API key available:', !!airdnaApiKey);

    if (airdnaApiKey) {
      try {
        // Call AirDNA Rentalizer API for real data
        console.log(`Calling AirDNA API for ${city}...`);
        const encodedCity = encodeURIComponent(city);
        const airdnaUrl = `https://airdna1.p.rapidapi.com/rentalizer?address=${encodedCity}&bedrooms=${propertyType}&bathrooms=${bathrooms}&accommodate=${propertyType}`;
        console.log('Using AirDNA endpoint:', airdnaUrl);

        const airdnaResponse = await fetch(airdnaUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': airdnaApiKey,
            'X-RapidAPI-Host': 'airdna1.p.rapidapi.com'
          }
        });

        console.log('AirDNA API response status:', airdnaResponse.status);

        if (airdnaResponse.ok) {
          const airdnaData = await airdnaResponse.json();
          console.log('AirDNA data received:', JSON.stringify(airdnaData, null, 2));

          // Process real AirDNA data
          const submarketData = [];

          if (airdnaData.data?.property_statistics?.revenue?.ltm && airdnaData.data?.comps) {
            // Main property data
            const mainRevenue = airdnaData.data.property_statistics.revenue.ltm;
            const mainAdr = airdnaData.data.property_statistics.adr?.ltm || 150;
            const estimatedRent = Math.round(mainAdr * 30 * 0.7); // Estimate monthly rent from ADR
            
            if (estimatedRent > 0) {
              const multiple = mainRevenue / (estimatedRent * 12); // Annual multiple
              if (multiple >= 1.4) {
                submarketData.push({
                  submarket: airdnaData.data.combined_market_info?.airdna_submarket_name || city,
                  strRevenue: Math.round(mainRevenue),
                  medianRent: estimatedRent,
                  multiple: Number(multiple.toFixed(2))
                });
              }
            }

            // Process comparable properties
            airdnaData.data.comps.forEach((comp, index) => {
              if (comp.stats?.adr?.ltm && comp.title) {
                const compAdr = comp.stats.adr.ltm;
                const estimatedMonthlyRent = Math.round(compAdr * 30 * 0.7);
                const estimatedAnnualRevenue = Math.round(compAdr * 30 * 12 * 0.4); // Assume 40% occupancy
                
                if (estimatedMonthlyRent > 0) {
                  const multiple = estimatedAnnualRevenue / (estimatedMonthlyRent * 12);
                  if (multiple >= 1.4) {
                    submarketData.push({
                      submarket: comp.title.substring(0, 50) + (comp.title.length > 50 ? '...' : ''),
                      strRevenue: estimatedAnnualRevenue,
                      medianRent: estimatedMonthlyRent,
                      multiple: Number(multiple.toFixed(2))
                    });
                  }
                }
              }
            });
          }

          // Sort by multiple and limit results
          const filteredResults = submarketData
            .sort((a, b) => b.multiple - a.multiple)
            .slice(0, 8);

          console.log(`Processed ${filteredResults.length} real submarkets from AirDNA`);

          if (filteredResults.length > 0) {
            return new Response(
              JSON.stringify({
                submarkets: filteredResults,
                city: city,
                propertyType,
                bathrooms,
                dataSource: 'airdna_real_data'
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        } else {
          console.error('AirDNA API error:', airdnaResponse.status, airdnaResponse.statusText);
        }
      } catch (error) {
        console.error('Error calling AirDNA API:', error);
      }
    }

    // Fallback: Generate realistic neighborhoods using OpenAI
    console.log('Using AI-generated fallback data');
    const neighborhoods = await generateRealNeighborhoods(city);
    
    // Generate market data for each neighborhood
    const submarketData = await Promise.all(
      neighborhoods.map(async (neighborhood, index) => {
        // Calculate property type multipliers
        const bedroomMultiplier = propertyType === '1' ? 0.75 : propertyType === '3' ? 1.25 : 1.0;
        const bathroomMultiplier = bathrooms === '1' ? 0.9 : bathrooms === '3' ? 1.1 : 1.0;
        
        // Generate realistic base values with city-specific variation
        const cityFactor = getCityFactor(city.toLowerCase());
        const neighborhoodVariation = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15 variation
        
        // More realistic base rent calculation
        const baseRentRange = getCityRentRange(city.toLowerCase());
        const baseRent = Math.round((baseRentRange.min + Math.random() * (baseRentRange.max - baseRentRange.min)) * bedroomMultiplier);
        const baseRevenue = Math.round(baseRent * (1.4 + Math.random() * 0.4) * bathroomMultiplier * neighborhoodVariation);
        
        const multiple = baseRevenue / baseRent;
        
        return {
          submarket: neighborhood,
          strRevenue: baseRevenue,
          medianRent: baseRent,
          multiple: Number(multiple.toFixed(2))
        };
      })
    );

    // Filter and sort results
    const filteredResults = submarketData
      .filter(item => item.multiple >= 1.4)
      .sort((a, b) => b.multiple - a.multiple)
      .slice(0, 8); // Limit to top 8 results

    console.log(`Generated ${filteredResults.length} submarkets for ${city}`);

    return new Response(
      JSON.stringify({
        submarkets: filteredResults,
        city: city,
        propertyType,
        bathrooms,
        dataSource: 'ai_generated'
      }),
      {
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

async function generateRealNeighborhoods(city: string): Promise<string[]> {
  console.log(`Attempting to generate neighborhoods for ${city}, OpenAI key available: ${!!openaiApiKey}`);
  
  if (!openaiApiKey) {
    console.log('No OpenAI API key available, using enhanced fallback neighborhoods');
    return generateFallbackNeighborhoods(city);
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
      throw new Error(`OpenAI API error: ${response.status}`);
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
    
    console.log('OpenAI response insufficient, using fallback');
  } catch (error) {
    console.error('OpenAI API error:', error);
  }

  console.log('Falling back to enhanced neighborhood data');
  return generateFallbackNeighborhoods(city);
}

function generateFallbackNeighborhoods(city: string): string[] {
  const cityLower = city.toLowerCase().trim();
  
  // Enhanced city-specific fallbacks with real neighborhood names
  const cityNeighborhoods: { [key: string]: string[] } = {
    'portland': ['Pearl District', 'Hawthorne', 'Alberta Arts District', 'Nob Hill', 'Sellwood', 'Belmont District', 'Irvington', 'Mississippi District'],
    'san diego': ['Gaslamp Quarter', 'Little Italy', 'Pacific Beach', 'La Jolla', 'Hillcrest', 'Mission Valley', 'Balboa Park', 'Point Loma'],
    'san antonio': ['Southtown', 'Pearl District', 'King William', 'Alamo Heights', 'Monte Vista', 'River Walk', 'Downtown', 'Brackenridge Park'],
    'los angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'West Hollywood', 'Downtown LA', 'Silver Lake', 'Manhattan Beach'],
    'san francisco': ['SoMa', 'Mission District', 'Nob Hill', 'Castro', 'Marina District', 'Fishermans Wharf', 'Pacific Heights', 'Chinatown'],
    'new york': ['Midtown', 'SoHo', 'Greenwich Village', 'Lower East Side', 'Chelsea', 'Tribeca', 'Financial District', 'Upper West Side'],
    'chicago': ['Lincoln Park', 'Wicker Park', 'River North', 'Gold Coast', 'Loop', 'Bucktown', 'Logan Square', 'Old Town'],
    'miami': ['South Beach', 'Wynwood', 'Brickell', 'Design District', 'Coconut Grove', 'Coral Gables', 'Key Biscayne', 'Little Havana'],
    'denver': ['LoDo', 'Capitol Hill', 'Highland', 'RiNo', 'Cherry Creek', 'Washington Park', 'Five Points', 'Stapleton'],
    'austin': ['Downtown', 'South Lamar', 'East Austin', 'Zilker', 'The Domain', 'Mueller', 'Rainey Street', 'Barton Hills'],
    'nashville': ['Music Row', 'The Gulch', 'Downtown', 'Belle Meade', 'Green Hills', 'Hillsboro Village', 'Germantown', 'East Nashville'],
    'seattle': ['Capitol Hill', 'Fremont', 'Ballard', 'Queen Anne', 'Georgetown', 'Wallingford', 'University District', 'Pioneer Square'],
    'boston': ['Back Bay', 'North End', 'Beacon Hill', 'South End', 'Cambridge', 'Somerville', 'Jamaica Plain', 'Charlestown'],
    'washington': ['Dupont Circle', 'Georgetown', 'Adams Morgan', 'Capitol Hill', 'Logan Circle', 'U Street', 'Navy Yard', 'Foggy Bottom'],
    'philadelphia': ['Old City', 'Rittenhouse Square', 'Northern Liberties', 'Fishtown', 'Center City', 'Society Hill', 'Fairmount', 'Graduate Hospital'],
    'atlanta': ['Midtown', 'Buckhead', 'Virginia Highland', 'Little Five Points', 'Inman Park', 'Poncey Highland', 'Old Fourth Ward', 'Grant Park'],
    'vancouver': ['Gastown', 'Yaletown', 'Kitsilano', 'West End', 'Commercial Drive', 'Mount Pleasant', 'Chinatown', 'False Creek'],
    'toronto': ['King West', 'Queen West', 'Distillery District', 'Yorkville', 'Kensington Market', 'Liberty Village', 'Entertainment District', 'Corktown'],
    'manila': ['Makati', 'BGC', 'Ortigas', 'Malate', 'Ermita', 'Intramuros', 'Quezon City', 'Bonifacio Global City'],
    'cebu': ['IT Park', 'Lahug', 'Ayala Center', 'Capitol Site', 'Colon', 'Fuente Circle', 'Banilad', 'Talamban'],
    'tokyo': ['Shibuya', 'Shinjuku', 'Ginza', 'Harajuku', 'Roppongi', 'Akasaka', 'Asakusa', 'Ueno'],
    'london': ['Shoreditch', 'Camden', 'Notting Hill', 'Covent Garden', 'Soho', 'Kensington', 'Canary Wharf', 'Borough'],
    'paris': ['Marais', 'Saint-Germain', 'Montmartre', 'Latin Quarter', 'Champs-Élysées', 'Belleville', 'Bastille', 'Opéra'],
    'barcelona': ['Gothic Quarter', 'Eixample', 'Gracia', 'El Born', 'Barceloneta', 'Poble Nou', 'Sarria', 'Les Corts'],
    'amsterdam': ['Jordaan', 'De Pijp', 'Oud-Zuid', 'Centrum', 'Noord', 'Oost', 'Nieuw-West', 'Vondelpark'],
    'berlin': ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Charlottenburg', 'Friedrichshain', 'Schöneberg', 'Neukölln', 'Wedding']
  };

  console.log(`Looking up fallback neighborhoods for: "${cityLower}"`);
  
  if (cityNeighborhoods[cityLower]) {
    console.log(`Found specific neighborhoods for ${city}:`, cityNeighborhoods[cityLower]);
    return cityNeighborhoods[cityLower];
  }

  // Check for partial matches (e.g., "santa monica" matches "los angeles" area)
  const partialMatches: { [key: string]: string[] } = {
    'santa monica': ['Santa Monica Pier', 'Third Street Promenade', 'Venice Beach', 'Marina del Rey', 'Playa del Rey', 'El Segundo', 'Manhattan Beach', 'Hermosa Beach'],
  };

  for (const [key, neighborhoods] of Object.entries(partialMatches)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      console.log(`Found partial match for ${city}:`, neighborhoods);
      return neighborhoods;
    }
  }

  console.log(`No specific neighborhoods found for ${city}, generating generic ones`);
  // Generic but realistic neighborhood names for other cities
  return [
    `${city} Downtown`,
    `${city} Historic District`,
    `${city} Arts District`,
    `${city} Riverfront`,
    `${city} University Area`,
    `${city} Uptown`,
    `${city} Old Town`,
    `${city} Cultural Quarter`
  ];
}

function getCityFactor(city: string): number {
  // Adjust base prices based on city cost of living
  const cityFactors: { [key: string]: number } = {
    'san francisco': 1.8,
    'new york': 1.7,
    'los angeles': 1.4,
    'san diego': 1.3,
    'seattle': 1.3,
    'miami': 1.2,
    'chicago': 1.1,
    'denver': 1.0,
    'austin': 1.0,
    'nashville': 0.9,
    'atlanta': 0.9,
    'san antonio': 0.75,
    'phoenix': 0.8,
    'dallas': 0.8,
    'houston': 0.8
  };

  return cityFactors[city] || 1.0; // Default multiplier for unknown cities
}

function getCityRentRange(city: string): { min: number; max: number } {
  // Realistic rent ranges for 2BR apartments based on actual market data
  const cityRentRanges: { [key: string]: { min: number; max: number } } = {
    'san francisco': { min: 3500, max: 5500 },
    'new york': { min: 3000, max: 5000 },
    'los angeles': { min: 2500, max: 3800 },
    'san diego': { min: 2300, max: 3500 },
    'seattle': { min: 2200, max: 3400 },
    'miami': { min: 2000, max: 3200 },
    'chicago': { min: 1800, max: 2800 },
    'denver': { min: 1700, max: 2600 },
    'austin': { min: 1600, max: 2500 },
    'san antonio': { min: 900, max: 1400 }, // Realistic San Antonio prices
    'nashville': { min: 1400, max: 2200 },
    'atlanta': { min: 1300, max: 2100 },
    'phoenix': { min: 1200, max: 2000 },
    'dallas': { min: 1300, max: 2100 },
    'houston': { min: 1200, max: 1900 }
  };

  return cityRentRanges[city] || { min: 1200, max: 2000 }; // Default range
}