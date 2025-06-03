
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Test4 = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started button clicked - navigating to demo page');
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 w-full border-b border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-cyan-400 neon-text" />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <LoginDialog 
                trigger={
                  <Button 
                    variant="outline"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                }
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
            
            {/* Updated Tagline */}
            <p className="text-2xl md:text-3xl text-white mb-12 max-w-5xl mx-auto leading-relaxed font-semibold">
              AI-Powered Rental Arbitrage Training System, CRM & Community
            </p>

            {/* Single Button Layout */}
            <div className="flex justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold min-w-[200px]"
              >
                <ArrowRight className="h-6 w-6 mr-3" />
                Get Started
              </Button>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Rentalizer.ai combines powerful market analysis, deal sourcing, and automation tools with a built-in CRM and a thriving community—everything you need to launch and scale your rental arbitrage business.
            </p>
          </div>

          {/* Animated Presentation Section */}
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              {/* Large floating circles */}
              <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500"></div>
              
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
                      RENTALIZER
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer showLinks={false} />
    </div>
  );
};

export default Test4;
