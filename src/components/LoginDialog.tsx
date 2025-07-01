
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
import { LogIn, User, Lock, UserPlus, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface LoginDialogProps {
  trigger?: React.ReactNode;
}

export const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Form submitted:', { email, isSubmitting });
    
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
      console.log('🔑 Attempting sign in...');
      await signIn(email, password);
      toast({
        title: "✅ Signed In",
        description: "Welcome back to Rentalizer!",
      });
      
      console.log('✅ Authentication successful, closing dialog');
      setIsOpen(false);
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check and try again.";
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

  const handleSignUpClick = () => {
    console.log('📅 Sign up clicked, showing calendar');
    setShowCalendar(true);
  };

  const resetForm = () => {
    setShowPasswordReset(false);
    setShowCalendar(false);
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
            ) : showCalendar ? (
              <>
                <Calendar className="h-5 w-5" />
                Schedule a Demo
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
              : showCalendar
                ? "Book a demo to learn more about Rentalizer's features"
                : "Sign in to access your subscription and professional market data"
            }
          </DialogDescription>
        </DialogHeader>
        
        {showPasswordReset ? (
          <ForgotPasswordForm 
            onBack={() => setShowPasswordReset(false)}
            initialEmail={email}
          />
        ) : showCalendar ? (
          <div className="pt-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-4">
              <p className="text-cyan-200 text-sm mb-2">
                📅 Schedule a personalized demo to see how Rentalizer can help you analyze STR investments.
              </p>
            </div>
            <div className="h-96 w-full bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-600">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=your-calendar-id"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                className="rounded-lg"
                title="Schedule Demo"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCalendar(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
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
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={isSubmitting}
                className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

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
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
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
                onClick={handleSignUpClick}
                disabled={isSubmitting}
                className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Need an account? Sign up
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
