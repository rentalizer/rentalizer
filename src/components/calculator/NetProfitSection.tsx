import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface NetProfitSectionProps {
  rent: number | '';
  comps: any[];
  expenses: any[];
  furnishings: any[];
  buildOut: any[];
}

export const NetProfitSection: React.FC<NetProfitSectionProps> = ({
  rent,
  comps,
  expenses,
  furnishings,
  buildOut
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          Net Profit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-400">
          Net profit section temporarily disabled
        </div>
      </CardContent>
    </Card>
  );
};