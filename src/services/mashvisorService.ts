
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
    
    // Handle export-comps data (new implementation)
    if (responseData.source === 'export-comps' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing export-comps data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((property: any) => {
        const propertyName = property.neighborhood || 'Unknown Property';
        const strRevenue = property.airbnb_revenue || 0;
        const rentRevenue = property.rental_income || 0;
        const dataSource = property.data_source || 'unknown';
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${propertyName} - ${responseData.city} (${dataSource})`,
            strRevenue: strRevenue,
            medianRent: rentRevenue,
            multiple: multiple
          });
        }
      });
      
      if (processedData.length === 0) {
        const totalZipCodes = responseData.total_zip_codes || 0;
        const processedZipCodes = responseData.processed_zip_codes || 0;
        
        processedData.push({
          submarket: `${responseData.city} - ${processedZipCodes} of ${totalZipCodes} zip codes processed, no revenue data found`,
          strRevenue: 0,
          medianRent: 0,
          multiple: 0
        });
      }
    }
    
    // Handle legacy rento-calculator neighborhood data
    else if (responseData.source === 'rento-calculator-neighborhood' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing legacy rento-calculator neighborhood data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((neighborhood: any) => {
        const neighborhoodName = neighborhood.neighborhood || 'Unknown Neighborhood';
        const strRevenue = neighborhood.airbnb_revenue || 0;
        const rentRevenue = neighborhood.rental_income || 0;
        const dataSource = neighborhood.data_source || 'unknown';
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${neighborhoodName} - ${responseData.city} (${dataSource})`,
            strRevenue: strRevenue,
            medianRent: rentRevenue,
            multiple: multiple
          });
        }
      });
      
      // Add city baseline info if available
      if (responseData.city_baseline) {
        const cityBaseline = responseData.city_baseline;
        if (cityBaseline.airbnb_revenue > 0 || cityBaseline.rental_income > 0) {
          const multiple = cityBaseline.rental_income > 0 ? cityBaseline.airbnb_revenue / cityBaseline.rental_income : 0;
          
          processedData.push({
            submarket: `${responseData.city} - City Baseline`,
            strRevenue: cityBaseline.airbnb_revenue,
            medianRent: cityBaseline.rental_income,
            multiple: multiple
          });
        }
      }
    }
    
    // Handle fallback neighborhood list (if revenue data not available)
    else if (responseData.content) {
      const content = responseData.content;
      
      console.log('📊 Processing fallback rento-calculator data:', content);
      
      if (content.airbnb || content.rental || content.revenue || content.rent) {
        const strRevenue = (content.airbnb?.revenue || content.revenue || content.adjusted_rental_income || 0) * 12;
        const rentRevenue = (content.rental?.rent || content.rent || content.median_rental_income || 0) * 12;
        
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
