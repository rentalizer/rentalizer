
// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { WelcomeSection } from '@/components/WelcomeSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // No automatic redirect - let users stay on dashboard if they want

  // Load Calendly script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Book demo function
  const handleBookDemo = () => {
    console.log('📅 Book Demo clicked - opening Calendly popup');
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    }
  };



  // If user is logged in, show welcome page with TopNavBar
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <TopNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">Welcome to Rentalizer!</h1>
              <p className="text-xl text-gray-300">
                You're logged in as <span className="text-cyan-400">{user.email}</span>
              </p>
              <p className="text-gray-400">
                Click on your email in the top navigation to complete your profile, or explore the platform below.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/community')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Training Hub</h3>
                  <p className="text-gray-400 text-sm">Live Training, Video & Document Library, Tools, Resources, Community</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/markets')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Market Intelligence</h3>
                  <p className="text-gray-400 text-sm">The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/properties')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Acquisition Agent</h3>
                  <p className="text-gray-400 text-sm">Automate Property Outreach, Close Deals, Calculate Profit, Robust CRM</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/pms')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">🫶</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Property Management</h3>
                  <p className="text-gray-400 text-sm">Automate Property Management, Operations & Cash Flow</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Complete Your Profile</h3>
                  <p className="text-gray-400 mb-4">
                    To get the most out of our community, complete your profile with your name, photo, and bio.
                  </p>
                  <Button 
                    onClick={() => navigate('/profile-setup')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <TopNavBar />
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md bg-slate-800/50 border-cyan-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Community Access</CardTitle>
          <p className="text-gray-400">Join our vibrant community of rental entrepreneurs</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/auth/signup')}
                variant="outline"
                className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                Sign Up
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              After signing up, you'll be guided to complete your profile to access all community features.
            </div>
          </div>
          
          {/* Book A Demo Button - Prominent placement */}
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <Button
              onClick={handleBookDemo}
              variant="outline"
              className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book A Demo
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Schedule a 1-on-1 demo call
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              After signing up, you'll be guided to complete your profile to access all community features.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
