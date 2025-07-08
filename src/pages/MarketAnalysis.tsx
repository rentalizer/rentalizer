
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, Home } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { SimulatedMarketIntelligence } from '@/components/SimulatedMarketIntelligence';
import { AccessGate } from '@/components/AccessGate';

const MarketAnalysis = () => {
  const navigate = useNavigate();
  
  const MarketContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      <TopNavBar />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex-1">
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

  return (
    <AccessGate title="Market Intelligence" subtitle="Access your account to continue">
      <MarketContent />
    </AccessGate>
  );
};

export default MarketAnalysis;
