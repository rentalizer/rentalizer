
import React from 'react';
import { Home, DollarSign, TrendingUp, MapPin } from 'lucide-react';

export const ThinAnimatedBanner = () => {
  return (
    <div className="relative h-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden border-b border-cyan-500/20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
      </div>
      
      {/* Moving geometric shapes */}
      <div className="absolute inset-0">
        {/* Floating dots */}
        <div className="absolute top-2 left-10 w-2 h-2 bg-cyan-400/40 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-6 left-20 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3 left-32 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce delay-500"></div>
        
        {/* Moving lines */}
        <div className="absolute top-4 left-0 w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/30 animate-pulse"></div>
        <div className="absolute top-8 left-16 w-12 h-px bg-gradient-to-r from-cyan-400/30 to-transparent animate-pulse delay-700"></div>
        <div className="absolute top-6 left-40 w-6 h-px bg-gradient-to-r from-transparent to-blue-400/30 animate-pulse delay-1000"></div>
        
        {/* Right side elements */}
        <div className="absolute top-2 right-10 w-2 h-2 bg-green-400/40 rounded-full animate-bounce delay-200"></div>
        <div className="absolute top-5 right-20 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce delay-400"></div>
        <div className="absolute top-8 right-32 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce delay-600"></div>
      </div>

      {/* Animated icons flowing across */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-8 animate-pulse">
          {/* House icon */}
          <div className="flex items-center space-x-1 opacity-60">
            <Home className="h-4 w-4 text-cyan-400 animate-pulse" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
          </div>
          
          {/* Dollar sign */}
          <div className="flex items-center space-x-1 opacity-70">
            <DollarSign className="h-4 w-4 text-green-400 animate-pulse delay-300" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-green-400/40 to-transparent"></div>
          </div>
          
          {/* Trending up */}
          <div className="flex items-center space-x-1 opacity-60">
            <TrendingUp className="h-4 w-4 text-blue-400 animate-pulse delay-600" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent"></div>
          </div>
          
          {/* Map pin */}
          <div className="flex items-center space-x-1 opacity-70">
            <MapPin className="h-4 w-4 text-purple-400 animate-pulse delay-900" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400/40 to-transparent"></div>
          </div>
          
          {/* House icon again to complete the cycle */}
          <div className="flex items-center space-x-1 opacity-50">
            <Home className="h-4 w-4 text-cyan-400 animate-pulse delay-1200" />
          </div>
        </div>
      </div>

      {/* Subtle animated border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/20"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-400/20"></div>
    </div>
  );
};
