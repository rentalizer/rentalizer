
import React from 'react';
import { Home, DollarSign, TrendingUp, MapPin, BarChart3, Calculator, Building, Search } from 'lucide-react';

export const ThinAnimatedBanner = () => {
  return (
    <div className="relative h-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-b border-cyan-500/20">
      {/* Large floating circles - scaled down for thin banner */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Animated grid pattern - more prominent */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-32 grid-rows-4 gap-0.5 h-full w-full">
          {Array.from({ length: 128 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-cyan-400/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 animate-pulse" 
              style={{ 
                animationDelay: `${i * 30}ms`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating platform icons */}
      <div className="absolute inset-0">
        {/* Home/Property icons */}
        <div className="absolute top-2 left-8 opacity-60">
          <Home className="h-4 w-4 text-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        </div>
        <div className="absolute top-8 left-20 opacity-50">
          <Building className="h-3 w-3 text-purple-400 animate-bounce" style={{ animationDelay: '200ms' }} />
        </div>
        <div className="absolute top-4 left-32 opacity-70">
          <Home className="h-3.5 w-3.5 text-blue-400 animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
        
        {/* Financial icons */}
        <div className="absolute top-6 left-44 opacity-60">
          <DollarSign className="h-4 w-4 text-green-400 animate-bounce" style={{ animationDelay: '600ms' }} />
        </div>
        <div className="absolute top-2 left-56 opacity-50">
          <Calculator className="h-3 w-3 text-cyan-400 animate-bounce" style={{ animationDelay: '800ms' }} />
        </div>
        
        {/* Analytics icons */}
        <div className="absolute top-10 left-68 opacity-70">
          <TrendingUp className="h-3.5 w-3.5 text-blue-400 animate-bounce" style={{ animationDelay: '1000ms' }} />
        </div>
        <div className="absolute top-4 left-80 opacity-60">
          <BarChart3 className="h-4 w-4 text-purple-400 animate-bounce" style={{ animationDelay: '1200ms' }} />
        </div>
        
        {/* Location icons */}
        <div className="absolute top-8 right-32 opacity-50">
          <MapPin className="h-3 w-3 text-purple-400 animate-bounce" style={{ animationDelay: '1400ms' }} />
        </div>
        <div className="absolute top-2 right-20 opacity-70">
          <Search className="h-3.5 w-3.5 text-cyan-400 animate-bounce" style={{ animationDelay: '1600ms' }} />
        </div>
        <div className="absolute top-6 right-8 opacity-60">
          <MapPin className="h-4 w-4 text-blue-400 animate-bounce" style={{ animationDelay: '1800ms' }} />
        </div>
      </div>

      {/* Floating geometric shapes with platform colors */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-1/4 w-2 h-2 bg-cyan-400/30 rotate-45 animate-bounce delay-200"></div>
        <div className="absolute top-4 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-blue-400/30 animate-bounce delay-1200"></div>
        <div className="absolute top-6 right-1/4 w-2.5 h-2.5 bg-green-400/30 rotate-12 animate-bounce delay-300"></div>
        <div className="absolute top-10 left-1/5 w-2 h-2 bg-purple-500/40 animate-bounce delay-900"></div>
        <div className="absolute top-3 right-1/5 w-1.5 h-1.5 bg-cyan-500/40 rotate-45 animate-bounce delay-1100"></div>
      </div>

      {/* Floating lines/bars with platform theme */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-20 w-8 h-0.5 bg-gradient-to-r from-cyan-400/30 to-purple-400/20 animate-pulse delay-800"></div>
        <div className="absolute top-10 right-20 w-6 h-0.5 bg-gradient-to-l from-purple-400/30 to-blue-400/20 animate-pulse delay-400"></div>
        <div className="absolute top-6 right-40 w-10 h-0.5 bg-gradient-to-r from-blue-400/30 to-cyan-400/20 animate-pulse delay-1000"></div>
        <div className="absolute top-4 left-60 w-7 h-0.5 bg-gradient-to-r from-purple-500/30 to-transparent animate-pulse delay-1300"></div>
      </div>

      {/* Animated icons flowing across - enhanced for platform representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-4 animate-pulse">
          {/* Property Analysis Flow */}
          <div className="flex items-center space-x-1 opacity-60">
            <Home className="h-3 w-3 text-cyan-400 animate-pulse" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
          </div>
          
          {/* Financial Calculation */}
          <div className="flex items-center space-x-1 opacity-70">
            <Calculator className="h-3 w-3 text-purple-400 animate-pulse delay-200" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400/40 to-transparent"></div>
          </div>
          
          {/* Market Analysis */}
          <div className="flex items-center space-x-1 opacity-60">
            <BarChart3 className="h-3 w-3 text-blue-400 animate-pulse delay-400" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent"></div>
          </div>
          
          {/* Profit Generation */}
          <div className="flex items-center space-x-1 opacity-70">
            <DollarSign className="h-3 w-3 text-green-400 animate-pulse delay-600" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-green-400/40 to-transparent"></div>
          </div>
          
          {/* Location Intelligence */}
          <div className="flex items-center space-x-1 opacity-60">
            <MapPin className="h-3 w-3 text-purple-400 animate-pulse delay-800" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400/40 to-transparent"></div>
          </div>
          
          {/* Growth Tracking */}
          <div className="flex items-center space-x-1 opacity-70">
            <TrendingUp className="h-3 w-3 text-cyan-400 animate-pulse delay-1000" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
          </div>
          
          {/* Complete cycle back to properties */}
          <div className="flex items-center space-x-1 opacity-50">
            <Building className="h-3 w-3 text-blue-400 animate-pulse delay-1200" />
          </div>
        </div>
      </div>

      {/* Enhanced animated border with platform colors */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 via-purple-500/30 to-transparent animate-pulse"></div>
      
      {/* Corner accents - platform themed */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-400/30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-blue-400/30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400/30"></div>
      
      {/* Additional floating elements for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-5 left-16 w-1 h-1 bg-cyan-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-9 right-24 w-1 h-1 bg-purple-400/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-7 left-48 w-1 h-1 bg-blue-400/50 rounded-full animate-ping delay-1000"></div>
      </div>
    </div>
  );
};
