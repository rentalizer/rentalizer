import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  DollarSign,
  ArrowRight,
  Lock,
  Star,
  Crown,
  Check,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const MarketFinderDemo = () => {
  const { user } = useAuth();
  const [showPricing, setShowPricing] = useState(false);

  const mockMarketOpportunities = [
    { 
      market: "Austin, TX", 
      growth: "+28%", 
      roi: "34%", 
      deals: 127, 
      competition: "Low",
      avgRevenue: "$8,200",
      score: 9.2
    },
    { 
      market: "Nashville, TN", 
      growth: "+22%", 
      roi: "29%", 
      deals: 94, 
      competition: "Medium",
      avgRevenue: "$7,800",
      score: 8.8
    },
    { 
      market: "Tampa, FL", 
      growth: "+31%", 
      roi: "31%", 
      deals: 156, 
      competition: "Low",
      avgRevenue: "$7,650",
      score: 8.9
    },
    { 
      market: "Charlotte, NC", 
      growth: "+19%", 
      roi: "26%", 
      deals: 89, 
      competition: "Medium",
      avgRevenue: "$6,900",
      score: 8.3
    }
  ];

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      // Show login dialog if user is not authenticated
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.error('No active session');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan: plan,
          billing: 'monthly'
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        console.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
        {/* Premium Feature Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              Premium Add-On
            </Badge>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Market Finder
          </h2>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
            Discover high-potential rental markets nationwide with AI-powered analysis of growth trends, competition levels, and profit opportunities.
          </p>
        </div>

        {/* Demo Content */}
        <div className="bg-slate-700/30 rounded-lg p-6 mb-8 relative overflow-hidden">
          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
            {!showPricing ? (
              <div className="text-center p-8 bg-slate-800/90 rounded-xl border border-purple-500/30">
                <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-purple-300 mb-4">Premium Feature</h3>
                <p className="text-gray-300 mb-6 max-w-md">
                  Unlock Market Finder to discover profitable rental markets nationwide with our AI-powered analysis.
                </p>
                <Button
                  onClick={() => setShowPricing(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3"
                  size="lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            ) : (
              <div className="p-8 bg-slate-800/95 rounded-xl border border-purple-500/30 max-w-2xl w-full mx-4">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-purple-300 mb-2">Choose Your Plan</h3>
                  <p className="text-gray-300">Access Market Finder with our premium plans</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Market Insights + Calculator Plan */}
                  <div className="bg-slate-700/50 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-cyan-400" />
                      <h4 className="text-lg font-bold text-cyan-300">Market Insights + Calculator</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      $1,950<span className="text-sm text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Perfect for getting started</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Market Intelligence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Property Calculator</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Live Airbnb Revenue Data</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUpgrade('essentials')}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                      disabled={!user}
                    >
                      {user ? 'Get Started' : 'Login Required'}
                    </Button>
                  </div>

                  {/* All-In-One System Plan */}
                  <div className="bg-slate-700/50 border border-purple-500/20 rounded-lg p-4 relative">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                      Most Popular
                    </Badge>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-purple-400" />
                      <h4 className="text-lg font-bold text-purple-300">All-In-One System</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      $2,950<span className="text-sm text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Complete rental arbitrage solution</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Everything in Market Insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 font-semibold">+ Market Finder</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Acquisitions Agent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">AI-Powered Outreach</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUpgrade('complete')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                      disabled={!user}
                    >
                      {user ? 'Get Started' : 'Login Required'}
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowPricing(false)}
                    variant="outline"
                    className="border-gray-500/30 text-gray-400 hover:text-gray-300"
                  >
                    Back to Demo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Blurred Demo Content */}
          <div className="blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-orange-400" />
              Top Market Opportunities This Month
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {mockMarketOpportunities.map((market, index) => (
                <div key={index} className="bg-slate-600/50 p-4 rounded-lg border border-orange-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-400" />
                      <span className="font-semibold text-white">{market.market}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-bold">{market.score}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400">Growth Rate</div>
                      <div className="text-green-400 font-semibold">{market.growth}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg ROI</div>
                      <div className="text-green-400 font-semibold">{market.roi}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Active Deals</div>
                      <div className="text-cyan-400 font-semibold">{market.deals}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg Revenue</div>
                      <div className="text-cyan-400 font-semibold">{market.avgRevenue}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Competition:</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          market.competition === 'Low' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'
                        }`}
                      >
                        {market.competition}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-600/30 p-4 rounded-lg border border-orange-500/20">
                <TrendingUp className="h-8 w-8 text-orange-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Growth Analysis</h4>
                <p className="text-gray-400 text-sm">Track market growth trends and emerging opportunities</p>
              </div>
              
              <div className="bg-slate-600/30 p-4 rounded-lg border border-orange-500/20">
                <DollarSign className="h-8 w-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Profit Forecasting</h4>
                <p className="text-gray-400 text-sm">AI-powered revenue and ROI predictions</p>
              </div>
              
              <div className="bg-slate-600/30 p-4 rounded-lg border border-orange-500/20">
                <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Competition Scoring</h4>
                <p className="text-gray-400 text-sm">Analyze competition levels and market saturation</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Find Your Next Profitable Market?
          </h3>
          <p className="text-gray-300 mb-6">
            Join our All-In-One System plan to access Market Finder and discover untapped opportunities.
          </p>
          <Button
            onClick={() => setShowPricing(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 text-lg"
            size="lg"
          >
            View Pricing Plans
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};