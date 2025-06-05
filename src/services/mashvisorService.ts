
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
        bathrooms,
        requestNeighborhoods: true,
        comprehensiveNeighborhoods: true
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

export const processMarketData = async (marketData: any, city: string, propertyType: string, bathrooms: string): Promise<SubmarketData[]> => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Helper function to accurately calculate monthly STR revenue
  const calculateAccurateSTRRevenue = (data: any): number => {
    const nightRate = data.median_night_rate || data.night_rate || data.nightly_rate || 0;
    const occupancyRate = data.median_occupancy_rate || data.occupancy || data.occupancy_rate || 0;
    const revpar = data.revpar || data.revpan || 0;
    const directMonthlyRevenue = data.monthly_revenue || data.airbnb_revenue || 0;
    
    console.log(`📊 Revenue calculation for area - Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%, RevPAR: $${revpar}, Direct: $${directMonthlyRevenue}`);
    
    let monthlyRevenue = 0;
    
    // Method 1: Use RevPAR (most accurate daily revenue metric)
    if (revpar > 0) {
      monthlyRevenue = revpar * 30; // RevPAR is daily revenue per available room
      console.log(`💰 Using RevPAR calculation: $${revpar} × 30 days = $${monthlyRevenue}/month`);
    }
    // Method 2: Calculate from night rate and occupancy
    else if (nightRate > 0 && occupancyRate > 0) {
      const daysPerMonth = 30;
      const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth;
      monthlyRevenue = nightRate * occupiedDaysPerMonth;
      console.log(`💰 Using night rate calculation: $${nightRate} × ${occupiedDaysPerMonth.toFixed(1)} occupied days = $${monthlyRevenue}/month`);
    }
    // Method 3: Use direct monthly revenue if available and reasonable
    else if (directMonthlyRevenue > 500 && directMonthlyRevenue < 20000) {
      monthlyRevenue = directMonthlyRevenue;
      console.log(`💰 Using direct monthly revenue: $${directMonthlyRevenue}/month`);
    }
    
    return Math.round(monthlyRevenue);
  };

  // Handle successful API response
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle comprehensive neighborhoods from enhanced search
    if (responseData.allNeighborhoods && Array.isArray(responseData.allNeighborhoods)) {
      console.log(`📊 Processing ${responseData.allNeighborhoods.length} comprehensive neighborhoods`);
      
      responseData.allNeighborhoods.forEach((neighborhood: any) => {
        const locationName = neighborhood.name || neighborhood.neighborhood || neighborhood.area || neighborhood.location || 'Unknown Neighborhood';
        
        // Calculate accurate STR revenue
        const monthlyStrRevenue = calculateAccurateSTRRevenue(neighborhood);
        
        // Apply 25% markup to STR revenue
        const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
        
        // Extract rental data - be more precise about which field to use
        const monthlyRent = neighborhood.rental_income || neighborhood.median_rental_income || neighborhood.traditional_rental || neighborhood.rent || neighborhood.median_rent || 0;
        
        // Only include neighborhoods with meaningful data
        if (monthlyStrRevenue > 0 || monthlyRent > 0) {
          console.log(`📈 Adding neighborhood: ${locationName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}, Rent: $${monthlyRent}`);
          
          const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
          
          processedData.push({
            submarket: locationName,
            strRevenue: strRevenueWith25Markup,
            medianRent: monthlyRent,
            multiple: multiple
          });
        }
      });
    }
    
    // Handle rento-calculator-lookup data with neighborhoods_with_revenue
    else if (responseData.source === 'rento-calculator-lookup' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing rento-calculator lookup data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((location: any) => {
        const locationName = location.neighborhood || location.property_address || location.area || 'Unknown Location';
        
        // Calculate accurate STR revenue
        const monthlyStrRevenue = calculateAccurateSTRRevenue(location);
        
        // Apply 25% markup to STR revenue
        const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
        
        // Get rental data
        const monthlyRent = location.rental_income || location.median_rental_income || location.traditional_rental || location.rent || 0;
        
        if (monthlyStrRevenue > 0 || monthlyRent > 0) {
          console.log(`📈 Adding location: ${locationName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}, Rent: $${monthlyRent}`);
          
          const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
          
          processedData.push({
            submarket: locationName,
            strRevenue: strRevenueWith25Markup,
            medianRent: monthlyRent,
            multiple: multiple
          });
        }
      });
    }
    
    // Handle standard city-level data as fallback
    else if (responseData.content) {
      const content = responseData.content;
      
      console.log('📊 Processing city-level data as fallback:', content);
      
      // Calculate accurate STR revenue for city
      const monthlyStrRevenue = calculateAccurateSTRRevenue(content);
      
      // Apply 25% markup to STR revenue
      const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
      
      // Get rental data
      const monthlyRent = content.median_rental_income || content.rental_income || content.rent || 0;
      
      if (monthlyStrRevenue > 0 || monthlyRent > 0) {
        const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
        
        processedData.push({
          submarket: `${responseData.city || city} - City Average`,
          strRevenue: strRevenueWith25Markup,
          medianRent: monthlyRent,
          multiple: multiple
        });
      }
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid data found from Mashvisor');
    
    const cityName = marketData?.data?.city || city || 'Unknown City';
    const message = marketData?.data?.message || 'No neighborhood data available from Mashvisor API';
    
    processedData.push({
      submarket: `${cityName} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Remove duplicates based on submarket name
  const uniqueData = processedData.filter((item, index, self) => 
    index === self.findIndex(t => t.submarket === item.submarket)
  );

  // Sort by multiple first (highest revenue-to-rent ratio), then by STR revenue
  uniqueData.sort((a, b) => {
    if (a.multiple > 0 && b.multiple > 0) {
      return b.multiple - a.multiple;
    }
    return b.strRevenue - a.strRevenue;
  });

  console.log(`✅ Final processed neighborhoods (${uniqueData.length} unique):`, uniqueData.map(d => ({
    neighborhood: d.submarket,
    monthlyRevenueWith25Markup: d.strRevenue,
    monthlyRentFromMashvisor: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return uniqueData;
};
