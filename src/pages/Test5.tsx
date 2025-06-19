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
  Pin,
  Zap,
  Clock,
  Shield,
  Target,
  Crown,
  Eye,
  Layers,
  Activity
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
  
  // Typing simulation states
  const [typedCity, setTypedCity] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);

  // Mock data for market analysis demos
  const mockMarketData = [
    { submarket: "Hillcrest", strRevenue: 7076, medianRent: 3800, multiple: 1.86 },
    { submarket: "Little Italy", strRevenue: 7948, medianRent: 4500, multiple: 1.77 },
    { submarket: "Gaslamp Quarter", strRevenue: 7415, medianRent: 4200, multiple: 1.77 },
    { submarket: "Mission Valley", strRevenue: 0, medianRent: 3500, multiple: 0 },
    { submarket: "La Jolla", strRevenue: 0, medianRent: 4800, multiple: 0 },
    { submarket: "Pacific Beach", strRevenue: 0, medianRent: 4000, multiple: 0 }
  ];

  // Typing simulation effect
  useEffect(() => {
    if (currentStep === 1 && (demoRunning || manualMode)) {
      const cityText = "San Diego";
      let cityIndex = 0;
      
      // Reset states
      setTypedCity('');
      setSelectedBedrooms('');
      setSelectedBathrooms('');
      setButtonPressed(false);
      
      // Type city name
      const cityTimer = setInterval(() => {
        if (cityIndex < cityText.length) {
          setTypedCity(cityText.slice(0, cityIndex + 1));
          cityIndex++;
        } else {
          clearInterval(cityTimer);
          
          // After city typing, select bedrooms
          setTimeout(() => {
            setSelectedBedrooms('2');
            
            // Then select bathrooms
            setTimeout(() => {
              setSelectedBathrooms('2');
              
              // Finally press the button
              setTimeout(() => {
                setButtonPressed(true);
                
                // Reset button press after animation
                setTimeout(() => {
                  setButtonPressed(false);
                }, 200);
              }, 500);
            }, 500);
          }, 500);
        }
      }, 100);

      return () => clearInterval(cityTimer);
    }
  }, [currentStep, demoRunning, manualMode]);

  useEffect(() => {
    if (demoRunning && !manualMode) {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 18) {
            setDemoRunning(false);
            setManualMode(true);
            return 18;
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
    { id: 17, title: "Community Support", description: "Connect with other investors", icon: Users, category: "community" },
    { id: 18, title: "Get Started Today", description: "Join thousands of successful investors", icon: Star, category: "sales" }
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
          return "bg-cyan-500";
        case "sales":
          return "bg-gradient-to-r from-purple-500 to-blue-500";
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
          return "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900";
        case "sales":
          return "ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900";
        default:
          return "ring-2 ring-gray-400 ring-offset-2 ring-offset-slate-900";
      }
    }
    return "";
  };

  // Show amazing landing page when no demo is running
  if (!demoRunning && !manualMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TopNavBar />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              The Complete Rental Arbitrage System
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              From market research to property management - see how our AI-powered platform automates every step of building a profitable short-term rental business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button 
                onClick={handleRunDemo}
                size="lg"
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Live Demo
              </Button>
              <Button 
                onClick={() => setManualMode(true)}
                size="lg"
                variant="outline"
                className="px-12 py-6 text-xl font-bold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transform hover:scale-105 transition-all duration-300"
              >
                <Eye className="mr-3 h-6 w-6" />
                Explore Manually
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2">10,000+</div>
                <div className="text-gray-300">Active Investors</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">$50M+</div>
                <div className="text-gray-300">Properties Analyzed</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">23%</div>
                <div className="text-gray-300">Higher ROI vs Traditional</div>
              </div>
            </div>
          </div>

          {/* Feature Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Market Intelligence Preview */}
            <Card className="bg-gradient-to-br from-cyan-900/30 to-slate-800/50 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-300 flex items-center gap-3">
                  <Search className="h-8 w-8" />
                  AI Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Analyze any market in seconds with AI-powered research that identifies the most profitable neighborhoods for rental arbitrage.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold text-lg">$7,948</div>
                      <div className="text-gray-400">Avg STR Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold text-lg">1.77x</div>
                      <div className="text-gray-400">Revenue Multiple</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold text-lg">85%</div>
                      <div className="text-gray-400">Occupancy Rate</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>Little Italy, San Diego - Top performing submarket</span>
                </div>
              </CardContent>
            </Card>

            {/* Acquisitions CRM Preview */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-300 flex items-center gap-3">
                  <Building className="h-8 w-8" />
                  Smart Acquisitions CRM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Find and contact property owners with AI-generated personalized outreach campaigns that get results.
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">Downtown Loft - 2BR/2BA</div>
                        <div className="text-gray-400 text-sm">$3,200/month rent</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300">High ROI</Badge>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-2">AI-Generated Email:</div>
                    <div className="text-xs text-gray-400 italic">
                      "Hi Sarah, I noticed your beautiful property in Little Italy. I'm a professional rental operator..."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Management Preview */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center gap-3">
                  <Settings className="h-8 w-8" />
                  Automated Property Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Manage all your properties across Airbnb, VRBO, and Booking.com with unified calendars and automated guest messaging.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-3 text-center">
                    <div className="text-red-300 font-bold">Airbnb</div>
                    <div className="text-xs text-gray-400">24 bookings</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 text-center">
                    <div className="text-blue-300 font-bold">VRBO</div>
                    <div className="text-xs text-gray-400">15 bookings</div>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3 text-center">
                    <div className="text-purple-300 font-bold">Booking.com</div>
                    <div className="text-xs text-gray-400">8 bookings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Automated responses:</span>
                  <span className="text-blue-400 font-bold">98% guest satisfaction</span>
                </div>
              </CardContent>
            </Card>

            {/* Community & Support Preview */}
            <Card className="bg-gradient-to-br from-cyan-900/30 to-slate-800/50 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-300 flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Expert Community & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Join a thriving community of rental arbitrage experts with exclusive video library, live events, and 1-on-1 support.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Video className="h-4 w-4 text-cyan-400" />
                    <span className="text-gray-300">50+ Training Videos</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="text-gray-300">Weekly Live Q&A Sessions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span className="text-gray-300">Legal Document Templates</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Star className="h-4 w-4 text-cyan-400" />
                    <span className="text-gray-300">Expert Network Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Overview */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">Complete 18-Step Workflow</h2>
            <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${
                    step.category === 'market' ? 'bg-cyan-500' :
                    step.category === 'acquisition' ? 'bg-purple-500' :
                    step.category === 'pms' ? 'bg-blue-500' :
                    step.category === 'community' ? 'bg-cyan-500' :
                    'bg-purple-500'
                  }`}>
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-500 mx-1" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Category Labels */}
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                <span className="text-gray-300">Market Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-gray-300">Acquisitions CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-300">Property Management</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-12 border border-purple-500/30 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to See It All in Action?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the complete workflow that's helping thousands of investors build profitable rental arbitrage businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleRunDemo}
                size="lg"
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <Play className="mr-3 h-6 w-6" />
                Start Live Demo Now
              </Button>
              <Button 
                onClick={() => setManualMode(true)}
                size="lg"
                variant="outline"
                className="px-12 py-6 text-xl font-bold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transform hover:scale-105 transition-all duration-300"
              >
                <Settings className="mr-3 h-6 w-6" />
                Manual Exploration
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5-minute Demo</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Join 10,000+ Investors</span>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Live Demo: Complete Rental Arbitrage Workflow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
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
                      steps[currentStep - 1]?.category === 'sales' ? 'text-purple-400' :
                      'text-cyan-400'
                    }`
                  })}
                  <h3 className="text-xl font-bold text-white">
                    Step {currentStep}: {steps[currentStep - 1]?.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-3 whitespace-normal break-words">
                  {steps[currentStep - 1]?.description}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  steps[currentStep - 1]?.category === 'market' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  steps[currentStep - 1]?.category === 'acquisition' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  steps[currentStep - 1]?.category === 'pms' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  steps[currentStep - 1]?.category === 'sales' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {steps[currentStep - 1]?.category === 'market' ? 'Market Intelligence' :
                   steps[currentStep - 1]?.category === 'acquisition' ? 'Acquisition CRM' :
                   steps[currentStep - 1]?.category === 'pms' ? 'Property Management' :
                   steps[currentStep - 1]?.category === 'sales' ? 'Get Started' :
                   'Community'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step-Specific Visual Demonstrations */}
        {(demoRunning || manualMode) && (
          <div className="mb-12 space-y-8">
            {/* Step 1: Market Research - Search Field with Typing Animation */}
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
                    <div className="relative">
                      <Label htmlFor="target-city" className="text-sm font-medium text-gray-300">
                        Enter Target City
                      </Label>
                      <Input
                        id="target-city"
                        value={typedCity}
                        readOnly
                        className={`mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 transition-all duration-200 ${
                          typedCity ? 'border-cyan-500' : ''
                        }`}
                        placeholder="e.g., San Diego, Austin, Miami"
                      />
                      {typedCity && (
                        <div className="absolute right-3 top-9">
                          <div className="w-0.5 h-5 bg-cyan-400 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-300">Bedrooms</Label>
                        <Select value={selectedBedrooms} disabled>
                          <SelectTrigger className={`mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 transition-all duration-200 ${
                            selectedBedrooms ? 'border-cyan-500 ring-1 ring-cyan-500/20' : ''
                          }`}>
                            <SelectValue placeholder="Select bedrooms">
                              {selectedBedrooms ? `${selectedBedrooms} Bedrooms` : "Select bedrooms"}
                            </SelectValue>
                          </SelectTrigger>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-300">Bathrooms</Label>
                        <Select value={selectedBathrooms} disabled>
                          <SelectTrigger className={`mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 transition-all duration-200 ${
                            selectedBathrooms ? 'border-cyan-500 ring-1 ring-cyan-500/20' : ''
                          }`}>
                            <SelectValue placeholder="Select bathrooms">
                              {selectedBathrooms ? `${selectedBathrooms} Bathrooms` : "Select bathrooms"}
                            </SelectValue>
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 ${
                        buttonPressed ? 'scale-95 shadow-inner' : 'scale-100'
                      }`}
                      disabled={!typedCity || !selectedBedrooms || !selectedBathrooms}
                    >
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
              <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-cyan-400" />
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
                              <Pin className="h-3 w-3 text-purple-400" />
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
                    <Card className="bg-slate-700/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-cyan-400" />
                          <CardTitle className="text-lg text-cyan-300">Events</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm font-medium text-white mb-1">Weekly Q&A Session</div>
                            <div className="text-xs text-cyan-400">Today 7:00 PM EST</div>
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
                        <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                          View Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expert Network Section */}
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-cyan-500/20">
                    <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Expert Network
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          SC
                        </div>
                        <div>
                          <div className="text-white font-medium">Sarah Chen</div>
                          <div className="text-gray-400 text-sm">STR Expert • 47 properties</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-cyan-400" />
                            <span className="text-cyan-400 text-xs">4.9</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          MR
                        </div>
                        <div>
                          <div className="text-white font-medium">Mike Rodriguez</div>
                          <div className="text-gray-400 text-sm">Market Analyst • Austin specialist</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-cyan-400" />
                            <span className="text-cyan-400 text-xs">4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          LT
                        </div>
                        <div>
                          <div className="text-white font-medium">Lisa Thompson</div>
                          <div className="text-gray-400 text-sm">Legal Expert • Contract specialist</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-cyan-400" />
                            <span className="text-cyan-400 text-xs">5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sales Step (18) */}
            {currentStep === 18 && (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-purple-500/30 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-3xl bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Star className="h-8 w-8 text-purple-400" />
                    Ready to Start or Scale Your Rental Business?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Join 10,000+ Successful Rental Arbitrage Investors
                      </h3>
                      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        You've seen the complete workflow. Now it's time to put it into action and start building your rental empire with our AI-powered platform.
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-cyan-500/20 text-center">
                        <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast Setup</h4>
                        <p className="text-gray-400 text-sm">Get started in minutes, not weeks. Our AI handles the complex market analysis instantly.</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20 text-center">
                        <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-white mb-2">Precision Targeting</h4>
                        <p className="text-gray-400 text-sm">Find the most profitable properties with AI-driven market intelligence and scoring.</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20 text-center">
                        <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-white mb-2">Proven Results</h4>
                        <p className="text-gray-400 text-sm">Our users average 23% higher ROI compared to traditional methods.</p>
                      </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Market Insights + Calculator Plan */}
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-cyan-500/30 relative">
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-cyan-400 mb-2">Market Insights + Calculator</h4>
                          <div className="text-3xl font-bold text-white mb-1">$1,950<span className="text-lg text-gray-400">/month</span></div>
                          <p className="text-gray-400 text-sm">Perfect for getting started</p>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">Market Intelligence Tool</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">Property Calculator</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">Live Airbnb Revenue Data</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">ROI & Cash Flow Analysis</span>
                          </div>
                        </div>
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                          Get Started
                        </Button>
                      </div>

                      {/* All-In-One System Plan */}
                      <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-lg p-6 border border-purple-500/50 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-4 py-1">
                            MOST POPULAR
                          </Badge>
                        </div>
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-purple-400 mb-2">All-In-One System</h4>
                          <div className="text-3xl font-bold text-white mb-1">$2,950<span className="text-lg text-gray-400">/month</span></div>
                          <p className="text-gray-400 text-sm">Complete rental arbitrage solution</p>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="text-cyan-300 font-medium text-sm mb-3">Everything in Market Insights + Calculator, plus:</div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">Acquisitions Agent</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">Front Desk Management</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">AI-Powered Outreach</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">Automated Guest Management</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">Priority Support</span>
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold">
                          Get Started
                        </Button>
                      </div>
                    </div>

                    {/* Social Proof */}
                    <div className="bg-slate-800/30 rounded-lg p-6 border border-gray-700">
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Trusted by Industry Leaders</h4>
                        <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-cyan-400" />
                            <span>4.9/5 Average Rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-cyan-400" />
                            <span>10,000+ Active Users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-cyan-400" />
                            <span>$50M+ Properties Analyzed</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Testimonials */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 rounded p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              JS
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">Jessica Smith</div>
                              <div className="text-gray-400 text-xs">Real Estate Investor</div>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">"Increased my portfolio from 2 to 15 properties in just 8 months using this platform."</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              MD
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">Mark Davis</div>
                              <div className="text-gray-400 text-xs">STR Entrepreneur</div>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">"The AI market analysis saved me weeks of research and helped me find my most profitable deals."</p>
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
