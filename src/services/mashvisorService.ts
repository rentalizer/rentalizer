
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
  
  // Handle successful API response with neighborhood data
  if (marketData && marketData.success && marketData.data && marketData.data.content) {
    const responseData = marketData.data;
    const neighborhoods = responseData.content.neighborhoods || responseData.content;
    
    console.log('📊 Processing neighborhood data:', neighborhoods);
    
    // Handle array of neighborhoods
    if (Array.isArray(neighborhoods)) {
      neighborhoods.forEach((neighborhood: any) => {
        const neighborhoodName = neighborhood.name || neighborhood.neighborhood || 'Unknown Neighborhood';
        const strRevenue = (neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.revenue || 0) * 12; // Annualize if monthly
        const rentRevenue = (neighborhood.rental_income || neighborhood.rent || neighborhood.median_rent || 0) * 12; // Annualize if monthly
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${neighborhoodName} - ${responseData.city}`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(rentRevenue),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle object with neighborhood data
    else if (typeof neighborhoods === 'object' && neighborhoods !== null) {
      Object.keys(neighborhoods).forEach((key) => {
        const neighborhood = neighborhoods[key];
        if (typeof neighborhood === 'object') {
          const neighborhoodName = neighborhood.name || key || 'Unknown Neighborhood';
          const strRevenue = (neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.revenue || 0) * 12;
          const rentRevenue = (neighborhood.rental_income || neighborhood.rent || neighborhood.median_rent || 0) * 12;
          
          if (strRevenue > 0 || rentRevenue > 0) {
            const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
            
            processedData.push({
              submarket: `${neighborhoodName} - ${responseData.city}`,
              strRevenue: Math.round(strRevenue),
              medianRent: Math.round(rentRevenue),
              multiple: multiple
            });
          }
        }
      });
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid neighborhood data found');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = marketData?.data?.message || 'No neighborhood data available';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Processed neighborhood data:', processedData.map(d => ({
    submarket: d.submarket,
    revenue: d.strRevenue,
    rent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
