
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const WelcomeSection = () => {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-4 mb-6">
        <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
        <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Rentalizer
        </div>
      </div>
      
      <div className="text-lg text-white font-medium mb-8">
      </div>
      
      <div className="mb-8 px-4">
        <div className="text-lg md:text-xl lg:text-2xl text-white max-w-5xl mx-auto leading-relaxed font-semibold">
          Find Rental Markets. Source Deals. Automate Cash Flow—All in One Place
        </div>
      </div>

      <div className="mb-12 px-4">
        <div className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Rentalizer is a complete training platform built to help you launch and grow a rental arbitrage business—an AI-powered system to support every step. Everything you need, all in one place.
        </div>
      </div>
    </div>
  );
};
