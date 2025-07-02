import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalculatorIcon, ArrowLeft, RotateCcw, Download, LogIn, User, Lock, UserPlus, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

const CalculatorTestGate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const initialData = {
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    averageComparable: 0,
    firstMonthRent: 0,
    securityDeposit: 0,
    furnishingsCost: 0,
    rent: 0,
    serviceFees: 0,
    maintenance: 0,
    power: 0,
    waterSewer: 0,
    internet: 0,
    taxLicense: 0,
    insurance: 0,
    software: 0,
    miscellaneous: 0,
    furnitureRental: 0,
    squareFootage: 0,
    furnishingsPSF: 0,
  };

  const handleBookDemo = () => {
    toast({
      title: "Demo Booking (Preview)",
      description: "This would open calendar booking for users without valid promo codes.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && promoCode !== 'T6MEM') {
      // Instead of showing error, redirect to demo booking
      handleBookDemo();
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate loading
    setTimeout(() => {
      if (isSignUp) {
        toast({
          title: "Account Created (Demo)",
          description: "This is just a preview. Account would be created with Pro access.",
        });
      } else {
        toast({
          title: "Signed In (Demo)",
          description: "This is just a preview. User would be signed in.",
        });
      }
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Header Section - Clear and visible */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-6 bg-transparent rounded-lg p-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <CalculatorIcon className="h-10 w-10 text-cyan-400" />
              Rental Calculator (GATE TEST)
            </h1>
            <p className="text-xl text-gray-300 mb-6 sm:text-lg">
              Analyze STR Profitability - Authentication Gate Preview
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              
              <Button
                variant="outline"
                disabled
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
            </div>
          </div>

          {/* Calculator Input Sections - Blurred preview */}
          <div className="blur-[1px] opacity-40 pointer-events-none">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 max-w-full mx-auto mb-8 place-items-center">
              <BuildOutSection data={initialData} updateData={() => {}} cashToLaunch={0} />
              <ExpensesSection 
                data={initialData} 
                updateData={() => {}} 
                serviceFeeCalculated={0}
                monthlyExpenses={0}
              />
              <CompsSection data={initialData} updateData={() => {}} />
              <NetProfitSection 
                monthlyRevenue={0}
                netProfitMonthly={0}
                paybackMonths={null}
                cashOnCashReturn={0}
              />
            </div>
          </div>
        </div>

        {/* Login Form Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="container mx-auto px-4 py-8 flex justify-center">
            {/* Login Form Content */}
            <div className="max-w-md w-full">
              <div className="bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-cyan-300 justify-center mb-2">
                      {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                      <h1 className="text-xl font-semibold">
                        {isSignUp ? 'Sign Up for Rentalizer' : 'Sign In to Rentalizer'}
                      </h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isSignUp 
                        ? 'Create your account with a promo code to get Pro access'
                        : 'Welcome back to Rentalizer'
                      }
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Email
                      </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={isSubmitting}
                          className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                    </div>

                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="promoCode" className="text-gray-300 flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          Promo Code
                        </Label>
                        <Input
                          id="promoCode"
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          disabled={isSubmitting}
                          className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </div>
                    )}

                    {!isSignUp && (
                      <div className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm p-0 h-auto"
                        >
                          Forgot Your Password?
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {isSignUp ? 'Creating Account...' : 'Signing In...'}
                          </>
                        ) : (
                          <>
                            {isSignUp ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                            {isSignUp ? 'Create Account' : 'Sign In'}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/')}
                        disabled={isSubmitting}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="text-center pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsSignUp(!isSignUp)}
                        disabled={isSubmitting}
                        className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                      >
                        {isSignUp ? (
                          <>
                            <LogIn className="h-4 w-4 mr-2" />
                            Already have an account? Sign In
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up
                          </>
                        )}
                      </Button>
                    </div>

                    {isSignUp && (
                      <div className="text-center pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-2 mt-3">
                          Don't have a promo code?
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBookDemo}
                          disabled={isSubmitting}
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 text-sm"
                        >
                          Book a Demo Instead
                        </Button>
                      </div>
                    )}
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CalculatorTestGate;