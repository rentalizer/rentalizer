
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
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Handle fallback data structure
  if (marketData && marketData.data && marketData.data.fallback) {
    const comps = marketData.data.comps || [];
    
    comps.forEach((comp: any) => {
      const address = comp.address || 'Unknown Area';
      const strRevenue = comp.airbnb_revenue || 0;
      const medianRent = comp.long_term_rent || 0;
      const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
      
      processedData.push({
        submarket: address,
        strRevenue: Math.round(strRevenue),
        medianRent: Math.round(medianRent),
        multiple: multiple
      });
    });

    // Sort by multiple (highest first)
    processedData.sort((a, b) => b.multiple - a.multiple);
    
    return processedData;
  }

  // Handle the lookup endpoint response
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    
    // Check for rental comps data
    if (content.rental_comps && Array.isArray(content.rental_comps)) {
      content.rental_comps.forEach((comp: any, index: number) => {
        const address = comp.address || comp.neighborhood || `Area ${index + 1}`;
        const strRevenue = comp.airbnb_revenue || comp.str_revenue || 0;
        const medianRent = comp.long_term_rent || comp.rental_income || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        processedData.push({
          submarket: address,
          strRevenue: Math.round(strRevenue),
          medianRent: Math.round(medianRent),
          multiple: multiple
        });
      });
    }
    
    // Check for airbnb data
    if (content.airbnb && content.airbnb.revenue) {
      const airbnbRevenue = content.airbnb.revenue;
      const longTermRent = content.rental?.income || content.rental?.rent || 0;
      const multiple = longTermRent > 0 ? airbnbRevenue / longTermRent : 0;
      
      processedData.push({
        submarket: `${content.city || 'City'} Average`,
        strRevenue: Math.round(airbnbRevenue),
        medianRent: Math.round(longTermRent),
        multiple: multiple
      });
    }

    // Check for neighborhood-level data
    if (content.neighborhoods && Array.isArray(content.neighborhoods)) {
      content.neighborhoods.forEach((neighborhood: any) => {
        const name = neighborhood.name || neighborhood.neighborhood || 'Unknown Neighborhood';
        const strRevenue = neighborhood.airbnb_revenue || neighborhood.str_revenue || 0;
        const medianRent = neighborhood.rental_income || neighborhood.long_term_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 || medianRent > 0) {
          processedData.push({
            submarket: name,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }

    // If we still have no data, try to extract any revenue information
    if (processedData.length === 0) {
      if (content.revenue || content.income) {
        processedData.push({
          submarket: 'Market Data Available',
          strRevenue: Math.round(content.revenue || content.income || 0),
          medianRent: Math.round(content.rent || content.rental_income || 0),
          multiple: content.rent > 0 ? (content.revenue || 0) / content.rent : 0
        });
      }
    }
  }

  // If no valid data found, create an informative message
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No market data available for this location',
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by multiple (highest first), then by STR revenue
  processedData.sort((a, b) => {
    if (a.multiple === 0 && b.multiple === 0) {
      return b.strRevenue - a.strRevenue;
    }
    if (a.multiple === 0) return 1;
    if (b.multiple === 0) return -1;
    return b.multiple - a.multiple;
  });

  return processedData;
};
