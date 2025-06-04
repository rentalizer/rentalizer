
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
  
  // Handle the response data structure from rento-calculator/export-comps endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle rento-calculator response structure - might have comps or comparables array
    if (data.content && data.content.comps && Array.isArray(data.content.comps)) {
      const comps = data.content.comps;
      
      comps.forEach((comp: any, index: number) => {
        const address = comp.address || comp.location || `Property ${index + 1}`;
        const strRevenue = comp.airbnb_revenue || comp.str_revenue || comp.rental_revenue || 0;
        const medianRent = comp.long_term_rent || comp.traditional_rent || comp.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: address,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle if comps is at root level
    if (data.comps && Array.isArray(data.comps)) {
      data.comps.forEach((comp: any, index: number) => {
        const address = comp.address || comp.location || `Property ${index + 1}`;
        const strRevenue = comp.airbnb_revenue || comp.str_revenue || comp.rental_revenue || 0;
        const medianRent = comp.long_term_rent || comp.traditional_rent || comp.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: address,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle if data is directly an array of comps
    if (Array.isArray(data)) {
      data.forEach((comp: any, index: number) => {
        const address = comp.address || comp.location || `Property ${index + 1}`;
        const strRevenue = comp.airbnb_revenue || comp.str_revenue || comp.rental_revenue || 0;
        const medianRent = comp.long_term_rent || comp.traditional_rent || comp.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: address,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Rental Comparison Data Available',
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
