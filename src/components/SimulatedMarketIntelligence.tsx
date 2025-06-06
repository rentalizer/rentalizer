
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchRealMarketData, processMarketData } from '@/services/airdnaService';

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
      console.log(`🚀 Starting real AirDNA market analysis for ${city}`);
      
      // Call the real AirDNA API with just the city name
      const marketData = await fetchRealMarketData(city, propType, bathCount);

      // Process the real data from AirDNA
      const processedData = processMarketData(marketData);

      setSubmarketData(processedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const hasRevenueData = processedData.some(d => d.strRevenue > 0);
      const hasRentData = processedData.some(d => d.medianRent > 0);
      
      if (hasRevenueData && hasRentData) {
        toast({
          title: "City Market Analysis Complete",
          description: `STR revenue data found for ${city}. Rent estimates provided using market averages.`,
        });
      } else if (hasRevenueData && !hasRentData) {
        toast({
          title: "Revenue Data Found",
          description: `STR revenue statistics available for ${city}, but no traditional rent comparison data found.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Limited Data Available",
          description: `AirDNA API returned limited market data for ${city}.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete market analysis. Please check the console for details.",
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
      {/* Real Data Notice */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">Real AirDNA City Market Intelligence</h3>
              <p className="text-sm text-gray-300">
                This tool uses real AirDNA API data to analyze STR revenue opportunities for specific cities and neighborhoods.
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
