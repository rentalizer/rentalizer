
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, DollarSign, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

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

  const validResults = results.filter(r => r.strRevenue > 0 && r.medianRent > 0);
  const avgMultiple = validResults.length > 0 
    ? validResults.reduce((sum, r) => sum + r.multiple, 0) / validResults.length 
    : 0;

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
  const hasFailedData = results.some(r => r.strRevenue === 0 || r.medianRent === 0);

  // Get the best performing neighborhood
  const bestNeighborhood = validResults.length > 0 ? validResults[0] : null;

  return (
    <Card className="w-full bg-gray-900/95 border-gray-700 shadow-2xl">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="h-6 w-6 text-cyan-400" />
            {city} Neighborhoods
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasFailedData ? (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Some Data Missing</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Complete Data</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            {results.length} neighborhoods • STR revenue (with 25% markup) vs rental data
          </p>
          {bestNeighborhood && (
            <div className="text-sm text-cyan-300">
              Best: {bestNeighborhood.submarket} ({bestNeighborhood.multiple.toFixed(2)}x)
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-white font-semibold w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                  />
                </TableHead>
                <TableHead className="text-white font-semibold">Neighborhood</TableHead>
                <TableHead className="text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    STR Revenue (+25%)
                  </div>
                </TableHead>
                <TableHead className="text-white font-semibold">Median Rent</TableHead>
                <TableHead className="text-white font-semibold">Revenue Multiple</TableHead>
                <TableHead className="text-white font-semibold">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => {
                const isTopPerformer = validResults.length > 0 && result === validResults[0];
                const isGoodPerformance = result.multiple >= 2.0;
                
                return (
                  <TableRow 
                    key={index} 
                    className={`border-gray-700 hover:bg-gray-800/50 transition-colors ${
                      isTopPerformer ? 'bg-green-500/10' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedSubmarkets.includes(result.submarket)}
                        onCheckedChange={(checked) => handleSubmarketSelection(result.submarket, checked as boolean)}
                        className="border-cyan-500/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {result.submarket}
                        {isTopPerformer && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Top Performer
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      {result.strRevenue === 0 ? (
                        <span className="text-yellow-400">No Data</span>
                      ) : (
                        <span className="text-green-400">${result.strRevenue.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      {result.medianRent === 0 ? (
                        <span className="text-yellow-400">No Data</span>
                      ) : (
                        <span className="text-blue-400">${result.medianRent.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      {result.strRevenue === 0 || result.medianRent === 0 ? (
                        <span className="text-yellow-400">N/A</span>
                      ) : (
                        <span className={isGoodPerformance ? 'text-green-400' : 'text-white'}>
                          {result.multiple.toFixed(2)}x
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {result.strRevenue === 0 || result.medianRent === 0 ? (
                        <span className="text-xs text-yellow-400">Incomplete</span>
                      ) : result.multiple >= 3.0 ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Excellent
                        </span>
                      ) : result.multiple >= 2.0 ? (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          Good
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                          Fair
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 bg-gray-800/20 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-cyan-300">
              <span>Neighborhood Analysis</span>
              {selectedSubmarkets.length > 0 && (
                <span className="text-purple-300">• {selectedSubmarkets.length} selected</span>
              )}
            </div>
            <div className="text-gray-400">
              {results.length} neighborhoods • {validResults.length} with complete data
              {validResults.length > 0 && ` • Avg Multiple: ${avgMultiple.toFixed(2)}x`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
