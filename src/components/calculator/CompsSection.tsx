
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, DollarSign, Plus, X } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
  const [propertyValues, setPropertyValues] = useState<number[]>([]);
  const [newPropertyValue, setNewPropertyValue] = useState<string>('');

  const addPropertyValue = () => {
    const value = parseFloat(newPropertyValue);
    if (value && value > 0) {
      const updatedValues = [...propertyValues, value];
      setPropertyValues(updatedValues);
      
      // Calculate and update average
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
      
      setNewPropertyValue('');
    }
  };

  const removePropertyValue = (index: number) => {
    const updatedValues = propertyValues.filter((_, i) => i !== index);
    setPropertyValues(updatedValues);
    
    if (updatedValues.length > 0) {
      const average = Math.round(updatedValues.reduce((sum, val) => sum + val, 0) / updatedValues.length);
      updateData({ averageComparable: average });
    } else {
      updateData({ averageComparable: 0 });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Building2 className="h-5 w-5 text-cyan-400" />
          Property Comps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Bedrooms</Label>
            <Select 
              value={data.bedrooms?.toString() || "2"} 
              onValueChange={(value) => updateData({ bedrooms: parseInt(value) })}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-100">
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
              value={data.bathrooms?.toString() || "2"} 
              onValueChange={(value) => updateData({ bathrooms: parseFloat(value) })}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-100">
                <SelectValue placeholder="Select bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-gray-200">Add Property Values</Label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={newPropertyValue}
                onChange={(e) => setNewPropertyValue(e.target.value)}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && addPropertyValue()}
              />
            </div>
            <Button
              onClick={addPropertyValue}
              disabled={!newPropertyValue || parseFloat(newPropertyValue) <= 0}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {propertyValues.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-200 text-sm">Property Values ({propertyValues.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {propertyValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded p-2">
                    <span className="text-gray-200">${value.toLocaleString()}</span>
                    <Button
                      onClick={() => removePropertyValue(index)}
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

        <div className="space-y-2">
          <Label className="text-gray-200">Average Comparable Revenue</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.averageComparable || ''}
              onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
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
                  {Math.round(data.averageComparable).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
