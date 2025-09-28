
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

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
      return `${months.toFixed(1)} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths.toFixed(1)}m`;
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monthly Revenue */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Monthly Revenue</p>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {monthlyRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className={`p-4 rounded-lg border ${
            netProfitMonthly >= 0 
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  netProfitMonthly >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  Net Monthly Profit
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className={`h-4 w-4 ${
                    netProfitMonthly >= 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                  <span className={`text-xl font-bold ${
                    netProfitMonthly >= 0 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {netProfitMonthly >= 0 ? '' : '-'}${Math.abs(netProfitMonthly).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payback Period */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Payback Period</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {formatPaybackPeriod(paybackMonths)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cash on Cash Return */}
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Cash on Cash ROI</p>
                <div className="flex items-center gap-2 mt-1">
                  <Percent className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-xl font-bold text-orange-700 dark:text-orange-300">
                    {cashOnCashReturn}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
