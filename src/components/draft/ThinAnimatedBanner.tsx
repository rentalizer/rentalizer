
import React from 'react';
import { Home, DollarSign, TrendingUp, MapPin } from 'lucide-react';

export const ThinAnimatedBanner = () => {
  return (
    <div className="relative h-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-b border-cyan-500/20">
      {/* Large floating circles - scaled down for thin banner */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-1/4 w-2 h-2 bg-cyan-400/30 rotate-45 animate-bounce delay-200"></div>
        <div className="absolute top-4 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-blue-400/30 animate-bounce delay-1200"></div>
        <div className="absolute top-6 right-1/4 w-2.5 h-2.5 bg-green-400/30 rotate-12 animate-bounce delay-300"></div>
      </div>

      {/* Floating lines/bars */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-20 w-8 h-0.5 bg-gradient-to-r from-cyan-400/20 to-transparent animate-pulse delay-800"></div>
        <div className="absolute top-10 right-20 w-6 h-0.5 bg-gradient-to-l from-purple-400/20 to-transparent animate-pulse delay-400"></div>
        <div className="absolute top-6 right-40 w-10 h-0.5 bg-gradient-to-r from-blue-400/20 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Animated grid pattern - very subtle for thin banner */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-24 gap-1 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-cyan-400/10 animate-pulse" 
              style={{ animationDelay: `${i * 50}ms` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Animated icons flowing across - same as original but smaller */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-6 animate-pulse">
          {/* House icon */}
          <div className="flex items-center space-x-1 opacity-60">
            <Home className="h-3 w-3 text-cyan-400 animate-pulse" />
            <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
          </div>
          
          {/* Dollar sign */}
          <div className="flex items-center space-x-1 opacity-70">
            <DollarSign className="h-3 w-3 text-green-400 animate-pulse delay-300" />
            <div className="w-6 h-0.5 bg-gradient-to-r from-green-400/40 to-transparent"></div>
          </div>
          
          {/* Trending up */}
          <div className="flex items-center space-x-1 opacity-60">
            <TrendingUp className="h-3 w-3 text-blue-400 animate-pulse delay-600" />
            <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent"></div>
          </div>
          
          {/* Map pin */}
          <div className="flex items-center space-x-1 opacity-70">
            <MapPin className="h-3 w-3 text-purple-400 animate-pulse delay-900" />
            <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400/40 to-transparent"></div>
          </div>
          
          {/* House icon again to complete the cycle */}
          <div className="flex items-center space-x-1 opacity-50">
            <Home className="h-3 w-3 text-cyan-400 animate-pulse delay-1200" />
          </div>
        </div>
      </div>

      {/* Subtle animated border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      
      {/* Corner accents - same as original */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/20"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-400/20"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400/20"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400/20"></div>
    </div>
  );
};
