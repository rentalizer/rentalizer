
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const AnimatedBannerDraft = () => {
  console.log('AnimatedBannerDraft component is rendering');
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Test content to make sure it's visible */}
      <div className="absolute top-4 left-4 z-50 bg-red-500 text-white p-2 rounded">
        ANIMATION DRAFT PAGE - YOU CAN SEE THIS!
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 left-1/4 w-4 h-4 bg-cyan-400/30 rotate-45 animate-bounce delay-200"></div>
        <div className="absolute top-48 right-1/3 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-blue-400/30 animate-bounce delay-1200"></div>
        <div className="absolute top-64 right-1/4 w-5 h-5 bg-green-400/30 rotate-12 animate-bounce delay-300"></div>
        
        {/* Floating lines/bars */}
        <div className="absolute top-40 left-20 w-16 h-1 bg-gradient-to-r from-cyan-400/20 to-transparent animate-pulse delay-800"></div>
        <div className="absolute bottom-60 right-20 w-12 h-1 bg-gradient-to-l from-purple-400/20 to-transparent animate-pulse delay-400"></div>
        <div className="absolute top-80 right-40 w-20 h-1 bg-gradient-to-r from-blue-400/20 to-transparent animate-pulse delay-1000"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-cyan-400/10 animate-pulse" 
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Animated Logo */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <BarChart3 className="h-20 w-20 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/30 animate-spin"></div>
              <div className="absolute -inset-4 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            </div>
            <div className="relative">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rentalizer
              </h1>
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 transform scale-x-0 animate-pulse origin-left"></div>
            </div>
          </div>

          {/* Animated subtitle */}
          <div className="mb-8 space-y-4">
            <p className="text-xl text-cyan-300/80 font-medium animate-fade-in delay-500">
              By Richie Matthews
            </p>
            <p className="text-3xl text-cyan-100 animate-fade-in delay-700 leading-relaxed">
              The All-In-One AI System To Earn Rental Income—No Mortgage Needed
            </p>
          </div>

          {/* Animated feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { title: "Market Intelligence", delay: "delay-1000" },
              { title: "Profit Analysis", delay: "delay-1200" },
              { title: "ROI Calculator", delay: "delay-1400" }
            ].map((feature, index) => (
              <div key={index} className={`relative group animate-fade-in ${feature.delay}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-lg border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-all duration-300">
                  <h3 className="text-cyan-300 font-semibold text-lg">{feature.title}</h3>
                  <div className="mt-2 h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating action elements */}
          <div className="mt-16 flex justify-center space-x-8">
            <div className="relative">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 animate-bounce delay-1600">
                Get Started
              </button>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-30 animate-pulse"></div>
            </div>
            <div className="relative">
              <button className="px-8 py-4 border-2 border-cyan-500/30 text-cyan-300 rounded-lg font-semibold hover:bg-cyan-500/10 transition-all duration-300 animate-bounce delay-1800">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-400/30 animate-pulse"></div>
        <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-cyan-400/20 animate-pulse delay-500"></div>
        <div className="absolute top-12 left-12 w-12 h-12 border-l-2 border-t-2 border-cyan-400/10 animate-pulse delay-1000"></div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-purple-400/30 animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-purple-400/20 animate-pulse delay-500"></div>
        <div className="absolute bottom-12 right-12 w-12 h-12 border-r-2 border-b-2 border-purple-400/10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};
