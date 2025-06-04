

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
  
  // Handle the response data structure from neighborhoods endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle neighborhoods response structure
    if (data.content && Array.isArray(data.content)) {
      data.content.forEach((neighborhood: any) => {
        const airbnbRevenue = neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.rental_income_airbnb || 0;
        const traditionalRent = neighborhood.rental_income || neighborhood.long_term_rental || neighborhood.traditional_rental || neighborhood.median_rental_income || 0;
        const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
        
        processedData.push({
          submarket: neighborhood.name || neighborhood.neighborhood || neighborhood.title || `Neighborhood ${processedData.length + 1}`,
          strRevenue: airbnbRevenue,
          medianRent: traditionalRent,
          multiple: multiple
        });
      });
    }
    // Handle single neighborhood or different structure
    else if (data.content && typeof data.content === 'object') {
      const neighborhood = data.content;
      const airbnbRevenue = neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.rental_income_airbnb || 0;
      const traditionalRent = neighborhood.rental_income || neighborhood.long_term_rental || neighborhood.traditional_rental || neighborhood.median_rental_income || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: neighborhood.name || neighborhood.neighborhood || neighborhood.title || data.city || 'Market Analysis',
        strRevenue: airbnbRevenue,
        medianRent: traditionalRent,
        multiple: multiple
      });
    }
    // Handle direct array structure
    else if (Array.isArray(data)) {
      data.forEach((neighborhood: any) => {
        const airbnbRevenue = neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.rental_income_airbnb || 0;
        const traditionalRent = neighborhood.rental_income || neighborhood.long_term_rental || neighborhood.traditional_rental || neighborhood.median_rental_income || 0;
        const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
        
        processedData.push({
          submarket: neighborhood.name || neighborhood.neighborhood || neighborhood.title || `Neighborhood ${processedData.length + 1}`,
          strRevenue: airbnbRevenue,
          medianRent: traditionalRent,
          multiple: multiple
        });
      });
    }
    // Handle direct data structure
    else if (data.airbnb_revenue || data.rental_income || data.median_rental_income) {
      const airbnbRevenue = data.airbnb_revenue || data.str_revenue || 0;
      const traditionalRent = data.rental_income || data.long_term_rental || data.median_rental_income || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: data.neighborhood || data.area || data.city || 'Market Analysis',
        strRevenue: airbnbRevenue,
        medianRent: traditionalRent,
        multiple: multiple
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Data Available',
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

