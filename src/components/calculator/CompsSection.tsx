
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, DollarSign, Map } from 'lucide-react';
import { fetchAirDNAListingsData } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';
import { CalculatorData } from '@/pages/Calculator';
import { MapViewComps } from './MapViewComps';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [comps, setComps] = useState<Array<{ name: string; price: number }>>([]);
  const [showMap, setShowMap] = useState(false);

  const fetchComparables = async () => {
    if (!data.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to search for comparable properties.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('🔍 Fetching comparables for:', data.address);
    
    try {
      const strData = await fetchAirDNAListingsData(data.address);
      
      // Filter for 2BR properties and take top 4
      const comparableProperties = strData
        .slice(0, 4)
        .map((item, index) => ({
          name: item.submarket || `Comp Property #${index + 1}`,
          price: item.revenue
        }));
      
      setComps(comparableProperties);
      
      // Calculate average
      const average = comparableProperties.length > 0 
        ? Math.round(comparableProperties.reduce((sum, comp) => sum + comp.price, 0) / comparableProperties.length)
        : 0;
      
      updateData({ averageComparable: average });
      
      toast({
        title: "✅ Comparables Found",
        description: `Found ${comparableProperties.length} comparable properties with average revenue of $${average.toLocaleString()}`,
      });
      
    } catch (error) {
      console.error('Error fetching comparables:', error);
      toast({
        title: "❌ Search Failed",
        description: "Unable to fetch comparable properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-cyan-400" />
          1. Comparable Properties
        </CardTitle>
        <p className="text-sm text-gray-300">
          Find 2BR/2BA apartments in your immediate target neighborhood (6 people capacity)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200">Property Address</Label>
          <div className="flex gap-2">
            <Input
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="Enter address or city"
              className="flex-1 bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400"
            />
            <Button 
              onClick={fetchComparables}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {comps.length > 0 && (
          <>
            <div className="flex justify-between items-center mt-6">
              <Label className="text-gray-200">Comparable Properties</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!showMap ? "default" : "outline"}
                  onClick={() => setShowMap(false)}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  List View
                </Button>
                <Button
                  size="sm"
                  variant={showMap ? "default" : "outline"}
                  onClick={() => setShowMap(true)}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Map className="h-4 w-4 mr-1" />
                  Map View
                </Button>
              </div>
            </div>

            {showMap ? (
              <MapViewComps comps={comps} address={data.address} />
            ) : (
              <div className="space-y-2">
                {comps.map((comp, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-md">
                    <span className="text-cyan-300 text-sm">{comp.name}</span>
                    <span className="text-white font-medium">${comp.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-cyan-300 font-medium">Average Comparable Revenue</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">
                ${data.averageComparable.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
