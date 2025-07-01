import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Building,
  Users,
  Download,
  Loader2
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { AdminEditMode } from '@/components/AdminEditMode';
import { AccessGate } from '@/components/AccessGate';
import { MarketDataInput } from '@/components/MarketDataInput';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { SimulatedMarketIntelligence } from '@/components/SimulatedMarketIntelligence';
import { exportToExcel } from '@/utils/dataExport';

const MarketAnalysis = () => {
  const [location, setLocation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
  const [marketData, setMarketData] = useState({
    averageRent: 0,
    occupancyRate: 0,
    propertyValues: 0,
    populationGrowth: 0,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('googleMapsApiKey') || '';
    setApiKey(storedApiKey);
    validateApiKey(storedApiKey);
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key) {
      setApiKeyStatus('unknown');
      return;
    }

    setApiKeyStatus('unknown');
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee%20shop&location=${location}&key=${key}`);
      const data = await response.json();
      setApiKeyStatus(data.status === 'OK' ? 'valid' : 'invalid');
    } catch (error) {
      setApiKeyStatus('invalid');
    }
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('googleMapsApiKey', newKey);
    validateApiKey(newKey);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleMarketDataChange = (data: any) => {
    setMarketData(data);
  };

  const handleAnalyzeMarket = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newResults = [
      { id: 1, neighborhood: 'Downtown', averageRent: 1500, occupancyRate: 95, propertyValues: 350000, populationGrowth: 3 },
      { id: 2, neighborhood: 'Midtown', averageRent: 1300, occupancyRate: 92, propertyValues: 280000, populationGrowth: 2.5 },
      { id: 3, neighborhood: 'Uptown', averageRent: 1700, occupancyRate: 97, propertyValues: 420000, populationGrowth: 3.5 },
    ];

    setResults(newResults);
    setLoading(false);
  };

  const handleEditModeChange = (isEditing: boolean) => {
    setIsEditMode(isEditing);
  };

  return (
    <AccessGate
      requiredAccess="essentials"
      moduleName="Market Intelligence"
      moduleDescription="Access AI-powered market analysis and insights for rental arbitrage opportunities."
      moduleIcon={<BarChart3 className="h-8 w-8 text-cyan-400" />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TopNavBar />
        <AdminEditMode onEditModeChange={handleEditModeChange} />
        
        <div className="container mx-auto px-4 py-16">
          <Card className="bg-slate-800/90 backdrop-blur-lg border border-gray-700/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
                Market Analysis
              </CardTitle>
              <ApiKeyStatus apiKeyStatus={apiKeyStatus} />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="inputs" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="inputs" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    Market Data
                  </TabsTrigger>
                  <TabsTrigger value="api" className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-300">
                    <Building className="h-4 w-4 mr-2" />
                    API Key
                  </TabsTrigger>
                  <TabsTrigger value="simulated" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-300">
                    <Users className="h-4 w-4 mr-2" />
                    Simulated Data
                  </TabsTrigger>
                </TabsList>
                <Separator className="bg-gray-700" />
                <TabsContent value="inputs" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-gray-300">Location</Label>
                      <Input 
                        id="location" 
                        value={location} 
                        onChange={handleLocationChange} 
                        className="bg-gray-700 text-white border-gray-600 focus-visible:ring-cyan-500" 
                      />
                    </div>
                    <MarketDataInput onMarketDataChange={handleMarketDataChange} isEditMode={isEditMode} />
                  </div>
                  <Button 
                    onClick={handleAnalyzeMarket} 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze Market
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="api" className="space-y-4">
                  <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} apiKeyStatus={apiKeyStatus} />
                </TabsContent>
                <TabsContent value="simulated" className="space-y-4">
                  <SimulatedMarketIntelligence />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-green-400" />
                  Market Analysis Results
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500/30 hover:bg-green-500/10 text-green-300 hover:text-green-200"
                  onClick={() => exportToExcel(results, 'market_analysis_results')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
              <ResultsTable results={results} />
            </div>
          )}
        </div>
      </div>
    </AccessGate>
  );
};

export default MarketAnalysis;
