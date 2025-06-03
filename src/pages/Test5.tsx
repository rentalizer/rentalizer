
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
  Play
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

const Test5 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (demoRunning) {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 17) {
            return 1; // Reset to beginning
          }
          return prev + 1;
        });
      }, 2000);

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
          return "bg-green-500";
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
          return "ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900";
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-4">
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

        {/* Progress Flow with Small Dots */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${getStepColor(step.id, step.category)} ${getStepBorder(step.id, step.category)}`}
                >
                  <span className="text-white text-xs font-bold">{step.id}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-4 h-0.5 bg-gray-600 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Display */}
          {demoRunning && (
            <div className="text-center mb-8">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  {React.createElement(steps[currentStep - 1]?.icon || Search, {
                    className: `h-8 w-8 ${
                      steps[currentStep - 1]?.category === 'market' ? 'text-cyan-400' :
                      steps[currentStep - 1]?.category === 'acquisition' ? 'text-purple-400' :
                      steps[currentStep - 1]?.category === 'pms' ? 'text-green-400' :
                      'text-orange-400'
                    }`
                  })}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {steps[currentStep - 1]?.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {steps[currentStep - 1]?.description}
                </p>
                <div className="mt-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    steps[currentStep - 1]?.category === 'market' ? 'bg-cyan-500/20 text-cyan-300' :
                    steps[currentStep - 1]?.category === 'acquisition' ? 'bg-purple-500/20 text-purple-300' :
                    steps[currentStep - 1]?.category === 'pms' ? 'bg-green-500/20 text-green-300' :
                    'bg-orange-500/20 text-orange-300'
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

        {/* Feature Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-300">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm text-center">
                Steps 1-3: AI-powered market analysis and location scoring
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-purple-300">Acquisition CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm text-center">
                Steps 4-11: Property search, outreach, and deal closure
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Home className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-green-300">Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm text-center">
                Steps 12-16: Listing management and guest operations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/30">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-orange-300">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm text-center">
                Step 17: Connect with fellow rental arbitrage investors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Results Preview - Only show when demo is running */}
        {demoRunning && (
          <Card className="bg-slate-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Live Results Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-300 mb-2">Market Score</h4>
                  <div className="text-3xl font-bold text-white">8.7/10</div>
                  <p className="text-sm text-gray-400">Austin, TX - Downtown</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">Properties Found</h4>
                  <div className="text-3xl font-bold text-white">47</div>
                  <p className="text-sm text-gray-400">Available for arbitrage</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-300 mb-2">Projected Profit</h4>
                  <div className="text-3xl font-bold text-white">$2,340</div>
                  <p className="text-sm text-gray-400">Monthly net income</p>
                </div>
              </div>

              {/* Mock Calculator Demo */}
              {(currentStep >= 7 && currentStep <= 8) && (
                <div className="mt-6 bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-4 text-center">Deal Analysis Calculator</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Monthly Rent Revenue</p>
                      <div className="text-xl font-bold text-green-300">$3,200</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Monthly Expenses</p>
                      <div className="text-xl font-bold text-red-300">$860</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Net Monthly Profit</p>
                      <div className="text-2xl font-bold text-cyan-300">$2,340</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Annual ROI</p>
                      <div className="text-2xl font-bold text-purple-300">420%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
