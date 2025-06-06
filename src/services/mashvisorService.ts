
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
  address?: string;
  neighborhood: string;
}

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling Mashvisor Lookup API for ${city}`);
    
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

    console.log('✅ Mashvisor Lookup API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Mashvisor API error:', error);
    throw error;
  }
};

export const processMarketData = (marketData: any): SubmarketData[] => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing Mashvisor lookup data:', marketData);
  
  if (marketData && marketData.success && marketData.data && marketData.data.rentalData) {
    console.log('📊 Processing real Mashvisor lookup rental data');
    
    const rentalData = marketData.data.rentalData;
    const neighborhoods = marketData.data.neighborhoods || [];
    
    // Group rental data by neighborhood
    const neighborhoodDataMap = new Map();
    
    rentalData.forEach((item: any) => {
      if (!item || !item.data || !item.neighborhood) return;
      
      const neighborhood = item.neighborhood;
      const isAirbnb = item.type.includes('airbnb');
      
      if (!neighborhoodDataMap.has(neighborhood)) {
        neighborhoodDataMap.set(neighborhood, {
          neighborhood: neighborhood,
          airbnbData: null,
          traditionalData: null
        });
      }
      
      const neighborhoodEntry = neighborhoodDataMap.get(neighborhood);
      
      if (isAirbnb) {
        neighborhoodEntry.airbnbData = item.data;
      } else {
        neighborhoodEntry.traditionalData = item.data;
      }
    });
    
    console.log(`✅ Found data for ${neighborhoodDataMap.size} areas`);
    
    // Process each neighborhood's data
    neighborhoodDataMap.forEach((entry, neighborhood) => {
      const { airbnbData, traditionalData } = entry;
      
      // Extract STR revenue from Airbnb data
      let monthlyStrRevenue = 0;
      if (airbnbData && airbnbData.content) {
        monthlyStrRevenue = airbnbData.content.monthly_revenue || 
                           airbnbData.content.revenue || 
                           airbnbData.content.airbnb_revenue || 
                           0;
      }
      
      // Extract traditional rent from traditional data
      let monthlyRent = 0;
      if (traditionalData && traditionalData.content) {
        monthlyRent = traditionalData.content.monthly_rent || 
                     traditionalData.content.rent || 
                     traditionalData.content.traditional_rent || 
                     0;
      }
      
      // Get address info if available
      const address = airbnbData?.content?.address || traditionalData?.content?.address || '';
      
      console.log(`📍 ${neighborhood}: STR: $${monthlyStrRevenue}, Rent: $${monthlyRent}, Address: ${address}`);
      
      // Only include data points with real financial data
      if (monthlyStrRevenue > 0 && monthlyRent > 0) {
        const multiple = monthlyStrRevenue / monthlyRent;
        
        processedData.push({
          submarket: `${neighborhood} - ${marketData.data.city || 'Unknown City'}`,
          strRevenue: Math.round(monthlyStrRevenue),
          medianRent: Math.round(monthlyRent),
          multiple: multiple,
          neighborhood: neighborhood,
          address: address
        });
        
        console.log(`✅ REAL DATA: ${neighborhood} - STR: $${monthlyStrRevenue}, Rent: $${monthlyRent}, Multiple: ${multiple.toFixed(2)}x`);
      } else if (monthlyStrRevenue > 0) {
        // If we have STR data but no rent data, still include it
        processedData.push({
          submarket: `${neighborhood} - ${marketData.data.city || 'Unknown City'}`,
          strRevenue: Math.round(monthlyStrRevenue),
          medianRent: 0,
          multiple: 0,
          neighborhood: neighborhood,
          address: address
        });
        
        console.log(`⚠️ PARTIAL DATA: ${neighborhood} - STR: $${monthlyStrRevenue}, No rent data`);
      } else {
        console.log(`❌ NO FINANCIAL DATA: ${neighborhood}`);
      }
    });
  }
  
  // If no data available, show message
  if (processedData.length === 0) {
    console.log('❌ No real financial data available from Mashvisor Lookup API');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = 'No real financial data available from Mashvisor Lookup API';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0,
      neighborhood: city,
      address: ''
    });
  }

  // Sort by monthly STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Final processed REAL lookup data:', processedData.map(d => ({
    neighborhood: d.neighborhood,
    address: d.address,
    monthlyStrRevenue: d.strRevenue,
    monthlyRent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'No Data'
  })));
  
  return processedData;
};
