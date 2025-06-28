
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface NetProfitMockup3Props {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const NetProfitMockup3: React.FC<NetProfitMockup3Props> = ({
  monthlyRevenue,
  netProfitMonthly,
  paybackMonths,
  cashOnCashReturn
}) => {
  const formatPaybackPeriod = (months: number | null) => {
    if (months === null || months <= 0) return 'N/A';
    
    if (months < 12) {
      return `${months.toFixed(1)} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths < 1) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths.toFixed(0)}m`;
      }
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mockup 3: Vertical Stack with Dividers */}
        <div className="space-y-4">
          <div className="text-center border-b border-gray-600/30 pb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <Label className="text-blue-300 text-sm">Monthly Revenue</Label>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              ${monthlyRevenue.toLocaleString()}
            </div>
          </div>

          <div className="text-center border-b border-gray-600/30 pb-3">
            <Label className="text-green-300 text-sm block mb-2">Net Monthly Profit</Label>
            <div className={`text-3xl font-bold ${netProfitMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netProfitMonthly >= 0 ? '+' : '-'}${Math.abs(netProfitMonthly).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-cyan-400" />
                <Label className="text-cyan-300 text-xs">Payback</Label>
              </div>
              <div className="text-lg font-bold text-cyan-400">
                {formatPaybackPeriod(paybackMonths)}
              </div>
            </div>

            <div className="w-px h-12 bg-gray-600/30 mx-4"></div>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Percent className="h-3 w-3 text-purple-400" />
                <Label className="text-purple-300 text-xs">CoC Return</Label>
              </div>
              <div className={`text-lg font-bold ${cashOnCashReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                {cashOnCashReturn}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
