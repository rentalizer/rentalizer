import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface ExpensesSectionProps {
  expenses: any[];
  setExpenses: (expenses: any[]) => void;
  editMode: boolean;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  setExpenses,
  editMode
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <DollarSign className="h-5 w-5 text-cyan-400" />
          Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-400">
          Expenses section temporarily disabled
        </div>
      </CardContent>
    </Card>
  );
};