
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { BarChart3, MapPin, Search, Loader2, ArrowLeft, Map, Table2, Home, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { TopNavBar } from '@/components/TopNavBar';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { Footer } from '@/components/Footer';
import { fetchMarketData } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { exportToCSV } from '@/utils/dataExport';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const MarketAnalysis = () => {
  const { user, isSubscribed } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [targetCity, setTargetCity] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState<{ airdnaApiKey?: string; openaiApiKey?: string }>({});

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
      console.log(`🚀 Starting market analysis for: ${targetCity} (${propertyType}BR/${bathrooms}BA properties)`);
      
      const marketData = await fetchMarketData(targetCity, apiConfig, propertyType, bathrooms);
      
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
        description: `Found ${combinedData.length} submarkets in ${targetCity} for ${propertyType}BR/${bathrooms}BA properties`,
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

  const handleExportData = () => {
    if (submarketData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please run a market analysis first to generate data.",
        variant: "destructive",
      });
      return;
    }

    const filename = `${cityName.toLowerCase().replace(/\s+/g, '-')}-market-analysis-${propertyType}br-${bathrooms}ba`;
    exportToCSV(submarketData, filename);
    
    toast({
      title: "Data Exported",
      description: `Market analysis data for ${cityName} has been downloaded as CSV.`,
    });
  };

  const getBathroomOptions = () => {
    if (propertyType === '1') {
      return [{ value: '1', label: '1 Bathroom' }];
    } else if (propertyType === '2') {
      return [
        { value: '1', label: '1 Bathroom' },
        { value: '2', label: '2 Bathrooms' }
      ];
    } else if (propertyType === '3') {
      return [
        { value: '1', label: '1 Bathroom' },
        { value: '2', label: '2 Bathrooms' },
        { value: '3', label: '3 Bathrooms' }
      ];
    }
    return [{ value: '1', label: '1 Bathroom' }];
  };

  // Update bathrooms when property type changes
  React.useEffect(() => {
    const options = getBathroomOptions();
    if (!options.find(opt => opt.value === bathrooms)) {
      setBathrooms(options[0].value);
    }
  }, [propertyType]);

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
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center justify-center gap-6 mb-8 px-4">
              <BarChart3 className="h-16 w-16 text-cyan-400 flex-shrink-0" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Market Intelligence
              </h1>
            </div>
            <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Find The Best Rental Arbitrage Markets
            </p>
            
            {/* Property Type Badges */}
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 px-4 py-2">
                <Home className="h-4 w-4 mr-1" />
                1BR - 3BR Apartments
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 px-4 py-2">
                Revenue/Rent Ratio
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300 px-4 py-2">
                Heat Map
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-green-500/30 text-green-300 px-4 py-2">
                Export Data
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

                    <div className="w-full max-w-md grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="property-type" className="text-sm font-medium text-gray-300">
                          Bedrooms
                        </Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                          <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20">
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 z-50">
                            <SelectItem value="1" className="text-gray-100 focus:bg-gray-700 focus:text-white">
                              1 Bedroom
                            </SelectItem>
                            <SelectItem value="2" className="text-gray-100 focus:bg-gray-700 focus:text-white">
                              2 Bedrooms
                            </SelectItem>
                            <SelectItem value="3" className="text-gray-100 focus:bg-gray-700 focus:text-white">
                              3 Bedrooms
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-300">
                          Bathrooms
                        </Label>
                        <Select value={bathrooms} onValueChange={setBathrooms}>
                          <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20">
                            <SelectValue placeholder="Select bathrooms" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 z-50">
                            {getBathroomOptions().map((option) => (
                              <SelectItem 
                                key={option.value} 
                                value={option.value} 
                                className="text-gray-100 focus:bg-gray-700 focus:text-white"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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

          {/* Split Screen Results Section */}
          {submarketData.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">Market Analysis Results</h2>
                  <p className="text-gray-400 mt-1">{propertyType}BR/{bathrooms}BA properties in {cityName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 px-3 py-1">
                    <Table2 className="h-4 w-4 mr-1" />
                    Table View
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 px-3 py-1">
                    <Map className="h-4 w-4 mr-1" />
                    Map View
                  </Badge>
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
                <CardContent className="p-0">
                  <ResizablePanelGroup direction="horizontal" className="min-h-[700px]">
                    {/* Table View Panel */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                      <div className="h-full p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Table2 className="h-5 w-5 text-purple-400" />
                          <h3 className="text-lg font-semibold text-purple-300">Table View</h3>
                        </div>
                        <div className="h-[620px] overflow-hidden">
                          <ResultsTable results={submarketData} city={cityName} />
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Map View Panel */}
                    <ResizablePanel defaultSize={60} minSize={40}>
                      <div className="h-full p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Map className="h-5 w-5 text-cyan-400" />
                          <h3 className="text-lg font-semibold text-cyan-300">Map View</h3>
                        </div>
                        <MapView results={submarketData} city={cityName} />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketAnalysis;
