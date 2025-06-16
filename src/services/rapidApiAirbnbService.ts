import { supabase } from '@/integrations/supabase/client';

interface AirbnbProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  monthlyRevenue: number;
  occupancyRate: number;
  rating: number;
  reviews: number;
  neighborhood: string;
}

interface AirbnbEarningsData {
  properties: AirbnbProperty[];
  averageRevenue: number;
  totalProperties: number;
  city: string;
}

export const fetchAirbnbEarningsData = async (city: string, propertyType: string = '2') => {
  try {
    console.log(`🚀 Calling RapidAPI Airbnb Scraper for ${city}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-airbnb', {
      body: {
        city,
        propertyType,
        action: 'get_earnings'
      }
    });

    if (error) {
      throw new Error(`RapidAPI call failed: ${error.message}`);
    }

    console.log('✅ RapidAPI Airbnb response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ RapidAPI Airbnb error:', error);
    throw error;
  }
};

// New function for income prediction
export const fetchIncomePredicition = async (propertyId: string) => {
  try {
    console.log(`💰 Calling Income Prediction API for property: ${propertyId}`);
    
    const { data, error } = await supabase.functions.invoke('rapidapi-airbnb', {
      body: {
        propertyId,
        action: 'get_income_prediction'
      }
    });

    if (error) {
      throw new Error(`Income Prediction API call failed: ${error.message}`);
    }

    console.log('✅ Income Prediction response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Income Prediction API error:', error);
    throw error;
  }
};

export const processAirbnbEarningsData = (apiData: any): AirbnbEarningsData => {
  console.log('🔍 Processing RapidAPI Airbnb earnings data:', apiData);
  
  let processedProperties: AirbnbProperty[] = [];
  
  if (apiData && apiData.data) {
    const properties = apiData.data.properties || [];
    
    processedProperties = properties.map((property: any) => ({
      id: property.id || property.listing_id || Math.random().toString(),
      name: property.name || property.title || 'No Data Available',
      location: property.location || property.address || 'No Data Available',
      price: property.price || property.nightly_rate || 0,
      monthlyRevenue: property.monthly_revenue || (property.price * 20) || 0,
      occupancyRate: property.occupancy_rate || property.occupancy || 0,
      rating: property.rating || property.review_score || 0,
      reviews: property.reviews || property.review_count || 0,
      neighborhood: property.neighborhood || property.district || 'No Data Available'
    }));
  }
  
  const validProperties = processedProperties.filter(prop => prop.monthlyRevenue > 0);
  const averageRevenue = validProperties.length > 0 
    ? validProperties.reduce((sum, prop) => sum + prop.monthlyRevenue, 0) / validProperties.length
    : 0;
  
  return {
    properties: processedProperties,
    averageRevenue: Math.round(averageRevenue),
    totalProperties: processedProperties.length,
    city: apiData?.data?.city || 'Unknown City'
  };
};

// Fetch real rental data using OpenAI ChatGPT - ONLY SOURCE FOR RENTAL DATA
export const fetchRealRentalData = async (city: string, propertyType: string = '2', neighborhood?: string) => {
  try {
    console.log(`🤖 Fetching OpenAI ChatGPT rental data for ${neighborhood ? neighborhood + ', ' + city : city} - ${propertyType}BR/2BA`);
    
    const { data, error } = await supabase.functions.invoke('openai-rental-data', {
      body: {
        city,
        bedrooms: propertyType,
        bathrooms: '2',
        neighborhood: neighborhood || null
      }
    });

    if (error) {
      console.error('❌ OpenAI rental data call failed:', error);
      throw new Error(`Failed to fetch real rental data from OpenAI: ${error.message}`);
    }

    if (!data || !data.success) {
      console.error('❌ OpenAI rental data failed:', data);
      throw new Error('OpenAI rental data request was not successful');
    }

    console.log('✅ OpenAI ChatGPT rental data response:', data);
    return data;
  } catch (error) {
    console.error('❌ OpenAI rental data error:', error);
    throw error;
  }
};

// Process rental data from OpenAI ChatGPT - SIMPLIFIED TO JUST RETURN THE RENTALS
export const processRentalData = (rentalData: any) => {
  console.log('🔍 Processing OpenAI rental data:', rentalData);
  
  if (!rentalData || !rentalData.data || !rentalData.data.rentals) {
    console.error('❌ Invalid rental data structure:', rentalData);
    return [];
  }

  const rentals = rentalData.data.rentals;
  console.log('✅ Raw rentals from OpenAI:', rentals);
  
  // Return the rentals exactly as they come from OpenAI
  return rentals;
};
