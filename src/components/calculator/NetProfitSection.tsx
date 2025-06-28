
import React from 'react';
import { NetProfitMockup1 } from './NetProfitMockup1';
import { NetProfitMockup2 } from './NetProfitMockup2';
import { NetProfitMockup3 } from './NetProfitMockup3';

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
  return (
    <div className="space-y-6">
      {/* Mockup 1: Horizontal Cards */}
      <div>
        <h3 className="text-white text-sm mb-2 text-center">Mockup 1: Horizontal Cards</h3>
        <NetProfitMockup1 
          monthlyRevenue={monthlyRevenue}
          netProfitMonthly={netProfitMonthly}
          paybackMonths={paybackMonths}
          cashOnCashReturn={cashOnCashReturn}
        />
      </div>

      {/* Mockup 2: Grid Layout */}
      <div>
        <h3 className="text-white text-sm mb-2 text-center">Mockup 2: 2x2 Grid</h3>
        <NetProfitMockup2 
          monthlyRevenue={monthlyRevenue}
          netProfitMonthly={netProfitMonthly}
          paybackMonths={paybackMonths}
          cashOnCashReturn={cashOnCashReturn}
        />
      </div>

      {/* Mockup 3: Vertical Stack */}
      <div>
        <h3 className="text-white text-sm mb-2 text-center">Mockup 3: Vertical Stack</h3>
        <NetProfitMockup3 
          monthlyRevenue={monthlyRevenue}
          netProfitMonthly={netProfitMonthly}
          paybackMonths={paybackMonths}
          cashOnCashReturn={cashOnCashReturn}
        />
      </div>
    </div>
  );
};
