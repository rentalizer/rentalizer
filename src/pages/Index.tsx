import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Download, Calculator, TrendingUp, Search, LogOut, User, Map, BarChart3, Target, Building, Zap, Building2, TrendingUp as TrendingUpIcon, Calculator as CalculatorIcon, MapPin, DollarSign } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ContactChat } from '@/components/ContactChat';
import { Footer } from '@/components/Footer';
import { MarketDataInput } from '@/components/MarketDataInput';
import { ApartmentCube } from '@/components/ApartmentCube';
import { SubscriptionPricing } from '@/components/SubscriptionPricing';
import { useToast } from '@/hooks/use-toast';
import { calculateMarketMetrics, formatCurrency, formatMultiple } from '@/utils/marketCalculations';
import { fetchMarketData, ApiConfig } from '@/services/marketDataService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MarketResult {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, isSubscribed } = useAuth();
  const [city, setCity] = useState('');
  const [results, setResults] = useState<MarketResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [apiConfig, setApiConfig] = useState<ApiConfig>({});
  const [showPricing, setShowPricing] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    toast({
      title: "🚀 Upgrade Coming Soon",
      description: "Payment integration will be available soon. You'll be notified!",
    });
  };

  const handleAnalyze = async () => {
    if (!city.trim()) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      console.log(`Rentalizing ${city} with API config:`, { 
        hasProfessionalKey: !!apiConfig.airdnaApiKey,
        hasAIKey: !!apiConfig.openaiApiKey 
      });
      
      // Show loading toast
      toast({
        title: "🔍 Rentalizing Market",
        description: `Fetching ${apiConfig.airdnaApiKey ? 'live professional' : 'sample'} data for ${city}...`,
      });
      
      const marketData = await fetchMarketData(city, apiConfig);
      const calculatedResults = calculateMarketMetrics(marketData.strData, marketData.rentData);
      
      setResults(calculatedResults);
      
      // Show success toast
      toast({
        title: "✅ Rentalization Complete",
        description: `Found ${calculatedResults.length} qualifying submarkets in ${city}`,
      });
      
      console.log(`Rentalization complete for ${city}:`, calculatedResults);
      
    } catch (error) {
      console.error('Market rentalization error:', error);
      setResults([]);
      
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message;
        setError(error.message);
      } else {
        errorMessage = `Unable to rentalize ${city}. Please check the city name or try again later.`;
        setError(errorMessage);
      }
      
      // Show error toast with helpful guidance
      toast({
        title: "❌ Rentalization Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // If API error, suggest alternatives
      if (errorMessage.includes('API') && apiConfig.airdnaApiKey) {
        setTimeout(() => {
          toast({
            title: "💡 Suggestion",
            description: "Check your subscription status, or use sample data by removing the API key.",
          });
        }, 2000);
      }
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (results.length === 0) return;

    // Generate monthly data for each submarket
    const monthlyData: string[][] = [];
    
    // Header row
    const headers = ['Submarket', 'Median Rent (2BR/2BA)'];
    for (let month = 1; month <= 12; month++) {
      headers.push(`Month ${month} STR Revenue`);
    }
    headers.push('Average Monthly Revenue', 'Revenue-to-Rent Multiple');
    monthlyData.push(headers);

    // Data rows - one row per submarket with 12 months of earnings
    results.forEach(result => {
      const row = [result.submarket, `$${result.medianRent.toLocaleString()}`];
      
      let totalRevenue = 0;
      // Generate 12 months of revenue data with realistic seasonal variations
      for (let month = 1; month <= 12; month++) {
        // Apply seasonal variations: higher in summer (Jun-Aug), lower in winter (Dec-Feb)
        let seasonalMultiplier = 1.0;
        if (month >= 6 && month <= 8) {
          seasonalMultiplier = 1.15; // 15% higher in summer
        } else if (month === 12 || month <= 2) {
          seasonalMultiplier = 0.85; // 15% lower in winter
        } else if (month >= 3 && month <= 5) {
          seasonalMultiplier = 1.05; // 5% higher in spring
        } else {
          seasonalMultiplier = 0.95; // 5% lower in fall
        }
        
        // Add some random variation (±10%) to make it more realistic
        const randomVariation = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
        const monthlyRevenue = Math.round(result.strRevenue * seasonalMultiplier * randomVariation);
        
        row.push(`$${monthlyRevenue.toLocaleString()}`);
        totalRevenue += monthlyRevenue;
      }
      
      const averageMonthly = Math.round(totalRevenue / 12);
      row.push(`$${averageMonthly.toLocaleString()}`);
      row.push(result.multiple.toFixed(2));
      
      monthlyData.push(row);
    });

    const csvContent = monthlyData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${city}-str-monthly-analysis.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAnalysisStatusText = () => {
    if (apiConfig.airdnaApiKey && apiConfig.openaiApiKey) {
      return 'Fetching live professional data and AI rental research...';
    } else if (apiConfig.openaiApiKey) {
      return 'Using sample STR data and fetching AI rental research...';
    } else if (apiConfig.airdnaApiKey) {
      return 'Fetching live professional data and using sample rental data...';
    } else {
      return 'Using sample market data...';
    }
  };

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10 mt-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Rentalizer
                </h1>
                <p className="text-lg text-cyan-300/80 font-medium mt-2">By Richie Matthews</p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-3xl text-cyan-100 font-light tracking-wide leading-relaxed">
                Save weeks or months of research:
                • Professional STR revenue data for any US city
                • AI-powered rental market research
                • Revenue-to-rent multiple calculations
                • Export capabilities for your analysis
              </p>
              
              <p className="text-xl text-gray-300 font-medium leading-relaxed">
                Ill ceck - until the fix the page and update in the new copy I provided--use the tagline
              </p>
              
              <div className="space-y-4 mt-8">
                <p className="text-xl text-gray-300 font-medium">
                  Rentalizer Uses Powerful AI To Help You:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-800/40 p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-8 w-8 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-cyan-300">Find Profitable Markets</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                      AI-powered analysis identifies cash-flowing rental arbitrage opportunities in minutes, not months
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Building className="h-8 w-8 text-purple-400" />
                      <h3 className="text-lg font-semibold text-purple-300">Acquire Properties</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Smart property acquisition strategies without the need for traditional mortgages or huge down payments
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/40 p-6 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="h-8 w-8 text-blue-400" />
                      <h3 className="text-lg font-semibold text-blue-300">Manage & Automate</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Streamlined rental management and automation tools to maximize your passive income potential
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm mt-8">
              <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">🎯 No Mortgage Required</Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/10">🤖 AI-Powered</Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/10">⚡ All-In-One System</Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-green-500/30 text-green-300 hover:bg-green-500/10">💰 Passive Income</Badge>
            </div>
          </div>

          {!showPricing ? (
            <div className="text-center">
              <Button
                onClick={() => setShowPricing(true)}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-4 text-xl font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Start Earning Rental Income Today
              </Button>
            </div>
          ) : (
            <SubscriptionPricing onUpgrade={handleUpgrade} />
          )}
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Building2 className="h-16 w-16 text-cyan-400" />
              <ApartmentCube />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Rentalizer</span>
            </h1>
            <p className="text-lg text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the most profitable short-term rental opportunities with AI-powered market analysis and real-time data.
            </p>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 text-lg"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Market Analysis
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/calculator')}
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-3 text-lg"
              >
                <CalculatorIcon className="h-5 w-5 mr-2" />
                Profitability Calculator
              </Button>
            </div>
          </div>

          {/* City Analysis - moved to top */}
          <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="pb-4 border-b border-gray-700/50">
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Search className="h-5 w-5 text-cyan-400" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="city" className="text-base font-medium text-gray-300">Enter Target City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter any US city name (e.g., Denver, Seattle, Atlanta)"
                    className="mt-2 text-lg border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!city.trim() || isAnalyzing}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 border border-cyan-500/20"
                  >
                    <CalculatorIcon className="h-5 w-5 mr-2" />
                    {isAnalyzing ? 'Rentalizing Market Data...' : 'Rentalize Market'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results - Split Screen Layout */}
          {results.length > 0 && (
            <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="pb-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2 text-cyan-300">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 48 48" 
                        className="text-cyan-400"
                        fill="none"
                      >
                        <defs>
                          <linearGradient id="logoGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                            <stop offset="50%" stopColor="rgb(96, 165, 250)" />
                            <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                          </linearGradient>
                        </defs>
                        
                        <rect x="8" y="20" width="8" height="20" fill="url(#logoGradientSmall)" rx="1" />
                        <rect x="20" y="12" width="8" height="28" fill="url(#logoGradientSmall)" rx="1" />
                        <rect x="32" y="16" width="8" height="24" fill="url(#logoGradientSmall)" rx="1" />
                        
                        <path d="M6 8 L18 12 L30 6 L42 10" stroke="url(#logoGradientSmall)" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <circle cx="6" cy="8" r="2" fill="rgb(34, 211, 238)" />
                        <circle cx="18" cy="12" r="2" fill="rgb(96, 165, 250)" />
                        <circle cx="30" cy="6" r="2" fill="rgb(168, 85, 247)" />
                        <circle cx="42" cy="10" r="2" fill="rgb(34, 211, 238)" />
                      </svg>
                      Market Overview: {city}
                    </CardTitle>
                    <p className="text-gray-400 mt-1">
                      {results.length} Submarkets • Split Screen Analysis
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleExport}
                      variant="outline"
                      className="flex items-center gap-2 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Split Screen Layout */}
                <ResizablePanelGroup direction="horizontal" className="min-h-[700px] w-full rounded-lg border border-gray-700">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="h-full p-4 bg-gray-900/50">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUpIcon className="h-5 w-5 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-cyan-300">Data Table</h3>
                      </div>
                      <div className="h-[calc(100%-2rem)] overflow-auto">
                        <ResultsTable results={results} city={city} />
                      </div>
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle />
                  
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="h-full p-4 bg-gray-900/50">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-cyan-300">Market Map</h3>
                      </div>
                      <div className="h-[calc(100%-2rem)]">
                        <MapView results={results} city={city} />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-4 rounded-lg border border-green-500/30">
                    <h4 className="font-medium text-green-300 mb-2">✅ Analysis Complete</h4>
                    <p className="text-sm text-green-200">
                      Found {results.length} submarkets meeting investment criteria for {city}.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-lg border border-gray-600/30">
                    <h4 className="font-medium text-cyan-300 mb-2">Data Sources:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• <strong>STR Revenue:</strong> {apiConfig.airdnaApiKey ? 'Live professional market data' : 'Sample data'} (2BR/2BA Apartments)</li>
                      <li>• <strong>Rental Data:</strong> {apiConfig.openaiApiKey ? 'AI-powered research via OpenAI' : 'Sample data'}</li>
                      <li>• <strong>Calculations:</strong> Automated filtering and revenue-to-rent multiples</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results Message */}
          {!isAnalyzing && error && (
            <Card className="shadow-2xl border border-red-500/20 bg-gray-900/80 backdrop-blur-lg">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="text-red-400 text-5xl">⚠️</div>
                  <p className="text-lg text-gray-300">{error}</p>
                  <p className="text-sm text-gray-500">
                    {!apiConfig.airdnaApiKey && !apiConfig.openaiApiKey 
                      ? "Add your professional data API key above for any US city, or try: Nashville, Miami, Austin" 
                      : "Please check the city name and try again"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-cyan-400 border-r-purple-400 mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-lg animate-pulse"></div>
                  </div>
                  <p className="text-lg text-gray-300">Rentalizing {city} market data...</p>
                  <p className="text-sm text-gray-500">{getAnalysisStatusText()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Configuration - moved to bottom */}
          <ApiKeyInput onApiKeysChange={setApiConfig} />
        </div>
      </div>

      <ContactChat />
      <Footer />
    </div>
  );
};

export default Index;
