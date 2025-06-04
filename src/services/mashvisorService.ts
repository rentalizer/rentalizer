
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

  // Handle the response data structure from rento-calculator/export-comps endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Check if the API returned a status indicating no data available
    if (data.content && data.content.status === 40 && !data.content.comps) {
      console.log('⚠️ Mashvisor API returned status 40 - no comparison data available for this market');
      
      // Return a single entry indicating no data is available
      processedData.push({
        submarket: `No comparison data available for this market`,
        strRevenue: 0,
        medianRent: 0,
        multiple: 0
      });
      
      return processedData;
    }
    
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

  // If no valid data found, create a more informative message
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'Mashvisor API - No rental comparison data available for this market',
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
