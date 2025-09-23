// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home, Brain, Target, MessageSquare, Calendar as CalendarIcon, Star, X, Video, FileText, Bot, LogOut } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { MarketIntelligenceDemo } from '@/components/MarketIntelligenceDemo';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';
import { AskRichieChat } from '@/components/AskRichieChat';
import { TrainingHubDemo } from '@/components/TrainingHubDemo';

const TestLanding = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Note: Removed automatic redirect to community - let users stay on landing page

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
    mainTitle: 'Rentalizer',
    byLine: '',
    tagline: 'All-In-One Platform To Launch, Automate, & Scale Rental Income—Powered By AI',
    description: 'Rentalizer combines AI powered market analysis, deal sourcing, property management software, and automation tools with a built-in CRM and thriving community—everything you need to launch, automate, and scale rental arbitrage income',
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
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-cyan-300 text-sm">
                    {user.email}
                  </span>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => navigate('/signup')}
                    variant="default"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3"
                  >
                    Sign Up
                  </Button>
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
                </div>
              )}
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
            
            <div className="mb-8 px-4">
              <div className="text-lg md:text-xl lg:text-2xl text-white max-w-5xl mx-auto leading-relaxed font-semibold">
                Find Rental Markets. Source Deals. Automate Cash Flow—All in One Place
              </div>
            </div>

            {/* New Description */}
            <div className="mb-12 px-4">
              <div className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Rentalizer is an AI-powered training platform built to help you launch and grow your rental arbitrage business.
              </div>
            </div>


          </div>

          {/* Animated Features Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1: Training Hub */}
              <div className="group relative" onClick={() => handleFeatureClick('community')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Training Hub
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Live Training, Video & Document Library, Tools, Resources, Community
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

              {/* Feature 2: Market Intelligence */}
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
                      Market Intelligence
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3: Acquisition Agent */}
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
                      Acquisition Agent
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Outreach, Close Deals, Calculate Profit, Robust CRM
                    </div>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-8 h-1 bg-purple-400 rounded animate-pulse"></div>
                      <div className="w-6 h-1 bg-cyan-400 rounded animate-pulse delay-200"></div>
                      <div className="w-10 h-1 bg-purple-300 rounded animate-pulse delay-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 4: Property Management */}
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
                      Property Management
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Management, Operations & Cash Flow
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-2 bg-cyan-400/50 rounded animate-pulse`} style={{animationDelay: `${i * 100}ms`}}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Recent Users Who've Unlocked Rental Income With Rentalizer
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Christopher Lee", text: "The market intelligence feature is a game-changer. It showed me exactly which neighborhoods to target and which to avoid. I closed 2 deals in my first month using their data." },
                { name: "Samantha Rodriguez", text: "The community aspect is incredible. Being able to connect with other rental arbitrage entrepreneurs and learn from their experiences has accelerated my learning curve tremendously." },
                { name: "David Chang", text: "The CRM and automation tools have saved me countless hours. What used to take me a full day of manual work now happens automatically. The ROI has been phenomenal." }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-slate-800/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                    <p className="text-cyan-300 font-medium">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Book Demo CTA Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-cyan-500/30">
              <CardContent className="p-12">
                <div className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Start Building Rental Income?
                </div>
                <div className="text-lg text-gray-300 mb-8">
                  Book a personalized demo and see how Rentalizer can accelerate your rental arbitrage journey.
                </div>
                <Button
                  onClick={handleBookDemo}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-4 text-lg"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Book Your Demo Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Dialog open={activeDemo !== null} onOpenChange={handleCloseDemo}>
        <DialogContent className="max-w-7xl h-[80vh] bg-slate-900 border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">
              {activeDemo === 'market' && 'Market Intelligence Demo'}
              {activeDemo === 'acquisition' && 'Acquisition CRM Demo'}
              {activeDemo === 'pms' && 'Property Management Demo'}
              {activeDemo === 'community' && 'Training Hub Demo'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDemo}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
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
              <TrainingHubDemo 
                currentStep={currentStep} 
                isRunning={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AskRichieChat />
      <Footer />
    </div>
  );
};

export default TestLanding;