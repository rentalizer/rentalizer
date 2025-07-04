import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MessageSquare, Users, Book, Video, Bell, Plus, FileText, Calculator, Medal, RotateCcw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { exportCalculatorToCSV } from '@/utils/calculatorExport';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityLeaderboard } from '@/components/community/CommunityLeaderboard';
import { ContactChat } from '@/components/ContactChat';

export interface CalculatorData {
  // Comps
  address: string;
  bedrooms: number;
  bathrooms: number;
  averageComparable: number;
  
  // Build Out
  firstMonthRent: number;
  securityDeposit: number;
  furnishingsCost: number;
  
  // Expenses
  rent: number;
  serviceFees: number;
  maintenance: number;
  power: number;
  waterSewer: number;
  internet: number;
  taxLicense: number;
  insurance: number;
  software: number;
  miscellaneous: number;
  furnitureRental: number;
  
  // Furnishings Calculator
  squareFootage: number;
  furnishingsPSF: number;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const { toast } = useToast();
  
  // Calculator state
  const initialData: CalculatorData = {
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    averageComparable: 0,
    firstMonthRent: 0,
    securityDeposit: 0,
    furnishingsCost: 0,
    rent: 0,
    serviceFees: 0,
    maintenance: 0,
    power: 0,
    waterSewer: 0,
    internet: 0,
    taxLicense: 0,
    insurance: 0,
    software: 0,
    miscellaneous: 0,
    furnitureRental: 0,
    squareFootage: 0,
    furnishingsPSF: 0,
  };
  
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(initialData);
  
  // Calculate derived values
  const calculatedFurnishings = Math.round(calculatorData.squareFootage * calculatorData.furnishingsPSF);
  const cashToLaunch = Math.round(calculatorData.firstMonthRent + calculatorData.securityDeposit + calculatorData.miscellaneous + calculatedFurnishings + calculatorData.furnitureRental);
  const serviceFeeCalculated = Math.round(calculatorData.rent * 0.029);
  const monthlyExpenses = Math.round(calculatorData.rent + serviceFeeCalculated + calculatorData.maintenance + calculatorData.power + 
                         calculatorData.waterSewer + calculatorData.internet + calculatorData.taxLicense + calculatorData.insurance + 
                         calculatorData.software + calculatorData.furnitureRental);
  const monthlyRevenue = Math.round(calculatorData.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  const paybackMonths = (cashToLaunch > 0 && netProfitMonthly > 0) 
    ? cashToLaunch / netProfitMonthly
    : null;
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  
  // Update service fees when rent changes
  useEffect(() => {
    setCalculatorData(prev => ({
      ...prev,
      serviceFees: Math.round(prev.rent * 0.029)
    }));
  }, [calculatorData.rent]);

  const updateCalculatorData = (updates: Partial<CalculatorData>) => {
    const roundedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = Math.round(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    setCalculatorData(prev => ({ ...prev, ...roundedUpdates }));
  };

  const clearCalculatorData = () => {
    setCalculatorData({ ...initialData });
    toast({
      title: "Calculator Cleared",
      description: "All data has been reset.",
    });
  };

  const downloadCalculatorData = () => {
    const calculatedValues = {
      cashToLaunch,
      monthlyExpenses,
      monthlyRevenue,
      netProfitMonthly,
      paybackMonths,
      cashOnCashReturn,
      calculatedFurnishings
    };
    
    exportCalculatorToCSV(calculatorData, calculatedValues);
    
    toast({
      title: "Data Downloaded",
      description: "Your calculator data has been exported to a CSV file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center">
      <TopNavBar />
      
      <div className="w-full max-w-4xl px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight py-2">
              Training & Community Hub
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border border-cyan-500/20 gap-1 justify-items-stretch">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <Users className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <Video className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1"
              onClick={(e) => {
                e.preventDefault();
                setCalculatorOpen(true);
              }}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Business Docs
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex-1">
              <Medal className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Other Tabs */}
          <TabsContent value="discussions" className="mt-8">
            <GroupDiscussions />
          </TabsContent>
          <TabsContent value="calendar" className="mt-8">
            <CommunityCalendar />
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <VideoLibrary />
          </TabsContent>

          <TabsContent value="messages" className="mt-8">
            <MessageThreads />
          </TabsContent>

          {/* Calculator Dialog - outside of tabs content */}
          <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-cyan-500/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-cyan-400" />
                  Rental Calculator
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={clearCalculatorData}
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={downloadCalculatorData}
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Data
                  </Button>
                </div>

                {/* Calculator Sections */}
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                  <BuildOutSection 
                    data={calculatorData} 
                    updateData={updateCalculatorData} 
                    cashToLaunch={cashToLaunch} 
                  />
                  
                  <ExpensesSection 
                    data={calculatorData} 
                    updateData={updateCalculatorData} 
                    serviceFeeCalculated={serviceFeeCalculated}
                    monthlyExpenses={monthlyExpenses}
                  />
                  
                  <CompsSection 
                    data={calculatorData} 
                    updateData={updateCalculatorData} 
                  />

                  <NetProfitSection 
                    monthlyRevenue={monthlyRevenue}
                    netProfitMonthly={netProfitMonthly}
                    paybackMonths={paybackMonths}
                    cashOnCashReturn={cashOnCashReturn}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>


          <TabsContent value="documents" className="mt-8">
            <DocumentsLibrary />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-8">
            <CommunityLeaderboard />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
