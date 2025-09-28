
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Plus, X } from 'lucide-react';
import { CalculatorData } from '@/pages/Community';
import { parseNumericInput, formatInputValue } from '@/utils/inputHelpers';

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
    const value = parseNumericInput(newCompValue);
    if (value > 0) {
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
    <Card className="shadow-lg border-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-xl font-semibold">
          <MapPin className="h-6 w-6 text-blue-400" />
          Property & Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Details */}
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">Property Address</Label>
            <Input
              type="text"
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="123 Main St, City, State"
              className="bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-blue-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300 text-sm font-medium mb-2 block">Bedrooms</Label>
              <Input
                type="text"
                value={formatInputValue(data.bedrooms)}
                onChange={(e) => updateData({ bedrooms: parseNumericInput(e.target.value) })}
                placeholder="3"
                className="bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-blue-400/50"
              />
            </div>

            <div>
              <Label className="text-gray-300 text-sm font-medium mb-2 block">Bathrooms</Label>
              <Input
                type="text"
                value={formatInputValue(data.bathrooms)}
                onChange={(e) => updateData({ bathrooms: parseNumericInput(e.target.value) })}
                placeholder="2"
                className="bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-blue-400/50"
              />
            </div>
          </div>
        </div>

        {/* Comparable Properties */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
          <Label className="text-gray-300 text-sm font-medium mb-3 block">Add Comparable Properties</Label>
          
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={newCompValue}
                onChange={(e) => setNewCompValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="4500"
                className="pl-9 bg-gray-800/60 border-gray-600/50 text-white h-11 text-base"
              />
            </div>
            <Button
              onClick={addCompValue}
              className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Display Added Values */}
          {compValues.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs">Properties Added ({compValues.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {compValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/40 rounded px-3 py-2">
                    <span className="text-gray-200 text-sm font-medium">
                      ${value.toLocaleString()}/month
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

        {/* Revenue Result */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-500/30">
          <div className="text-center">
            <Label className="text-blue-300 text-sm font-medium block mb-2">Expected Monthly Revenue</Label>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-400" />
              <span className="text-3xl font-bold text-blue-400">
                {Math.round(data.averageComparable).toLocaleString()}
              </span>
            </div>
            {compValues.length > 0 && (
              <p className="text-xs text-blue-300/70 mt-2">
                Average of {compValues.length} comparable {compValues.length === 1 ? 'property' : 'properties'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
