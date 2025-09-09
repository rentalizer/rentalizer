import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Home, 
  BarChart3, 
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { fetchMarketData } from '@/services/marketDataService';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ApiProviderSelector } from '@/components/ApiProviderSelector';
import { useToast } from '@/hooks/use-toast';

export const SimulatedMarketIntelligence: React.FC = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<any[]>([]);
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [apiProvider, setApiProvider] = useState<'airdna' | 'rentcast'>('airdna');
  const [apiKeys, setApiKeys] = useState<{
    airdnaApiKey?: string;
    openaiApiKey?: string;
    rentcastApiKey?: string;
  }>({});
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Load saved API keys and provider preference from localStorage
  useEffect(() => {
    const savedKeys = {
      airdnaApiKey: localStorage.getItem('airdna_api_key') || undefined,
      openaiApiKey: localStorage.getItem('openai_api_key') || undefined,
      rentcastApiKey: localStorage.getItem('rentcast_api_key') || undefined,
    };
    setApiKeys(savedKeys);

    const savedProvider = localStorage.getItem('api_provider') as 'airdna' | 'rentcast';
    if (savedProvider) {
      setApiProvider(savedProvider);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setAnalysisComplete(false);

    try {
      // Save current provider preference
      localStorage.setItem('api_provider', apiProvider);
      
      const response = await fetchMarketData(city, propertyType, bathrooms, apiProvider, apiKeys);
      
      if (response && response.submarkets) {
        setResults(response.submarkets);
        setAnalysisComplete(true);
        toast({
          title: "Analysis Complete",
          description: `Found ${response.submarkets.length} profitable submarkets in ${city}`,
        });
      } else {
        setError('Unable to fetch market data. Please check your API keys or try again later.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze market data. Please check your inputs and API keys.');
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Market Intelligence Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Analyze short-term rental markets using real API data from AirDNA and RentCast
        </p>
      </div>

      {/* Analysis Form */}
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            Market Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Configuration Section */}
          {showApiKeyInput && (
            <div className="mb-6">
              <ApiKeyInput onApiKeysChange={setApiKeys} />
            </div>
          )}

          {/* API Provider Selection */}
          <ApiProviderSelector
            selectedProvider={apiProvider}
            onProviderChange={setApiProvider}
            apiKeys={apiKeys}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="city" className="text-sm font-semibold text-muted-foreground">
                Target City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="mt-2 h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="property-type" className="text-sm font-semibold text-muted-foreground">
                Bedrooms
              </Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4 Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bathrooms" className="text-sm font-semibold text-muted-foreground">
                Bathrooms
              </Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="3">3 Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {showApiKeyInput ? 'Hide' : 'Show'} API Configuration
            </Button>

            <Button
              onClick={handleAnalyze}
              disabled={!city.trim() || isLoading || (!apiKeys.airdnaApiKey && !apiKeys.rentcastApiKey)}
              size="lg"
              className="h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Analyzing Market Data...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-3 h-6 w-6" />
                  Analyze Market
                </>
              )}
            </Button>
          </div>

          {!apiKeys.airdnaApiKey && !apiKeys.rentcastApiKey && (
            <div className="text-center">
              <p className="text-sm text-amber-600 mb-2">
                Add at least one API key to enable market analysis
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="shadow-lg border-0 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {analysisComplete && results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Market Analysis Results
            </h3>
            <p className="text-muted-foreground">
              {propertyType}BR/{bathrooms}BA properties in {city}
            </p>
            <Badge variant="outline" className="mt-2">
              {results.length} submarkets analyzed
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold">{result.submarket}</h3>
                    </div>
                    <Badge 
                      variant={result.multiple >= 2.0 ? "default" : result.multiple >= 1.5 ? "secondary" : "outline"}
                      className="text-sm font-semibold px-3 py-1"
                    >
                      {result.multiple.toFixed(2)}x Multiple
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Annual STR Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${result.strRevenue?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${result.medianRent?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profitability Score</span>
                      <span className="font-semibold">{Math.round(result.multiple * 50)}/100</span>
                    </div>
                    <Progress 
                      value={Math.min(result.multiple * 50, 100)} 
                      className="h-3"
                    />
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {result.multiple >= 2.0 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : result.multiple >= 1.5 ? (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {result.multiple >= 2.0 
                            ? 'Excellent Investment' 
                            : result.multiple >= 1.5 
                            ? 'Good Potential' 
                            : 'Low Profitability'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};