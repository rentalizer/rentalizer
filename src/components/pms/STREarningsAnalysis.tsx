
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, DollarSign, TrendingUp, Star, MapPin, Zap, Database, Activity } from 'lucide-react';
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
      console.log(`🔍 Using BOTH Airbnb Listings + Income Prediction APIs for ${city}`);
      
      const apiData = await fetchAirbnbEarningsData(city);
      const processedData = processAirbnbEarningsData(apiData);
      setEarningsData(processedData);
      
      const realPredictions = apiData?.data?.data_sources?.real_predictions || 0;
      const totalProperties = processedData.totalProperties;
      
      toast({
        title: "Enhanced Analysis Complete",
        description: `Found ${totalProperties} properties with ${realPredictions} real income predictions using dual API approach`,
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
        <p className="text-gray-600">Enhanced with Airbnb Listings + Income Prediction APIs</p>
      </div>

      {/* Updated Enhanced API Info Banner */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700">Dual API Integration - Maximum Accuracy</h3>
              <p className="text-sm text-gray-600">
                Step 1: Airbnb Listings Data API → Get real property IDs and basic data<br/>
                Step 2: Income Prediction API → Get precise revenue forecasts for each property
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
              {isLoading ? 'Analyzing...' : 'Enhanced STR Analysis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {earningsData && (
        <>
          {/* Enhanced Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
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
                    <p className="text-sm font-medium text-gray-600">Real Predictions</p>
                    <p className="text-2xl font-bold text-gray-900">{earningsData.realPredictions || 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
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
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties List */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced STR Properties (Dual API Data)</CardTitle>
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
                          Property ID: {property.id}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {property.neighborhood}
                        </Badge>
                        {property.api_source === 'income_prediction_api' && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Activity className="h-3 w-3 mr-1" />
                            Real Prediction
                          </Badge>
                        )}
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
