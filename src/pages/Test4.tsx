
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Test4 = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetStarted = () => {
    console.log('Get Started button clicked - navigating to demo page');
    navigate('/demo');
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`${feature} clicked - navigating to demo page for public users`);
    navigate('/demo');
  };

  const slides = [
    {
      title: "Market Intelligence",
      subtitle: "Find The Best Rental Arbitrage Markets",
      description: "AI analyzes thousands of data points to identify profitable markets with high rental demand and low competition",
      icon: MapPin,
      gradient: "from-cyan-400 via-blue-400 to-purple-400",
      color: "text-cyan-400"
    },
    {
      title: "Acquisition CRM",
      subtitle: "Property Outreach, Close Deals, Profit Calculator",
      description: "Manage relationships with property owners, calculate potential profits, and close deals faster",
      icon: Building,
      gradient: "from-blue-400 to-purple-500",
      color: "text-blue-400"
    },
    {
      title: "Property Management",
      subtitle: "Automate Your Operations",
      description: "Streamline guest communication, maintenance requests, and revenue optimization with AI automation",
      icon: DollarSign,
      gradient: "from-purple-400 to-cyan-500",
      color: "text-purple-400"
    },
    {
      title: "Community",
      subtitle: "Connect With Other Rental Arbitrage Investors",
      description: "Learn from successful investors, share strategies, and grow together in our thriving community",
      icon: Users,
      gradient: "from-cyan-400 to-blue-500",
      color: "text-cyan-300"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

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

          {/* Animated Presentation Section */}
          <div className="mb-16 relative">
            {/* Main Content Container */}
            <div className="relative max-w-6xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  How Rentalizer Works
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
              </div>

              {/* Slide Content */}
              <div className="text-center mb-12">
                {/* Animated Icon with orbiting elements */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Orbiting rings */}
                    <div className="absolute -inset-8 border border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute -inset-12 border border-purple-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
                    <div className="absolute -inset-16 border border-blue-400/10 rounded-full animate-spin" style={{ animationDuration: '16s' }}></div>
                    
                    {/* Central icon */}
                    <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-cyan-400/30 flex items-center justify-center">
                      <IconComponent className={`h-16 w-16 ${currentSlideData.color} animate-pulse`} />
                    </div>
                  </div>
                </div>

                {/* Title with gradient animation */}
                <h3 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent mb-4 animate-fade-in`}>
                  {currentSlideData.title}
                </h3>

                {/* Subtitle */}
                <h4 className="text-xl md:text-2xl text-cyan-300 mb-6 animate-fade-in delay-300">
                  {currentSlideData.subtitle}
                </h4>

                {/* Description */}
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-500">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Interactive Slide Navigation */}
              <div className="flex justify-center gap-6 mb-8">
                {slides.map((slide, index) => {
                  const SlideIcon = slide.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSlideClick(index)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                        currentSlide === index
                          ? `border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25 scale-110`
                          : 'border-gray-600 hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:scale-105'
                      }`}
                    >
                      {/* Active indicator */}
                      {currentSlide === index && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl blur-sm"></div>
                      )}
                      
                      <div className="relative">
                        <SlideIcon className={`h-6 w-6 ${
                          currentSlide === index ? 'text-cyan-400' : 'text-gray-400'
                        } transition-colors duration-300`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-md">
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full transition-all duration-500 shadow-lg shadow-cyan-400/25"
                      style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Step {currentSlide + 1}</span>
                    <span>{slides.length} Steps</span>
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
