
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
  const [apiStatus, setApiStatus] = useState<{rentalApiWorking: boolean, strApiWorking: boolean}>({
    rentalApiWorking: true,
    strApiWorking: true
  });

  const handleMarketAnalysis = async (city: string, propType: string, bathCount: string, neighborhood?: string) => {
    setIsLoading(true);
    let rentalApiWorking = true;
    let strApiWorking = true;
    
    try {
      console.log(`🚀 Starting market analysis for ${neighborhood ? neighborhood + ', ' + city : city} - ${propType}BR/${bathCount}BA`);
      
      // Step 1: Get rental data from OpenAI for specific neighborhood or city
      console.log(`🤖 Fetching OpenAI rental data for ${neighborhood ? neighborhood + ', ' + city : city}`);
      
      let rentals = [];
      try {
        const rentalApiData = await fetchRealRentalData(city, propType, neighborhood);
        rentals = processRentalData(rentalApiData);
        console.log(`📊 Processed OpenAI rental data:`, rentals);
      } catch (rentalError) {
        console.error('❌ Rental API failed:', rentalError);
        rentalApiWorking = false;
        rentals = []; // Empty array when API fails
      }

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
        console.error('⚠️ STR data fetch failed:', strError);
        strApiWorking = false;
        // Don't treat this as a failure - continue with rental data only
      }

      // Update API status
      setApiStatus({ rentalApiWorking, strApiWorking });

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
      setApiStatus({ rentalApiWorking: false, strApiWorking: false });
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch data. Please check your API configuration.",
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

  // Show alert only when APIs actually fail
  const showApiFailureAlert = !apiStatus.rentalApiWorking || !apiStatus.strApiWorking;

  return (
    <div className="space-y-8">
      {/* API Failure Alert - Only show for real API failures */}
      {showApiFailureAlert && submarketData.length === 0 && (
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-700">API Connection Issues</h3>
                <p className="text-sm text-gray-600">
                  {!apiStatus.rentalApiWorking && !apiStatus.strApiWorking && "Both rental and STR APIs are not responding. Check your API keys."}
                  {!apiStatus.rentalApiWorking && apiStatus.strApiWorking && "Rental data API is not responding. Check your OpenAI API key."}
                  {apiStatus.rentalApiWorking && !apiStatus.strApiWorking && "STR data API is not responding. Check your RapidAPI key."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
      </div>

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
