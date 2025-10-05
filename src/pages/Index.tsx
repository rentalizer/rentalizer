
// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { WelcomeSection } from '@/components/WelcomeSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Users, Brain, Calculator, Target } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">
              {/* Training Hub Card */}
              <div className="group relative" onClick={() => navigate('/community')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Training Hub
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Live Training, Video & Document Library, Tools, Resources, Community
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full border-2 border-slate-800 animate-pulse`} style={{animationDelay: `${i * 150}ms`}}></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Market Intelligence Card */}
              <div className="group relative" onClick={() => navigate('/markets')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      Market Intelligence
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Acquisition Agent Card */}
              <div className="group relative" onClick={() => navigate('/properties')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Calculator className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Acquisition Agent
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Outreach, Close Deals, Calculate Profit, Robust CRM
                    </div>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-8 h-1 bg-purple-400 rounded animate-pulse"></div>
                      <div className="w-6 h-1 bg-cyan-400 rounded animate-pulse delay-200"></div>
                      <div className="w-10 h-1 bg-purple-300 rounded animate-pulse delay-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Management Card */}
              <div className="group relative" onClick={() => navigate('/pms')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      Property Management
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Management, Operations & Cash Flow
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-2 bg-cyan-400/50 rounded animate-pulse`} style={{animationDelay: `${i * 100}ms`}}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {(!profileLoading && (!profile?.bio || !profile?.avatar_url)) && (
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
            )}
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
