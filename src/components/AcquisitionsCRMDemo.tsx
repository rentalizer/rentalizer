
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Bot, 
  Target, 
  Calculator,
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

interface AcquisitionsCRMDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const AcquisitionsCRMDemo = ({ currentStep, isRunning }: AcquisitionsCRMDemoProps) => {
  const [searchProgress, setSearchProgress] = useState(0);
  const [emailProgress, setEmailProgress] = useState(0);
  const [leadProgress, setLeadProgress] = useState(0);

  // Mock property data
  const mockProperties = [
    { 
      id: 1, 
      address: "123 Main St, San Diego, CA", 
      rent: 2800, 
      bedrooms: 2, 
      bathrooms: 2, 
      sqft: 1100,
      status: "Available",
      profit: "+$1,200/mo"
    },
    { 
      id: 2, 
      address: "456 Ocean Ave, San Diego, CA", 
      rent: 3200, 
      bedrooms: 3, 
      bathrooms: 2, 
      sqft: 1400,
      status: "Contacted",
      profit: "+$1,500/mo"
    },
    { 
      id: 3, 
      address: "789 Park Blvd, San Diego, CA", 
      rent: 2400, 
      bedrooms: 2, 
      bathrooms: 1, 
      sqft: 950,
      status: "Available",
      profit: "+$900/mo"
    }
  ];

  // Mock email campaign data
  const emailCampaign = {
    sent: 47,
    opened: 18,
    replied: 6,
    openRate: "38%",
    replyRate: "13%"
  };

  // Mock lead conversion data
  const leadData = {
    totalLeads: 12,
    qualified: 8,
    viewingsScheduled: 5,
    dealsInProgress: 3,
    closed: 1
  };

  // Calculator data
  const calculatorData = {
    property: "456 Ocean Ave, San Diego, CA",
    rent: 3200,
    strRevenue: 4800,
    expenses: 3450,
    netProfit: 1350,
    roi: "42%",
    payback: "8.5 months"
  };

