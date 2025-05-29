
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap, BarChart3, MapPin, Calculator, DollarSign, User, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';
import { SubscriptionPricing } from './SubscriptionPricing';

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const { user, isSubscribed } = useAuth();

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // TODO: Implement actual payment processing
  };

  const handleBookDemo = () => {
    window.open('https://calendly.com/richies-schedule/scale', '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-8 relative z-10 mt-20">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Rentalizer
                </h1>
                <p className="text-lg text-cyan-300/80 font-medium mt-2">By Richie Matthews</p>
              </div>
            </div>
            <p className="text-3xl text-cyan-100 mb-6 max-w-4xl mx-auto leading-tight">
              The All-In-One AI System To Earn Rental Income—No Mortgage Needed
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate <span className="text-cyan-400 font-semibold">$3,000-$8,000+</span> monthly from rental arbitrage using our AI-powered market intelligence and automation tools
            </p>
          </div>

          <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardContent className="space-y-8 pt-8">
              {/* Value Proposition */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Why Top Rental Arbitrage Investors Choose Rentalizer</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-800/30 border border-cyan-500/20 rounded-lg p-4">
                    <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <h4 className="text-green-300 font-semibold mb-2">Proven ROI</h4>
                    <p className="text-gray-300 text-sm">Average users see 200-400% ROI within their first 6 months</p>
                  </div>
                  <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg p-4">
                    <Zap className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <h4 className="text-purple-300 font-semibold mb-2">AI-Powered</h4>
                    <p className="text-gray-300 text-sm">Cut research time from weeks to hours with intelligent automation</p>
                  </div>
                  <div className="bg-gray-800/30 border border-blue-500/20 rounded-lg p-4">
                    <Star className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-blue-300 font-semibold mb-2">Complete System</h4>
                    <p className="text-gray-300 text-sm">Everything you need from market research to deal closing</p>
                  </div>
                </div>
              </div>

              {/* Features grid with benefits */}
              <div className="bg-gray-800/30 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-center text-cyan-300 mb-6">Complete Rental Arbitrage Arsenal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h5 className="text-cyan-300 font-semibold mb-2">Market Intelligence</h5>
                      <p className="text-gray-400 text-sm mb-2">Find profitable markets in seconds, not weeks</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Live Airbnb revenue data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Rent-to-revenue ratios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-semibold mb-2">Acquisitions Agent</h5>
                      <p className="text-gray-400 text-sm mb-2">Close deals faster with AI-powered outreach</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Pre-written scripts & sequences</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Automated follow-ups</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h5 className="text-cyan-300 font-semibold mb-2">Front Desk</h5>
                      <p className="text-gray-400 text-sm mb-2">Automate guest management & maximize profits</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Automated guest messaging</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Dynamic pricing optimization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Calculator className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-blue-300 font-semibold mb-2">Property Calculator</h5>
                      <p className="text-gray-400 text-sm mb-2">Analyze deals with precision & confidence</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>ROI & cash flow projections</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>Market comps analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-6 rounded-lg border border-gray-600/30">
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-cyan-300 mb-2">Join 2,000+ Successful Rental Arbitrage Investors</h4>
                  <div className="flex justify-center items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-gray-300 text-sm ml-2">4.9/5 Average Rating</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-800/40 p-3 rounded">
                    <div className="text-2xl font-bold text-green-400">$7M+</div>
                    <div className="text-xs text-gray-400">Revenue Generated</div>
                  </div>
                  <div className="bg-gray-800/40 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-400">15,000+</div>
                    <div className="text-xs text-gray-400">Properties Analyzed</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleBookDemo}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-4 text-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Book Your Demo Call
                  <TrendingUp className="h-5 w-5 ml-2" />
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  ⚡ Get a personalized demo • 🚀 See the system in action • 💎 Book your call now
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10 mt-20">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Rentalizer
                </h1>
                <p className="text-lg text-cyan-300/80 font-medium">By Richie Matthews</p>
              </div>
            </div>
            <p className="text-xl text-gray-300">
              Welcome {user.email}! Choose your plan to unlock your rental income potential.
            </p>
          </div>

          <SubscriptionPricing onUpgrade={handleUpgrade} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
