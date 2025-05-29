
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, DollarSign, Calculator, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
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
                <BarChart3 className="h-12 w-12 text-cyan-400" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
              
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Login Required</h2>
                <p className="text-gray-300 mb-6">
                  Please log in to access your Rentalizer dashboard.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
                >
                  Go to Home Page
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Show subscription prompt for authenticated but non-subscribed users
  if (user && !isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <TopNavBar />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <BarChart3 className="h-12 w-12 text-cyan-400" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
              
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Subscription Required</h2>
                <p className="text-gray-300 mb-6">
                  You need an active subscription to access Rentalizer's powerful rental arbitrage tools.
                </p>
                <Button
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
                >
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main dashboard for authenticated and subscribed users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Clean Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
          </div>

          {/* Clean Features Grid with Action Buttons */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/markets')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <MapPin className="h-8 w-8 text-cyan-400" />
                  </div>
                  <CardTitle className="text-cyan-300 text-lg">
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
                onClick={() => navigate('/markets')}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Market Intelligence
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-blue-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/calculator')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Calculator className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-300 text-lg">
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
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-purple-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/deals')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <User className="h-8 w-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-purple-300 text-lg">
                    Acquisitions Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Contact Landlords & Close Deals
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/deals')}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Acquisitions Agent
              </Button>
            </div>

            <div className="flex flex-col">
              <Card 
                className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
                onClick={() => navigate('/front-desk')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <DollarSign className="h-8 w-8 text-cyan-400" />
                  </div>
                  <CardTitle className="text-cyan-300 text-lg">
                    Front Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-400 text-sm">
                    Property Management & Automations
                  </p>
                </CardContent>
              </Card>
              <Button
                onClick={() => navigate('/front-desk')}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Front Desk
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
