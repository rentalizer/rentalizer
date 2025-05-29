
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, User, Lock, UserPlus, Mail, MapPin, Calculator, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface LoginDialogProps {
  trigger?: React.ReactNode;
}

export const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const { signIn, signUp, user, isSubscribed } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Form submitted:', { email, isSignUp, isSubmitting });
    
    if (isSubmitting) {
      console.log('⚠️ Already submitting, ignoring');
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "❌ Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('🚀 Starting authentication process...');
    
    try {
      if (isSignUp) {
        console.log('📝 Attempting sign up...');
        await signUp(email, password);
        toast({
          title: "✅ Account Created",
          description: "Welcome to Rentalizer! You now have trial access.",
        });
      } else {
        console.log('🔑 Attempting sign in...');
        await signIn(email, password);
        toast({
          title: "✅ Signed In",
          description: "Welcome back to Rentalizer!",
        });
      }
      
      console.log('✅ Authentication successful, closing dialog');
      setIsOpen(false);
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check and try again.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Try signing in instead.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Connection timeout. Please check your internet and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Authentication process completed');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowPasswordReset(false);
    setIsSignUp(false);
    setEmail('');
    setPassword('');
  };

  // Show full professional access page for non-subscribed users
  if (user && !isSubscribed) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          {trigger || (
            <Button 
              variant="outline" 
              className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg">
          <div className="text-center space-y-6">
            {/* Header with logo and title */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rentalizer
              </h1>
            </div>
            <p className="text-cyan-300/80 font-medium">By Richie Matthews</p>
            
            {/* Tagline - matching the site */}
            <h2 className="text-xl text-cyan-100 max-w-lg mx-auto leading-tight">
              Identify profitable short-term rental arbitrage opportunities with professional market intelligence
            </h2>

            {/* Professional Access Required */}
            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xl font-semibold text-cyan-300">Professional Access Required</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Unlock comprehensive STR market analysis and professional tools
              </p>
              
              {/* Feature badges */}
              <div className="flex justify-center gap-4 mb-6">
                <span className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-sm border border-cyan-500/30">
                  📊 Real-Time Data
                </span>
                <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                  🤖 AI-Powered Analysis
                </span>
                <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                  🛠️ Pro Tools
                </span>
              </div>

              <Button 
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Access Professional Tools
              </Button>
            </div>

            {/* Features grid - matching the 4 categories from the site */}
            <div className="bg-gray-800/30 border border-cyan-500/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-cyan-300 mb-4">Save weeks or months of research:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-cyan-300 font-medium">Market Intelligence</h5>
                    <p className="text-gray-400 text-sm">Comprehensive STR revenue data for any US market</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-blue-300 font-medium">ROI Calculator</h5>
                    <p className="text-gray-400 text-sm">AI-powered profitability analysis and projections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-purple-300 font-medium">Acquisitions Agent</h5>
                    <p className="text-gray-400 text-sm">Automated landlord outreach with proven scripts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-cyan-300 font-medium">Front Desk Management</h5>
                    <p className="text-gray-400 text-sm">Complete property management automation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 flex items-center gap-2">
            {showPasswordReset ? (
              <>
                <Mail className="h-5 w-5" />
                Reset Password
              </>
            ) : isSignUp ? (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up for Rentalizer
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In to Rentalizer
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {showPasswordReset 
              ? "Reset your password to regain access to your account"
              : isSignUp 
                ? "Create your account to access professional STR market analysis"
                : "Sign in to access your subscription and professional market data"
            }
          </DialogDescription>
        </DialogHeader>
        
        {showPasswordReset ? (
          <ForgotPasswordForm 
            onBack={() => setShowPasswordReset(false)}
            initialEmail={email}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
                placeholder="Enter your email"
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
                placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                required
                minLength={6}
                disabled={isSubmitting}
                className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPasswordReset(true)}
                  disabled={isSubmitting}
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm p-0 h-auto"
                >
                  Forgot your password?
                </Button>
              </div>
            )}

            {isSignUp && (
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-xs text-cyan-200">
                  💎 New accounts get trial access. Use email with "premium" for demo subscription.
                </p>
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
                ) : isSignUp ? (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
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
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Need an account? Sign up"
                }
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
