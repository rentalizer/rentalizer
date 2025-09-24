import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Upload, User, Ticket, LogIn, UserPlus } from 'lucide-react';

export const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname === '/auth/login') {
      setActiveTab('login');
    } else if (location.pathname === '/auth/signup') {
      setActiveTab('signup');
    } else if (location.pathname === '/auth') {
      setActiveTab('signup'); // Default to signup for /auth
    }
  }, [location.pathname]);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'login') {
      navigate('/auth/login');
    } else if (value === 'signup') {
      navigate('/auth/signup');
    }
  };

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
    
    if (!signupEmail.trim() || !signupPassword.trim() || !firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in first name, last name, email, and password",
        variant: "destructive"
      });
      return;
    }

    // Promo code validation removed for backend integration

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
      const displayName = `${firstName} ${lastName}`;
      await signUp(signupEmail, signupPassword, {
        displayName,
        firstName,
        lastName
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-cyan-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Community Access</CardTitle>
          <p className="text-gray-400">Join our vibrant community of rental entrepreneurs</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="login" className="text-gray-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loginLoading}
                    className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
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
                      placeholder="Enter your password"
                      required
                      minLength={6}
                      disabled={loginLoading}
                      className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
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
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
                >
                  {loginLoading ? (
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
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-gray-300">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  name="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-slate-700/50 border-cyan-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  name="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-slate-700/50 border-cyan-500/20 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
              <Input
                id="signup-email"
                name="signup-email"
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
                  name="signup-password"
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

            {/* Profile picture upload removed - users can add it later in ProfileSetup */}

            {/* Bio field removed - users can add it later in ProfileSetup */}

            {/* Promo code field removed for backend integration */}
            
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
          
        </CardContent>
      </Card>
    </div>
  );
};