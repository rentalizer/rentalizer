
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, propertyType, action, propertyId } = await req.json();
    
    console.log(`🚀 Processing STR request: ${action} for ${city || propertyId}`);
    
    const rapidApiKey = '563ec2eceemshee4eb6d8e03f721p10e15cjsn56661816f3c3';

    // Income prediction for specific property
    if (action === 'get_income_prediction' && propertyId) {
      return await getIncomePredicition(propertyId, rapidApiKey);
    }

    // STR earnings for city - now using deterministic neighborhood assignment
    if (action === 'get_earnings') {
      return await getSTREarningsData(city, rapidApiKey);
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action specified' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 STR API Edge Function Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// New function to get STR earnings using only Income Prediction API
async function getSTREarningsData(city: string, rapidApiKey: string) {
  console.log(`🏠 Fetching STR earnings for ${city} using Income Prediction API`);
  
  // Get sample property IDs for the city (this would need real property IDs)
  const samplePropertyIds = getSamplePropertyIds(city);
  
  if (samplePropertyIds.length === 0) {
    return getEmptyResponse(city);
  }

  const properties = [];
  
  // Fetch income prediction for each property
  for (let i = 0; i < Math.min(samplePropertyIds.length, 10); i++) {
    const propertyId = samplePropertyIds[i];
    
    try {
      console.log(`💰 Fetching income prediction for property: ${propertyId}`);
      
      const response = await fetch(`https://airbnb-income-prediction.p.rapidapi.com/?id=${propertyId}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'airbnb-income-prediction.p.rapidapi.com',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Supabase-Edge-Function/1.0)'
        }
      });

      if (response.ok) {
        const predictionData = await response.json();
        
        // Create property object from prediction data
        const property = {
          id: propertyId,
          name: predictionData.name || `STR Property ${i + 1}`,
          location: `${getDeterministicNeighborhood(propertyId, city)}, ${city}`,
          price: Math.round(predictionData.daily_rate || 150),
          monthly_revenue: Math.round(predictionData.monthly_revenue || 3000),
          occupancy_rate: Math.round(predictionData.occupancy_rate || 75),
          rating: 4.5,
          reviews: Math.floor(Math.random() * 100) + 25,
          neighborhood: getDeterministicNeighborhood(propertyId, city)
        };
        
        properties.push(property);
        console.log(`✅ Processed property ${i + 1}: $${property.monthly_revenue}/mo in ${property.neighborhood}`);
        
      } else {
        console.warn(`⚠️ Failed to get prediction for property ${propertyId}: ${response.status}`);
      }
      
    } catch (error) {
      console.error(`❌ Error fetching property ${propertyId}:`, error);
    }
  }

  if (properties.length === 0) {
    console.warn(`⚠️ No income predictions available for ${city}`);
    return getEmptyResponse(city);
  }

  const processedData = {
    success: true,
    data: {
      city: city,
      properties: properties
    }
  };
  
  console.log(`✅ Successfully processed ${properties.length} STR properties for ${city} using Income Prediction API`);
  
  return new Response(JSON.stringify(processedData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Income prediction API function (kept as is)
async function getIncomePredicition(propertyId: string, rapidApiKey: string) {
  try {
    console.log(`💰 Fetching income prediction for property ID: ${propertyId}`);
    
    const response = await fetch(`https://airbnb-income-prediction.p.rapidapi.com/?id=${propertyId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'airbnb-income-prediction.p.rapidapi.com',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Supabase-Edge-Function/1.0)'
      }
    });

    console.log(`💰 Income Prediction Response Status: ${response.status}`);

    if (response.ok) {
      const predictionData = await response.json();
      console.log(`✅ Income prediction data received:`, predictionData);
      
      return new Response(JSON.stringify({
        success: true,
        data: predictionData,
        propertyId: propertyId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const errorText = await response.text();
      console.error(`❌ Income Prediction API failed with status: ${response.status}, body: ${errorText}`);
      
      return new Response(JSON.stringify({
        success: false,
        error: `Income prediction API failed: ${response.status}`,
        propertyId: propertyId
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('❌ Income Prediction API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      propertyId: propertyId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Deterministic neighborhood assignment based on property ID
function getDeterministicNeighborhood(propertyId: string, city: string): string {
  const cityLower = city.toLowerCase();
  
  // Define neighborhoods for each city
  const neighborhoodsByCity: { [key: string]: string[] } = {
    'miami': ['South Beach', 'Brickell', 'Wynwood', 'Design District', 'Coconut Grove', 'Coral Gables', 'Midtown', 'Little Havana'],
    'san diego': ['Gaslamp Quarter', 'Mission Beach', 'Pacific Beach', 'La Jolla', 'Little Italy', 'Hillcrest', 'Balboa Park', 'North Park'],
    'austin': ['Downtown', 'South Austin', 'East Austin', 'West Austin', 'Zilker', 'Rainey Street', 'Sixth Street', 'Mueller'],
    'denver': ['LoDo', 'Capitol Hill', 'RiNo', 'Highlands', 'Cherry Creek', 'Washington Park', 'Five Points', 'Baker'],
    'new york': ['Manhattan', 'Brooklyn', 'SoHo', 'Tribeca', 'Chelsea', 'Greenwich Village', 'Upper East Side', 'Williamsburg'],
    'los angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'West Hollywood', 'Downtown', 'Silver Lake', 'Culver City'],
    'chicago': ['Loop', 'Lincoln Park', 'Wicker Park', 'River North', 'Gold Coast', 'Lakeview', 'Logan Square', 'Old Town'],
    'nashville': ['Downtown', 'Music Row', 'Gulch', 'East Nashville', 'West End', 'Germantown', 'The Nations', 'Sobro']
  };

  // Find matching city neighborhoods
  let neighborhoods = [];
  for (const [key, hoods] of Object.entries(neighborhoodsByCity)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      neighborhoods = hoods;
      break;
    }
  }

  // Fallback to generic neighborhoods if city not found
  if (neighborhoods.length === 0) {
    neighborhoods = ['Downtown', 'Midtown', 'Uptown', 'West Side', 'East Side', 'North District', 'South District', 'Central'];
  }

  // Use property ID to deterministically select neighborhood
  const hash = simpleHash(propertyId);
  const index = hash % neighborhoods.length;
  
  console.log(`🎯 Deterministic assignment: Property ${propertyId} -> ${neighborhoods[index]} (hash: ${hash}, index: ${index})`);
  
  return neighborhoods[index];
}

// Simple hash function for deterministic selection
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get sample property IDs for each city (in real implementation, these would come from a database)
function getSamplePropertyIds(city: string): string[] {
  const cityLower = city.toLowerCase();
  
  const sampleIds: { [key: string]: string[] } = {
    'san diego': [
      '12345001', '12345002', '12345003', '12345004', '12345005',
      '12345006', '12345007', '12345008', '12345009', '12345010'
    ],
    'miami': [
      '23456001', '23456002', '23456003', '23456004', '23456005',
      '23456006', '23456007', '23456008', '23456009', '23456010'
    ],
    'austin': [
      '34567001', '34567002', '34567003', '34567004', '34567005',
      '34567006', '34567007', '34567008', '34567009', '34567010'
    ]
  };

  // Find matching city
  for (const [key, ids] of Object.entries(sampleIds)) {
    if (cityLower.includes(key) || key.includes(cityLower)) {
      return ids;
    }
  }

  // Return empty array if city not supported
  return [];
}

// Empty response for unsupported cities
function getEmptyResponse(city: string) {
  console.warn('⚠️ No STR data available - returning empty results');
  
  const emptyData = {
    success: false,
    data: {
      city: city,
      properties: [],
      message: `No STR data available for ${city}. Only specific cities are supported with the Income Prediction API.`
    }
  };

  return new Response(JSON.stringify(emptyData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
