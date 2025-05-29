
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, BarChart3, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';

const Pricing = () => {
  const { user } = useAuth();

  const handleBookDemo = () => {
    window.open('https://calendly.com/richies-schedule/scale', '_blank');
  };

  const handleGetStarted = () => {
    // Handle subscription logic here
    console.log('Get started clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />
      
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
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start your rental arbitrage journey with our AI-powered system
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Market Insights + Calculator Plan */}
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg relative">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <CardTitle className="text-2xl text-cyan-300">
                    Market Insights + Calculator
                  </CardTitle>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  $1,950<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">Perfect for getting started</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Market Intelligence Tool</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Property Calculator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Live Airbnb Revenue Data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">ROI & Cash Flow Analysis</span>
                  </div>
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                  size="lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* All-In-One System Plan */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-lg relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Most Popular
              </Badge>
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-purple-400" />
                  <CardTitle className="text-2xl text-purple-300">
                    All-In-One System
                  </CardTitle>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  $2,950<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">Complete rental arbitrage solution</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Everything in Market Insights + Calculator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Acquisitions Agent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Front Desk Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">AI-Powered Outreach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Automated Guest Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Priority Support</span>
                  </div>
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  size="lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-16">
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="flex justify-center items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-300 ml-2">4.9/5 Average Rating</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-300 mb-4">
                Join 2,000+ Successful Rental Arbitrage Investors
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/40 p-4 rounded">
                  <div className="text-2xl font-bold text-green-400">$7M+</div>
                  <div className="text-sm text-gray-400">Revenue Generated</div>
                </div>
                <div className="bg-gray-800/40 p-4 rounded">
                  <div className="text-2xl font-bold text-purple-400">15,000+</div>
                  <div className="text-sm text-gray-400">Properties Analyzed</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Rental Arbitrage Journey?
            </h3>
            <p className="text-gray-300 mb-8">
              Book a personalized demo to see the system in action
            </p>
            <Button
              onClick={handleBookDemo}
              size="lg"
              variant="outline"
              className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 px-12 py-4 text-xl"
            >
              Book Demo Call
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
