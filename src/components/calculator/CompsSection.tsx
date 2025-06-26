
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, DollarSign, Search, Loader2 } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const searchComps = async () => {
    if (!data.address.trim()) {
      return;
    }

    setIsLoading(true);
    console.log('🔍 Searching comps for:', data.address);
    
    // Simulate API call
    setTimeout(() => {
      const mockRevenue = Math.floor(Math.random() * 2000) + 3000;
      updateData({ averageComparable: mockRevenue });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Building2 className="h-5 w-5 text-cyan-400" />
          Property Comps
        </CardTitle>
        <p className="text-sm text-gray-300">
          Enter property details and search for comparable STR revenue
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200">Property Address</Label>
          <Input
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="123 Main St, City, State"
            className="bg-gray-800/50 border-gray-600 text-gray-100 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Bedrooms</Label>
            <Select 
              value={data.bedrooms?.toString() || "2"} 
              onValueChange={(value) => updateData({ bedrooms: parseInt(value) })}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-100 text-sm">
                <SelectValue placeholder="Select bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Bathrooms</Label>
            <Select 
              value={Math.floor(data.bathrooms)?.toString() || "1"} 
              onValueChange={(value) => updateData({ bathrooms: parseInt(value) })}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-100 text-sm">
                <SelectValue placeholder="Select bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={searchComps}
          disabled={isLoading || !data.address.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching Comps...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search Comparable Properties
            </>
          )}
        </Button>

        <div className="space-y-2">
          <Label className="text-gray-200">Average Comparable Revenue</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={Math.floor(data.averageComparable) || ''}
              onChange={(e) => updateData({ averageComparable: parseInt(e.target.value) || 0 })}
              placeholder="4250"
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100 text-sm"
            />
          </div>
        </div>

        {data.averageComparable > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <Label className="text-cyan-300 font-medium">Monthly Revenue Estimate</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-cyan-400" />
                <span className="text-2xl font-bold text-cyan-400">
                  {Math.floor(data.averageComparable).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
