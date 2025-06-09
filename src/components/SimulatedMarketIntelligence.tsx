
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
      console.log(`🚀 Starting market analysis for ${city} - ${propType}BR/${bathCount}BA RENTALS ONLY`);
      
      // Fetch REAL rental data first
      console.log(`🏠 Fetching REAL rental rates for ${city}`);
      const rentalApiData = await fetchRealRentalData(city, propType);
      const processedRentals = processRentalData(rentalApiData);
      
      console.log(`📊 Processed rental data:`, processedRentals);

      if (processedRentals.length === 0) {
        toast({
          title: "No Rental Data Found",
          description: `No real rental data available for ${propType}BR/${bathCount}BA apartments in ${city}. Try a different city or property type.`,
          variant: "destructive",
        });
        setSubmarketData([]);
        return;
      }

      // Convert rental data to submarket format
      const processedData: SubmarketData[] = processedRentals.map(rental => ({
        submarket: `${rental.neighborhood}, ${city}`,
        strRevenue: 0, // Not fetching STR data for rental-only analysis
        medianRent: rental.rent,
        multiple: 0 // Can't calculate without STR data
      }));

      setSubmarketData(processedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const validRentCount = processedData.filter(d => d.medianRent > 0).length;
      
      toast({
        title: "Real Rental Data Analysis Complete",
        description: `Found ${validRentCount} real rental rates for ${propType}BR/${bathCount}BA apartments in ${city}.`,
      });

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch real rental data. Please try another city.",
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
              <h3 className="font-semibold text-green-300">REAL RENTAL DATA ONLY</h3>
              <p className="text-sm text-gray-300">
                This tool fetches ONLY real rental rates from actual rental markets. No fake calculations or STR-derived rental estimates.
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
