// Community Component - Fixed TopNavBar issue
import React, { useState, useEffect, useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MessageSquare, Users, Book, Video, Bell, Plus, FileText, Calculator, Medal, RotateCcw, Download, Bot, Newspaper, User, Building, TrendingUp, Settings } from 'lucide-react';
import AdminChatButton from '@/components/AdminChatButton';
import AdminSupportMessaging from '@/components/messaging/AdminSupportMessaging';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { exportCalculatorToCSV } from '@/utils/calculatorExport';
import { useMemberCount } from '@/hooks/useMemberCount';

import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityLeaderboard } from '@/components/community/CommunityLeaderboard';
import { NewsFeed } from '@/components/community/NewsFeed';
import { MemberAskRichie } from '@/components/MemberAskRichie';
import { ContactChat } from '@/components/ContactChat';
import { AccessGate } from '@/components/AccessGate';
import { MembersList } from '@/components/MembersList';
import { ProfileEditor } from '@/components/ProfileEditor';

import { useAdminRole } from '@/hooks/useAdminRole';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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

const Community = React.memo(() => {
  const { memberCount, loading } = useMemberCount();
  
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
  const [directMessageChatOpen, setDirectMessageChatOpen] = useState(false);

  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const { isAdmin } = useAdminRole();
  const { unreadCount } = useUnreadMessages();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if we're in Lovable environment
  const isLovableEnv = window.location.hostname.includes('lovableproject.com') || 
                       window.location.search.includes('__lovable_token') ||
                       window.location.hostname === 'localhost';
  
  // Check admin status based on user role - optimized to run only once
  const userIsAdmin = useMemo(() => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'superadmin';
  }, [user]); // Include user dependency as required by exhaustive-deps

  const adminCheckLoading = useMemo(() => {
    return !user; // Only loading if user is not loaded yet
  }, [user]);
  
  
  // Update URL hash when tab changes - debounced to prevent excessive updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.location.hash = activeTab;
    }, 100); // Small delay to prevent excessive hash updates

    return () => clearTimeout(timeoutId);
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
    furnishingsPSF: 8,
  };
  
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(initialData);
  
  // Calculate derived values
  const calculatedFurnishings = Math.round(calculatorData.squareFootage * calculatorData.furnishingsPSF);
  const cashToLaunch = Math.round(calculatorData.firstMonthRent + calculatorData.securityDeposit + calculatorData.miscellaneous + calculatedFurnishings);
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

  // Load Calendly script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const updateCalculatorData = (updates: Partial<CalculatorData>) => {
    const roundedUpdates: Record<string, string | number> = {};
    
    Object.entries(updates).forEach(([key, value]) => {
      if (typeof value === 'number') {
        roundedUpdates[key] = Math.round(value);
      } else {
        roundedUpdates[key] = value;
      }
    });
    
    setCalculatorData(prev => ({ ...prev, ...roundedUpdates }));
  };

  const clearCalculatorData = () => {
    setCalculatorData({ ...initialData });
    console.log("Calculator Cleared: All data has been reset.");
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
    
    console.log("Data Downloaded: Your calculator data has been exported to a CSV file.");
  };

  const handleCheckout = async (plan: string) => {
    if (!user) {
      console.log("Authentication Required: Please log in to subscribe.");
      return;
    }

    try {
      console.log("Redirecting to Checkout: Opening Stripe checkout...");

      // Mock checkout - replace with real API call later
      setTimeout(() => {
        // Mock checkout URL - replace with real Stripe checkout URL
        const mockCheckoutUrl = 'https://checkout.stripe.com/mock-checkout';
        window.open(mockCheckoutUrl, '_blank');
        
        console.log("Checkout Opened: Mock checkout page opened in new tab");
      }, 500);
    } catch (error) {
      console.error('Checkout error:', error);
      console.log("Checkout Failed:", error instanceof Error ? error.message : "Failed to start checkout process");
    }
  };

  const CommunityContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight py-2">
              Training Dashboard
            </h1>
          </div>
          
          {/* Admin Chat Button */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <AdminChatButton />
          </div>
        </div>

        {/* Admin Quick Links */}
        {userIsAdmin && (
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
            <TabsTrigger value="calculator" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Calculator size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Calculator
            </TabsTrigger>
            {/* <TabsTrigger value="askrichie" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Bot size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              AI Richie
            </TabsTrigger> */}
            {/* <TabsTrigger value="propertyfinder" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Building size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Property Finder
            </TabsTrigger>
            <TabsTrigger value="marketfinder" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <TrendingUp size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Market Finder
            </TabsTrigger>
            <TabsTrigger value="propertymanagement" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Settings size={24} style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px'}} className="mr-2 flex-shrink-0" />
              Property Management
            </TabsTrigger> */}
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

              {/* Calculator Sections - Cleaner Grid Layout */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-full">
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

          <TabsContent value="propertyfinder" className="mt-8">
            <div className="text-center py-8">
              <p className="text-gray-400">Property Finder coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="marketfinder" className="mt-8">
            <div className="text-center py-8">
              <p className="text-gray-400">Market Finder coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="propertymanagement" className="mt-8">
            <div className="max-w-4xl mx-auto relative">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <Settings className="h-20 w-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Property Management
                  </h2>
                  <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    Comprehensive tools and resources for managing your rental properties efficiently.
                  </p>
                </div>
                
                <div className="text-center mb-8">
                  <Button 
                    onClick={() => setShowPricingOverlay(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Upgrade Now
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-400">
                    Property Management features coming soon...
                  </p>
                </div>
              </div>

              {/* Pricing Overlay */}
              {showPricingOverlay && (
                <div className="absolute inset-0 bg-black/90 rounded-xl flex items-center justify-center z-50 p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h3>
                      <p className="text-gray-300">Unlock powerful property management tools</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {/* Basic Plan */}
                      <div className="bg-slate-800/90 rounded-lg p-6 border border-gray-600 hover:border-cyan-500/50 transition-all">
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-semibold text-white mb-2">Basic</h4>
                          <div className="text-3xl font-bold text-cyan-400 mb-2">$29<span className="text-lg text-gray-400">/mo</span></div>
                          <p className="text-gray-400 text-sm">Perfect for beginners</p>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-sm mb-6">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            Basic property tracking
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            Rent collection tools
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            Email support
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                          onClick={() => handleCheckout('property_basic')}
                        >
                          Get Started
                        </Button>
                      </div>

                      {/* Premium Plan */}
                      <div className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 rounded-lg p-6 border-2 border-blue-500 relative hover:border-blue-400 transition-all transform scale-105">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>
                        </div>
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-semibold text-white mb-2">Premium</h4>
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            $79<span className="text-lg text-gray-400">/mo</span>
                          </div>
                          <p className="text-gray-400 text-sm">For growing portfolios</p>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-sm mb-6">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Advanced analytics
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Automated workflows
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Priority support
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Multi-property management
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                          onClick={() => handleCheckout('property_premium')}
                        >
                          Upgrade to Premium
                        </Button>
                      </div>

                      {/* Enterprise Plan */}
                      <div className="bg-slate-800/90 rounded-lg p-6 border border-gray-600 hover:border-purple-500/50 transition-all">
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-semibold text-white mb-2">Enterprise</h4>
                          <div className="text-3xl font-bold text-purple-400 mb-2">$199<span className="text-lg text-gray-400">/mo</span></div>
                          <p className="text-gray-400 text-sm">For large portfolios</p>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-sm mb-6">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Custom integrations
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Dedicated account manager
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            White-label options
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Unlimited properties
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                          onClick={() => handleCheckout('property_enterprise')}
                        >
                          Contact Sales
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPricingOverlay(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
                    AI Richie
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
                        <span>Market research techniques</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>Legal compliance and licensing</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-6 border border-purple-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Example Questions
                    </h4>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <div className="bg-slate-600/50 rounded p-3">
                        "What's your process for finding 2.0+ multiple properties?"
                      </div>
                      <div className="bg-slate-600/50 rounded p-3">
                        "How do I handle landlord objections about Airbnb?"
                      </div>
                      <div className="bg-slate-600/50 rounded p-3">
                        "What are the key STR licensing requirements?"
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setChatOpen(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                  >
                    <Bot className="h-6 w-6" />
                    Start Chatting with Richie AI
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

      {/* Ask Richie Chat Dialog for Members */}
      <Dialog open={isChatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-4xl h-[700px] bg-slate-900 border-cyan-500/20 p-0">
          <MemberAskRichie />
        </DialogContent>
      </Dialog>

      {/* Members List Dialog */}
      <MembersList 
        open={membersDialogOpen} 
        onOpenChange={setMembersDialogOpen}
        onMessageMember={(member) => {
          console.log('Message member:', member);
          // Handle messaging logic here if needed
        }}
      />

      <ProfileEditor
        isOpen={profileEditorOpen}
        onClose={() => setProfileEditorOpen(false)}
      />
    </div>
  );

  // If in Lovable environment, bypass authentication
  if (isLovableEnv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <TopNavBar />
        <CommunityContent />
        <Footer />
      </div>
    );
  }

  return (
    <AccessGate title="Training Dashboard" subtitle="Access your account">
      <CommunityContent />
      {directMessageChatOpen && userIsAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Admin Support</h2>
              <button 
                onClick={() => setDirectMessageChatOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AdminSupportMessaging />
            </div>
          </div>
        </div>
      )}
    </AccessGate>
  );
});

Community.displayName = 'Community';

export default Community;
