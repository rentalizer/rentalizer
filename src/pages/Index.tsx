import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp, Search } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { calculateMarketMetrics } from '@/utils/marketCalculations';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

// Sample market data - in a real app, this would come from APIs
const marketDatabase = {
  'nashville': {
    strData: [
      { submarket: 'Downtown', revenue: 6794 },
      { submarket: 'The Gulch', revenue: 6000 },
      { submarket: 'East Nashville', revenue: 5200 },
      { submarket: '12 South', revenue: 4800 },
      { submarket: 'Midtown', revenue: 4640 },
      { submarket: 'Music Row', revenue: 4200 },
      { submarket: 'Germantown', revenue: 3800 }
    ],
    rentData: [
      { submarket: 'Downtown', rent: 2513 },
      { submarket: 'The Gulch', rent: 2456 },
      { submarket: 'East Nashville', rent: 2307 },
      { submarket: '12 South', rent: 2136 },
      { submarket: 'Midtown', rent: 2272 },
      { submarket: 'Music Row', rent: 2100 },
      { submarket: 'Germantown', rent: 2200 }
    ]
  },
  'miami': {
    strData: [
      { submarket: 'Brickell', revenue: 7200 },
      { submarket: 'South Beach', revenue: 8500 },
      { submarket: 'Downtown Miami', revenue: 6800 },
      { submarket: 'Wynwood', revenue: 5400 },
      { submarket: 'Coral Gables', revenue: 6200 }
    ],
    rentData: [
      { submarket: 'Brickell', rent: 3200 },
      { submarket: 'South Beach', rent: 3800 },
      { submarket: 'Downtown Miami', rent: 2900 },
      { submarket: 'Wynwood', rent: 2400 },
      { submarket: 'Coral Gables', rent: 2800 }
    ]
  },
  'austin': {
    strData: [
      { submarket: 'Downtown Austin', revenue: 6500 },
      { submarket: 'South Austin', revenue: 5800 },
      { submarket: 'East Austin', revenue: 5200 },
      { submarket: 'West Austin', revenue: 4800 },
      { submarket: 'North Austin', revenue: 4200 }
    ],
    rentData: [
      { submarket: 'Downtown Austin', rent: 2800 },
      { submarket: 'South Austin', rent: 2400 },
      { submarket: 'East Austin', rent: 2200 },
      { submarket: 'West Austin', rent: 2000 },
      { submarket: 'North Austin', rent: 1900 }
    ]
  }
};

const Index = () => {
  const [city, setCity] = useState('');
  const [results, setResults] = useState<SubmarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!city.trim()) return;

    setIsAnalyzing(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      const cityKey = city.toLowerCase().trim();
      const cityData = marketDatabase[cityKey as keyof typeof marketDatabase];
      
      if (cityData) {
        const calculatedResults = calculateMarketMetrics(cityData.strData, cityData.rentData);
        setResults(calculatedResults);
        console.log(`Found data for ${city}:`, calculatedResults);
      } else {
        setResults([]);
        setError(`No data available for "${city}". Currently supported cities: Nashville, Miami, Austin`);
        console.log(`No data found for: ${city}`);
      }
      
      setIsAnalyzing(false);
    }, 1500);
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
          </div>
        </div>

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
                  placeholder="Enter city name (e.g., Nashville, Miami, Austin)"
                  className="mt-2 text-lg"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Analysis Process:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fetches AirDNA data for 2BR/2BA upscale properties (past 24 months)</li>
                  <li>• Applies +25% adjustment for top 25% performance</li>
                  <li>• Sources median rent data from Rentometer</li>
                  <li>• Filters for $4,000+ revenue and 2.0+ multiple criteria</li>
                  <li>• Ranks by revenue-to-rent multiple</li>
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
                  <h4 className="font-medium text-green-900 mb-2">✅ Submarkets Meeting Criteria</h4>
                  <p className="text-sm text-green-800">
                    All listed submarkets meet your specified criteria and are strong candidates for STR investment.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Notes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>STR Revenue (Top 25%):</strong> Based on AirDNA data, top 25% performing 2BR/2BA Upscale STRs</li>
                    <li>• <strong>Median Rent:</strong> Sourced from Rentometer, reflecting current median rents for 2-bedroom, 2-bath apartments</li>
                    <li>• <strong>Revenue-to-Rent Multiple:</strong> Calculated by dividing STR revenue by median rent</li>
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
                  Try entering one of the supported cities or check your spelling.
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
                <p className="text-sm text-gray-500">Fetching AirDNA revenue data and Rentometer rent data</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
