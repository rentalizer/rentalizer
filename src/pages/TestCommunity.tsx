
// Community Component - Fixed TopNavBar issue
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MessageSquare, Users, Book, Video, Bell, Plus, FileText, Calculator, Medal, RotateCcw, Download, Bot, Newspaper, User, Sun, Moon, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { exportCalculatorToCSV } from '@/utils/calculatorExport';

import { Footer } from '@/components/Footer';
import { TopNavBarTest } from '@/components/TopNavBarTest';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityLeaderboard } from '@/components/community/CommunityLeaderboard';
import { NewsFeed } from '@/components/community/NewsFeed';
import SimplifiedChat from '@/components/SimplifiedChat';
import { AskRichieChat } from '@/components/AskRichieChat';
import { ContactChat } from '@/components/ContactChat';
import { AccessGate } from '@/components/AccessGate';
import { MembersList } from '@/components/MembersList';
import { ProfileEditor } from '@/components/ProfileEditor';

import { useAdminRole } from '@/hooks/useAdminRole';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoginPrompt } from '@/components/LoginPrompt';
import { LoginDialog } from '@/components/LoginDialog';


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
  const { user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Check if we're in Lovable environment (bypass auth for development)
  const isLovableEnv = window.location.hostname.includes('lovableproject.com') || 
                       window.location.search.includes('__lovable_token') ||
                       window.location.hostname === 'localhost' ||
                       window.location.hostname.includes('lovable.app');

  // Show login modal automatically if not authenticated and not in development
  useEffect(() => {
    if (!isLoading && !user && !isLovableEnv) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [isLoading, user, isLovableEnv]);

  // Get initial tab from URL hash or default to discussions
  const getInitialTab = () => {
    const hash = window.location.hash.substring(1);
    return hash || 'discussions';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isChatOpen, setChatOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const [isDayMode, setIsDayMode] = useState(() => {
    // Load theme preference from localStorage, default to night mode
    const saved = localStorage.getItem('test-community-theme');
    return saved === 'day';
  });
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();
  const { unreadCount } = useUnreadMessages();
  const navigate = useNavigate();

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('test-community-theme', isDayMode ? 'day' : 'night');
  }, [isDayMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDayMode(!isDayMode);
    toast({
      title: `Switched to ${!isDayMode ? 'Day' : 'Night'} Mode`,
      description: `You're now viewing the ${!isDayMode ? 'light' : 'dark'} theme.`,
    });
  };
  
  // Enhanced admin check that works on live site
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setUserIsAdmin(false);
        setAdminCheckLoading(false);
        return;
      }

      try {
        // First check using the hook
        if (isAdmin) {
          setUserIsAdmin(true);
          setAdminCheckLoading(false);
          return;
        }

        // Direct database check as fallback
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .limit(1);

        if (error) {
          console.error('Error checking admin status:', error);
          setUserIsAdmin(false);
        } else {
          setUserIsAdmin(roles && roles.length > 0);
        }
      } catch (error) {
        console.error('Exception checking admin status:', error);
        setUserIsAdmin(false);
      }
      
      setAdminCheckLoading(false);
    };

    checkAdminStatus();
  }, [user, isAdmin]);
  
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

  const CommunityContent = () => (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      isDayMode 
        ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      <TopNavBarTest />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className={`h-12 w-12 ${isDayMode ? 'text-cyan-700' : 'text-cyan-400'}`} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight py-2">
              Training Dashboard
            </h1>
          </div>
        </div>

        {/* Admin Quick Links */}
        {userIsAdmin && (
          <div className="mb-6 flex justify-center">
            <Link to="/admin/richie" className={`text-sm flex items-center gap-2 transition-colors ${
              isDayMode ? 'text-slate-800 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'
            }`}>
              <Bot className="h-4 w-4" />
              Manage Richie's Knowledge Base
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`flex w-full justify-evenly h-14 p-2 transition-all duration-300 ${
            isDayMode 
              ? 'bg-white border-2 border-slate-200 shadow-lg' 
              : 'bg-slate-800/50 border border-cyan-500/20'
          }`}>
            <TabsTrigger value="discussions" className={`transition-all duration-300 ${
              isDayMode 
                ? 'data-[state=active]:bg-cyan-100 data-[state=active]:text-slate-900 text-slate-800 hover:text-slate-900' 
                : 'data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300'
            }`}>
              <Users className="h-5 w-5 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="calendar" className={`transition-all duration-300 ${
              isDayMode 
                ? 'data-[state=active]:bg-cyan-100 data-[state=active]:text-slate-900 text-slate-800 hover:text-slate-900' 
                : 'data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300'
            }`}>
              <Calendar className="h-5 w-5 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="videos" className={`transition-all duration-300 ${
              isDayMode 
                ? 'data-[state=active]:bg-cyan-100 data-[state=active]:text-slate-900 text-slate-800 hover:text-slate-900' 
                : 'data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300'
            }`}>
              <Video className="h-5 w-5 mr-2" />
              Training
            </TabsTrigger>
            <button 
              onClick={() => setChatOpen(true)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
                isDayMode 
                  ? 'text-slate-800 hover:text-slate-900 hover:bg-cyan-50' 
                  : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-600/10'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </button>
            <TabsTrigger value="calculator" className={`transition-all duration-300 ${
              isDayMode 
                ? 'data-[state=active]:bg-cyan-100 data-[state=active]:text-slate-900 text-slate-800 hover:text-slate-900' 
                : 'data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300'
            }`}>
              <Calculator size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="askrichie" className={`transition-all duration-300 ${
              isDayMode 
                ? 'data-[state=active]:bg-cyan-100 data-[state=active]:text-slate-900 text-slate-800 hover:text-slate-900' 
                : 'data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300'
            }`}>
              <Bot size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Ask Richie
            </TabsTrigger>
            <button
              onClick={() => setProfileEditorOpen(true)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isDayMode 
                  ? 'text-slate-800 hover:text-slate-900 hover:bg-cyan-50' 
                  : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-600/10'
              }`}
            >
              <User size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Profile
            </button>
            {!adminCheckLoading && userIsAdmin && (
              <button
                onClick={() => setMembersDialogOpen(true)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isDayMode 
                    ? 'text-slate-800 hover:text-slate-900 hover:bg-cyan-50' 
                    : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-600/10'
                }`}
              >
                <Users size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
                Members
              </button>
            )}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="discussions" className="mt-8">
            <GroupDiscussions isDayMode={isDayMode} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-8">
            <CommunityCalendar />
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <VideoLibrary />
          </TabsContent>

          <TabsContent value="calculator" className="mt-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 ${
                  isDayMode ? 'text-slate-700' : 'text-cyan-300'
                }`}>
                  <Calculator className={`h-8 w-8 ${isDayMode ? 'text-cyan-700' : 'text-cyan-400'}`} />
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
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <Bot className="h-20 w-20 text-cyan-400 mx-auto animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Ask Richie AI
                  </h2>
                  <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
                    Your on-demand rental arbitrage mentor—powered by AI and trained on over 200 hours of video trainings and coaching calls, plus more than 1,350,000 words of transcripts, guides, checklists, and deal analysis tools.
                  </p>
                  <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-6 mb-8">
                    <p className="text-cyan-300 leading-relaxed">
                      It pulls directly from my actual content—not generic internet data—so every answer reflects exactly how I teach, analyze, and execute. Whether you're asking about deal criteria, landlord objections, STR licensing, or next steps after a "yes," Ask Richie gives you clear, tactical responses 24/7—just like I would.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-slate-700/50 rounded-lg p-6 border border-cyan-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      What You Can Ask
                    </h4>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Deal analysis and criteria</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Landlord negotiation strategies</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>STR licensing requirements</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Setup and launch checklists</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Market research techniques</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-6 border border-cyan-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Example Questions
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <div className="bg-slate-800/50 rounded p-3">
                        "What's the best way to present rental arbitrage to skeptical landlords?"
                      </div>
                      <div className="bg-slate-800/50 rounded p-3">
                        "How do I calculate if a property meets the 1% rule?"
                      </div>
                      <div className="bg-slate-800/50 rounded p-3">
                        "What permits do I need for STR in Nashville?"
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    id="ask-richie-button"
                    onClick={() => {
                      const askRichieComponent = document.querySelector('[data-component="AskRichieChat"]') as HTMLElement;
                      if (askRichieComponent) {
                        const toggleButton = askRichieComponent.querySelector('[data-action="toggle"]') as HTMLElement;
                        if (toggleButton) {
                          toggleButton.click();
                        }
                      }
                    }}
                    className="group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl border border-cyan-500/20"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Bot className="h-6 w-6 group-hover:animate-pulse" />
                      <span className="text-lg">Start Chat with Richie AI</span>
                    </div>
                  </button>
                  <p className="text-sm text-gray-400 mt-4">
                    Available 24/7 • Instant responses • Based on real training content
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-4xl h-[80vh] bg-slate-900 border-cyan-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Chat
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <SimplifiedChat />
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] bg-slate-900 border-cyan-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Members
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <MembersList 
              open={membersDialogOpen} 
              onOpenChange={setMembersDialogOpen}
              onMessageMember={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Editor Dialog */}
      <Dialog open={profileEditorOpen} onOpenChange={setProfileEditorOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-cyan-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <ProfileEditor 
            isOpen={profileEditorOpen} 
            onClose={() => setProfileEditorOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  // Show community content with login modal overlay if needed
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <CommunityContent />
      <Footer />
      
      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginDialog 
              trigger={
                <div className="hidden" />
              }
            />
            {/* Force modal to be open by using a trick */}
            <div className="bg-slate-800/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-6">
                <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Sign In to Rentalizer</h2>
                <p className="text-gray-400">Access your account</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="text-right">
                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    Forgot Your Password?
                  </button>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-cyan-300 hover:text-cyan-200 text-sm"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
