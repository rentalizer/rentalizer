
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Building, 
  Calculator, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  MapPin,
  DollarSign,
  Home,
  Users,
  Phone,
  Mail,
  FileText,
  Settings,
  BarChart3,
  Play,
  TrendingUp,
  Star,
  Table2,
  Map,
  BookOpen,
  Video,
  Heart,
  Reply,
  Pin
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { MapView } from '@/components/MapView';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';
import { ResultsTable } from '@/components/ResultsTable';

const Test5 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [demoRunning, setDemoRunning] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Mock data for market analysis demos
  const mockMarketData = [
    { submarket: "Hillcrest", strRevenue: 7076, medianRent: 3800, multiple: 1.86 },
    { submarket: "Little Italy", strRevenue: 7948, medianRent: 4500, multiple: 1.77 },
    { submarket: "Gaslamp Quarter", strRevenue: 7415, medianRent: 4200, multiple: 1.77 },
    { submarket: "Mission Valley", strRevenue: 0, medianRent: 3500, multiple: 0 },
    { submarket: "La Jolla", strRevenue: 0, medianRent: 4800, multiple: 0 },
    { submarket: "Pacific Beach", strRevenue: 0, medianRent: 4000, multiple: 0 }
  ];

  useEffect(() => {
    if (demoRunning && !manualMode) {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 17) {
            setDemoRunning(false);
            setManualMode(true);
            return 17;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(stepTimer);
    }
  }, [demoRunning, manualMode]);

  const handleRunDemo = () => {
    if (demoRunning) {
      setDemoRunning(false);
      setManualMode(false);
    } else {
      setDemoRunning(true);
      setManualMode(false);
      setCurrentStep(1);
    }
  };

  const handleStepClick = (stepId) => {
    if (manualMode || !demoRunning) {
      setCurrentStep(stepId);
      if (!manualMode) {
        setManualMode(true);
        setDemoRunning(false);
      }
    }
  };

  const steps = [
    { id: 1, title: "Market Research", description: "AI analyzes rental markets", icon: Search, category: "market" },
    { id: 2, title: "Market Scoring", description: "Evaluates profitability metrics", icon: BarChart3, category: "market" },
    { id: 3, title: "Location Analysis", description: "Identifies best neighborhoods", icon: MapPin, category: "market" },
    { id: 4, title: "Property Search", description: "Finds available properties", icon: Building, category: "acquisition" },
    { id: 5, title: "Contact Generation", description: "AI creates personalized outreach", icon: MessageSquare, category: "acquisition" },
    { id: 6, title: "Email Campaigns", description: "Automated landlord outreach", icon: Mail, category: "acquisition" },
    { id: 7, title: "Deal Analysis", description: "Profit calculator assessment", icon: Calculator, category: "acquisition" },
    { id: 8, title: "ROI Calculation", description: "Detailed financial projections", icon: DollarSign, category: "acquisition" },
    { id: 9, title: "Negotiation Support", description: "AI-powered negotiation tips", icon: Phone, category: "acquisition" },
    { id: 10, title: "Contract Management", description: "Document templates & tracking", icon: FileText, category: "acquisition" },
    { id: 11, title: "Deal Closure", description: "Complete acquisition process", icon: CheckCircle2, category: "acquisition" },
    { id: 12, title: "Listing Creation", description: "Multi-platform property setup", icon: Home, category: "pms" },
    { id: 13, title: "Calendar Sync", description: "Unified booking management", icon: Calendar, category: "pms" },
    { id: 14, title: "Guest Messaging", description: "Automated communication", icon: MessageSquare, category: "pms" },
    { id: 15, title: "Check-in Automation", description: "Streamlined guest experience", icon: Settings, category: "pms" },
    { id: 16, title: "Performance Tracking", description: "Revenue & occupancy analytics", icon: BarChart3, category: "pms" },
    { id: 17, title: "Community Support", description: "Connect with other investors", icon: Users, category: "community" }
  ];

  const getStepColor = (step, category) => {
    if (step <= currentStep) {
      switch (category) {
        case "market":
          return "bg-cyan-500";
        case "acquisition":
          return "bg-purple-500";
        case "pms":
          return "bg-blue-500";
        case "community":
          return "bg-orange-500";
        default:
          return "bg-gray-500";
      }
    }
    return "bg-gray-700";
  };

  const getStepBorder = (step, category) => {
    if (step === currentStep && (demoRunning || manualMode)) {
      switch (category) {
        case "market":
          return "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900";
        case "acquisition":
          return "ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900";
        case "pms":
          return "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900";
        case "community":
          return "ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900";
        default:
          return "ring-2 ring-gray-400 ring-offset-2 ring-offset-slate-900";
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Live Demo: Complete Rental Arbitrage Workflow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Watch how Rentalizer.AI guides you through every step from market research to property management
          </p>
          
          {/* Run Demo Button */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={handleRunDemo}
              size="lg"
              className={`px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                demoRunning 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white'
              }`}
            >
              {demoRunning ? (
                <>
                  Stop Demo
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Run Live Demo
                  <Play className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            
            {(manualMode || !demoRunning) && (
              <Button 
                onClick={() => {
                  setManualMode(true);
                  setDemoRunning(false);
                }}
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              >
                Manual Demo
                <Settings className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Streamlined Progress Flow */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${getStepColor(step.id, step.category)} ${getStepBorder(step.id, step.category)} ${
                  manualMode || !demoRunning ? 'hover:scale-110' : ''
                }`}
              >
                <span className="text-white text-sm font-bold">{step.id}</span>
              </div>
            ))}
          </div>

          {/* Compact Current Step Display */}
          {(demoRunning || manualMode) && (
            <div className="text-center mb-6">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {React.createElement(steps[currentStep - 1]?.icon || Search, {
                    className: `h-6 w-6 ${
                      steps[currentStep - 1]?.category === 'market' ? 'text-cyan-400' :
                      steps[currentStep - 1]?.category === 'acquisition' ? 'text-purple-400' :
                      steps[currentStep - 1]?.category === 'pms' ? 'text-blue-400' :
                      'text-orange-400'
                    }`
                  })}
                  <h3 className="text-xl font-bold text-white">
                    Step {currentStep}: {steps[currentStep - 1]?.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {steps[currentStep - 1]?.description}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  steps[currentStep - 1]?.category === 'market' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  steps[currentStep - 1]?.category === 'acquisition' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  steps[currentStep - 1]?.category === 'pms' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}>
                  {steps[currentStep - 1]?.category === 'market' ? 'Market Intelligence' :
                   steps[currentStep - 1]?.category === 'acquisition' ? 'Acquisition CRM' :
                   steps[currentStep - 1]?.category === 'pms' ? 'Property Management' :
                   'Community'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step-Specific Visual Demonstrations */}
        {(demoRunning || manualMode) && (
          <div className="mb-12 space-y-8">
            {/* Step 1: Market Research - Search Field */}
            {currentStep === 1 && (
              <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Search className="h-6 w-6 text-cyan-400" />
                    Market Research Input
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <Label htmlFor="target-city" className="text-sm font-medium text-gray-300">
                        Enter Target City
                      </Label>
                      <Input
                        id="target-city"
                        value="San Diego"
                        readOnly
                        className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-300">Bedrooms</Label>
                        <Select value="2" disabled>
                          <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                            <SelectValue placeholder="2 Bedrooms" />
                          </SelectTrigger>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-300">Bathrooms</Label>
                        <Select value="2" disabled>
                          <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                            <SelectValue placeholder="2 Bathrooms" />
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Market
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Market Scoring - Table View */}
            {currentStep === 2 && (
              <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Table2 className="h-6 w-6 text-cyan-400" />
                    Market Scoring Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-hidden">
                    <ResultsTable 
                      results={mockMarketData} 
                      city="San Diego" 
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Location Analysis - Map View */}
            {currentStep === 3 && (
              <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Map className="h-6 w-6 text-cyan-400" />
                    Location Analysis - San Diego, CA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapView results={mockMarketData} city="San Diego, CA" />
                </CardContent>
              </Card>
            )}

            {/* Acquisitions CRM Demo (Steps 4-11) */}
            {currentStep >= 4 && currentStep <= 11 && (
              <AcquisitionsCRMDemo currentStep={currentStep} isRunning={demoRunning || manualMode} />
            )}

            {/* Property Management Steps (12-16) */}
            {currentStep >= 12 && currentStep <= 16 && (
              <PMSDemo currentStep={currentStep} isRunning={demoRunning || manualMode} />
            )}

            {/* Community Step (17) */}
            {currentStep === 17 && (
              <Card className="bg-slate-800/50 border-orange-500/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-orange-400" />
                    Community Hub - Connect & Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Discussion Threads */}
                    <Card className="bg-slate-700/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-cyan-400" />
                          <CardTitle className="text-lg text-cyan-300">Discussion Threads</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            RM
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Pin className="h-3 w-3 text-yellow-400" />
                              <span className="text-sm font-medium text-white truncate">Welcome to the Community!</span>
                            </div>
                            <div className="text-xs text-gray-400">Richie Matthews • 2h ago</div>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                              <span className="text-gray-400 flex items-center gap-1">
                                <Reply className="h-3 w-3" />
                                23
                              </span>
                              <span className="text-gray-400 flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                45
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            SJ
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-white truncate block">Best practices for market research?</span>
                            <div className="text-xs text-gray-400">Sarah Johnson • 4h ago</div>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                              <span className="text-gray-400 flex items-center gap-1">
                                <Reply className="h-3 w-3" />
                                12
                              </span>
                              <span className="text-gray-400 flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                18
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                          View All Threads
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Video Library */}
                    <Card className="bg-slate-700/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-purple-400" />
                          <CardTitle className="text-lg text-purple-300">Video Library</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Market Analysis Masterclass</div>
                            <div className="text-xs text-gray-400">45 min • Beginner</div>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Negotiation Strategies</div>
                            <div className="text-xs text-gray-400">32 min • Intermediate</div>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Setting Up Your First Property</div>
                            <div className="text-xs text-gray-400">28 min • Beginner</div>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          Browse Videos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documents Library */}
                    <Card className="bg-slate-700/50 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                          <CardTitle className="text-lg text-blue-300">Documents</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">Lease Agreement Template</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                            <FileText className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm text-white">Market Research Checklist</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                            <FileText className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-white">Expense Tracking Sheet</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View Library
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Community Calendar */}
                    <Card className="bg-slate-700/50 border-orange-500/20 hover:border-orange-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-orange-400" />
                          <CardTitle className="text-lg text-orange-300">Events</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Weekly Q&A Session</div>
                            <div className="text-xs text-orange-400">Today 7:00 PM EST</div>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Market Analysis Workshop</div>
                            <div className="text-xs text-gray-400">Dec 15 • 2:00 PM EST</div>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Success Stories Meetup</div>
                            <div className="text-xs text-gray-400">Dec 22 • 6:00 PM EST</div>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                          View Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expert Network Section */}
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-orange-500/20">
                    <h4 className="font-semibold text-orange-300 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Expert Network
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          SC
                        </div>
                        <div>
                          <div className="text-white font-medium">Sarah Chen</div>
                          <div className="text-gray-400 text-sm">STR Expert • 47 properties</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">4.9</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          MR
                        </div>
                        <div>
                          <div className="text-white font-medium">Mike Rodriguez</div>
                          <div className="text-gray-400 text-sm">Market Analyst • Austin specialist</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          LT
                        </div>
                        <div>
                          <div className="text-white font-medium">Lisa Thompson</div>
                          <div className="text-gray-400 text-sm">Legal Expert • Contract specialist</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Test5;
