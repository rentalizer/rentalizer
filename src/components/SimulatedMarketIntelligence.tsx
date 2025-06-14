
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketAnalysisForm } from '@/components/MarketAnalysisForm';
import { MarketAnalysisResults } from '@/components/MarketAnalysisResults';
import { fetchAirbnbEarningsData, processAirbnbEarningsData, fetchRealRentalData, processRentalData } from '@/services/rapidApiAirbnbService';
import { findBestMatch, findBestMatchAdvanced } from '@/utils/fuzzyMatching';

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

  const handleMarketAnalysis = async (city: string, propType: string, bathCount: string, neighborhood?: string) => {
    setIsLoading(true);
    
    try {
      console.log(`🚀 Starting market analysis for ${neighborhood ? neighborhood + ', ' + city : city} - ${propType}BR/${bathCount}BA`);
      
      // Step 1: Get rental data from OpenAI for specific neighborhood or city
      console.log(`🤖 Fetching OpenAI rental data for ${neighborhood ? neighborhood + ', ' + city : city}`);
      const rentalApiData = await fetchRealRentalData(city, propType, neighborhood);
      const rentals = processRentalData(rentalApiData);
      
      console.log(`📊 Processed OpenAI rental data:`, rentals);

      // Step 2: Create submarkets DIRECTLY from OpenAI rental data
      const submarkets: SubmarketData[] = rentals.map((rental: any, index: number) => {
        console.log(`📍 Processing rental ${index}:`, rental);
        
        const submarket: SubmarketData = {
          submarket: rental.neighborhood || `Area ${index + 1}`,
          strRevenue: 0, // Will be filled with STR data if available
          medianRent: rental.rent || 0,
          multiple: 0
        };
        
        console.log(`✅ Created submarket:`, submarket);
        return submarket;
      });

      console.log(`📋 Final submarkets with rental data:`, submarkets);

      // Step 3: Try to get STR data with enhanced fuzzy matching
      try {
        console.log(`🏠 Fetching STR earnings for ${city}`);
        const strApiData = await fetchAirbnbEarningsData(city, propType);
        const processedSTR = processAirbnbEarningsData(strApiData);
        
        console.log(`📊 STR data:`, processedSTR);

        // Enhanced STR data matching with multiple strategies
        let exactMatches = 0;
        let fuzzyMatches = 0;
        let noMatches = 0;

        processedSTR.properties.forEach(strProperty => {
          console.log(`🔍 Enhanced fuzzy matching for STR property: "${strProperty.neighborhood}"`);
          
          // Get all submarket names for fuzzy matching
          const submarketNames = submarkets.map(s => s.submarket);
          
          // Try advanced matching first
          const advancedMatch = findBestMatchAdvanced(strProperty.neighborhood, submarketNames, {
            exactThreshold: 0.9,
            aliasThreshold: 0.8,
            fuzzyThreshold: 0.3,
            allowPartialMatches: true
          });
          
          if (advancedMatch) {
            console.log(`✅ Advanced match found: "${strProperty.neighborhood}" -> "${advancedMatch.match}" (${advancedMatch.matchType}, similarity: ${advancedMatch.similarity.toFixed(3)})`);
            
            const matchingSubmarket = submarkets.find(submarket => 
              submarket.submarket === advancedMatch.match
            );
            
            if (matchingSubmarket) {
              matchingSubmarket.strRevenue = strProperty.monthlyRevenue;
              matchingSubmarket.multiple = matchingSubmarket.medianRent > 0 ? 
                strProperty.monthlyRevenue / matchingSubmarket.medianRent : 0;
              
              if (advancedMatch.matchType === 'exact' || advancedMatch.matchType === 'alias') {
                exactMatches++;
              } else {
                fuzzyMatches++;
              }
              
              console.log(`💰 Updated submarket "${matchingSubmarket.submarket}" with STR revenue: $${strProperty.monthlyRevenue} (${advancedMatch.matchType} match)`);
            }
          } else {
            // Fallback to basic fuzzy matching with lower threshold
            const basicMatch = findBestMatch(strProperty.neighborhood, submarketNames, 0.2);
            
            if (basicMatch) {
              console.log(`⚡ Fallback match found: "${strProperty.neighborhood}" -> "${basicMatch.match}" (similarity: ${basicMatch.similarity.toFixed(3)})`);
              
              const matchingSubmarket = submarkets.find(submarket => 
                submarket.submarket === basicMatch.match
              );
              
              if (matchingSubmarket) {
                matchingSubmarket.strRevenue = strProperty.monthlyRevenue;
                matchingSubmarket.multiple = matchingSubmarket.medianRent > 0 ? 
                  strProperty.monthlyRevenue / matchingSubmarket.medianRent : 0;
                
                fuzzyMatches++;
                console.log(`💰 Updated submarket "${matchingSubmarket.submarket}" with STR revenue: $${strProperty.monthlyRevenue} (fallback match)`);
              }
            } else {
              noMatches++;
              console.log(`❌ No match found for STR neighborhood: "${strProperty.neighborhood}"`);
            }
          }
        });

        console.log(`📊 Matching Results: ${exactMatches} exact/alias, ${fuzzyMatches} fuzzy, ${noMatches} unmatched`);

      } catch (strError) {
        console.warn('⚠️ STR data fetch failed, continuing with rental data only:', strError);
      }

      setSubmarketData(submarkets);
      setCityName(city);
      setPropertyType(propType);
      setBathrooms(bathCount);
      
      const rentalCount = submarkets.filter(d => d.medianRent > 0).length;
      const strCount = submarkets.filter(d => d.strRevenue > 0).length;
      
      console.log(`🎉 Analysis complete! ${submarkets.length} submarkets, ${rentalCount} with rental data, ${strCount} with STR data`);
      
      toast({
        title: "Market Analysis Complete",
        description: `Found ${submarkets.length} submarkets with ${rentalCount} having rental data and ${strCount} having STR data using enhanced fuzzy matching.`,
      });

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch rental data from OpenAI. Please check your API key.",
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
              <h3 className="font-semibold text-green-300">ENHANCED FUZZY MATCHING + REAL API DATA</h3>
              <p className="text-sm text-gray-300">
                Now using advanced fuzzy matching with neighborhood aliases, phonetic similarity, and lower thresholds for better coverage.
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
