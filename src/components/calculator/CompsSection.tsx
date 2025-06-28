
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Plus, X } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  data,
  updateData
}) => {
  const [comparableValues, setComparableValues] = useState<number[]>([]);
  const [newComparable, setNewComparable] = useState<string>('');

  const addComparable = () => {
    if (newComparable && !isNaN(Number(newComparable))) {
      const value = Math.round(Number(newComparable));
      const updatedValues = [...comparableValues, value];
      setComparableValues(updatedValues);
      
      // Calculate average and update data
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
      
      // Clear input
      setNewComparable('');
    }
  };

  const removeComparable = (index: number) => {
    const updatedValues = comparableValues.filter((_, i) => i !== index);
    setComparableValues(updatedValues);
    
    // Recalculate average
    if (updatedValues.length > 0) {
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
    } else {
      updateData({ averageComparable: 0 });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Property Comps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Property Address</Label>
          <Input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Enter property address"
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bedrooms</Label>
            <Input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => updateData({ bedrooms: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bathrooms</Label>
            <Input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => updateData({ bathrooms: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Comparable Properties</Label>
          
          {/* Input for new comparable */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={newComparable}
                onChange={(e) => setNewComparable(e.target.value)}
                placeholder="Enter value"
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={addComparable}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400 h-9 px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* List of added comparables */}
          {comparableValues.map((value, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded p-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-200 text-sm">{value.toLocaleString()}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeComparable(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Average Comparable Property</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(data.averageComparable).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
