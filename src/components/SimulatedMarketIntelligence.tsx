
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchAirbnbEarningsData, processAirbnbEarningsData, fetchRealRentalData, processRentalData } from '@/services/rapidApiAirbnbService';

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
      console.log(`🚀 Starting complete market analysis for ${city} - ${propType}BR/${bathCount}BA`);
      
      // Fetch BOTH STR earnings AND rental data
      console.log(`🏠 Fetching STR earnings for ${city}`);
      const strApiData = await fetchAirbnbEarningsData(city, propType);
      const processedSTR = processAirbnbEarningsData(strApiData);
      
      console.log(`🏠 Fetching rental rates for ${city}`);
      const rentalApiData = await fetchRealRentalData(city, propType);
      const processedRentals = processRentalData(rentalApiData);
      
      console.log(`📊 STR data:`, processedSTR);
      console.log(`📊 Rental data:`, processedRentals);

      // Combine STR and rental data by neighborhood
      const combinedData: SubmarketData[] = [];
      
      // Create a map of rental data by neighborhood
      const rentalMap = new Map();
      processedRentals.forEach(rental => {
        const neighborhood = rental.neighborhood.toLowerCase();
        if (!rentalMap.has(neighborhood)) {
          rentalMap.set(neighborhood, []);
        }
        rentalMap.get(neighborhood).push(rental.rent);
      });
      
      // Process STR properties and match with rental data
      processedSTR.properties.forEach(strProperty => {
        const neighborhood = strProperty.neighborhood.toLowerCase();
        const rentals = rentalMap.get(neighborhood) || [];
        const medianRent = rentals.length > 0 
          ? rentals.sort((a, b) => a - b)[Math.floor(rentals.length / 2)]
          : 0;
        
        const multiple = medianRent > 0 ? strProperty.monthlyRevenue / medianRent : 0;
        
        combinedData.push({
          submarket: `${strProperty.neighborhood}, ${city}`,
          strRevenue: strProperty.monthlyRevenue,
          medianRent: medianRent,
          multiple: multiple
        });
      });
      
      // Add rental-only data for neighborhoods without STR matches
      processedRentals.forEach(rental => {
        const neighborhood = rental.neighborhood.toLowerCase();
        const exists = combinedData.some(item => 
          item.submarket.toLowerCase().includes(neighborhood)
        );
        
        if (!exists) {
          combinedData.push({
            submarket: `${rental.neighborhood}, ${city}`,
            strRevenue: 0,
            medianRent: rental.rent,
            multiple: 0
          });
        }
      });

      setSubmarketData(combinedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const validDataCount = combinedData.filter(d => d.strRevenue > 0 && d.medianRent > 0).length;
      
      toast({
        title: "Complete Market Analysis Done",
        description: `Found ${combinedData.length} submarkets with ${validDataCount} having both STR and rental data.`,
      });

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch market data. Please try another city.",
        variant: "destructive",
      });
      setSubmarketData([]);
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
              <h3 className="font-semibold text-green-300">REAL STR & RENTAL DATA</h3>
              <p className="text-sm text-gray-300">
                This tool fetches real STR earnings AND real rental rates to calculate accurate revenue multiples.
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
