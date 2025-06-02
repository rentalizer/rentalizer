
import React, { useState, useEffect } from 'react';
import { BarChart3, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Test4 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "RENTALIZER",
      subtitle: "AI-Powered Rental Arbitrage Training System, CRM & Community",
      description: "Everything you need to launch and scale your rental arbitrage business",
      icon: BarChart3,
      gradient: "from-cyan-400 via-blue-400 to-purple-400"
    },
    {
      title: "Market Intelligence",
      subtitle: "Find The Best Rental Arbitrage Markets",
      description: "AI analyzes thousands of data points to identify profitable markets with high rental demand and low competition",
      icon: MapPin,
      gradient: "from-blue-400 to-purple-500"
    },
    {
      title: "Acquisition CRM & Calculator",
      subtitle: "Property Outreach, Close Deals, Profit Calculator",
      description: "Manage relationships with property owners, calculate potential profits, and close deals faster",
      icon: Building,
      gradient: "from-purple-400 to-pink-500"
    },
    {
      title: "Property Management System",
      subtitle: "Automate Your Operations",
      description: "Streamline guest communication, maintenance requests, and revenue optimization with AI automation",
      icon: DollarSign,
      gradient: "from-green-400 to-cyan-500"
    },
    {
      title: "Community",
      subtitle: "Connect With Other Rental Arbitrage Investors",
      description: "Learn from successful investors, share strategies, and grow together in our thriving community",
      icon: Users,
      gradient: "from-orange-400 to-red-500"
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating icons */}
        <div className="absolute inset-0">
          <Home className="absolute top-32 left-20 h-6 w-6 text-cyan-400/30 animate-bounce" style={{ animationDelay: '0ms' }} />
          <Calculator className="absolute top-48 right-32 h-5 w-5 text-purple-400/30 animate-bounce" style={{ animationDelay: '500ms' }} />
          <TrendingUp className="absolute bottom-48 left-32 h-7 w-7 text-blue-400/30 animate-bounce" style={{ animationDelay: '1000ms' }} />
          <Search className="absolute top-64 right-48 h-4 w-4 text-green-400/30 animate-bounce" style={{ animationDelay: '1500ms' }} />
          <DollarSign className="absolute bottom-32 right-20 h-6 w-6 text-yellow-400/30 animate-bounce" style={{ animationDelay: '2000ms' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Slide Content */}
          <div className="text-center mb-16">
            {/* Animated Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full border-2 border-cyan-400/30 animate-spin"></div>
                <div className="absolute -inset-8 rounded-full border border-purple-400/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
                <IconComponent className={`h-24 w-24 text-transparent bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text animate-pulse relative z-10`} />
              </div>
            </div>

            {/* Title with gradient animation */}
            <h1 className={`text-6xl md:text-7xl font-bold bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent mb-6 animate-fade-in`}>
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl text-cyan-300 mb-8 animate-fade-in delay-300">
              {currentSlideData.subtitle}
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-500">
              {currentSlideData.description}
            </p>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-4 mb-12">
            {slides.map((slide, index) => {
              const SlideIcon = slide.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSlideClick(index)}
                  className={`p-4 rounded-full border-2 transition-all duration-300 ${
                    currentSlide === index
                      ? `border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25`
                      : 'border-gray-600 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                  }`}
                >
                  <SlideIcon className={`h-6 w-6 ${
                    currentSlide === index ? 'text-cyan-400' : 'text-gray-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-12">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Feature Flow Animation */}
          <div className="flex justify-center items-center gap-4 mb-16 opacity-60">
            <div className="flex items-center gap-2 animate-pulse">
              <MapPin className="h-5 w-5 text-blue-400" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 animate-pulse delay-200">
              <Building className="h-5 w-5 text-purple-400" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 animate-pulse delay-400">
              <DollarSign className="h-5 w-5 text-green-400" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 animate-pulse delay-600">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold animate-bounce delay-1000"
            >
              <ArrowRight className="h-6 w-6 mr-3" />
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-400/30 animate-pulse"></div>
        <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-cyan-400/20 animate-pulse delay-500"></div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-purple-400/30 animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-purple-400/20 animate-pulse delay-500"></div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 left-8 text-gray-400 text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Test4;
