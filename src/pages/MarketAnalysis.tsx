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
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
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

  // Load API keys from localStorage on component mount
  React.useEffect(() => {
    console.log('📋 MarketAnalysis component mounted - initializing...');
    
    const savedProfessionalKey = localStorage.getItem('professional_data_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    console.log('🔑 Loading stored API keys:', {
      professionalKey: savedProfessionalKey ? `${savedProfessionalKey.substring(0, 8)}...` : 'Not found',
      openaiKey: savedOpenaiKey ? `${savedOpenaiKey.substring(0, 8)}...` : 'Not found',
      localStorage_keys: Object.keys(localStorage).filter(key => key.includes('api') || key.includes('key'))
    });
    
    if (savedProfessionalKey || savedOpenaiKey) {
      console.log('✅ API keys found in localStorage, setting state...');
      setApiConfig({
        airdnaApiKey: savedProfessionalKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
      
      toast({
        title: "✅ API Keys Loaded",
        description: `Found stored API keys - ready for market analysis`,
      });
    } else {
      console.log('❌ No API keys found in localStorage');
      toast({
        title: "⚠️ No API Keys Found",
        description: "Please configure your API keys below to run market analysis",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleApiKeysChange = (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => {
    console.log('🔄 API keys changed:', {
      airdna: keys.airdnaApiKey ? 'Updated' : 'Not provided',
      openai: keys.openaiApiKey ? 'Updated' : 'Not provided'
    });
    setApiConfig(keys);
  };

  const handleMarketAnalysis = async () => {
    console.log('🚀 Market analysis started for:', {
      targetCity,
      propertyType,
      bathrooms,
      hasAirdnaKey: !!apiConfig.airdnaApiKey,
      hasOpenaiKey: !!apiConfig.openaiApiKey
    });

    if (!targetCity.trim()) {
      console.log('❌ Analysis failed: No city provided');
      toast({
        title: "City Required",
        description: "Please enter a target city for analysis.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have the required API keys
    if (!apiConfig.airdnaApiKey || !apiConfig.openaiApiKey) {
      console.log('❌ Analysis failed: Missing API keys');
      toast({
        title: "API Keys Required",
        description: "Please configure your AirDNA and OpenAI API keys in the configuration section below.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🚀 Starting market analysis for: ${targetCity} (${propertyType}BR/${bathrooms}BA properties)`);
      console.log('🔑 Using API keys:', {
        airdna: apiConfig.airdnaApiKey ? 'Present' : 'Missing',
        openai: apiConfig.openaiApiKey ? 'Present' : 'Missing'
      });
      
      console.log('📡 Calling fetchMarketData...');
      const marketData = await fetchMarketData(targetCity, apiConfig, propertyType, bathrooms);
      console.log('📊 Market data received:', {
        strDataCount: marketData.strData?.length || 0,
        rentDataCount: marketData.rentData?.length || 0,
        strData: marketData.strData,
        rentData: marketData.rentData
      });
      
      // Combine STR and rent data
      const combinedData: SubmarketData[] = marketData.strData.map(strItem => {
        const rentItem = marketData.rentData.find(r => r.submarket === strItem.submarket);
        const medianRent = rentItem?.rent || 2000; // Default fallback
        const multiple = strItem.revenue / medianRent;
        
        console.log('🔗 Combining data for submarket:', {
          submarket: strItem.submarket,
          strRevenue: strItem.revenue,
          medianRent,
          multiple: multiple.toFixed(2)
        });
        
        return {
          submarket: strItem.submarket,
          strRevenue: strItem.revenue,
          medianRent,
          multiple
        };
      });

      // Sort by revenue potential (highest first)
      combinedData.sort((a, b) => b.multiple - a.multiple);
      console.log('📈 Final sorted data:', combinedData);

      setSubmarketData(combinedData);
      setCityName(targetCity);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${combinedData.length} submarkets in ${targetCity} for ${propertyType}BR/${bathrooms}BA properties`,
      });

      console.log('✅ Analysis completed successfully');

    } catch (error) {
      console.error('💥 Market analysis error:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to complete market analysis. Please check your API keys and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Analysis process finished (loading state cleared)');
    }
  };

  const handleExportData = () => {
    console.log('📤 Export data requested:', {
      dataAvailable: submarketData.length > 0,
      city: cityName,
      propertyType,
      bathrooms
    });

    if (submarketData.length === 0) {
      console.log('❌ Export failed: No data available');
      toast({
        title: "No Data to Export",
        description: "Please run a market analysis first to generate data.",
        variant: "destructive",
      });
      return;
    }

    const filename = `${cityName.toLowerCase().replace(/\s+/g, '-')}-market-analysis-${propertyType}br-${bathrooms}ba`;
    console.log('💾 Exporting to CSV:', filename);
    exportToCSV(submarketData, filename);
    
    toast({
      title: "12-Month Data Exported",
      description: `12 months of market data for ${cityName} has been downloaded as CSV with seasonal variations.`,
    });
    console.log('✅ Export completed successfully');
  };

  const getBathroomOptions = () => {
    const options = propertyType === '1' ? [{ value: '1', label: '1 Bathroom' }] :
                   propertyType === '2' ? [
                     { value: '1', label: '1 Bathroom' },
                     { value: '2', label: '2 Bathrooms' }
                   ] :
                   propertyType === '3' ? [
                     { value: '1', label: '1 Bathroom' },
                     { value: '2', label: '2 Bathrooms' },
                     { value: '3', label: '3 Bathrooms' }
                   ] : [{ value: '1', label: '1 Bathroom' }];
    
    console.log('🚿 Bathroom options updated:', {
      propertyType,
      availableOptions: options
    });
    
    return options;
  };

  // Update bathrooms when property type changes
  React.useEffect(() => {
    console.log('🔄 Property type changed:', propertyType);
    const options = getBathroomOptions();
    if (!options.find(opt => opt.value === bathrooms)) {
      console.log('🔄 Bathroom selection invalid, updating to:', options[0].value);
      setBathrooms(options[0].value);
    }
  }, [propertyType]);

  // Log state changes
  React.useEffect(() => {
    console.log('🏠 Target city changed:', targetCity);
  }, [targetCity]);

  React.useEffect(() => {
    console.log('🛏️ Bathrooms changed:', bathrooms);
  }, [bathrooms]);

  React.useEffect(() => {
    console.log('🔧 API config changed:', {
      hasAirdna: !!apiConfig.airdnaApiKey,
      hasOpenai: !!apiConfig.openaiApiKey
    });
  }, [apiConfig]);

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

              {/* API Configuration and Status - Now moved after results */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ApiKeyInput onApiKeysChange={handleApiKeysChange} />
                <ApiKeyStatus />
              </div>
            </div>
          )}

          {/* Show API Configuration and Status if no results yet */}
          {submarketData.length === 0 && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApiKeyInput onApiKeysChange={handleApiKeysChange} />
              <ApiKeyStatus />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketAnalysis;
