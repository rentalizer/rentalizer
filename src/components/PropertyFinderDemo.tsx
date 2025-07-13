import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  Target,
  ArrowRight,
  Lock,
  Crown,
  CheckCircle,
  Clock,
  DollarSign,
  Check,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const PropertyFinderDemo = () => {
  const { user } = useAuth();
  const [showPricing, setShowPricing] = useState(false);

  const mockProperties = [
    {
      address: "1247 Oak Street, Austin, TX",
      rent: "$2,800",
      strRevenue: "$8,200",
      profit: "$3,400",
      owner: "Sarah Johnson",
      contact: "sarah.j@email.com",
      status: "Contacted",
      lastContact: "2 days ago",
      response: "Interested"
    },
    {
      address: "892 Pine Avenue, Austin, TX",
      rent: "$3,200",
      strRevenue: "$9,100",
      profit: "$3,800",
      owner: "Michael Chen",
      contact: "m.chen@email.com",
      status: "Follow-up",
      lastContact: "5 days ago",
      response: "Pending"
    },
    {
      address: "1563 Maple Drive, Austin, TX",
      rent: "$2,500",
      strRevenue: "$7,800",
      profit: "$3,100",
      owner: "Lisa Rodriguez",
      contact: "lisa.r@email.com",
      status: "New Lead",
      lastContact: "Never",
      response: "Not contacted"
    }
  ];

  const mockEmailTemplates = [
    "Initial Outreach - Professional Introduction",
    "Follow-up - Value Proposition",
    "Meeting Request - In-Person Discussion",
    "Final Offer - Partnership Proposal"
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
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Building className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              Premium Add-On
            </Badge>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Property Finder (Acquisitions Agent)
          </h2>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
            Automate property outreach with AI-powered contact management, email campaigns, and deal tracking for rental arbitrage opportunities.
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
                  Unlock Property Finder to automate your deal sourcing and property outreach with AI-powered tools.
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
                  <p className="text-gray-300">Access Property Finder with our premium plans</p>
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
                        <span className="text-gray-300 font-semibold">+ Property Finder</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Market Finder</span>
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
            {/* Property Pipeline */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-400" />
                Active Property Pipeline - Austin, TX
              </h3>
              
              <div className="grid gap-4">
                {mockProperties.map((property, index) => (
                  <div key={index} className="bg-slate-600/50 p-4 rounded-lg border border-blue-500/20">
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Property Info */}
                      <div>
                        <div className="font-semibold text-white mb-2">{property.address}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Current Rent:</span>
                            <div className="text-cyan-400 font-semibold">{property.rent}/mo</div>
                          </div>
                          <div>
                            <span className="text-gray-400">STR Revenue:</span>
                            <div className="text-green-400 font-semibold">{property.strRevenue}/mo</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Est. Profit:</span>
                            <div className="text-green-400 font-semibold">{property.profit}/mo</div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Property Owner</div>
                        <div className="font-semibold text-white mb-2">{property.owner}</div>
                        <div className="text-sm text-gray-300">{property.contact}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          Last contact: {property.lastContact}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={`mb-2 ${
                              property.status === 'Contacted' ? 'border-green-500/50 text-green-400' :
                              property.status === 'Follow-up' ? 'border-yellow-500/50 text-yellow-400' :
                              'border-blue-500/50 text-blue-400'
                            }`}
                          >
                            {property.status}
                          </Badge>
                          <div className="text-sm text-gray-400">{property.response}</div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs border-green-500/30 text-green-300">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Email Campaign */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-purple-400" />
                AI Email Campaign Templates
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {mockEmailTemplates.map((template, index) => (
                  <div key={index} className="bg-slate-600/50 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{template}</span>
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                        AI Generated
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">
                      Personalized for rental arbitrage opportunities
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {Math.floor(Math.random() * 20) + 70}% Open Rate
                      </span>
                      <Button size="sm" variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-600/30 p-4 rounded-lg border border-blue-500/20">
                <Target className="h-8 w-8 text-blue-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Lead Generation</h4>
                <p className="text-gray-400 text-sm">AI identifies profitable properties and owner contacts</p>
              </div>
              
              <div className="bg-slate-600/30 p-4 rounded-lg border border-purple-500/20">
                <MessageSquare className="h-8 w-8 text-purple-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Automated Outreach</h4>
                <p className="text-gray-400 text-sm">Personalized email campaigns and follow-up sequences</p>
              </div>
              
              <div className="bg-slate-600/30 p-4 rounded-lg border border-green-500/20">
                <Calendar className="h-8 w-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-white mb-2">Deal Tracking</h4>
                <p className="text-gray-400 text-sm">Comprehensive CRM for managing your pipeline</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Automate Your Property Acquisitions?
          </h3>
          <p className="text-gray-300 mb-6">
            Join our All-In-One System plan to access Property Finder and scale your rental arbitrage business.
          </p>
          <Button
            onClick={() => setShowPricing(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg"
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