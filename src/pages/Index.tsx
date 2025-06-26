
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, Building, Users, Headphones, Calculator } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { LoginDialog } from '@/components/LoginDialog';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      // Show login dialog for non-authenticated users
      // The LoginDialog component will handle this
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <div className="text-cyan-300 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
            
            <p className="text-xs sm:text-xs md:text-xs lg:text-sm text-white mb-12 max-w-7xl mx-auto leading-relaxed font-semibold">
              All-in-One Platform to Launch and Scale a Rental Arbitrage Business
            </p>

            {/* Authentication Status */}
            {!user && (
              <div className="mb-8">
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-cyan-300 mb-4">Sign in to access all features</p>
                  <LoginDialog trigger={
                    <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white">
                      Sign In / Sign Up
                    </Button>
                  } />
                </div>
              </div>
            )}
          </div>

          {/* Features Grid - 5 cards in a row */}
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('/market-analysis')}
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
              {user ? (
                <Button
                  onClick={() => navigate('/market-analysis')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Market Intelligence
                </Button>
              ) : (
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <MapPin className="h-4 w-4 mr-2" />
                    Market Intelligence
                  </Button>
                } />
              )}
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('/calculator')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Calculator className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Calculate Property ROI & Profitability
                  </p>
                </CardContent>
              </Card>
              {user ? (
                <Button
                  onClick={() => navigate('/calculator')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator
                </Button>
              ) : (
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculator
                  </Button>
                } />
              )}
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('/acquisitions')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Building className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Acquisition CRM
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Contact Landlords & Close Deals
                  </p>
                </CardContent>
              </Card>
              {user ? (
                <Button
                  onClick={() => navigate('/acquisitions')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Acquisition CRM
                </Button>
              ) : (
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <Building className="h-4 w-4 mr-2" />
                    Acquisition CRM
                  </Button>
                } />
              )}
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('/pms')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Headphones className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Front Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Property Management & Automations
                  </p>
                </CardContent>
              </Card>
              {user ? (
                <Button
                  onClick={() => navigate('/pms')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Front Desk
                </Button>
              ) : (
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <Headphones className="h-4 w-4 mr-2" />
                    Front Desk
                  </Button>
                } />
              )}
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => handleFeatureClick('/community')}
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
              {user ? (
                <Button
                  onClick={() => navigate('/community')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Button>
              ) : (
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                } />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
