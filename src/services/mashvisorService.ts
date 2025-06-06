
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
  
  // Handle successful API response with real financial data
  if (marketData && marketData.success && marketData.data && marketData.data.content) {
    console.log('📊 Processing real Mashvisor financial data');
    
    // Check for different possible data structures from Mashvisor
    const results = marketData.data.content.results || 
                   marketData.data.content.properties || 
                   marketData.data.content.neighborhoods || 
                   marketData.data.content;
    
    if (results && Array.isArray(results)) {
      console.log(`✅ Found ${results.length} real data points from Mashvisor`);
      
      results.forEach((item: any, index: number) => {
        // Extract REAL financial data from Mashvisor API
        const monthlyStrRevenue = item.airbnb?.monthly_revenue || 
                                 item.str_revenue || 
                                 item.rental_income?.str || 
                                 item.monthly_revenue || 
                                 0;
        
        const monthlyRent = item.traditional?.monthly_rent || 
                           item.monthly_rent || 
                           item.rental_income?.traditional || 
                           item.rent || 
                           0;
        
        const neighborhoodName = item.neighborhood || 
                                item.name || 
                                item.area || 
                                item.address || 
                                `Area ${index + 1}`;
        
        // Only include data points with REAL financial data from Mashvisor
        if (monthlyStrRevenue > 0 && monthlyRent > 0) {
          const multiple = monthlyStrRevenue / monthlyRent;
          
          processedData.push({
            submarket: `${neighborhoodName} - ${marketData.data.city || 'Unknown City'}`,
            strRevenue: Math.round(monthlyStrRevenue),
            medianRent: Math.round(monthlyRent),
            multiple: multiple
          });
          
          console.log(`✅ REAL DATA: ${neighborhoodName} - STR: $${monthlyStrRevenue}, Rent: $${monthlyRent}, Multiple: ${multiple.toFixed(2)}x`);
        } else {
          console.log(`❌ INCOMPLETE DATA: ${neighborhoodName} - STR: $${monthlyStrRevenue}, Rent: $${monthlyRent}`);
        }
      });
    }
  }
  
  // Only show error message if API failed or returned no usable data
  if (processedData.length === 0) {
    console.log('❌ No real financial data available from Mashvisor API');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = 'No real financial data available from Mashvisor API';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by monthly STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Final processed REAL data:', processedData.map(d => ({
    submarket: d.submarket,
    monthlyStrRevenue: d.strRevenue,
    monthlyRent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'No Data'
  })));
  
  return processedData;
};
