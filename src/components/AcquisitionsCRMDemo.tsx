
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
  Pause,
  Users,
  MessageSquare,
  BookOpen,
  Calendar
} from 'lucide-react';

interface AcquisitionsCRMDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const AcquisitionsCRMDemo = ({ currentStep, isRunning }: AcquisitionsCRMDemoProps) => {
  const [searchProgress, setSearchProgress] = useState(0);
  const [emailProgress, setEmailProgress] = useState(0);
  const [leadProgress, setLeadProgress] = useState(0);

  // Mock Tampa property data
  const tampaProperties = [
    { 
      id: 1, 
      address: "110 Main Street, Tampa, FL", 
      rent: 1832, 
      bedrooms: 1, 
      bathrooms: 2, 
      sqft: 936,
      status: "Available Now",
      profit: "+$800/mo",
      rating: 4.2
    },
    { 
      id: 2, 
      address: "140 Main Street, Tampa, FL", 
      rent: 1929, 
      bedrooms: 3, 
      bathrooms: 1, 
      sqft: 1094,
      status: "Available Now",
      profit: "+$950/mo",
      rating: 4.9
    },
    { 
      id: 3, 
      address: "300 Main Street, Tampa, FL", 
      rent: 2017, 
      bedrooms: 3, 
      bathrooms: 2, 
      sqft: 996,
      status: "Available Now",
      profit: "+$1,100/mo",
      rating: 4.1
    }
  ];

  // Mock San Diego property data for step 4
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
                color: "text-cyan-400"
              },
              { 
                step: 4, 
                title: "Deal Calculator", 
                icon: Calculator, 
                description: "Analyze profitability and ROI for each opportunity",
                color: "text-blue-400"
              }
            ].map((item) => {
              const status = getStepStatus(item.step);
              return (
                <div key={item.step} className="text-center space-y-3">
                  <div className={`
                    p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center transition-all duration-500
                    ${status === 'completed' ? 'bg-cyan-500/20 border-2 border-cyan-400' : 
                      status === 'active' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse' : 
                      'bg-slate-700/50 border border-slate-600'}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-8 w-8 text-cyan-400" />
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

          {/* Step 2A: Property Listings - Tampa (Step 5) */}
          {currentStep === 5 && (
            <Card className="bg-slate-800/50 border-purple-500/20 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Step 2A: Property Listings Found - Tampa, FL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-white">3 Properties Found</span>
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-200">Tampa Area</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      "tampa"
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tampaProperties.map((property) => (
                      <div key={property.id} className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="text-2xl font-bold text-white">
                              ${property.rent.toLocaleString()}/mo
                            </div>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              {property.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">{property.rating}</span>
                            </div>
                          </div>

                          <div className="flex gap-4 text-sm text-gray-300">
                            <span>{property.bedrooms} bed</span>
                            <span>{property.bathrooms} bath</span>
                            <span>{property.sqft} sqft</span>
                          </div>

                          <div className="text-sm font-medium text-white">
                            {property.address.split(',')[0]}
                          </div>
                          <div className="text-xs text-gray-400">
                            {property.address}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                            <div className="text-green-400 font-semibold">{property.profit}</div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                                Contact Owner
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                                Save Property
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2B: Smart Outreach - Email Campaign (Step 6) */}
          {currentStep === 6 && (
            <Card className="bg-slate-800/50 border-purple-500/20 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Step 2B: Smart Outreach - AI Email Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">To: landlord@tampaproperties.com</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        ✓ Sent
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white">
                        Subject: Partnership Opportunity - Premium Short-Term Rental Management
                      </p>
                      <div className="text-xs text-gray-300 bg-slate-800/50 p-3 rounded border-l-4 border-purple-500">
                        <p className="mb-2">Hi Maria,</p>
                        <p className="mb-2">
                          I hope this email finds you well. I'm reaching out regarding your beautiful property at 110 Main Street in Tampa. 
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
            <Card className="bg-slate-800/50 border-cyan-500/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Step 3: Lead Conversion - CRM Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Converting leads to deals...</span>
                      <span className="text-cyan-400">{leadProgress}%</span>
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
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">{leadData.viewingsScheduled}</div>
                      <div className="text-sm text-gray-300">Viewings</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{leadData.dealsInProgress}</div>
                      <div className="text-sm text-gray-300">In Progress</div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">{leadData.closed}</div>
                      <div className="text-sm text-gray-300">Closed</div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-300 mb-3">Recent Activity</h4>
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
            <Card className="bg-slate-800/50 border-blue-500/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-blue-300 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Step 4: Deal Calculator - Property Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Property Header */}
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="font-semibold text-white mb-2">{calculatorData.property}</h4>
                    <div className="text-sm text-gray-300">2BR/2BA • 1400 sqft</div>
                  </div>

                  {/* Calculator Layout */}
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-blue-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Input Section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-300 text-center">Inputs</h4>
                        <div className="space-y-3">
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <label className="text-sm text-gray-300 block mb-1">Monthly Rent</label>
                            <div className="text-lg font-bold text-white">${calculatorData.rent.toLocaleString()}</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <label className="text-sm text-gray-300 block mb-1">STR Revenue</label>
                            <div className="text-lg font-bold text-cyan-400">${calculatorData.strRevenue.toLocaleString()}</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <label className="text-sm text-gray-300 block mb-1">Total Expenses</label>
                            <div className="text-lg font-bold text-purple-400">${calculatorData.expenses.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Calculator Display */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-cyan-300 text-center">Calculator</h4>
                        <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-cyan-500/30">
                          <div className="space-y-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-400 mb-1">REVENUE - EXPENSES</div>
                              <div className="text-2xl font-mono text-cyan-400">
                                ${calculatorData.strRevenue.toLocaleString()} - ${calculatorData.expenses.toLocaleString()}
                              </div>
                            </div>
                            <div className="border-t border-cyan-500/30 pt-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">NET PROFIT</div>
                                <div className="text-3xl font-bold text-cyan-300">
                                  ${calculatorData.netProfit.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400">per month</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Calculate
                          </Button>
                          <Button variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                            Clear
                          </Button>
                        </div>
                      </div>

                      {/* Results Section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-purple-300 text-center">Results</h4>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-3 border border-cyan-500/30">
                            <div className="text-sm text-gray-300 mb-1">Monthly Profit</div>
                            <div className="text-xl font-bold text-cyan-400">${calculatorData.netProfit}</div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3 border border-purple-500/30">
                            <div className="text-sm text-gray-300 mb-1">Annual ROI</div>
                            <div className="text-xl font-bold text-purple-400">{calculatorData.roi}</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                            <div className="text-sm text-gray-300 mb-1">Payback Period</div>
                            <div className="text-xl font-bold text-blue-400">{calculatorData.payback}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-8">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Approve Deal
                      </Button>
                    </div>
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
