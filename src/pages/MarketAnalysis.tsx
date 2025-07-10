
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
  
  // Check if we're in Lovable environment
  const isLovableEnv = window.location.hostname.includes('lovableproject.com') || 
                       window.location.search.includes('__lovable_token') ||
                       window.location.hostname === 'localhost';
  
  const MarketContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      <TopNavBar />
      

      <div className="relative z-10 flex-1">
        <div className="w-full mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            
            <div className="flex items-center justify-center gap-6 mb-8 px-4">
              <BarChart3 className="h-16 w-16 text-cyan-400 flex-shrink-0" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Market Intelligence
              </h1>
            </div>
          </div>

          {/* Simulated Market Intelligence Component */}
          <SimulatedMarketIntelligence />
        </div>
      </div>
      
      <Footer />
    </div>
  );

  // If in Lovable environment, bypass authentication
  if (isLovableEnv) {
    return <MarketContent />;
  }

  return (
    <AccessGate title="Market Intelligence" subtitle="Access your account to continue">
      <MarketContent />
    </AccessGate>
  );
};

export default MarketAnalysis;
