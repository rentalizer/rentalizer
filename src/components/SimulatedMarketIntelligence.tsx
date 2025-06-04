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

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

// Real Mashvisor API service function
const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real Mashvisor API for ${city}`);
    
    const response = await fetch('/functions/v1/mashvisor-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city,
        propertyType,
        bathrooms
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Real Mashvisor API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Mashvisor API error:', error);
    throw error;
  }
};

export const SimulatedMarketIntelligence = () => {
  const { toast } = useToast();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [selectedSubmarkets, setSelectedSubmarkets] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [targetCity, setTargetCity] = useState<string>('san diego');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [isLoading, setIsLoading] = useState(false);

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
      console.log(`🚀 Starting real market analysis for ${targetCity}`);
      
      // Call the real Mashvisor API
      const marketData = await fetchRealMarketData(targetCity, propertyType, bathrooms);

      // Process the real data from Mashvisor
      const processedData: SubmarketData[] = [];
      
      // Handle the response data structure
      if (marketData && marketData.content && Array.isArray(marketData.content)) {
        marketData.content.forEach((item: any) => {
          const multiple = item.rental_income > 0 && item.airbnb_revenue > 0 
            ? item.airbnb_revenue / item.rental_income 
            : 0;
          
          processedData.push({
            submarket: item.neighborhood || item.area || 'Unknown Area',
            strRevenue: item.airbnb_revenue || 0,
            medianRent: item.rental_income || 0,
            multiple: multiple
          });
        });
      }

      // Sort by multiple (highest first), with failed data at the end
      processedData.sort((a, b) => {
        if (a.multiple === 0 && b.multiple === 0) return 0;
        if (a.multiple === 0) return 1;
        if (b.multiple === 0) return -1;
        return b.multiple - a.multiple;
      });

      setSubmarketData(processedData);
      setCityName(targetCity);
      
      const successCount = processedData.filter(d => d.strRevenue > 0).length;
      const failedCount = processedData.length - successCount;
      
      if (successCount > 0) {
        toast({
          title: "Real Market Analysis Complete",
          description: `${successCount} submarkets analyzed with real Mashvisor data${failedCount > 0 ? `, ${failedCount} with limited data` : ''}`,
        });
      } else {
        toast({
          title: "Analysis Complete - Limited Data",
          description: "Market analysis completed but Mashvisor API returned limited data for this market.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete market analysis. Please check the console for details.",
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
    link.setAttribute('download', `${cityName.toLowerCase().replace(/\s+/g, '-')}-market-analysis-mashvisor.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: `Real market data for ${cityName} downloaded.`,
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
      {/* Real Data Notice */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">Real Mashvisor Market Intelligence</h3>
              <p className="text-sm text-gray-300">
                This tool uses real Mashvisor API data to analyze rental arbitrage opportunities in your target market.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis Input */}
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
