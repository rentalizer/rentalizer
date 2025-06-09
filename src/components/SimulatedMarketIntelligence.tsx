
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
      
      // Fetch BOTH STR earnings AND rental data from OpenAI
      console.log(`🏠 Fetching STR earnings for ${city}`);
      const strApiData = await fetchAirbnbEarningsData(city, propType);
      const processedSTR = processAirbnbEarningsData(strApiData);
      
      console.log(`🤖 Fetching OpenAI ChatGPT rental rates for ${city}`);
      const rentalApiData = await fetchRealRentalData(city, propType);
      const processedRentals = processRentalData(rentalApiData);
      
      console.log(`📊 STR data:`, processedSTR);
      console.log(`📊 OpenAI ChatGPT rental data:`, processedRentals);

      // Create combined data starting with rental data as the base
      const combinedData: SubmarketData[] = [];
      
      // Start with all rental neighborhoods
      processedRentals.forEach(rental => {
        combinedData.push({
          submarket: `${rental.neighborhood}, ${city}`,
          strRevenue: 0, // Will be filled if STR data exists
          medianRent: rental.rent,
          multiple: 0
        });
      });
      
      // Add STR data to existing neighborhoods or create new entries
      processedSTR.properties.forEach(strProperty => {
        // Find matching rental entry by looking for neighborhood name in submarket
        let existingEntry = combinedData.find(item => 
          item.submarket.toLowerCase().includes(strProperty.neighborhood.toLowerCase()) ||
          strProperty.neighborhood.toLowerCase().includes(item.submarket.toLowerCase().split(',')[0].trim())
        );
        
        if (existingEntry) {
          // Update existing entry with STR data
          existingEntry.strRevenue = strProperty.monthlyRevenue;
          existingEntry.multiple = existingEntry.medianRent > 0 ? strProperty.monthlyRevenue / existingEntry.medianRent : 0;
        } else {
          // Create new entry for STR-only neighborhood
          combinedData.push({
            submarket: `${strProperty.neighborhood}, ${city}`,
            strRevenue: strProperty.monthlyRevenue,
            medianRent: 0,
            multiple: 0
          });
        }
      });

      setSubmarketData(combinedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const validDataCount = combinedData.filter(d => d.strRevenue > 0 && d.medianRent > 0).length;
      const rentalDataCount = combinedData.filter(d => d.medianRent > 0).length;
      
      toast({
        title: "OpenAI ChatGPT Market Analysis Complete",
        description: `Found ${combinedData.length} submarkets with ${rentalDataCount} having rental data and ${validDataCount} having both STR and rental data.`,
      });

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch real market data from OpenAI ChatGPT. Please check your API key.",
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
              <h3 className="font-semibold text-green-300">REAL CHATGPT RENTAL DATA</h3>
              <p className="text-sm text-gray-300">
                This tool uses OpenAI ChatGPT for rental rates and real STR earnings to calculate accurate revenue multiples.
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
