
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

export const processAirbnbEarningsData = (apiData: any): AirbnbEarningsData => {
  console.log('🔍 Processing RapidAPI Airbnb earnings data:', apiData);
  
  let processedProperties: AirbnbProperty[] = [];
  
  if (apiData && apiData.success && apiData.data) {
    const properties = apiData.data.properties || [];
    
    processedProperties = properties.map((property: any) => ({
      id: property.id || property.listing_id || Math.random().toString(),
      name: property.name || property.title || 'Unknown Property',
      location: property.location || property.address || 'Unknown Location',
      price: property.price || property.nightly_rate || 0,
      monthlyRevenue: property.monthly_revenue || (property.price * 20) || 0, // Estimate if not available
      occupancyRate: property.occupancy_rate || property.occupancy || 75, // Default estimate
      rating: property.rating || property.review_score || 4.5,
      reviews: property.reviews || property.review_count || 0,
      neighborhood: property.neighborhood || property.district || 'Unknown Area'
    }));
  }
  
  const averageRevenue = processedProperties.length > 0 
    ? processedProperties.reduce((sum, prop) => sum + prop.monthlyRevenue, 0) / processedProperties.length
    : 0;
  
  return {
    properties: processedProperties,
    averageRevenue: Math.round(averageRevenue),
    totalProperties: processedProperties.length,
    city: apiData?.data?.city || 'Unknown City'
  };
};
