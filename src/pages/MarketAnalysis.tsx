
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, Home } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { SimulatedMarketIntelligence } from '@/components/SimulatedMarketIntelligence';

const MarketAnalysis = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Check if we're in development environment
  const isDevelopment = () => {
    return window.location.hostname.includes('lovable.app') || 
           window.location.hostname.includes('localhost') ||
           window.location.hostname.includes('127.0.0.1');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show login gate if not authenticated and not in development
  if (!user && !isDevelopment()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TopNavBar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Login Gate Content */}
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="bg-slate-700/90 backdrop-blur-lg rounded-lg p-8 border border-gray-500/50">
              <BarChart3 className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Sign In
              </h1>
              <p className="text-gray-300 mb-6">
                Sign in to access the calculator
              </p>
              
              <LoginDialog 
                trigger={
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white">
                    Sign In
                  </Button>
                }
              />
              
              <div className="mt-6">
                <Button
                  variant="ghost"
                  className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                >
                  Create an Account
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center justify-center gap-6 mb-8 px-4">
              <BarChart3 className="h-16 w-16 text-cyan-400 flex-shrink-0" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Market Intelligence
              </h1>
            </div>
            <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Find The Best Rental Arbitrage Markets
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 px-4 py-2">
                <Home className="h-4 w-4 mr-1" />
                1BR - 3BR Apartments
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 px-4 py-2">
                Revenue/Rent Ratio
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300 px-4 py-2">
                Heat Map
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 border-green-500/30 text-green-300 px-4 py-2">
                Export Data
              </Badge>
            </div>
          </div>

          {/* Simulated Market Intelligence Component */}
          <SimulatedMarketIntelligence />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketAnalysis;
