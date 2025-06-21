
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
import { LogIn, User, Lock, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface LoginDialogProps {
  trigger?: React.ReactNode;
}

export const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const { signIn, signUp } = useAuth();
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
          title: "✅ Account Created Successfully!",
          description: "Welcome to Ask Richie AI! You can now start asking questions.",
        });
      } else {
        console.log('🔑 Attempting sign in...');
        await signIn(email, password);
        toast({
          title: "✅ Signed In Successfully!",
          description: "Welcome back to Ask Richie AI!",
        });
      }
      
      console.log('✅ Authentication successful, closing dialog');
      setIsOpen(false);
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      let shouldSuggestSignUp = false;
      
      if (error.message?.includes('Invalid login credentials')) {
        if (!isSignUp) {
          errorMessage = "Account not found. Would you like to create a new account instead?";
          shouldSuggestSignUp = true;
        } else {
          errorMessage = "Failed to create account. Please try again or contact support.";
        }
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Try signing in instead.";
        setIsSignUp(false);
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Connection timeout. Please check your internet and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: `❌ ${isSignUp ? 'Sign Up' : 'Sign In'} Failed`,
        description: errorMessage,
        variant: "destructive",
      });

      // Auto-suggest sign up if login failed with invalid credentials
      if (shouldSuggestSignUp) {
        setTimeout(() => {
          toast({
            title: "💡 Need an Account?",
            description: "Click 'Need an account? Sign up' below to create a new account.",
          });
        }, 2000);
      }
      
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
                Create Account
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {showPasswordReset 
              ? "Reset your password to regain access to your account"
              : isSignUp 
                ? "Create your account to start using Ask Richie AI"
                : "Sign in to access Ask Richie AI"
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
                  🎉 New accounts get immediate access to Ask Richie AI with trial features!
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
                    Create Account
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

            <div className="text-center pt-2 border-t border-gray-700/50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isSubmitting}
                className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
              >
                {isSignUp 
                  ? "Already have an account? Sign in instead" 
                  : "Need an account? Sign up to get started"
                }
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
