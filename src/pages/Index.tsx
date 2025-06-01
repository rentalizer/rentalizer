import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, Calculator, Building, Users, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { LoginDialog } from '@/components/LoginDialog';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, isSubscribed } = useAuth();
  const navigate = useNavigate();

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
                <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
              
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Login Required</h2>
                <p className="text-gray-300 mb-6">
                  Please log in to access your Rentalizer dashboard.
                </p>
                <LoginDialog trigger={
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white">
                    Login
                  </Button>
                } />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Content - Matching Home Page Layout */}
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
              AI-Powered Rental Arbitrage System, CRM & Community
            </p>
          </div>

          {/* Features Grid - Exact Match to Home Page */}
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/markets')}
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
                    Identify the most profitable rental markets in seconds.
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/markets')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Market Intelligence
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/calculator')}
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
                    Assess Property Profitability And ROI
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/calculator')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/deals')}
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
                    Property Outreach, Close Deals & Manage relationships with property owners seamlessly
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/deals')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                Acquisition CRM
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/front-desk')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Headphones className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Property Management System
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Automate Operations
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/front-desk')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Headphones className="h-4 w-4 mr-2" />
                Property Management System
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/community')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                    Supportive Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Learn from peers, share insights, and stay ahead of the curve
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/community')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Supportive Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with reduced top margin */}
      <Footer />
    </div>
  );
};

export default Index;
