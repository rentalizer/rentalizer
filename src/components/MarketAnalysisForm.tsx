
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Home, MapPin } from 'lucide-react';

interface MarketAnalysisFormProps {
  onAnalyze: (city: string, propertyType: string, bathrooms: string, neighborhood?: string) => void;
  isLoading: boolean;
}

export const MarketAnalysisForm: React.FC<MarketAnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [propertyType, setPropertyType] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onAnalyze(city.trim(), propertyType, bathrooms, neighborhood.trim() || undefined);
    }
  };

  return (
    <Card className="bg-gray-900/95 border-gray-700 shadow-2xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="h-6 w-6 text-cyan-400" />
          Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white font-medium">
                <MapPin className="h-4 w-4 inline mr-1" />
                City *
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., San Diego, Austin, Miami"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-white font-medium">
                <Home className="h-4 w-4 inline mr-1" />
                Neighborhood (Optional)
              </Label>
              <Input
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g., North Park, East Village, etc."
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-white font-medium">Bedrooms</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-white font-medium">Bathrooms</Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="3">3 Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !city.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Market
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
