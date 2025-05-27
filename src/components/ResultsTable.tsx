
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

interface ResultsTableProps {
  results: SubmarketData[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const getMultipleBadge = (multiple: number) => {
    if (multiple >= 3.0) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Excellent</Badge>;
    } else if (multiple >= 2.5) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Very Good</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Good</Badge>;
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No submarkets meet the qualifying criteria</p>
        <p className="text-sm mt-2">Submarkets must have $4,000+ revenue and 2.0+ revenue-to-rent multiple</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">Submarket</TableHead>
            <TableHead className="font-semibold text-gray-900">STR Revenue (Top 25%)</TableHead>
            <TableHead className="font-semibold text-gray-900">Median Rent</TableHead>
            <TableHead className="font-semibold text-gray-900">Revenue-to-Rent Multiple</TableHead>
            <TableHead className="font-semibold text-gray-900">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900">{row.submarket}</TableCell>
              <TableCell className="text-green-600 font-semibold">
                ${row.strRevenue.toLocaleString()}
              </TableCell>
              <TableCell className="text-gray-700">
                ${row.medianRent.toLocaleString()}
              </TableCell>
              <TableCell className="font-semibold text-blue-600">
                {row.multiple.toFixed(2)}x
              </TableCell>
              <TableCell>
                {getMultipleBadge(row.multiple)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Summary Statistics:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Qualifying Markets:</span>
            <div className="font-semibold text-blue-900">{results.length}</div>
          </div>
          <div>
            <span className="text-blue-700">Avg Revenue:</span>
            <div className="font-semibold text-blue-900">
              ${Math.round(results.reduce((sum, r) => sum + r.strRevenue, 0) / results.length).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-blue-700">Avg Rent:</span>
            <div className="font-semibold text-blue-900">
              ${Math.round(results.reduce((sum, r) => sum + r.medianRent, 0) / results.length).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-blue-700">Avg Multiple:</span>
            <div className="font-semibold text-blue-900">
              {(results.reduce((sum, r) => sum + r.multiple, 0) / results.length).toFixed(2)}x
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
