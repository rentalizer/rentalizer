import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home, Brain, Target, MessageSquare, Calendar, Star, X } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { MarketIntelligenceDemo } from '@/components/MarketIntelligenceDemo';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';
import { CommunityDemo } from '@/components/CommunityDemo';

const TestHome = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Auto-progression through demo steps
  useEffect(() => {
    if (activeDemo) {
      const stepRanges = {
        'market': { start: 1, end: 3, duration: 3000 },
        'acquisition': { start: 4, end: 11, duration: 2500 },
        'pms': { start: 12, end: 16, duration: 2000 },
        'community': { start: 17, end: 17, duration: 5000 }
      };

      const config = stepRanges[activeDemo];
      if (config) {
        const timer = setInterval(() => {
          setCurrentStep(prevStep => {
            if (prevStep >= config.end) {
              return config.start; // Loop back to start
            }
            return prevStep + 1;
          });
        }, config.duration);

        return () => clearInterval(timer);
      }
    }
  }, [activeDemo]);

  // Static text content from the actual landing page
  const texts = {
    mainTitle: 'RENTALIZER',
    byLine: '',
    tagline: 'All-In-One Platform To Launch, Automate, & Scale Rental Income—Powered By AI',
    description: 'RENTALIZER Combines AI Powered Market Analysis, Deal Sourcing, Property Management Software, And Automation Tools With A Built-In CRM And Thriving Community—Everything You Need To Launch, Automate, And Scale Rental Arbitrage Income',
    buttonText: 'Book Demo',
    feature1Title: 'Market Intelligence',
    feature1Description: 'The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets',
    feature2Title: 'Acquisition CRM & Calculator',
    feature2Description: 'Property Outreach, Close Deals, Profit Calculator, Manage Relationships',
    feature3Title: 'PMS',
    feature3Description: 'Streamline Property Management And Automate Operations',
    feature4Title: 'Community',
    feature4Description: 'Join Our Network Of Rental Arbitrage Entrepreneurs'
  };

  const handleFeatureClick = (feature: string) => {
    setActiveDemo(feature);
    // Reset to appropriate starting step for each demo
    if (feature === 'market') {
      setCurrentStep(1);
    } else if (feature === 'acquisition') {
      setCurrentStep(4);
    } else if (feature === 'pms') {
      setCurrentStep(12);
    } else if (feature === 'community') {
      setCurrentStep(17);
    }
  };

  const handleCloseDemo = () => {
    setActiveDemo(null);
    setCurrentStep(1);
  };

  const handleBookDemo = () => {
    console.log('Book Demo button clicked - opening Calendly popup');
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    }
  };

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 w-full border-b border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-cyan-400 neon-text" />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <LoginDialog 
                trigger={
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 px-6 py-3"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                }
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
              <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {texts.mainTitle}
              </div>
            </div>
            
            <div className="text-lg text-white font-medium mb-8">
              {texts.byLine}
            </div>
            
            {/* Updated Tagline */}
            <div className="mb-12 px-4">
              <div className="text-lg md:text-xl lg:text-2xl text-white max-w-5xl mx-auto leading-relaxed font-semibold">
                All-In-One Platform To Launch, Automate, & Scale Rental Income—<br />
                Powered By AI
              </div>
            </div>

            {/* Single Button Layout */}
            <div className="flex justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleBookDemo}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold min-w-[200px]"
              >
                <Calendar className="h-6 w-6 mr-3" />
                <span className="inline">
                  {texts.buttonText}
                </span>
              </Button>
            </div>
          </div>

          {/* Animated Features Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1: Market Intelligence */}
              <div className="group relative" onClick={() => handleFeatureClick('market')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      {texts.feature1Title}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {texts.feature1Description}
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 2: Acquisition CRM & Calculator */}
              <div className="group relative" onClick={() => handleFeatureClick('acquisition')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Calculator className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      {texts.feature2Title}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {texts.feature2Description}
                    </div>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-8 h-1 bg-purple-400 rounded animate-pulse"></div>
                      <div className="w-6 h-1 bg-cyan-400 rounded animate-pulse delay-200"></div>
                      <div className="w-10 h-1 bg-purple-300 rounded animate-pulse delay-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3: PMS */}
              <div className="group relative" onClick={() => handleFeatureClick('pms')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      {texts.feature3Title}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {texts.feature3Description}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-2 bg-cyan-400/50 rounded animate-pulse`} style={{animationDelay: `${i * 100}ms`}}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 4: Community */}
              <div className="group relative" onClick={() => handleFeatureClick('community')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <MessageSquare className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      {texts.feature4Title}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {texts.feature4Description}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full border-2 border-slate-800 animate-pulse`} style={{animationDelay: `${i * 150}ms`}}></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center mb-16">
            <div className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {texts.description}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Dialog open={!!activeDemo} onOpenChange={() => handleCloseDemo()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {activeDemo === 'market' && 'Market Intelligence Demo'}
              {activeDemo === 'acquisition' && 'Acquisition CRM Demo'}
              {activeDemo === 'pms' && 'Property Management Demo'}
              {activeDemo === 'community' && 'Community Demo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Demo Content */}
            {activeDemo === 'market' && (
              <MarketIntelligenceDemo 
                currentStep={currentStep} 
                isRunning={true}
                onStepChange={setCurrentStep}
              />
            )}
            
            {activeDemo === 'acquisition' && (
              <AcquisitionsCRMDemo 
                currentStep={currentStep}
                isRunning={true}
              />
            )}
            
            {activeDemo === 'pms' && (
              <PMSDemo 
                currentStep={currentStep}
                isRunning={true}
              />
            )}
            
            {activeDemo === 'community' && (
              <CommunityDemo 
                currentStep={currentStep}
                isRunning={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer showLinks={false} />
    </div>
  );
};

export default TestHome;