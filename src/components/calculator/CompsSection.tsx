import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, DollarSign, Map } from 'lucide-react';
import { fetchMarketData } from '@/services/marketDataService';
import { useToast } from '@/hooks/use-toast';
import { CalculatorData } from '@/pages/Calculator';
import { MapViewComps } from './MapViewComps';
import { Badge } from '@/components/ui/badge';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [comps, setComps] = useState<Array<{ name: string; price: number }>>([]);
  const [showMap, setShowMap] = useState(false);
  const [dataQuality, setDataQuality] = useState<'basic' | 'enhanced'>('basic');

  // Check for premium API keys on component mount
  React.useEffect(() => {
    const airdnaKey = localStorage.getItem('professional_data_key') || localStorage.getItem('airdna_api_key');
    const openaiKey = localStorage.getItem('openai_api_key');
    
    if (airdnaKey || openaiKey) {
      setDataQuality('enhanced');
      console.log('✅ Premium API keys detected for comparables');
    }
  }, []);

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
    console.log('🔍 Fetching premium comparables for:', data.address);
    
    try {
      // Use enhanced market data service with subscription benefits
      const apiKeys = {
        airdnaApiKey: localStorage.getItem('professional_data_key') || localStorage.getItem('airdna_api_key') || undefined,
        openaiApiKey: localStorage.getItem('openai_api_key') || undefined
      };
      
      console.log('🔑 Using API configuration for comparables:', {
        hasAirdna: !!apiKeys.airdnaApiKey,
        hasOpenai: !!apiKeys.openaiApiKey,
        quality: dataQuality
      });
      
      const marketData = await fetchMarketData(data.address, apiKeys, '2', '1');
      
      // Use premium STR data for enhanced comparables
      const comparableProperties = marketData.strData
        .slice(0, 6) // More comparables with subscription
        .map((item, index) => ({
          name: item.submarket || `Premium Comp Property #${index + 1}`,
          price: item.revenue
        }));
      
      setComps(comparableProperties);
      
      // Calculate enhanced average
      const average = comparableProperties.length > 0 
        ? Math.round(comparableProperties.reduce((sum, comp) => sum + comp.price, 0) / comparableProperties.length)
        : 0;
      
      updateData({ averageComparable: average });
      
      const qualityBadge = dataQuality === 'enhanced' ? '⭐ Enhanced' : '📊 Basic';
      
      toast({
        title: `${qualityBadge} Comparables Found`,
        description: `Found ${comparableProperties.length} premium comparable properties with average revenue of $${average.toLocaleString()}`,
      });
      
    } catch (error) {
      console.error('Error fetching premium comparables:', error);
      toast({
        title: "❌ Search Failed",
        description: "Unable to fetch comparable properties. Please try again or check your subscription status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow-lg border-0 ${dataQuality === 'enhanced' ? 'bg-gradient-to-br from-white/10 to-purple-500/5' : 'bg-white/10'} backdrop-blur-md`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Comparable Properties
          {dataQuality === 'enhanced' && (
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs ml-2">
              Enhanced
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-gray-300">
          Find 2BR/2BA apartments in your immediate target neighborhood (6 people capacity)
          {dataQuality === 'enhanced' && (
            <span className="block text-purple-300 mt-1">• Premium data quality with subscription benefits</span>
          )}
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
              className={`${dataQuality === 'enhanced' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}
            >
              {isLoading ? (
                dataQuality === 'enhanced' ? 'Premium Search...' : 'Searching...'
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {dataQuality === 'enhanced' ? '⭐ Premium Search' : 'Search'}
                </>
              )}
            </Button>
          </div>
        </div>

        {comps.length > 0 && (
          <>
            <div className="flex justify-between items-center mt-6">
              <Label className="text-gray-200">
                Comparable Properties
                {dataQuality === 'enhanced' && (
                  <span className="text-purple-300 text-xs ml-2">(Enhanced Quality)</span>
                )}
              </Label>
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
                  <div key={index} className={`flex justify-between items-center p-3 ${dataQuality === 'enhanced' ? 'bg-purple-800/20' : 'bg-gray-800/30'} rounded-md`}>
                    <span className="text-cyan-300 text-sm">{comp.name}</span>
                    <span className="text-white font-medium">${comp.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className={`mt-6 p-4 ${dataQuality === 'enhanced' ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30' : 'bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30'} rounded-lg`}>
          <div className="flex items-center justify-between">
            <Label className={`${dataQuality === 'enhanced' ? 'text-purple-300' : 'text-cyan-300'} font-medium`}>
              Average Comparable Revenue
              {dataQuality === 'enhanced' && (
                <span className="block text-xs text-purple-400 mt-1">Premium Analysis</span>
              )}
            </Label>
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${dataQuality === 'enhanced' ? 'text-purple-400' : 'text-cyan-400'}`} />
              <span className={`text-2xl font-bold ${dataQuality === 'enhanced' ? 'text-purple-400' : 'text-cyan-400'}`}>
                ${data.averageComparable.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
