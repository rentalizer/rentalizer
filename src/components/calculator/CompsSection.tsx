
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, X } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

interface ComparableProperty {
  id: string;
  type: string;
  value: number;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  data,
  updateData
}) => {
  const [comparableProperties, setComparableProperties] = useState<ComparableProperty[]>([]);
  const [newComparable, setNewComparable] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const propertyTypes = [
    { value: 'similar', label: 'Similar Property' },
    { value: 'recent', label: 'Recent Sale' },
    { value: 'rental', label: 'Rental Comp' },
    { value: 'market', label: 'Market Value' }
  ];

  const addComparable = () => {
    if (newComparable && !isNaN(Number(newComparable)) && selectedType) {
      const value = Math.round(Number(newComparable));
      const newProperty: ComparableProperty = {
        id: Date.now().toString(),
        type: selectedType,
        value: value
      };
      
      const updatedProperties = [...comparableProperties, newProperty];
      setComparableProperties(updatedProperties);
      
      // Calculate average and update data
      const average = Math.round(updatedProperties.reduce((sum, prop) => sum + prop.value, 0) / updatedProperties.length);
      updateData({ averageComparable: average });
      
      // Clear inputs
      setNewComparable('');
      setSelectedType('');
    }
  };

  const removeComparable = (id: string) => {
    const updatedProperties = comparableProperties.filter(prop => prop.id !== id);
    setComparableProperties(updatedProperties);
    
    // Recalculate average
    if (updatedProperties.length > 0) {
      const average = Math.round(updatedProperties.reduce((sum, prop) => sum + prop.value, 0) / updatedProperties.length);
      updateData({ averageComparable: average });
    } else {
      updateData({ averageComparable: 0 });
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = propertyTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
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
          <Label className="text-gray-200 text-center block text-sm">Property Values</Label>
          
          {/* Add new comparable section */}
          <div className="space-y-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                    className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
                disabled={!selectedType || !newComparable}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400 h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* List of added comparables */}
          {comparableProperties.map((property) => (
            <div key={property.id} className="flex items-center justify-between bg-gray-800/30 rounded p-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-200 text-sm font-medium">{property.value.toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-400 ml-6">{getTypeLabel(property.type)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeComparable(property.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
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
        </div>
      </CardContent>
    </Card>
  );
};
