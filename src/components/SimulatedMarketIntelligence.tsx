
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { BarChart3, MapPin, Search, Loader2, Map, Table2, Download, Satellite, Eye } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { ApiKeyInput } from '@/components/ApiKeyInput';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const SimulatedMarketIntelligence = () => {
  const { toast } = useToast();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [selectedSubmarkets, setSelectedSubmarkets] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [targetCity, setTargetCity] = useState<string>('san diego');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ airdnaApiKey?: string; rentcastApiKey?: string; openaiApiKey?: string }>({});

  // No longer using simulated data - removed mock data object

  const fetchRealMarketData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const authHeader = user ? `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` : undefined;

      const response = await supabase.functions.invoke('fetch-market-data', {
        body: {
          city: targetCity,
          propertyType,
          bathrooms
        },
        headers: authHeader ? { Authorization: authHeader } : {}
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data?.submarkets || [];
    } catch (error) {
      console.error('Real API fetch failed:', error);
      throw error;
    }
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
      let processedData: SubmarketData[];

      // Always try to fetch real data first
      toast({
        title: "Fetching Market Data",
        description: apiKeys.airdnaApiKey && apiKeys.openaiApiKey 
          ? "Using your API keys to get real market data..." 
          : "Generating realistic market data with AI...",
      });
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 2500));
      processedData = await fetchRealMarketData();

      setSubmarketData(processedData);
      setCityName(targetCity);
      
      toast({
        title: "Market Analysis Complete",
        description: `Found ${processedData.length} submarkets with revenue data for ${targetCity}`,
      });

    } catch (error) {
      console.error('Market analysis failed:', error);
      
      // Clear any existing data and show no data available message
      setSubmarketData([]);
      setCityName(targetCity);
      
      toast({
        title: "No Available Data",
        description: "Unable to fetch market data for this city. Please try another city or check your API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const dataToExport = selectedSubmarkets.length > 0 ? selectedSubmarkets : submarketData;
    
    if (dataToExport.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please run a market analysis first.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ['Submarket', 'STR Revenue', 'Median Rent', 'Revenue Multiple'];
    const csvRows = dataToExport.map(row => [
      `"${row.submarket}"`,
      row.strRevenue || 'NA',
      row.medianRent || 'NA',
      row.multiple > 0 ? row.multiple.toFixed(2) : 'NA'
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${cityName.toLowerCase().replace(/\s+/g, '-')}-market-analysis.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: `Market data for ${cityName} downloaded.`,
    });
  };

  const handleSelectionChange = (selected: SubmarketData[]) => {
    setSelectedSubmarkets(selected);
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
    
    return options;
  };

  useEffect(() => {
    const options = getBathroomOptions();
    if (!options.find(opt => opt.value === bathrooms)) {
      if (propertyType === '2') {
        setBathrooms('2');
      } else {
        setBathrooms(options[0].value);
      }
    }
  }, [propertyType]);

  return (
    <div className="space-y-8">

      {/* Market Analysis Input */}
      <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg w-full mx-auto">
        <CardHeader className="pb-4 border-b border-gray-700/50">
          <CardTitle className="flex items-center justify-center gap-2 text-cyan-300 text-xl">
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
                  placeholder="Try: San Diego, Denver, Austin"
                  className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleMarketAnalysis()}
                />
              </div>

              <div className="w-full max-w-md grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property-type" className="text-sm font-medium text-gray-300">
                    Bedrooms
                  </Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 z-50">
                      <SelectItem value="1" className="text-gray-100 focus:bg-gray-700">1 Bedroom</SelectItem>
                      <SelectItem value="2" className="text-gray-100 focus:bg-gray-700">2 Bedrooms</SelectItem>
                      <SelectItem value="3" className="text-gray-100 focus:bg-gray-700">3 Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-300">
                    Bathrooms
                  </Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 z-50">
                      {getBathroomOptions().map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value} 
                          className="text-gray-100 focus:bg-gray-700"
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Market
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Configuration */}
      <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg w-full mx-auto">
        <CardContent className="pt-6">
          <ApiKeyInput onApiKeysChange={(keys) => {
            setApiKeys(keys);
            console.log('API Keys updated:', keys);
          }} />
        </CardContent>
      </Card>

      {/* No Data Available State */}
      {submarketData.length === 0 && cityName && (
        <Card className="shadow-2xl border border-red-500/20 bg-gray-900/80 backdrop-blur-lg w-full mx-auto">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Eye className="h-12 w-12 text-red-400" />
              <h3 className="text-xl font-semibold text-red-300">No Available Data</h3>
              <p className="text-gray-400 max-w-md">
                Unable to fetch market data for <span className="text-red-300 font-medium">{cityName}</span>. 
                Please try another city or check your API configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Available State */}
      {submarketData.length === 0 && cityName && (
        <Card className="shadow-2xl border border-red-500/20 bg-gray-900/80 backdrop-blur-lg w-full mx-auto">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Eye className="h-12 w-12 text-red-400" />
              <h3 className="text-xl font-semibold text-red-300">No Available Data</h3>
              <p className="text-gray-400 max-w-md">
                Unable to fetch market data for <span className="text-red-300 font-medium">{cityName}</span>. 
                Please try another city or check your API configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {submarketData.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300">
                Market Analysis Results
              </h2>
              <p className="text-gray-400 mt-1">
                {propertyType}BR/{bathrooms}BA apartments in {cityName}
              </p>
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
                Export {selectedSubmarkets.length > 0 ? `Selected (${selectedSubmarkets.length})` : 'All'} CSV
              </Button>
            </div>
          </div>

          <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardContent className="p-0">
              <ResizablePanelGroup direction="horizontal" className="min-h-[700px]">
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="h-full p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Table2 className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-purple-300">Table View</h3>
                    </div>
                    <div className="h-[620px] overflow-hidden">
                      <ResultsTable 
                        results={submarketData} 
                        city={cityName} 
                        onSelectionChange={handleSelectionChange}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={60} minSize={40}>
                  <div className="h-full p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Satellite className="h-5 w-5 text-cyan-400" />
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
  );
};
