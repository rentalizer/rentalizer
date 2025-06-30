
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const WelcomeSection = () => {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-4 mb-6">
        <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
        <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          RENTALIZER
        </h1>
      </div>
      <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
      
      <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white mb-12 max-w-7xl mx-auto leading-relaxed font-semibold whitespace-nowrap">
        The AI Platform to Launch and Scale Your Rental Income
      </p>
    </div>
  );
};
