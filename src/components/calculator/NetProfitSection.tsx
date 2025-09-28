
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';

interface NetProfitSectionProps {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const NetProfitSection: React.FC<NetProfitSectionProps> = ({
  monthlyRevenue,
  netProfitMonthly,
  paybackMonths,
  cashOnCashReturn
}) => {
  const formatPaybackPeriod = (months: number | null) => {
    if (months === null || months <= 0) return 'N/A';
    
    if (months < 12) {
      return `${months.toFixed(1)} mo`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} yr${years > 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths.toFixed(1)}m`;
      }
    }
  };

  const getReturnColor = (returnRate: number) => {
    if (returnRate >= 20) return 'text-green-400';
    if (returnRate >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-xl font-semibold">
          <BarChart3 className="h-6 w-6 text-purple-400" />
          Profitability Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Net Monthly Profit - Most Important */}
        <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-lg p-5 border border-purple-500/30">
          <div className="text-center">
            <Label className="text-purple-300 text-lg font-semibold block mb-3">Monthly Net Profit</Label>
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="h-8 w-8 text-purple-400" />
              <span className={`text-4xl font-bold ${getProfitColor(netProfitMonthly)}`}>
                {netProfitMonthly >= 0 ? '' : '-'}${Math.abs(netProfitMonthly).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-purple-300/70">Revenue - Expenses</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cash on Cash Return */}
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg p-4 border border-amber-500/30">
            <div className="text-center">
              <Percent className="h-5 w-5 text-amber-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getReturnColor(cashOnCashReturn)} mb-1`}>
                {cashOnCashReturn}%
              </div>
              <Label className="text-amber-300/80 text-xs">Cash on Cash</Label>
            </div>
          </div>

          {/* Payback Period */}
          <div className="bg-gradient-to-br from-teal-600/20 to-cyan-600/20 rounded-lg p-4 border border-teal-500/30">
            <div className="text-center">
              <Calendar className="h-5 w-5 text-teal-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-400 mb-1">
                {formatPaybackPeriod(paybackMonths)}
              </div>
              <Label className="text-teal-300/80 text-xs">Payback Time</Label>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
          <div className="text-center">
            <div className="mb-2">
              {cashOnCashReturn >= 20 ? (
                <div className="text-green-400 text-sm font-semibold">🎉 Excellent Investment</div>
              ) : cashOnCashReturn >= 10 ? (
                <div className="text-yellow-400 text-sm font-semibold">👍 Good Investment</div>
              ) : cashOnCashReturn > 0 ? (
                <div className="text-orange-400 text-sm font-semibold">⚠️ Marginal Investment</div>
              ) : (
                <div className="text-red-400 text-sm font-semibold">❌ Loss Making</div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {cashOnCashReturn >= 15 
                ? "This property shows strong profitability potential"
                : cashOnCashReturn >= 8
                ? "Decent returns, consider market conditions"
                : "Review numbers or find better deals"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
