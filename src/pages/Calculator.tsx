import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator as CalculatorIcon, 
  DollarSign, 
  Home, 
  TrendingUp, 
  Building,
  Download,
  Loader2
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { AdminEditMode } from '@/components/AdminEditMode';
import { AccessGate } from '@/components/AccessGate';
import { CompsSection } from '@/components/calculator/CompsSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { FurnishingsSection } from '@/components/calculator/FurnishingsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { exportToExcel } from '@/utils/calculatorExport';

const Calculator = () => {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [rent, setRent] = useState<number | ''>('');
  const [comps, setComps] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [furnishings, setFurnishings] = useState<any[]>([]);
  const [buildOut, setBuildOut] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = {
        propertyAddress,
        rent,
        comps,
        expenses,
        furnishings,
        buildOut,
      };
      await exportToExcel(data, 'calculator_data.xlsx');
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccessGate
      requiredAccess="essentials"
      moduleName="Profit Calculator"
      moduleDescription="Calculate your rental arbitrage profits with our advanced calculator tool."
      moduleIcon={<CalculatorIcon className="h-8 w-8 text-cyan-400" />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TopNavBar />
        <AdminEditMode onEditModeChange={(isEditing) => setEditMode(isEditing)} />

        <div className="container mx-auto p-4">
          <Card className="bg-slate-800/90 backdrop-blur-lg border border-gray-700/50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <CalculatorIcon className="h-6 w-6 text-cyan-400" />
                Rental Arbitrage Calculator
              </CardTitle>
              <Button 
                variant="outline" 
                className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                onClick={handleExport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export to Excel</span>
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="propertyAddress" className="text-gray-300">
                    Property Address
                  </Label>
                  <Input
                    id="propertyAddress"
                    placeholder="123 Main St, Anytown"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="rent" className="text-gray-300">
                    Monthly Rent
                  </Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="Enter monthly rent"
                    value={rent}
                    onChange={(e) => setRent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    disabled={!editMode}
                  />
                </div>

                <CompsSection comps={comps} setComps={setComps} editMode={editMode} />
                <ExpensesSection expenses={expenses} setExpenses={setExpenses} editMode={editMode} />
                <FurnishingsSection furnishings={furnishings} setFurnishings={setFurnishings} editMode={editMode} />
                <BuildOutSection buildOut={buildOut} setBuildOut={setBuildOut} editMode={editMode} />
                <NetProfitSection 
                  rent={rent}
                  comps={comps}
                  expenses={expenses}
                  furnishings={furnishings}
                  buildOut={buildOut}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </AccessGate>
  );
};

// Simplified calculator for basic functionality
export interface CalculatorData {
  propertyAddress: string;
  rent: number | '';
  comps: any[];
  expenses: any[];
  furnishings: any[];
  buildOut: any[];
}

export default Calculator;
