
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
    
    // Handle city-revenue endpoint response (PRIORITY - this has actual revenue data)
    if (responseData.source === 'city-revenue' && responseData.content) {
      console.log('💰 Processing city-level revenue data from Mashvisor API');
      
      const content = responseData.content;
      
      // Extract revenue data from city-level response
      const airbnbData = content.airbnb || content;
      const rentalData = content.rental || content;
      
      const strRevenue = (airbnbData.revenue || airbnbData.monthly_revenue || 0) * 12; // Annualize
      const rentRevenue = (rentalData.rent || rentalData.monthly_rent || content.rent || content.median_rent || 0) * 12; // Annualize
      
      if (strRevenue > 0 || rentRevenue > 0) {
        const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
        
        processedData.push({
          submarket: `${responseData.city} - City Average`,
          strRevenue: Math.round(strRevenue),
          medianRent: Math.round(rentRevenue),
          multiple: multiple
        });
      }
    }
    
    // Handle metro area endpoint response
    else if (responseData.source === 'metro' && responseData.content) {
      console.log('🏙️ Processing metro area data from Mashvisor API');
      
      const content = responseData.content;
      
      if (Array.isArray(content)) {
        content.forEach((area: any) => {
          const areaName = area.name || area.metro || 'Metro Area';
          const strRevenue = (area.airbnb_revenue || area.str_revenue || area.revenue || 0) * 12;
          const rentRevenue = (area.rental_income || area.rent || area.median_rent || 0) * 12;
          
          if (strRevenue > 0 || rentRevenue > 0) {
            const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
            
            processedData.push({
              submarket: `${areaName} - ${responseData.city}`,
              strRevenue: Math.round(strRevenue),
              medianRent: Math.round(rentRevenue),
              multiple: multiple
            });
          }
        });
      }
    }
    
    // Handle address/zipcode endpoint responses
    else if ((responseData.source === 'address' || responseData.source === 'zipcode') && responseData.content) {
      console.log('📍 Processing address/zipcode data from Mashvisor API');
      
      const content = responseData.content;
      const strRevenue = (content.airbnb?.revenue || content.revenue || 0) * 12;
      const rentRevenue = (content.rental?.rent || content.rent || content.median_rent || 0) * 12;
      
      if (strRevenue > 0 || rentRevenue > 0) {
        const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
        
        processedData.push({
          submarket: `${responseData.address || responseData.zipCode || responseData.city} - ${responseData.source} data`,
          strRevenue: Math.round(strRevenue),
          medianRent: Math.round(rentRevenue),
          multiple: multiple
        });
      }
    }
    
    // Handle neighborhoods endpoint response (fallback - no revenue data)
    else if (responseData.source === 'neighborhoods' && responseData.content && responseData.content.results) {
      console.log('📊 Processing neighborhoods directory (no revenue data available)');
      
      const neighborhoods = responseData.content.results;
      const city = responseData.city || 'Unknown City';
      
      // Return a single informational row since we don't have revenue data
      processedData.push({
        submarket: `${city} - ${neighborhoods.length} neighborhoods found (no revenue data from this endpoint)`,
        strRevenue: 0,
        medianRent: 0,
        multiple: 0
      });
    }
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
