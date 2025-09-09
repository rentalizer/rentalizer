
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Upload, User, Ticket, Lock } from 'lucide-react';

import { Footer } from '@/components/Footer';

interface AccessGateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AccessGate: React.FC<AccessGateProps> = ({ 
  children, 
  title = "Training & Community Hub",
  subtitle = "Access your account"
}) => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
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

  // If user is authenticated, show the protected content without TopNavBar
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {children}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <div className="text-cyan-300 text-xl">Loading...</div>
        </div>
      </div>
    );
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
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (promoCode.toUpperCase() !== 'T6MEM') {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code to sign up",
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
      const displayName = `${firstName} ${lastName}`;
      await signUp(signupEmail, signupPassword, {
        displayName,
        firstName,
        lastName,
        bio,
        avatarFile
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      
      
      {/* Blurred background content */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-sm opacity-30 scale-105">
          {children}
        </div>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      </div>

      {/* Access Gate Overlay */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-full">
                <Lock className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>

          {/* Auth Tabs */}
          <Card className="bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-2xl">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="signin" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-cyan-300 text-center">Sign In to Rentalizer</CardTitle>
                  <p className="text-gray-400 text-center">Access your account</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
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
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        Forgot Your Password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3"
                    >
                      {loginLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <div className="text-center">
                      <p className="text-cyan-400 text-sm">
                        Don't have an account? Sign Up
                      </p>
                    </div>
                  </form>
                </CardContent>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-cyan-300 text-center">Join the Community</CardTitle>
                  <p className="text-gray-400 text-center">Create your account</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-gray-300">First Name</Label>
                        <Input
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-gray-300">Last Name</Label>
                        <Input
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
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
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 pr-12"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-code" className="text-gray-300 flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        Promo Code
                      </Label>
                      <Input
                        id="promo-code"
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3"
                    >
                      {signupLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};
