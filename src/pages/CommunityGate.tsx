import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowLeft, LogIn, User, Lock, UserPlus, Ticket, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TopNavBarTest } from '@/components/TopNavBarTest';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import Community from './Community';

const CommunityGate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  
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
            emailRedirectTo: `${window.location.origin}/community`
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
        redirectTo: `${window.location.origin}/community`,
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
  if (isLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show community if user is authenticated OR if admin access is granted
  if (user || isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <TopNavBarTest />
        <Community />
      </div>
    );
  }

  // Show login gate if not authenticated and not admin
  if (!user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <TopNavBarTest />
        
        {/* Main content area */}
        <div className="flex-1 relative">
          {/* Header Section - Clear and visible */}
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-6 bg-transparent rounded-lg p-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Users className="h-10 w-10 text-cyan-400" />
                Training & Community Hub
              </h1>
              <p className="text-xl text-gray-300 mb-6 sm:text-lg">
                Connect, Learn & Grow Together
              </p>
            </div>

            {/* Community Preview - Blurred */}
            <div className="blur-[1px] opacity-40 pointer-events-none">
              <div className="max-w-4xl mx-auto">
                <div className="grid w-full grid-cols-6 bg-slate-800/50 border border-cyan-500/20 gap-1 justify-items-stretch rounded-lg p-1 mb-8">
                  <div className="bg-cyan-600/20 text-cyan-300 px-4 py-2 rounded text-center text-sm">
                    Discussions
                  </div>
                  <div className="px-4 py-2 rounded text-center text-sm text-gray-300">
                    Calendar
                  </div>
                  <div className="px-4 py-2 rounded text-center text-sm text-gray-300">
                    Training
                  </div>
                  <div className="px-4 py-2 rounded text-center text-sm text-gray-300">
                    Chat
                  </div>
                  <div className="px-4 py-2 rounded text-center text-sm text-gray-300">
                    Business Doc
                  </div>
                  <div className="px-4 py-2 rounded text-center text-sm text-gray-300">
                    Leaderboard
                  </div>
                </div>
                
                <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Welcome Aboard!</h3>
                      <p className="text-gray-300 text-sm">
                        We're excited to have you join our community of rental entrepreneurs...
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Getting Started Guide</h3>
                      <p className="text-gray-300 text-sm">
                        Learn the fundamentals of short-term rental investing...
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
                      {isSignUp ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="first-name" className="text-gray-300">
                                First Name
                              </Label>
                              <Input
                                id="first-name"
                                type="text"
                                required
                                disabled={isSubmitting}
                                className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last-name" className="text-gray-300">
                                Last Name
                              </Label>
                              <Input
                                id="last-name"
                                type="text"
                                required
                                disabled={isSubmitting}
                                className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                              />
                            </div>
                          </div>
                          
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
                            <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="avatar-upload" className="text-gray-300 flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload Your Image *
                            </Label>
                            <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                required
                              />
                              <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-gray-300"
                              >
                                <Upload className="h-6 w-6" />
                                <span className="text-sm">Click to upload profile image</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio" className="text-gray-300">Tell The Community About Yourself *</Label>
                            <textarea
                              id="bio"
                              className="w-full px-3 py-2 border border-cyan-500/30 bg-gray-800/50 text-gray-100 rounded-md resize-none focus:border-cyan-400 focus:ring-cyan-400/20 focus:outline-none focus:ring-2"
                              placeholder="Share a bit about yourself, your interests, and what brings you to our community..."
                              rows={3}
                              required
                              disabled={isSubmitting}
                            />
                          </div>

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
                              required
                              disabled={isSubmitting}
                              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}

                      {!isSignUp && (
                        <div className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowForgotPassword(true)}
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
                          onClick={() => {
                            setEmail('');
                            setPassword('');
                            setPromoCode('');
                            setIsSignUp(false);
                          }}
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
                            <>Already have an account? Sign In</>
                          ) : (
                            <>Don't have an account? Sign Up</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="max-w-md w-full">
                  <div className="bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-cyan-300 justify-center mb-2">
                          <Lock className="h-5 w-5" />
                          <h1 className="text-xl font-semibold">Reset Password</h1>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Enter your email to receive reset instructions
                        </p>
                      </div>
                      
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="forgot-email" className="text-gray-300 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Email
                          </Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
                            placeholder="Enter your email address"
                          />
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
                                Sending...
                              </>
                            ) : (
                              'Send Reset Email'
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setForgotPasswordEmail('');
                            }}
                            disabled={isSubmitting}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           )}
        </div>
        
        <Footer />
      </div>
    );
  }

  // Show community directly if in development
  return <Community />;
};

export default CommunityGate;