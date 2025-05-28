
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, TrendingUp, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPricingProps {
  onUpgrade: (promoCode?: string) => void;
}

export const SubscriptionPricing = ({ onUpgrade }: SubscriptionPricingProps) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);

  const basePrice = 950;
  const finalPrice = promoDiscount ? basePrice - (basePrice * promoDiscount / 100) : basePrice;

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    
    // Simulate promo code validation
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

  const handleUpgrade = () => {
    onUpgrade(promoCode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl border border-gradient-to-r from-cyan-500/20 to-purple-500/20 bg-gray-900/90 backdrop-blur-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <CardTitle className="text-3xl text-cyan-300">Professional Plan</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              {promoDiscount && promoDiscount < 100 && (
                <span className="text-2xl text-gray-500 line-through">${basePrice}</span>
              )}
              <span className="text-5xl font-bold text-white">
                ${promoDiscount === 100 ? 'FREE' : finalPrice.toLocaleString()}
              </span>
              {promoDiscount !== 100 && (
                <span className="text-xl text-gray-400">/month</span>
              )}
            </div>
            {promoDiscount && (
              <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                {promoDiscount}% OFF Applied!
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Promo Code Section */}
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-lg border border-gray-600/30">
            <Label htmlFor="promoCode" className="text-cyan-300 font-medium">
              Have a Promo Code?
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

          {/* Features List */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-300">What you get:</h4>
            <div className="grid gap-3">
              {[
                'Live professional STR data from AirDNA',
                'AI-powered rental market research',
                'Unlimited city analysis',
                'Revenue-to-rent multiple calculations',
                'Export capabilities (CSV)',
                'Priority support',
                'Advanced filtering options',
                'Market trend analysis'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-4 rounded-lg border border-green-500/30">
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
            size="lg"
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-4 text-lg font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Calculator className="h-5 w-5 mr-2" />
            {promoDiscount === 100 ? 'Start Free Trial' : 'Upgrade to Professional'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Cancel anytime. No long-term commitments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