  useEffect(() => {
    if (isRunning && currentStep >= 4 && currentStep <= 6) {
      const timer = setInterval(() => {
        setSearchProgress(prev => prev >= 100 ? 0 : prev + 5);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isRunning, currentStep]);

  useEffect(() => {
    if (isRunning && (currentStep === 5 || currentStep === 6)) {
      const timer = setInterval(() => {
        setEmailProgress(prev => prev >= 100 ? 0 : prev + 3);
      }, 150);
      return () => clearInterval(timer);
    }
  }, [isRunning, currentStep]);

  useEffect(() => {
    if (isRunning && (currentStep >= 7 && currentStep <= 11)) {
      const timer = setInterval(() => {
        setLeadProgress(prev => prev >= 100 ? 0 : prev + 4);
      }, 120);
      return () => clearInterval(timer);
    }
  }, [isRunning, currentStep]);

  const isStepActive = (step: number) => {
    const stepRanges = {
      1: [4], // Apartment Discovery
      2: [5, 6], // Smart Outreach  
      3: [7, 8, 9, 10, 11], // Lead Conversion
      4: [7, 8] // Calculator overlaps with conversion
    };
    return stepRanges[step]?.includes(currentStep) || false;
  };

  const getStepStatus = (step: number) => {
    const completedSteps = {
      1: currentStep > 4,
      2: currentStep > 6, 
      3: currentStep > 11,
      4: currentStep > 8
    };
    
    if (completedSteps[step]) return 'completed';
    if (isStepActive(step)) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-8">
      {/* 4-Step Process Overview */}
      <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-purple-400" />
            Acquisitions CRM Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                step: 1, 
                title: "Apartment Discovery", 
                icon: Building2, 
                description: "AI searches multiple platforms for rental arbitrage opportunities",
                color: "text-blue-400"
              },
              { 
                step: 2, 
                title: "Smart Outreach", 
                icon: Bot, 
                description: "Automated email sequences engage property owners professionally",
                color: "text-purple-400"
              },
              { 
                step: 3, 
                title: "Lead Conversion", 
                icon: Target, 
                description: "Track responses and convert leads into profitable deals",
                color: "text-green-400"
              },
              { 
                step: 4, 
                title: "Deal Calculator", 
                icon: Calculator, 
                description: "Analyze profitability and ROI for each opportunity",
                color: "text-cyan-400"
              }
            ].map((item) => {
              const status = getStepStatus(item.step);
              return (
                <div key={item.step} className="text-center space-y-3">
                  <div className={`
                    p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center transition-all duration-500
                    ${status === 'completed' ? 'bg-green-500/20 border-2 border-green-400' : 
                      status === 'active' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse' : 
                      'bg-slate-700/50 border border-slate-600'}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    ) : (
                      <item.icon className={`h-8 w-8 ${status === 'active' ? 'text-white' : item.color}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${status === 'active' ? 'text-white' : 'text-gray-300'}`}>
                      {item.step}. {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  {status === 'active' && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      Active
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step-Specific Demonstrations */}
      {isRunning && (
        <div className="space-y-6">
          {/* Step 1: Apartment Discovery (Step 4 in overall flow) */}
          {currentStep === 4 && (
            <Card className="bg-slate-800/50 border-blue-500/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-blue-300 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Step 1: Apartment Discovery - San Diego Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Search className="h-5 w-5 text-blue-400" />
                    <Input 
                      value="San Diego, Denver, Seattle, Tampa, NYC"
                      readOnly
                      className="bg-slate-700/50 border-blue-500/30 text-white"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Scanning rental platforms...</span>
                      <span className="text-blue-400">{searchProgress}%</span>
                    </div>
                    <Progress value={searchProgress} className="h-2" />
                  </div>

                  <div className="grid gap-4">
                    {mockProperties.map((property, index) => (
                      <div key={property.id} className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">{property.address}</h4>
                            <div className="flex gap-4 text-sm text-gray-300 mt-1">
                              <span>{property.bedrooms}BR/{property.bathrooms}BA</span>
                              <span>{property.sqft} sqft</span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {property.rent}/mo
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`mb-2 ${
                                property.status === 'Available' 
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                              }`}
                            >
                              {property.status}
                            </Badge>
                            <div className="text-green-400 font-semibold">{property.profit}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm text-blue-400">✓ Arbitrage Potential Detected</div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Contact Owner
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Smart Outreach (Steps 5-6) */}
          {(currentStep === 5 || currentStep === 6) && (
            <Card className="bg-slate-800/50 border-purple-500/20 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Step 2: Smart Outreach - AI Email Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">To: landlord@oceanave456.com</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        ✓ Sent
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white">
                        Subject: Partnership Opportunity - Premium Short-Term Rental Management
                      </p>
                      <div className="text-xs text-gray-300 bg-slate-800/50 p-3 rounded border-l-4 border-purple-500">
                        <p className="mb-2">Hi Sarah,</p>
                        <p className="mb-2">
                          I hope this email finds you well. I'm reaching out regarding your beautiful property at 456 Ocean Ave. 
                          I specialize in premium short-term rental management and would love to discuss a partnership opportunity 
                          that could increase your monthly income by 40-60% while providing you with guaranteed monthly payments.
                        </p>
                        <p className="mb-2">
                          Our comprehensive management service handles everything from guest screening to professional cleaning, 
                          ensuring your property is maintained to the highest standards while maximizing your returns.
                        </p>
                        <p>Best regards,<br/>Alex Thompson</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Email campaign progress...</span>
                      <span className="text-purple-400">{emailProgress}%</span>
                    </div>
                    <Progress value={emailProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-400">{emailCampaign.sent}</div>
                      <div className="text-xs text-gray-400">Emails Sent</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-400">{emailCampaign.opened}</div>
                      <div className="text-xs text-gray-400">Opened</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-purple-400">{emailCampaign.replied}</div>
                      <div className="text-xs text-gray-400">Replies</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-cyan-400">{emailCampaign.openRate}</div>
                      <div className="text-xs text-gray-400">Open Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Lead Conversion (Steps 7-11) */}
          {(currentStep >= 7 && currentStep <= 11) && (
            <Card className="bg-slate-800/50 border-green-500/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-xl text-green-300 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Step 3: Lead Conversion - CRM Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Converting leads to deals...</span>
                      <span className="text-green-400">{leadProgress}%</span>
                    </div>
                    <Progress value={leadProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{leadData.totalLeads}</div>
                      <div className="text-sm text-gray-300">Total Leads</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{leadData.qualified}</div>
                      <div className="text-sm text-gray-300">Qualified</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{leadData.viewingsScheduled}</div>
                      <div className="text-sm text-gray-300">Viewings</div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">{leadData.dealsInProgress}</div>
                      <div className="text-sm text-gray-300">In Progress</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{leadData.closed}</div>
                      <div className="text-sm text-gray-300">Closed</div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-3">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">📧 Response from 456 Ocean Ave landlord</span>
                        <span className="text-gray-400">5 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">📅 Viewing scheduled for tomorrow 2PM</span>
                        <span className="text-gray-400">12 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🤝 Deal negotiation started - 789 Park Blvd</span>
                        <span className="text-gray-400">1 hr ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">✅ Contract signed - 123 Main St</span>
                        <span className="text-gray-400">2 hrs ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Deal Calculator (Steps 7-8) */}
          {(currentStep === 7 || currentStep === 8) && (
            <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Step 4: Deal Calculator - ROI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="font-semibold text-white mb-2">{calculatorData.property}</h4>
                    <div className="text-sm text-gray-300">2BR/2BA • 1400 sqft</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-300">Revenue Analysis</h4>
                      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Monthly Rent</span>
                          <span className="text-red-300">${calculatorData.rent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">STR Revenue</span>
                          <span className="text-green-400 font-bold">${calculatorData.strRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-600 pt-2">
                          <span className="text-gray-300">Revenue Multiple</span>
                          <span className="text-cyan-400">1.5x</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-300">Expense Breakdown</h4>
                      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Total Expenses</span>
                          <span className="text-red-300">${calculatorData.expenses.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Rent + Utilities + Cleaning + Platform Fees
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg p-6 border border-green-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-green-400">${calculatorData.netProfit}</div>
                        <div className="text-gray-300">Monthly Net Profit</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-cyan-400">{calculatorData.roi}</div>
                        <div className="text-gray-300">Annual ROI</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-400">{calculatorData.payback}</div>
                        <div className="text-gray-300">Payback Period</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 px-8">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Approve Deal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
