
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
  const [newCompValue, setNewCompValue] = useState<string>('');
  const [compValues, setCompValues] = useState<number[]>([]);

  const addCompValue = () => {
    const value = Math.round(parseFloat(newCompValue));
    if (value && value > 0) {
      const updatedValues = [...compValues, value];
      setCompValues(updatedValues);
      
      // Calculate average and update data
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
      
      setNewCompValue('');
    }
  };

  const removeCompValue = (index: number) => {
    const updatedValues = compValues.filter((_, i) => i !== index);
    setCompValues(updatedValues);
    
    if (updatedValues.length > 0) {
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
    } else {
      updateData({ averageComparable: 0 });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCompValue();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Property
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Property Address</Label>
          <Input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder=""
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

        {/* Comparable Values Section */}
        <div className="space-y-3">
          <Label className="text-gray-200 text-center block text-sm">Comparable Property Values</Label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={newCompValue}
                onChange={(e) => setNewCompValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
            <Button
              onClick={addCompValue}
              size="sm"
              className="h-9 px-3 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display Added Values */}
          {compValues.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Added Properties ({compValues.length})</Label>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {compValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded px-3 py-2">
                    <span className="text-gray-200 text-sm">
                      ${value.toLocaleString()}
                    </span>
                    <Button
                      onClick={() => removeCompValue(index)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Avg Monthly Revenue</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(data.averageComparable).toLocaleString()}
              </span>
            </div>
          </div>
          {compValues.length > 0 && (
            <div className="text-xs text-blue-300/70 mt-1">
              Based on {compValues.length} comparable {compValues.length === 1 ? 'property' : 'properties'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
