
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
  
  // If API failed, don't calculate averages from zero values
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

// Enhanced function to fetch real rental data only
export const fetchRealRentalData = async (city: string, propertyType: string = '2') => {
  try {
    console.log(`🏠 Fetching REAL rental data for ${city} - ${propertyType}BR/2BA`);
    
    const { data, error } = await supabase.functions.invoke('rental-data-api', {
      body: {
        city,
        bedrooms: propertyType,
        bathrooms: '2',
        action: 'get_rental_rates'
      }
    });

    if (error) {
      console.error('Rental API call failed:', error);
      return { success: false, data: { rentals: [] } };
    }

    console.log('✅ Real rental data response:', data);
    return data;
  } catch (error) {
    console.error('❌ Rental data error:', error);
    return { success: false, data: { rentals: [] } };
  }
};

// Process rental data to standardize format
export const processRentalData = (rentalData: any) => {
  if (!rentalData || !rentalData.data || !rentalData.data.rentals) {
    return [];
  }

  return rentalData.data.rentals.map((rental: any) => ({
    neighborhood: rental.neighborhood || rental.address || 'Unknown',
    rent: rental.rent || rental.price || 0,
    address: rental.address || rental.neighborhood || 'Unknown'
  }));
};
