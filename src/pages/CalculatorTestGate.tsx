import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalculatorIcon, ArrowLeft, RotateCcw, Download, LogIn, User, Lock, UserPlus, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { TopNavBarTest } from '@/components/TopNavBarTest';
import { Footer } from '@/components/Footer';
import { exportCalculatorToCSV } from '@/utils/calculatorExport';
import { supabase } from '@/integrations/supabase/client';

export interface CalculatorData {
  address: string;
  bedrooms: number;
  bathrooms: number;
  averageComparable: number;
  firstMonthRent: number;
  securityDeposit: number;
  furnishingsCost: number;
  rent: number;
  serviceFees: number;
  maintenance: number;
  power: number;
  waterSewer: number;
  internet: number;
  taxLicense: number;
  insurance: number;
  software: number;
  miscellaneous: number;
  furnitureRental: number;
  squareFootage: number;
  furnishingsPSF: number;
}

const CalculatorTestGate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
  // State for the auth overlay form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Initial data for calculator
  const initialData: CalculatorData = {
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
  
  // Check if we're in development environment
  const isDevelopment = () => {
    return window.location.hostname.includes('lovable.app') || 
           window.location.hostname.includes('localhost') ||
           window.location.hostname.includes('127.0.0.1');
  };

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

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  const handleBookDemo = () => {
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    } else {
      toast({
        title: "Loading Calendar",
        description: "Please wait while we load the calendar widget...",
      });
      // Retry after a short delay
      setTimeout(() => {
        // @ts-ignore
        if (window.Calendly) {
          // @ts-ignore
          window.Calendly.initPopupWidget({
            url: 'https://calendly.com/richies-schedule/scale'
          });
        }
      }, 1000);
    }
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
    
    try {
      if (isSignUp) {
        console.log('📝 Starting sign up for:', email);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/calculator-test`
          }
        });

        console.log('📧 Sign up response:', { data, error });

        if (error) {
          console.error('❌ Sign up error:', error.message);
          throw new Error(error.message);
        }

        if (data.user && !data.session) {
          console.log('📬 User created but email confirmation required');
          toast({
            title: "Account Created",
            description: "Please check your email (including spam folder) to verify your account. You may need to wait a few minutes.",
          });
        } else if (data.session) {
          console.log('✅ User created and automatically signed in');
          toast({
            title: "Account Created",
            description: "Welcome to Rentalizer! You now have Pro access.",
          });
        }

        // Create user profile with Pro status for valid promo code users
        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              subscription_status: 'active'  // Pro status for promo code users
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            console.log('✅ User profile created with Pro status');
          }
        }
        
        // Reset form
        setEmail('');
        setPassword('');
        setPromoCode('');
        
      } else {
        // Sign in
        console.log('🔑 Starting sign in for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('❌ Sign in error:', error.message);
          throw new Error(error.message);
        }

        toast({
          title: "Signed In",
          description: "Welcome back!",
        });
      }
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check and try again.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account before signing in.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show calculator if user is authenticated  
  if (user) {
    return <AuthenticatedCalculator />;
  }

  // Show login gate if not authenticated and not in development
  if (!user && !isDevelopment()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <TopNavBarTest />
        
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
                Rental Calculator
              </h1>
              <p className="text-xl text-gray-300 mb-6 sm:text-lg">
                Analyze STR Profitability
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
                          ? 'Create your account'
                          : 'Access your account'
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
                              Already Have An Account? Sign In
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
                            Don't Have A Promo Code?
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
  }

  // Development mode - show calculator directly
  return <AuthenticatedCalculator />;
};

// Authenticated Calculator Component
const AuthenticatedCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const initialData: CalculatorData = {
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
  
  const [data, setData] = useState<CalculatorData>(initialData);

  // Calculate derived values - all rounded to whole numbers except paybackMonths
  const calculatedFurnishings = Math.round(data.squareFootage * data.furnishingsPSF);
  const cashToLaunch = Math.round(data.firstMonthRent + data.securityDeposit + data.miscellaneous + calculatedFurnishings + data.furnitureRental);
  const serviceFeeCalculated = Math.round(data.rent * 0.029); // 2.9% of rent, not average comparable
  const monthlyExpenses = Math.round(data.rent + serviceFeeCalculated + data.maintenance + data.power + 
                         data.waterSewer + data.internet + data.taxLicense + data.insurance + 
                         data.software + data.furnitureRental);
  const monthlyRevenue = Math.round(data.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  
  // Payback months calculation with decimals
  const paybackMonths = (cashToLaunch > 0 && netProfitMonthly > 0) 
    ? cashToLaunch / netProfitMonthly  // Keep as decimal for precision
    : null;
    
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  // Update service fees when rent changes
  useEffect(() => {
    setData(prev => ({
      ...prev,
      serviceFees: Math.round(prev.rent * 0.029)
    }));
  }, [data.rent]);

  const updateData = (updates: Partial<CalculatorData>) => {
    // Round all numerical values to remove decimals
    const roundedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = Math.round(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    setData(prev => ({ ...prev, ...roundedUpdates }));
  };

  const clearAllData = () => {
    setData({ ...initialData });
    toast({
      title: "Calculator Cleared",
      description: "All data has been reset. You can start over with a fresh calculation.",
    });
  };

  const downloadData = () => {
    const calculatedValues = {
      cashToLaunch,
      monthlyExpenses,
      monthlyRevenue,
      netProfitMonthly,
      paybackMonths,
      cashOnCashReturn,
      calculatedFurnishings
    };
    
    exportCalculatorToCSV(data, calculatedValues);
    
    toast({
      title: "Data Downloaded",
      description: "Your calculator data has been exported to a CSV file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBarTest />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
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

          <div className="text-center mb-6 bg-slate-700/90 backdrop-blur-lg rounded-lg p-8 border border-gray-500/50">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <CalculatorIcon className="h-10 w-10 text-cyan-400" />
              Rental Calculator
            </h1>
            <p className="text-xl text-gray-300 mb-6 sm:text-lg">
              Analyze STR Profitability
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={clearAllData}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              
              <Button
                variant="outline"
                onClick={downloadData}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
            </div>
          </div>

          {/* Calculator Input Sections - 4x1 Grid Layout on desktop, centered stack on mobile */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 max-w-full mx-auto mb-8 place-items-center">
            {/* 1st - Build Out Costs */}
            <BuildOutSection data={data} updateData={updateData} cashToLaunch={cashToLaunch} />
            
            {/* 2nd - Expenses */}
            <ExpensesSection 
              data={data} 
              updateData={updateData} 
              serviceFeeCalculated={serviceFeeCalculated}
              monthlyExpenses={monthlyExpenses}
            />
            
            {/* 3rd - Property Comps */}
            <CompsSection data={data} updateData={updateData} />

            {/* 4th - Analysis Results */}
            <NetProfitSection 
              monthlyRevenue={monthlyRevenue}
              netProfitMonthly={netProfitMonthly}
              paybackMonths={paybackMonths}
              cashOnCashReturn={cashOnCashReturn}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CalculatorTestGate;