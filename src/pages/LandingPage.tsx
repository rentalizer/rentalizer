
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started button clicked - navigating to demo page');
    navigate('/demo');
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`${feature} clicked - navigating to demo page for public users`);
    navigate('/demo');
  };

  // Add console log to verify what we're rendering
  console.log('Landing Page rendering - PMS should show: PMS, Property Management System Automates Operations');

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
            <nav className="flex items-center gap-6">
              <LoginDialog 
                trigger={
                  <Button 
                    variant="outline"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
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
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
            
            {/* Updated Tagline */}
            <p className="text-2xl md:text-3xl text-white mb-12 max-w-5xl mx-auto leading-relaxed font-semibold">
              AI-Powered Rental Arbitrage Training System, CRM & Community
            </p>

            {/* Single Button Layout */}
            <div className="flex justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold min-w-[200px]"
              >
                <ArrowRight className="h-6 w-6 mr-3" />
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid - Updated to 4 columns */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('Market Intelligence')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <MapPin className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Find The Best Rental Arbitrage Markets
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => handleFeatureClick('Market Intelligence')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Market Intelligence
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('Acquisition CRM')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Building className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Acquisition CRM & Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Property Outreach, Close Deals, Profit Calculator, Manage Relationships
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => handleFeatureClick('Acquisition CRM')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                Acquisition CRM & Calculator
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('PMS')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <DollarSign className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    PMS
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Property Management System Automates Operations
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => handleFeatureClick('PMS')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                PMS
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('Community')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Connect With Other Rental Arbitrage Investors
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => handleFeatureClick('Community')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with reduced top margin */}
      <Footer showLinks={false} />
    </div>
  );
};

export default LandingPage;
