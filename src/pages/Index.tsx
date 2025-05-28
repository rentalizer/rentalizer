import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp, Search } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { calculateMarketMetrics } from '@/utils/marketCalculations';
import { fetchMarketData, ApiConfig } from '@/services/marketDataService';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
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
        hasAirbnbKey: !!apiConfig.airbnbApiKey,
        hasOpenaiKey: !!apiConfig.openaiApiKey 
      });
      
      const marketData = await fetchMarketData(city, apiConfig);
      const calculatedResults = calculateMarketMetrics(marketData.strData, marketData.rentData);
      
      setResults(calculatedResults);
      console.log(`Analysis complete for ${city}:`, calculatedResults);
      
    } catch (error) {
      console.error('Market analysis error:', error);
      setResults([]);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`Unable to analyze ${city}. Please check the city name or try again later.`);
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
    if (apiConfig.airbnbApiKey && apiConfig.openaiApiKey) {
      return 'Fetching live Airbnb listings and AI rental data...';
    } else if (apiConfig.openaiApiKey) {
      return 'Using sample STR data and fetching AI rental data...';
    } else if (apiConfig.airbnbApiKey) {
      return 'Fetching live Airbnb listings and using sample rental data...';
    } else {
      return 'Using sample market data...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">STR Market Analyzer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze short-term rental markets vs. traditional rental markets with automated revenue-to-rent calculations
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Badge variant="outline">2BR/2BA Properties</Badge>
            <Badge variant="outline">Upscale Tier</Badge>
            <Badge variant="outline">Top 25% Performance</Badge>
            <Badge variant="outline">Affordable APIs</Badge>
          </div>
        </div>

        {/* API Configuration */}
        <ApiKeyInput onApiKeysChange={setApiConfig} />

        {/* City Analysis */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
                  className="mt-2 text-lg"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Current Analysis Mode:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {apiConfig.airbnbApiKey ? (
                    <li>• ✅ Live Airbnb listings data (2BR/2BA entire homes, ~$10-50/month)</li>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    📊 {city} STR vs. Rent Analysis (Top Submarkets)
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Submarkets meeting criteria: $4,000+ revenue and 2.0+ multiple
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResultsTable results={results} />
              
              <div className="mt-6 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">✅ Analysis Complete</h4>
                  <p className="text-sm text-green-800">
                    Found {results.length} submarkets meeting investment criteria for {city}.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Data Sources:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>STR Revenue:</strong> {apiConfig.airbnbApiKey ? 'Live Airbnb listings data via RapidAPI' : 'Sample data'} (2BR/2BA Entire homes)</li>
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-5xl">⚠️</div>
                <p className="text-lg text-gray-600">{error}</p>
                <p className="text-sm text-gray-500">
                  {!apiConfig.airbnbApiKey && !apiConfig.openaiApiKey 
                    ? "Add affordable API keys above for any US city, or try: Nashville, Miami, Austin" 
                    : "Please check the city name and try again"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
