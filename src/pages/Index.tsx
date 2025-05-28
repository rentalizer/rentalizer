import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp, Search } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ApartmentCube } from '@/components/ApartmentCube';
import { calculateMarketMetrics } from '@/utils/marketCalculations';
import { fetchMarketData, ApiConfig } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const { toast } = useToast();
  const [city, setCity] = useState('');
  const [results, setResults] = useState<SubmarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [apiConfig, setApiConfig] = useState<ApiConfig>({});

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ApartmentCube size={48} className="animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              Rentalizer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rentalizer™ Helps Investors Analyze Short Term Rental Opportunities
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Badge variant="outline" className="bg-white/50 border-blue-200">2BR/2BA Properties</Badge>
            <Badge variant="outline" className="bg-white/50 border-cyan-200">Professional Data</Badge>
            <Badge variant="outline" className="bg-white/50 border-blue-200">Sample Data Available</Badge>
            <Badge variant="outline" className="bg-white/50 border-cyan-200">AI Analysis</Badge>
          </div>
        </div>

        {/* API Configuration */}
        <ApiKeyInput onApiKeysChange={setApiConfig} />

        {/* City Analysis */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="city" className="text-base font-medium">Enter Target City</Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter any US city name (e.g., Denver, Seattle, Atlanta)"
                  className="mt-2 text-lg border-blue-200 focus:border-cyan-400"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Current Analysis Mode:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {apiConfig.airdnaApiKey ? (
                    <li>• ✅ Live professional STR data (2BR/2BA apartments, accommodates 6)</li>
                  ) : (
                    <li>• 📋 Sample STR data (for supported cities: Nashville, Miami, Austin)</li>
                  )}
                  {apiConfig.openaiApiKey ? (
                    <li>• 🤖 AI-powered rental data research via OpenAI (~$5-20/month)</li>
                  ) : (
                    <li>• 📋 Sample rental data (for supported cities only)</li>
                  )}
                  <li>• 🧮 Automated revenue-to-rent calculations and filtering (4k+ revenue, 2.0+ multiple)</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!city.trim() || isAnalyzing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ApartmentCube size={24} />
                    {city} STR vs. Rent Analysis (Top Submarkets)
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Submarkets meeting criteria: $4,000+ revenue and 2.0+ multiple
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResultsTable results={results} />
              
              <div className="mt-6 space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">✅ Analysis Complete</h4>
                  <p className="text-sm text-green-800">
                    Found {results.length} submarkets meeting investment criteria for {city}.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Data Sources:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-red-50/90 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-5xl">⚠️</div>
                <p className="text-lg text-gray-600">{error}</p>
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-lg text-gray-600">Analyzing {city} market data...</p>
                <p className="text-sm text-gray-500">{getAnalysisStatusText()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
