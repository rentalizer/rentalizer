
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, AlertTriangle, Info } from 'lucide-react';
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
  const [stateName, setStateName] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [isLoading, setIsLoading] = useState(false);

  const handleMarketAnalysis = async (state: string, propType: string, bathCount: string) => {
    setIsLoading(true);
    
    try {
      console.log(`🚀 Starting real market analysis for ${state} state`);
      
      // Call the real Mashvisor API
      const marketData = await fetchRealMarketData(state, propType, bathCount);

      // Process the real data from Mashvisor
      const processedData = processMarketData(marketData);

      setSubmarketData(processedData);
      setStateName(state);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const hasRevenueData = processedData.some(d => d.strRevenue > 0);
      const hasRentData = processedData.some(d => d.medianRent > 0);
      
      if (hasRevenueData && hasRentData) {
        toast({
          title: "State Market Analysis Complete",
          description: `STR revenue data found for ${state}. Rent estimates provided using market averages.`,
        });
      } else if (hasRevenueData && !hasRentData) {
        toast({
          title: "Revenue Data Found",
          description: `STR revenue statistics available for ${state}, but no traditional rent comparison data found.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Limited Data Available",
          description: "Mashvisor API returned limited market data for this state.",
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
              <h3 className="font-semibold text-green-300">Real Mashvisor State Market Intelligence</h3>
              <p className="text-sm text-gray-300">
                This tool uses real Mashvisor API data to analyze STR revenue opportunities at the state level.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Limitations Notice */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-blue-300">State-Level Revenue Statistics</h3>
              <p className="text-sm text-gray-300">
                The API provides STR revenue data aggregated by state and performance percentiles. Traditional rent data may be estimated using market averages when not available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Limitation Notice */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-300">State Market Data Availability</h3>
              <p className="text-sm text-gray-300">
                Some states may not have comprehensive rental comparison data. Results show revenue statistics by performance tiers when available.
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
        cityName={stateName}
        propertyType={propertyType}
        bathrooms={bathrooms}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};
