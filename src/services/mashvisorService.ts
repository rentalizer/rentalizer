
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
  
  // Handle successful API response
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle neighborhoods endpoint response
    if (responseData.source === 'neighborhoods' && responseData.content && responseData.content.results) {
      console.log('📊 Processing neighborhoods data from Mashvisor API');
      
      const neighborhoods = responseData.content.results;
      
      // For neighborhoods endpoint, we need to make additional calls to get revenue data
      // For now, we'll show the neighborhoods as available submarkets
      neighborhoods.forEach((neighborhood: any) => {
        const neighborhoodName = neighborhood.name || 'Unknown Neighborhood';
        
        processedData.push({
          submarket: `${neighborhoodName} - ${responseData.city}`,
          strRevenue: 0, // Neighborhoods endpoint doesn't include revenue data
          medianRent: 0, // Neighborhoods endpoint doesn't include rent data
          multiple: 0
        });
      });
    }
    
    // Handle rento-calculator endpoint response (city/zip/address level)
    else if (responseData.content) {
      const content = responseData.content;
      
      console.log('📊 Processing rento-calculator data:', content);
      
      // Check for rental calculator response structure
      if (content.airbnb || content.rental || content.revenue || content.rent) {
        const strRevenue = (content.airbnb?.revenue || content.revenue || 0) * 12; // Annualize if monthly
        const rentRevenue = (content.rental?.rent || content.rent || content.median_rent || 0) * 12; // Annualize if monthly
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${responseData.city} - ${responseData.source} data`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(rentRevenue),
            multiple: multiple
          });
        }
      }
      
      // Handle array of neighborhoods from other endpoints
      else if (Array.isArray(content)) {
        content.forEach((item: any) => {
          const itemName = item.name || item.neighborhood || item.submarket || 'Unknown Area';
          const strRevenue = (item.airbnb_revenue || item.str_revenue || item.revenue || 0) * 12;
          const rentRevenue = (item.rental_income || item.rent || item.median_rent || 0) * 12;
          
          if (strRevenue > 0 || rentRevenue > 0) {
            const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
            
            processedData.push({
              submarket: `${itemName} - ${responseData.city}`,
              strRevenue: Math.round(strRevenue),
              medianRent: Math.round(rentRevenue),
              multiple: multiple
            });
          }
        });
      }
    }
  }
  
  // If we only have neighborhood names without revenue data, show informational message
  if (processedData.length > 0 && processedData.every(d => d.strRevenue === 0 && d.medianRent === 0)) {
    console.log('ℹ️ Neighborhoods found but no revenue data available from this endpoint');
    
    const city = marketData?.data?.city || 'Unknown City';
    
    // Return a single informational row instead of all empty neighborhoods
    return [{
      submarket: `${city} - ${processedData.length} neighborhoods found`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    }];
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid data found');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = marketData?.data?.message || 'No data available';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first) - only meaningful if we have revenue data
  if (processedData.some(d => d.strRevenue > 0)) {
    processedData.sort((a, b) => b.strRevenue - a.strRevenue);
  }

  console.log('✅ Processed market data:', processedData.map(d => ({
    submarket: d.submarket,
    revenue: d.strRevenue,
    rent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
