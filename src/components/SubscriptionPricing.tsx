
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, TrendingUp, Calculator, MapPin, User, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionPricingProps {
  onUpgrade?: (promoCode?: string) => void;
}

export const SubscriptionPricing = ({ onUpgrade }: SubscriptionPricingProps) => {
  const { toast } = useToast();
  const { upgradeSubscription } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'essentials' | 'complete'>('essentials');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Pricing configuration
  const pricing = {
    essentials: {
      monthly: 1950,
      yearly: 3950,
    },
    complete: {
      monthly: 2950,
      yearly: 5950,
    }
  };

  const currentPrice = pricing[selectedPlan][billingCycle];
  const finalPrice = promoDiscount ? currentPrice - (currentPrice * promoDiscount / 100) : currentPrice;

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    
    setTimeout(() => {
      const validPromoCodes = {
        'BETA50': 50,
        'EARLY25': 25,
        'LAUNCH30': 30,
        'RICHIE100': 100
      };
      
      const discount = validPromoCodes[promoCode.toUpperCase() as keyof typeof validPromoCodes];
      
      if (discount) {
        setPromoDiscount(discount);
        toast({
          title: "✅ Promo Code Applied!",
          description: `${discount}% discount applied to your subscription.`,
        });
      } else {
        setPromoDiscount(null);
        toast({
          title: "❌ Invalid Promo Code",
          description: "Please check your promo code and try again.",
          variant: "destructive",
        });
      }
      setIsValidatingPromo(false);
    }, 1000);
  };

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      await upgradeSubscription();
      toast({
        title: "Redirecting to Stripe...",
        description: "Opening payment page in a new tab.",
      });
      
      if (onUpgrade) {
        onUpgrade(promoCode);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800/50 p-1 rounded-lg flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-md transition-all ${
              billingCycle === 'monthly'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-md transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Yearly
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
              Save 50%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800/50 p-1 rounded-lg flex">
          <button
            onClick={() => setSelectedPlan('essentials')}
            className={`px-6 py-3 rounded-md transition-all ${
              selectedPlan === 'essentials'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Market Insights + Calculator
          </button>
          <button
            onClick={() => setSelectedPlan('complete')}
            className={`px-6 py-3 rounded-md transition-all ${
              selectedPlan === 'complete'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All-In-One System
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Market Insights + Calculator Plan */}
        <Card className={`shadow-2xl border bg-gray-900/90 backdrop-blur-lg ${
          selectedPlan === 'essentials' ? 'border-cyan-500/50 ring-2 ring-cyan-500/20' : 'border-gray-700/50'
        }`}>
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-2">
                <MapPin className="h-6 w-6 text-cyan-400" />
                <Calculator className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-cyan-300">Market Insights + Calculator</CardTitle>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                {selectedPlan === 'essentials' && promoDiscount && promoDiscount < 100 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${pricing.essentials[billingCycle].toLocaleString()}
                  </span>
                )}
                <span className="text-4xl font-bold text-white">
                  ${selectedPlan === 'essentials' && promoDiscount === 100 ? 'FREE' : 
                    selectedPlan === 'essentials' ? finalPrice.toLocaleString() : 
                    pricing.essentials[billingCycle].toLocaleString()}
                </span>
                <span className="text-lg text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {selectedPlan === 'essentials' && promoDiscount && (
                <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                  {promoDiscount}% OFF Applied!
                </Badge>
              )}
              {billingCycle === 'yearly' && (
                <div className="text-sm text-green-400">
                  Save ${(pricing.essentials.monthly * 12 - pricing.essentials.yearly).toLocaleString()} per year
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {[
                'Live Professional STR Data From AirDNA',
                'AI-Powered Rental Market Research',
                'Unlimited City Analysis',
                'Revenue-To-Rent Multiple Calculations',
                'Export Capabilities (CSV)',
                'Priority Support',
                'Advanced Filtering Options',
                'Market Trend Analysis',
                'Time & Money Savings'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All-In-One System Plan */}
        <Card className={`shadow-2xl border bg-gray-900/90 backdrop-blur-lg ${
          selectedPlan === 'complete' ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-gray-700/50'
        }`}>
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <CardTitle className="text-2xl text-purple-300">All-In-One System</CardTitle>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                {selectedPlan === 'complete' && promoDiscount && promoDiscount < 100 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${pricing.complete[billingCycle].toLocaleString()}
                  </span>
                )}
                <span className="text-4xl font-bold text-white">
                  ${selectedPlan === 'complete' && promoDiscount === 100 ? 'FREE' : 
                    selectedPlan === 'complete' ? finalPrice.toLocaleString() : 
                    pricing.complete[billingCycle].toLocaleString()}
                </span>
                <span className="text-lg text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {selectedPlan === 'complete' && promoDiscount && (
                <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                  {promoDiscount}% OFF Applied!
                </Badge>
              )}
              {billingCycle === 'yearly' && selectedPlan === 'complete' && (
                <div className="text-sm text-green-400">
                  Save ${(pricing.complete.monthly * 12 - pricing.complete.yearly).toLocaleString()} per year
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <MapPin className="h-4 w-4" />
                  <Calculator className="h-4 w-4" />
                </div>
                Everything in Market Insights + Calculator, plus:
              </div>
              {[
                'Acquisitions Agent - Contact Landlords & Close Deals',
                'Front Desk - Property Management & Automations',
                'AI-Powered Outreach Sequences',
                'Automated Guest Management',
                'Dynamic Pricing Optimization',
                'Complete Deal Pipeline Management',
                'Advanced Analytics & Reporting',
                'White-Glove Onboarding'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promo Code Section */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-lg border border-gray-600/30">
          <Label htmlFor="promoCode" className="text-cyan-300 font-medium">
            Have A Promo Code?
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="promoCode"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="bg-gray-800/50 border-gray-600 text-gray-100"
            />
            <Button
              onClick={validatePromoCode}
              disabled={!promoCode.trim() || isValidatingPromo}
              variant="outline"
              className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300"
            >
              {isValidatingPromo ? 'Checking...' : 'Apply'}
            </Button>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-4 rounded-lg border border-green-500/30 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h4 className="font-medium text-green-300">Time & Money Savings</h4>
          </div>
          <p className="text-sm text-green-200">
            Save weeks or months of manual research. Find cash-flowing rental arbitrage markets 
            in minutes instead of spending countless hours analyzing data manually.
          </p>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          size="lg"
          className={`w-full mt-6 py-4 text-lg font-medium shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            selectedPlan === 'essentials'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/25'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25'
          } text-white`}
        >
          {selectedPlan === 'essentials' ? (
            <>
              <MapPin className="h-5 w-5 mr-2" />
              <Calculator className="h-5 w-5 mr-2" />
            </>
          ) : (
            <Crown className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Processing...' : (promoDiscount === 100 ? 'Start Free Trial' : 
            `Upgrade to ${selectedPlan === 'essentials' ? 'Market Insights + Calculator' : 'All-In-One System'}`)}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Cancel anytime. No long-term commitments.
        </p>
      </div>
    </div>
  );
};
