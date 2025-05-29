import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MapPin, DollarSign, TrendingUp, Calculator, User, LogOut, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ApartmentCube } from '@/components/ApartmentCube';
import { MarketDataInput } from '@/components/MarketDataInput';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { LoginDialog } from '@/components/LoginDialog';
import { SubscriptionPricing } from '@/components/SubscriptionPricing';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ThinAnimatedBanner } from '@/components/draft/ThinAnimatedBanner';
import { fetchMarketData } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const { user, signOut, isSubscribed } = useAuth();
  const { toast } = useToast();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [targetCity, setTargetCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [apiConfig, setApiConfig] = useState<{ airdnaApiKey?: string; openaiApiKey?: string }>({});

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // Handle upgrade logic here
  };

  const handleApiKeysChange = (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => {
    setApiConfig(keys);
  };

  const handleMarketAnalysis = async () => {
    if (!targetCity.trim()) {
      toast({
        title: "City Required",
        description: "Please enter a target city for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🚀 Starting market analysis for: ${targetCity}`);
      
      const marketData = await fetchMarketData(targetCity, apiConfig);
      
      // Combine STR and rent data
      const combinedData: SubmarketData[] = marketData.strData.map(strItem => {
        const rentItem = marketData.rentData.find(r => r.submarket === strItem.submarket);
        const medianRent = rentItem?.rent || 2000; // Default fallback
        const multiple = strItem.revenue / medianRent;
        
        return {
          submarket: strItem.submarket,
          strRevenue: strItem.revenue,
          medianRent,
          multiple
        };
      });

      // Sort by revenue potential (highest first)
      combinedData.sort((a, b) => b.multiple - a.multiple);

      setSubmarketData(combinedData);
      setCityName(targetCity);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${combinedData.length} submarkets in ${targetCity}`,
      });

    } catch (error) {
      console.error('Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete market analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show subscription gate for non-subscribed users
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Thin Animated Banner at the very top */}
        <ThinAnimatedBanner />
        
        {/* Top Navigation Bar for authenticated users */}
        {user && <TopNavBar />}

        {/* Futuristic background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-5 mb-6">
                <BarChart3 className="h-16 w-16 text-cyan-400" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-lg text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
              <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
                The All-In-One AI System To Earn Rental Income—No Mortgage Needed
              </p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <LoginDialog />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <MapPin className="h-5 w-5" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Get comprehensive market data for rental arbitrage opportunities across the US.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <TrendingUp className="h-5 w-5" />
                    Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Advanced algorithms calculate potential returns and risk scores for informed decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <Calculator className="h-5 w-5" />
                    ROI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Built-in calculator to model your specific investment scenarios and projections.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Pricing */}
            <SubscriptionPricing onUpgrade={handleUpgrade} />
          </div>
        </div>

        {/* Footer only - no standalone ContactChat */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header - simplified since we have the top nav */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-5 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
            <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              The All-In-One AI System To Earn Rental Income—No Mortgage Needed
            </p>
            
            {/* Property Type Badges */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 px-4 py-2">
                2BR/2BA Properties
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 px-4 py-2">
                Professional Data
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300 px-4 py-2">
                Sample Data Available
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-green-500/30 text-green-300 px-4 py-2">
                AI Analysis
              </Badge>
            </div>
          </div>

          {/* Market Analysis Section */}
          <div className="space-y-8 mb-12">
            {/* City Input Section */}
            <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="pb-4 border-b border-gray-700/50">
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md">
                      <Label htmlFor="target-city" className="text-sm font-medium text-gray-300">
                        Enter Target City
                      </Label>
                      <Input
                        id="target-city"
                        value={targetCity}
                        onChange={(e) => setTargetCity(e.target.value)}
                        placeholder="Enter any US city name (e.g., Denver, Seattle, Atlanta)"
                        className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleMarketAnalysis()}
                      />
                    </div>
                    
                    <Button
                      onClick={handleMarketAnalysis}
                      disabled={isLoading || !targetCity.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Market...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Rentalize Market
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <ApiKeyInput onApiKeysChange={handleApiKeysChange} />
          </div>

          {/* Results Section */}
          {submarketData.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-cyan-300">Market Analysis Results</h2>
                <div className="flex gap-2">
                  <Button
                    variant={showMap ? "outline" : "default"}
                    onClick={() => setShowMap(false)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Table View
                  </Button>
                  <Button
                    variant={showMap ? "default" : "outline"}
                    onClick={() => setShowMap(true)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Map View
                  </Button>
                </div>
              </div>

              {showMap ? (
                <MapView results={submarketData} city={cityName} />
              ) : (
                <ResultsTable results={submarketData} city={cityName} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer only - no standalone ContactChat */}
      <Footer />
    </div>
  );
};

export default Index;
