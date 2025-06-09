
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchRealMarketData, processMarketData } from '@/services/airdnaService';
import { fetchAirbnbEarningsData, processAirbnbEarningsData } from '@/services/rapidApiAirbnbService';

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
      console.log(`🚀 Starting market analysis for ${city} using RapidAPI Airbnb Scraper`);
      
      // First try RapidAPI Airbnb Scraper
      try {
        const rapidApiData = await fetchAirbnbEarningsData(city, propType);
        const rapidApiProcessed = processAirbnbEarningsData(rapidApiData);
        
        if (rapidApiProcessed.properties && rapidApiProcessed.properties.length > 0) {
          // Check if we got real data or NA data
          const hasRealData = rapidApiProcessed.properties.some(prop => prop.monthlyRevenue > 0);
          
          if (hasRealData) {
            // Convert RapidAPI data to SubmarketData format
            const processedData: SubmarketData[] = rapidApiProcessed.properties.map(property => ({
              submarket: `${property.neighborhood}, ${city}`,
              strRevenue: property.monthlyRevenue,
              medianRent: 0, // Set to 0 - will show as NA in table
              multiple: 0 // Set to 0 - will show as NA in table
            }));

            setSubmarketData(processedData);
            setCityName(city);
            setPropertyType(propType);
            setBathrooms(bathCount);
            
            toast({
              title: "RapidAPI Market Analysis Complete",
              description: `Found ${rapidApiProcessed.totalProperties} STR properties in ${city} using RapidAPI Airbnb Scraper.`,
            });
            
            setIsLoading(false);
            return;
          } else {
            // API returned but with no real data
            toast({
              title: "No Real Data Available",
              description: `RapidAPI returned no valid data for ${city}. Trying fallback sources.`,
              variant: "destructive",
            });
          }
        }
      } catch (rapidApiError) {
        console.warn('RapidAPI failed, falling back to AirDNA:', rapidApiError);
        toast({
          title: "API Failed",
          description: "RapidAPI failed. Falling back to AirDNA.",
          variant: "destructive",
        });
      }

      // Fallback to AirDNA if RapidAPI fails or returns no data
      console.log(`🔄 Falling back to AirDNA market analysis for ${city}`);
      const marketData = await fetchRealMarketData(city, propType, bathCount);
      const processedData = processMarketData(marketData);

      setSubmarketData(processedData);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const hasRevenueData = processedData.some(d => d.strRevenue > 0);
      const hasRentData = processedData.some(d => d.medianRent > 0);
      
      if (hasRevenueData && hasRentData) {
        toast({
          title: "AirDNA Fallback Analysis Complete",
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
          description: `Market data services returned limited data for ${city}.`,
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
      {/* Updated Data Notice */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">RapidAPI Airbnb Scraper + AirDNA Market Intelligence</h3>
              <p className="text-sm text-gray-300">
                This tool uses RapidAPI Airbnb Scraper as the primary data source with AirDNA as fallback. No placeholder data will be shown - only real market data or "NA" when unavailable.
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
