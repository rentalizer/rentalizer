import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MessageSquare, Users, Book, Video, Bell, Plus, FileText, Calculator, Medal, RotateCcw, Download, Bot, Newspaper } from 'lucide-react';
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
import { NewsFeed } from '@/components/community/NewsFeed';
import { DirectMessaging } from '@/components/DirectMessaging';
import { AskRichieChat } from '@/components/AskRichieChat';
import { ContactChat } from '@/components/ContactChat';
import { AdminSetup } from '@/components/AdminSetup';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate, Link } from 'react-router-dom';

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
  // Get initial tab from URL hash or default to discussions
  const getInitialTab = () => {
    const hash = window.location.hash.substring(1);
    return hash || 'discussions';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();
  
  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight py-2">
              Training & Community Hub
            </h1>
          </div>
        </div>

        {/* Admin Quick Links */}
        {isAdmin && (
          <div className="mb-6 flex justify-center">
            <Link to="/admin/richie" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Manage Richie's Knowledge Base
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full bg-slate-800/50 border border-cyan-500/20 justify-evenly h-14 p-2">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Users className="h-5 w-5 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Calendar className="h-5 w-5 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Video className="h-5 w-5 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Calculator size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="askrichie" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Bot size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Ask Richie
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/members');
                }}
              >
                <Users size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
                Members
              </TabsTrigger>
            )}
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

          <TabsContent value="calculator" className="mt-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4 flex items-center justify-center gap-3">
                  <Calculator className="h-8 w-8 text-cyan-400" />
                  Rental Calculator
                </h2>
              </div>
              
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
              <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-6">
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
          </TabsContent>

          <TabsContent value="askrichie" className="mt-8">
            <div className="text-center space-y-6">
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8">
                <Bot className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Ask Richie AI</h3>
                <p className="text-gray-300 mb-6">
                  Get instant answers to your rental arbitrage questions based on Richie's training materials.
                </p>
                <div className="space-y-4">
                  <div className="text-left bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Features:</p>
                    <ul className="text-cyan-300 space-y-1 text-sm">
                      <li>• Market analysis insights from training materials</li>
                      <li>• Investment strategy recommendations</li>
                      <li>• Property evaluation assistance</li>
                      <li>• Direct answers with source citations</li>
                    </ul>
                  </div>
                  <p className="text-sm text-orange-300">
                    Click the AI Richie button (bottom right) to start asking questions!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>

      <AdminSetup />
      <DirectMessaging />
      <AskRichieChat />
      <Footer />
    </div>
  );
};

export default Community;
