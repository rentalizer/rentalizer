
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, DollarSign, TrendingUp, Star, MapPin, Zap, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchAirbnbEarningsData, processAirbnbEarningsData } from '@/services/rapidApiAirbnbService';

export const STREarningsAnalysis = () => {
  const { toast } = useToast();
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [earningsData, setEarningsData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter a city name to analyze STR earnings.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`🔍 Using Airbnb Listings + Income Prediction APIs for ${city}`);
      
      const apiData = await fetchAirbnbEarningsData(city);
      const processedData = processAirbnbEarningsData(apiData);
      setEarningsData(processedData);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${processedData.totalProperties} real STR properties in ${city} using live Airbnb data`,
      });
      
    } catch (error) {
      console.error('STR earnings analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch real STR earnings data. Please try a different city.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">STR Earnings Analysis</h2>
        <p className="text-gray-600">Using real Airbnb property data + Income Prediction API</p>
      </div>

      {/* Updated API Info Banner */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700">Real Airbnb Data + Income Predictions</h3>
              <p className="text-sm text-gray-600">
                Now fetching real Airbnb property listings, then getting income predictions for actual properties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter city name (San Diego, Miami, Austin, etc.)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Analyzing...' : 'Analyze STR Market'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {earningsData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${earningsData.averageRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Real Properties Found</p>
                    <p className="text-2xl font-bold text-gray-900">{earningsData.totalProperties}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">City</p>
                    <p className="text-2xl font-bold text-gray-900">{earningsData.city}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties List */}
          <Card>
            <CardHeader>
              <CardTitle>Real STR Properties (Live Airbnb Data)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.properties.map((property: any) => (
                  <div 
                    key={property.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Real Property ID: {property.id}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {property.neighborhood}
                        </Badge>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {property.rating} ({property.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${property.monthlyRevenue}/mo</p>
                      <p className="text-sm text-gray-600">${property.price}/night</p>
                      <p className="text-sm text-gray-600">{property.occupancyRate}% occupancy</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
