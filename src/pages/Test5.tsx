import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Star
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { MapView } from '@/components/MapView';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';

const Test5 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [demoRunning, setDemoRunning] = useState(false);

  // Mock data for map demo
  const mockMarketData = [
    { submarket: "Downtown", strRevenue: 45000, medianRent: 2200, multiple: 3.41 },
    { submarket: "Midtown", strRevenue: 38000, medianRent: 1900, multiple: 3.33 },
    { submarket: "Riverside", strRevenue: 41000, medianRent: 2100, multiple: 3.25 },
    { submarket: "Tech District", strRevenue: 52000, medianRent: 2400, multiple: 3.61 },
    { submarket: "Arts Quarter", strRevenue: 35000, medianRent: 1700, multiple: 3.43 },
    { submarket: "University Area", strRevenue: 33000, medianRent: 1600, multiple: 3.44 },
    { submarket: "Historic Center", strRevenue: 39000, medianRent: 1850, multiple: 3.51 },
    { submarket: "Business Park", strRevenue: 44000, medianRent: 2050, multiple: 3.58 }
  ];

  // Mock properties for property search demo
  const mockProperties = [
    { address: "123 Main St, Austin, TX", rent: 2200, bedrooms: 2, bathrooms: 2, sqft: 1100 },
    { address: "456 Oak Ave, Austin, TX", rent: 1900, bedrooms: 2, bathrooms: 1, sqft: 950 },
    { address: "789 Pine Dr, Austin, TX", rent: 2400, bedrooms: 3, bathrooms: 2, sqft: 1300 }
  ];

  useEffect(() => {
    if (demoRunning) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [demoRunning]);

  useEffect(() => {
    if (demoRunning) {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 17) {
            return 1;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(stepTimer);
    }
  }, [demoRunning]);

  const handleRunDemo = () => {
    setDemoRunning(!demoRunning);
    if (!demoRunning) {
      setCurrentStep(1);
      setProgress(0);
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
    if (step === currentStep && demoRunning) {
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
          <Button 
            onClick={handleRunDemo}
            size="lg"
            className={`mb-8 px-8 py-4 text-lg font-semibold transition-all duration-300 ${
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
        </div>

        {/* Progress Flow with Numbered Steps (No Line) */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${getStepColor(step.id, step.category)} ${getStepBorder(step.id, step.category)}`}
              >
                <span className="text-white text-sm font-bold">{step.id}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {demoRunning && (
            <div className="mb-8">
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}

          {/* Current Step Display */}
          {demoRunning && (
            <div className="text-center mb-8">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6 max-w-md mx-auto transform transition-all duration-500 scale-105">
                <div className="flex items-center justify-center mb-4">
                  {React.createElement(steps[currentStep - 1]?.icon || Search, {
                    className: `h-12 w-12 ${
                      steps[currentStep - 1]?.category === 'market' ? 'text-cyan-400' :
                      steps[currentStep - 1]?.category === 'acquisition' ? 'text-purple-400' :
                      steps[currentStep - 1]?.category === 'pms' ? 'text-blue-400' :
                      'text-orange-400'
                    }`
                  })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {steps[currentStep - 1]?.description}
                </p>
                <div className="mt-4">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
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
            </div>
          )}
        </div>

        {/* Step-Specific Visual Demonstrations */}
        {demoRunning && (
          <div className="mb-12 space-y-8">
            {/* Market Analysis Steps (1-3) - Interactive Map */}
            {currentStep >= 1 && currentStep <= 3 && (
              <Card className="bg-slate-800/50 border-gray-700 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Live Market Analysis - Austin, TX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapView results={mockMarketData} city="Austin, TX" />
                </CardContent>
              </Card>
            )}

            {/* Acquisitions CRM Demo (Steps 4-11) */}
            {currentStep >= 4 && currentStep <= 11 && (
              <AcquisitionsCRMDemo currentStep={currentStep} isRunning={demoRunning} />
            )}

            {/* Property Management Steps (12-16) */}
            {currentStep >= 12 && currentStep <= 16 && (
              <PMSDemo currentStep={currentStep} isRunning={demoRunning} />
            )}
          </div>
        )}

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-4"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Test5;
