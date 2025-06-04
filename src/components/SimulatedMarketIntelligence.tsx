
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchRealMarketData, processMarketData } from '@/services/mashvisorService';

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
      console.log(`🚀 Starting real market analysis for ${city}`);
      
      // Call the real Mashvisor API with just the city name
      const marketData = await fetchRealMarketData(city, propType, bathCount);

      // Process the real data from Mashvisor (both STR and rent data)
      const processedData = await processMarketData(marketData, city, propType, bathCount);

      setSubmarketData(processedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const hasRevenueData = processedData.some(d => d.strRevenue > 0);
      const hasRentData = processedData.some(d => d.medianRent > 0);
      
      if (hasRevenueData && hasRentData) {
        toast({
          title: "Market Analysis Complete",
          description: `Both STR revenue and rental data from Mashvisor API for ${city}.`,
        });
      } else if (hasRevenueData && !hasRentData) {
        toast({
          title: "Partial Data Available",
          description: `STR revenue found but rental data unavailable for ${city}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Limited Data Available",
          description: `Mashvisor API returned limited data for ${city}.`,
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
              <h3 className="font-semibold text-green-300">Real Market Intelligence from Mashvisor</h3>
              <p className="text-sm text-gray-300">
                Both STR revenue (with 25% markup) and rental data from the same Mashvisor API source.
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
