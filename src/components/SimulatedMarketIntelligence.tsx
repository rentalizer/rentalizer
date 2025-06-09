
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchRealMarketData, processMarketData } from '@/services/airdnaService';
import { fetchAirbnbEarningsData, processAirbnbEarningsData, fetchRealRentalData } from '@/services/rapidApiAirbnbService';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const SimulatedMarketIntelligence = () => {
  const { toast } = useToast();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [selectedSubmarkets, setSelectedSubmarkets] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [isLoading, setIsLoading] = useState(false);

  const handleMarketAnalysis = async (city: string, propType: string, bathCount: string) => {
    setIsLoading(true);
    
    try {
      console.log(`🚀 Starting market analysis for ${city} - STR + REAL RENTAL DATA ONLY`);
      
      // Get STR data
      let strData: any[] = [];
      try {
        const rapidApiData = await fetchAirbnbEarningsData(city, propType);
        const rapidApiProcessed = processAirbnbEarningsData(rapidApiData);
        
        if (rapidApiProcessed.properties && rapidApiProcessed.properties.length > 0) {
          const hasRealData = rapidApiProcessed.properties.some(prop => prop.monthlyRevenue > 0);
          if (hasRealData) {
            strData = rapidApiProcessed.properties;
          }
        }
      } catch (strError) {
        console.warn('STR API failed:', strError);
      }

      // Get REAL rental data only
      let realRentalData: any[] = [];
      try {
        console.log(`🏠 Fetching REAL rental rates for ${city}`);
        const rentalApiData = await fetchRealRentalData(city, propType);
        
        if (rentalApiData && rentalApiData.data && rentalApiData.data.rentals) {
          realRentalData = rentalApiData.data.rentals;
          console.log(`✅ Found ${realRentalData.length} real rental listings`);
        }
      } catch (rentalError) {
        console.warn('Real rental API failed:', rentalError);
      }

      // Combine data - ONLY show real rental rates, no fake calculations
      const processedData: SubmarketData[] = [];

      // Add STR data with real rental matches
      if (strData.length > 0) {
        strData.forEach(strProperty => {
          // Find matching real rental data by neighborhood
          const matchingRental = realRentalData.find(rental => 
            rental.neighborhood?.toLowerCase().includes(strProperty.neighborhood?.toLowerCase()) ||
            rental.address?.toLowerCase().includes(strProperty.neighborhood?.toLowerCase())
          );

          processedData.push({
            submarket: `${strProperty.neighborhood}, ${city}`,
            strRevenue: strProperty.monthlyRevenue,
            medianRent: matchingRental ? (matchingRental.rent || matchingRental.price || 0) : 0,
            multiple: matchingRental && matchingRental.rent > 0 ? 
              strProperty.monthlyRevenue / (matchingRental.rent || matchingRental.price) : 0
          });
        });
      }

      // Add pure rental data for areas without STR matches
      if (realRentalData.length > 0) {
        realRentalData.forEach(rental => {
          const existingMatch = processedData.find(item => 
            item.submarket.toLowerCase().includes(rental.neighborhood?.toLowerCase() || rental.address?.toLowerCase())
          );
          
          if (!existingMatch) {
            processedData.push({
              submarket: `${rental.neighborhood || rental.address || 'Unknown'}, ${city}`,
              strRevenue: 0, // No STR data for this area
              medianRent: rental.rent || rental.price || 0,
              multiple: 0 // Can't calculate without STR data
            });
          }
        });
      }

      setSubmarketData(processedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const realRentCount = processedData.filter(d => d.medianRent > 0).length;
      const strCount = processedData.filter(d => d.strRevenue > 0).length;
      
      toast({
        title: "Real Market Data Analysis Complete",
        description: `Found ${realRentCount} real rental rates and ${strCount} STR properties in ${city}. No fake data included.`,
      });

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch real market data. Please try another city.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (selected: SubmarketData[]) => {
    setSelectedSubmarkets(selected);
  };

  return (
    <div className="space-y-8">
      {/* Updated Data Notice */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">REAL RENTAL DATA ONLY</h3>
              <p className="text-sm text-gray-300">
                This tool now fetches ONLY real rental rates from actual rental markets. No calculated or fake rental data will be shown - only "NA" when real data is unavailable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis Input */}
      <MarketAnalysisForm onAnalyze={handleMarketAnalysis} isLoading={isLoading} />

      {/* Results Section */}
      <MarketAnalysisResults
        submarketData={submarketData}
        selectedSubmarkets={selectedSubmarkets}
        cityName={cityName}
        propertyType={propertyType}
        bathrooms={bathrooms}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};
