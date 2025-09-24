
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, User, Lock, ArrowLeft, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

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
    
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
      
      navigate(redirectTo);
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check and try again.";
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

  const handleCreateAccount = () => {
    setShowCalendar(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="bg-slate-700/90 backdrop-blur-lg border border-gray-500/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-cyan-300 flex items-center justify-center gap-2">
              {showCalendar ? (
                <>
                  <Calendar className="h-6 w-6" />
                  Schedule a Demo
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  Sign In
                </>
              )}
            </CardTitle>
            <p className="text-gray-400">
              {showCalendar 
                ? "Book a demo to learn more about Rentalizer's features"
                : "Sign in to access the calculator"
              }
            </p>
          </CardHeader>
          <CardContent>
            {showCalendar ? (
              <div className="space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-cyan-200 text-sm">
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
                <Button
                  variant="outline"
                  onClick={() => setShowCalendar(false)}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
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

                <div className="text-center pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCreateAccount}
                    disabled={isSubmitting}
                    className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create an Account
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
