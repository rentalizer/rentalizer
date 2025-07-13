
// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { WelcomeSection } from '@/components/WelcomeSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, BarChart3, Calendar } from 'lucide-react';

const Index = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Redirect authenticated users to community
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/community');
    }
  }, [user, isLoading, navigate]);

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
  }, []);

  // Book demo function
  const handleBookDemo = () => {
    console.log('📅 Book Demo clicked - opening Calendly popup');
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully"
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail.trim() || !signupPassword.trim() || !displayName.trim() || !promoCode.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter your name, email, password, and promo code",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setSignupLoading(true);

    try {
      await signUp(signupEmail, signupPassword, { displayName });
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully. Please check your email to verify your account."
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setSignupLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <div className="text-cyan-300 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is logged in, show welcome page with TopNavBar
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <TopNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">Welcome to Rentalizer!</h1>
              <p className="text-xl text-gray-300">
                You're logged in as <span className="text-cyan-400">{user.email}</span>
              </p>
              <p className="text-gray-400">
                Click on your email in the top navigation to complete your profile, or explore the platform below.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/community')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Training Hub</h3>
                  <p className="text-gray-400 text-sm">Live Training, Video & Document Library, Tools, Resources, Community</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/markets')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Market Intelligence</h3>
                  <p className="text-gray-400 text-sm">The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/properties')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Acquisition Agent</h3>
                  <p className="text-gray-400 text-sm">Automate Property Outreach, Close Deals, Calculate Profit, Robust CRM</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    onClick={() => navigate('/pms')}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">🫶</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Property Management</h3>
                  <p className="text-gray-400 text-sm">Automate Property Management, Operations & Cash Flow</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Complete Your Profile</h3>
                  <p className="text-gray-400 mb-4">
                    To get the most out of our community, complete your profile with your name, photo, and bio.
                  </p>
                  <Button 
                    onClick={() => navigate('/profile-setup')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <TopNavBar />
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md bg-slate-800/50 border-cyan-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Community Access</CardTitle>
          <p className="text-gray-400">Join our vibrant community of rental entrepreneurs</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="login" className="text-gray-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-slate-700/50 border-cyan-500/20 text-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-gray-300">Your Name</Label>
                  <Input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="bg-slate-700/50 border-cyan-500/20 text-white pr-10"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-code" className="text-gray-300">Promo Code</Label>
                  <Input
                    id="promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/20 text-white"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {signupLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Book A Demo Button - Prominent placement */}
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <Button
              onClick={handleBookDemo}
              variant="outline"
              className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book A Demo
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Schedule a 1-on-1 demo call
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              After signing up, you'll be guided to complete your profile to access all community features.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
