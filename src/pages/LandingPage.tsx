
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowRight, LogIn, ExternalLink } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started button clicked - navigating to demo page');
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
            
            {/* Tagline */}
            <p className="text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-semibold">
              AI System To Earn Rental Income—No Mortgage Needed
            </p>

            {/* Two Button Layout */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold min-w-[200px]"
              >
                <ArrowRight className="h-6 w-6 mr-3" />
                Get Started
              </Button>
              
              <LoginDialog 
                trigger={
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 px-12 py-6 text-xl font-semibold min-w-[200px]"
                  >
                    <LogIn className="h-6 w-6 mr-3" />
                    Login
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
