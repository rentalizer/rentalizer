import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, ArrowLeft, LogIn, User, Lock, UserPlus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TopNavBarTest } from '@/components/TopNavBarTest';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import Demo from './Demo';

const DemoGate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
  // State for the auth overlay form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  // Check if we're in development environment
  const isDevelopment = () => {
    const hostname = window.location.hostname;
    return hostname.includes('lovable.app') || 
           hostname.includes('lovableproject.com') ||
           hostname.includes('localhost') ||
           hostname.includes('127.0.0.1');
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
            emailRedirectTo: `${window.location.origin}/demo`
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/demo`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });

      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email.",
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

  // Show demo if user is authenticated  
  if (user) {
    return <Demo />;
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
            <div className="text-center mb-6 bg-transparent rounded-lg p-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <BarChart3 className="h-10 w-10 text-cyan-400" />
                Rentalizer Demo
              </h1>
              <p className="text-xl text-gray-300 mb-6 sm:text-lg">
                See How Rentalizer Can Help You Earn Rental Income
              </p>
            </div>

            {/* Demo Preview - Blurred */}
            <div className="blur-[1px] opacity-40 pointer-events-none">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {[
                    { title: "Market Intelligence", icon: "🎯" },
                    { title: "Calculator", icon: "🧮" },
                    { title: "Acquisition CRM", icon: "🏢" },
                    { title: "Property Management", icon: "🎧" },
                    { title: "Community", icon: "👥" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="text-cyan-300 font-semibold text-sm">{feature.title}</h3>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Success Stories</h3>
                      <p className="text-gray-300 text-sm">
                        "I went from zero real estate knowledge to $12,000/month..."
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Demo Features</h3>
                      <p className="text-gray-300 text-sm">
                        See market analysis, ROI calculations, and more...
                      </p>
                    </div>
                  </div>
                </div>
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
                          Community Access
                        </h1>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Join our vibrant community of rental entrepreneurs
                      </p>
                    </div>
                    
                    {!showForgotPassword ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-300">Email</Label>
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
                          <Label htmlFor="password" className="text-gray-300">Password</Label>
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
                            <Label htmlFor="promo-code" className="text-gray-300">Promo Code</Label>
                            <Input
                              id="promo-code"
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter promo code"
                              disabled={isSubmitting}
                              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                            <p className="text-xs text-gray-400">Without a valid promo code, you'll be redirected to book a demo call</p>
                          </div>
                        )}
                        
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Please wait...
                            </div>
                          ) : (
                            <>
                              {isSignUp ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                              {isSignUp ? 'Sign Up' : 'Sign In'}
                            </>
                          )}
                        </Button>

                        <div className="text-center space-y-2">
                          {!isSignUp && (
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Forgot Your Password?
                            </Button>
                          )}
                          
                          <div className="text-gray-400 text-sm">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setIsSignUp(!isSignUp)}
                              className="text-cyan-400 hover:text-cyan-300 ml-1 p-0 h-auto"
                            >
                              {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="forgot-email" className="text-gray-300">Email Address</Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Sending...
                            </div>
                          ) : (
                            'Send Reset Email'
                          )}
                        </Button>

                        <div className="text-center">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowForgotPassword(false)}
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            Back to Sign In
                          </Button>
                        </div>
                      </form>
                    )}
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

  // For development, show the demo directly
  return <Demo />;
};

export default DemoGate;