
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Calculator, TrendingUp } from 'lucide-react';
import { MarketDataInput } from '@/components/MarketDataInput';
import { ResultsTable } from '@/components/ResultsTable';
import { calculateMarketMetrics } from '@/utils/marketCalculations';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const [city, setCity] = useState('');
  const [strData, setStrData] = useState<Array<{submarket: string, revenue: number}>>([]);
  const [rentData, setRentData] = useState<Array<{submarket: string, rent: number}>>([]);
  const [results, setResults] = useState<SubmarketData[]>([]);

  const handleStrDataChange = (data: Array<{submarket: string, revenue?: number, rent?: number}>) => {
    const filteredData = data
      .filter((item): item is {submarket: string, revenue: number} => 
        item.revenue !== undefined && item.revenue > 0
      );
    setStrData(filteredData);
  };

  const handleRentDataChange = (data: Array<{submarket: string, revenue?: number, rent?: number}>) => {
    const filteredData = data
      .filter((item): item is {submarket: string, rent: number} => 
        item.rent !== undefined && item.rent > 0
      );
    setRentData(filteredData);
  };

  const handleCalculate = () => {
    if (strData.length === 0 || rentData.length === 0) {
      return;
    }

    const calculatedResults = calculateMarketMetrics(strData, rentData);
    setResults(calculatedResults);
  };

  const handleExport = () => {
    if (results.length === 0) return;

    const csvContent = [
      ['Submarket', 'STR Revenue (Top 25%)', 'Median Rent', 'Revenue-to-Rent Multiple'],
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

        {/* City Input */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Market Analysis Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="city" className="text-base font-medium">Target City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name (e.g., Miami, FL)"
                  className="mt-2 text-lg"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Analysis Criteria:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 2-bedroom, 2-bathroom apartments</li>
                  <li>• Upscale pricing tier properties</li>
                  <li>• Revenue adjusted +25% for top 25% performance</li>
                  <li>• Minimum $4,000 monthly revenue requirement</li>
                  <li>• Minimum 2.0x revenue-to-rent multiple</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Input Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <MarketDataInput
            title="STR Revenue Data"
            description="Enter monthly STR revenue by submarket (will be automatically adjusted +25%)"
            placeholder="Revenue"
            onDataChange={handleStrDataChange}
            icon="dollar-sign"
          />
          
          <MarketDataInput
            title="Median Rent Data"
            description="Enter median rent for 2BR/2BA apartments by submarket"
            placeholder="Rent"
            onDataChange={handleRentDataChange}
            icon="home"
          />
        </div>

        {/* Calculate Button */}
        <div className="text-center">
          <Button
            onClick={handleCalculate}
            disabled={!city || strData.length === 0 || rentData.length === 0}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Market Metrics
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  Qualifying Submarkets - {city}
                </CardTitle>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <p className="text-gray-600">
                Submarkets meeting both criteria: $4,000+ revenue and 2.0+ multiple
              </p>
            </CardHeader>
            <CardContent>
              <ResultsTable results={results} />
              {results.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No submarkets meet the minimum criteria ($4,000 revenue + 2.0x multiple)
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
