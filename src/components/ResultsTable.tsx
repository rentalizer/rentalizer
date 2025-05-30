
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

interface ResultsTableProps {
  results: SubmarketData[];
  city: string;
  onSelectionChange?: (selectedSubmarkets: SubmarketData[]) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, city, onSelectionChange }) => {
  const [selectedSubmarkets, setSelectedSubmarkets] = useState<string[]>([]);

  if (!results || results.length === 0) {
    return (
      <Card className="w-full bg-gray-900/95 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-white">No results to display</p>
        </CardContent>
      </Card>
    );
  }

  const avgMultiple = results.reduce((sum, r) => sum + r.multiple, 0) / results.length;

  const handleSubmarketSelection = (submarket: string, checked: boolean) => {
    const updatedSelection = checked 
      ? [...selectedSubmarkets, submarket]
      : selectedSubmarkets.filter(s => s !== submarket);
    
    setSelectedSubmarkets(updatedSelection);
    
    // Notify parent component of selected submarkets
    if (onSelectionChange) {
      const selectedData = results.filter(r => updatedSelection.includes(r.submarket));
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? results.map(r => r.submarket) : [];
    setSelectedSubmarkets(newSelection);
    
    if (onSelectionChange) {
      const selectedData = checked ? results : [];
      onSelectionChange(selectedData);
    }
  };

  const isAllSelected = selectedSubmarkets.length === results.length;
  const isPartiallySelected = selectedSubmarkets.length > 0 && selectedSubmarkets.length < results.length;

  return (
    <Card className="w-full bg-gray-900/95 border-gray-700 shadow-2xl">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-cyan-400" />
            {city} Market Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Analysis Complete</span>
          </div>
        </div>
        <p className="text-white">Revenue potential by submarket</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-white font-semibold w-12">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onCheckedChange={handleSelectAll}
                    className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                  />
                </TableHead>
                <TableHead className="text-white font-semibold">Submarket</TableHead>
                <TableHead className="text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    STR Revenue
                  </div>
                </TableHead>
                <TableHead className="text-white font-semibold">Median Rent</TableHead>
                <TableHead className="text-white font-semibold">Revenue Multiple</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow 
                  key={index} 
                  className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedSubmarkets.includes(result.submarket)}
                      onCheckedChange={(checked) => handleSubmarketSelection(result.submarket, checked as boolean)}
                      className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {result.submarket}
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    ${result.strRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    ${result.medianRent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    {result.multiple.toFixed(2)}x
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 bg-gray-800/20 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-cyan-300">
              <span>Market Analysis Results</span>
              {selectedSubmarkets.length > 0 && (
                <span className="text-purple-300">• {selectedSubmarkets.length} selected</span>
              )}
            </div>
            <div className="text-gray-400">
              {results.length} submarkets analyzed • Avg Multiple: {avgMultiple.toFixed(2)}x
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
