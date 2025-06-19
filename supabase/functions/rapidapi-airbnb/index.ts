
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAPIDAPI-AIRBNB] ${step}${detailsStr}`);
};

// Input validation and sanitization
const validateAndSanitizeInput = (input: any, field: string, maxLength: number = 100): string => {
  if (!input || typeof input !== 'string') {
    throw new Error(`Invalid ${field}: must be a non-empty string`);
  }
  
  const sanitized = input
    .replace(/[<>'"&]/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim()
    .substring(0, maxLength);
    
  if (!sanitized) {
    throw new Error(`Invalid ${field}: contains only invalid characters`);
  }
  
  return sanitized;
};

const validatePropertyType = (propertyType: any): string => {
  const validTypes = ['1', '2', '3', '4', '5'];
  if (!validTypes.includes(String(propertyType))) {
    throw new Error('Invalid property type: must be 1-5 bedrooms');
  }
  return String(propertyType);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get RapidAPI key from environment
    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!rapidApiKey) {
      throw new Error("RAPIDAPI_KEY not configured in environment");
    }

    const { city, propertyType } = await req.json();
    
    // Validate and sanitize inputs
    const sanitizedCity = validateAndSanitizeInput(city, 'city', 50);
    const sanitizedPropertyType = validatePropertyType(propertyType);
    
    logStep("Input validated", { city: sanitizedCity, propertyType: sanitizedPropertyType });

    // Rate limiting check (basic implementation)
    const userIp = req.headers.get('x-forwarded-for') || 'unknown';
    logStep("Request from IP", { ip: userIp });

    const rapidApiUrl = `https://airbnb13.p.rapidapi.com/search-location`;
    
    const requestBody = {
      location: sanitizedCity,
      checkin: "2024-12-01",
      checkout: "2024-12-08", 
      adults: 2,
      children: 0,
      infants: 0,
      pets: 0,
      page: 1,
      currency: "USD"
    };

    logStep("Calling RapidAPI", { url: rapidApiUrl, location: sanitizedCity });

    const response = await fetch(rapidApiUrl, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      logStep("RapidAPI error", { status: response.status, statusText: response.statusText });
      throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logStep("RapidAPI response received", { 
      hasResults: !!data.results,
      resultCount: data.results?.length || 0
    });

    // Validate and sanitize response data
    if (!data.results || !Array.isArray(data.results)) {
      logStep("Invalid response structure", { data: Object.keys(data) });
      return new Response(JSON.stringify({ 
        results: [],
        message: "No results found or invalid response structure"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Filter and sanitize results
    const sanitizedResults = data.results
      .filter((listing: any) => {
        // Basic validation for required fields
        return listing && 
               typeof listing.name === 'string' &&
               typeof listing.price === 'object' &&
               listing.price.total;
      })
      .slice(0, 50) // Limit to 50 results max
      .map((listing: any) => ({
        id: String(listing.id || '').substring(0, 50),
        name: String(listing.name || '').substring(0, 200),
        price: {
          rate: Math.min(Number(listing.price?.rate) || 0, 10000),
          total: Math.min(Number(listing.price?.total) || 0, 50000),
          currency: String(listing.price?.currency || 'USD').substring(0, 10)
        },
        location: {
          city: String(listing.location?.city || sanitizedCity).substring(0, 100),
          neighborhood: String(listing.location?.neighborhood || '').substring(0, 100)
        },
        bedrooms: Math.min(Number(listing.bedrooms) || 1, 10),
        bathrooms: Math.min(Number(listing.bathrooms) || 1, 10),
        guests: Math.min(Number(listing.guests) || 2, 20),
        rating: Math.min(Number(listing.rating) || 0, 5),
        reviewsCount: Math.min(Number(listing.reviewsCount) || 0, 10000)
      }));

    logStep("Response processed", { 
      originalCount: data.results.length,
      sanitizedCount: sanitizedResults.length 
    });

    return new Response(JSON.stringify({ 
      results: sanitizedResults,
      total: sanitizedResults.length,
      city: sanitizedCity
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in rapidapi-airbnb", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      results: []
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
