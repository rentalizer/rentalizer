
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface MarketAnalysisFormProps {
  onAnalyze: (city: string, propertyType: string, bathrooms: string) => void;
  isLoading: boolean;
}

export const MarketAnalysisForm: React.FC<MarketAnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [targetCity, setTargetCity] = useState<string>('san diego');
  const [propertyType, setPropertyType] = useState<string>('2');
  const [bathrooms, setBathrooms] = useState<string>('2');

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

  const handleAnalyze = () => {
    if (targetCity.trim()) {
      onAnalyze(targetCity, propertyType, bathrooms);
    }
  };

  return (
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
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
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
              onClick={handleAnalyze}
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
  );
};
