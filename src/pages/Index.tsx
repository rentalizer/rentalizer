import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp, Search, LogOut, User, Map, BarChart3 } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { calculateMarketMetrics } from '@/utils/marketCalculations';
import { fetchMarketData, ApiConfig } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, isSubscribed } = useAuth();
  const [city, setCity] = useState('');
  const [results, setResults] = useState<SubmarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [apiConfig, setApiConfig] = useState<ApiConfig>({});
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const handleAnalyze = async () => {
    if (!city.trim()) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      console.log(`Analyzing ${city} with API config:`, { 
        hasProfessionalKey: !!apiConfig.airdnaApiKey,
        hasAIKey: !!apiConfig.openaiApiKey 
      });
      
      // Show loading toast
      toast({
        title: "🔍 Analyzing Market",
        description: `Fetching ${apiConfig.airdnaApiKey ? 'live professional' : 'sample'} data for ${city}...`,
      });
      
      const marketData = await fetchMarketData(city, apiConfig);
      const calculatedResults = calculateMarketMetrics(marketData.strData, marketData.rentData);
      
      setResults(calculatedResults);
      
      // Show success toast
      toast({
        title: "✅ Analysis Complete",
        description: `Found ${calculatedResults.length} qualifying submarkets in ${city}`,
      });
      
      console.log(`Analysis complete for ${city}:`, calculatedResults);
      
    } catch (error) {
      console.error('Market analysis error:', error);
      setResults([]);
      
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message;
        setError(error.message);
      } else {
        errorMessage = `Unable to analyze ${city}. Please check the city name or try again later.`;
        setError(errorMessage);
      }
      
      // Show error toast with helpful guidance
      toast({
        title: "❌ Analysis Failed",
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

    const csvContent = [
      ['Submarket', 'STR Revenue (Top 25%)', 'Median Rent (2BR/2BA)', 'Revenue-to-Rent Multiple'],
      ...results.map(row => [
        row.submarket,
        `$${row.strRevenue.toLocaleString()}`,
        `$${row.medianRent.toLocaleString()}`,
        row.multiple.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${city}-str-analysis.csv`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center justify-center gap-3">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                RENTALIZER.AI
              </h1>
            </div>
            <div className="flex-1 flex justify-end items-center gap-3">
              <div className="flex items-center gap-2 text-cyan-300 text-sm">
                <User className="h-4 w-4" />
                {user?.email}
                <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300">
                  {user?.subscription_status === 'active' ? 'Pro' : 'Trial'}
                </Badge>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto font-light tracking-wide">
            Helping Investors Analyze Short Term Rental Opportunities
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">2BR/2BA Properties</Badge>
            <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/10">Professional Data</Badge>
            <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/10">Sample Data Available</Badge>
            <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">AI Analysis</Badge>
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
                  <Calculator className="h-5 w-5 mr-2" />
                  {isAnalyzing ? 'Analyzing Market Data...' : 'Analyze Market'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
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
                    {results.length} Submarkets • Revenue Potential Analysis
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex bg-gray-800/50 rounded-lg p-1">
                    <Button
                      onClick={() => setViewMode('table')}
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      className={viewMode === 'table' ? 'bg-cyan-600 hover:bg-cyan-500' : 'text-gray-400 hover:text-cyan-300'}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Table
                    </Button>
                    <Button
                      onClick={() => setViewMode('map')}
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      size="sm"
                      className={viewMode === 'map' ? 'bg-cyan-600 hover:bg-cyan-500' : 'text-gray-400 hover:text-cyan-300'}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Map
                    </Button>
                  </div>
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
              {viewMode === 'table' ? (
                <ResultsTable results={results} />
              ) : (
                <MapView results={results} city={city} />
              )}
              
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
                <p className="text-lg text-gray-300">Analyzing {city} market data...</p>
                <p className="text-sm text-gray-500">{getAnalysisStatusText()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Configuration - moved to bottom */}
        <ApiKeyInput onApiKeysChange={setApiConfig} />
      </div>
    </div>
  );
};

export default Index;
