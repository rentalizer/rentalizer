
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real Mashvisor API for ${city}`);
    
    const { data, error } = await supabase.functions.invoke('mashvisor-api', {
      body: {
        city,
        propertyType,
        bathrooms
      }
    });

    if (error) {
      throw new Error(`API call failed: ${error.message}`);
    }

    console.log('✅ Real Mashvisor API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Mashvisor API error:', error);
    throw error;
  }
};

export const processMarketData = (marketData: any): SubmarketData[] => {
  const processedData: SubmarketData[] = [];
  
  // Handle the response data structure from properties endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle properties response structure
    if (data.content && data.content.properties && Array.isArray(data.content.properties)) {
      const properties = data.content.properties;
      
      // Group properties by neighborhood/submarket
      const submarketMap = new Map<string, { airbnbRevenues: number[], rentPrices: number[] }>();
      
      properties.forEach((property: any) => {
        const neighborhood = property.neighborhood || property.address?.neighborhood || property.submarket || 'Unknown Area';
        const airbnbRevenue = property.rental_income_airbnb || property.str_revenue || property.airbnb_revenue || 0;
        const rentPrice = property.rental_income || property.long_term_rental || property.traditional_rental || 0;
        
        if (airbnbRevenue > 0 || rentPrice > 0) {
          if (!submarketMap.has(neighborhood)) {
            submarketMap.set(neighborhood, { airbnbRevenues: [], rentPrices: [] });
          }
          
          const submarketData = submarketMap.get(neighborhood)!;
          if (airbnbRevenue > 0) submarketData.airbnbRevenues.push(airbnbRevenue);
          if (rentPrice > 0) submarketData.rentPrices.push(rentPrice);
        }
      });
      
      // Calculate averages for each submarket
      submarketMap.forEach((data, neighborhood) => {
        const avgAirbnb = data.airbnbRevenues.length > 0 
          ? data.airbnbRevenues.reduce((a, b) => a + b, 0) / data.airbnbRevenues.length 
          : 0;
        const avgRent = data.rentPrices.length > 0 
          ? data.rentPrices.reduce((a, b) => a + b, 0) / data.rentPrices.length 
          : 0;
        const multiple = avgRent > 0 ? avgAirbnb / avgRent : 0;
        
        if (avgAirbnb > 0 && avgRent > 0) {
          processedData.push({
            submarket: neighborhood,
            strRevenue: Math.round(avgAirbnb),
            medianRent: Math.round(avgRent),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle direct properties array (alternative structure)
    if (data.properties && Array.isArray(data.properties)) {
      data.properties.forEach((property: any, index: number) => {
        const airbnbRevenue = property.rental_income_airbnb || property.str_revenue || property.airbnb_revenue || 0;
        const rentPrice = property.rental_income || property.long_term_rental || property.traditional_rental || 0;
        const multiple = rentPrice > 0 ? airbnbRevenue / rentPrice : 0;
        
        if (airbnbRevenue > 0 && rentPrice > 0) {
          processedData.push({
            submarket: property.neighborhood || property.address || `Property ${index + 1}`,
            strRevenue: Math.round(airbnbRevenue),
            medianRent: Math.round(rentPrice),
            multiple: multiple
          });
        }
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Property Data Available',
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by multiple (highest first), with failed data at the end
  processedData.sort((a, b) => {
    if (a.multiple === 0 && b.multiple === 0) return 0;
    if (a.multiple === 0) return 1;
    if (b.multiple === 0) return -1;
    return b.multiple - a.multiple;
  });

  return processedData;
};
