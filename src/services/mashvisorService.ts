
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
    
    // Group rental data by neighborhood
    const neighborhoodDataMap = new Map();
    
    rentalData.forEach((item: any) => {
      if (!item || !item.data) return;
      
      const neighborhood = item.neighborhood || 'Unknown Area';
      const isAirbnb = item.type && item.type.includes('airbnb');
      
      console.log(`🔍 Processing ${neighborhood} - Type: ${item.type}`, item.data);
      
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
      
      console.log(`🔍 Detailed data for ${neighborhood}:`, {
        airbnbData: airbnbData,
        traditionalData: traditionalData
      });
      
      // Extract STR revenue from Airbnb data - check multiple possible locations
      let monthlyStrRevenue = 0;
      if (airbnbData) {
        // Check different possible paths in the response
        monthlyStrRevenue = 
          airbnbData.monthly_revenue || 
          airbnbData.revenue || 
          airbnbData.airbnb_revenue ||
          airbnbData.monthly_rental_income ||
          airbnbData.rental_income ||
          (airbnbData.content && airbnbData.content.monthly_revenue) ||
          (airbnbData.content && airbnbData.content.revenue) ||
          (airbnbData.content && airbnbData.content.airbnb_revenue) ||
          (airbnbData.results && airbnbData.results.monthly_revenue) ||
          (airbnbData.results && airbnbData.results.revenue) ||
          0;
          
        console.log(`💰 STR Revenue extraction for ${neighborhood}:`, {
          monthly_revenue: airbnbData.monthly_revenue,
          revenue: airbnbData.revenue,
          airbnb_revenue: airbnbData.airbnb_revenue,
          content: airbnbData.content,
          results: airbnbData.results,
          extracted: monthlyStrRevenue
        });
      }
      
      // Extract traditional rent from traditional data - check multiple possible locations
      let monthlyRent = 0;
      if (traditionalData) {
        monthlyRent = 
          traditionalData.monthly_rent || 
          traditionalData.rent || 
          traditionalData.traditional_rent ||
          traditionalData.monthly_rental_income ||
          traditionalData.rental_income ||
          (traditionalData.content && traditionalData.content.monthly_rent) ||
          (traditionalData.content && traditionalData.content.rent) ||
          (traditionalData.content && traditionalData.content.traditional_rent) ||
          (traditionalData.results && traditionalData.results.monthly_rent) ||
          (traditionalData.results && traditionalData.results.rent) ||
          0;
          
        console.log(`🏠 Rent extraction for ${neighborhood}:`, {
          monthly_rent: traditionalData.monthly_rent,
          rent: traditionalData.rent,
          traditional_rent: traditionalData.traditional_rent,
          content: traditionalData.content,
          results: traditionalData.results,
          extracted: monthlyRent
        });
      }
      
      // Get address info if available
      const address = 
        (airbnbData && airbnbData.address) ||
        (traditionalData && traditionalData.address) ||
        (airbnbData && airbnbData.content && airbnbData.content.address) ||
        (traditionalData && traditionalData.content && traditionalData.content.address) ||
        '';
      
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
        console.log(`❌ NO FINANCIAL DATA: ${neighborhood} - Available keys:`, {
          airbnbKeys: airbnbData ? Object.keys(airbnbData) : [],
          traditionalKeys: traditionalData ? Object.keys(traditionalData) : []
        });
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
