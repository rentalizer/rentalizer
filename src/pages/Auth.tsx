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
import { Eye, EyeOff, Upload, User, Ticket } from 'lucide-react';

export const Auth = () => {
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

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/community" replace />;
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
      await signUp(signupEmail, signupPassword, displayName);
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-gray-300">
                  First Name
                </Label>
                <Input
                  id="first-name"
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
              <Label htmlFor="avatar-upload" className="text-gray-300 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Your Image *
              </Label>
              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-gray-300"
                >
                  {avatarFile ? (
                    <span className="text-cyan-300">{avatarFile.name}</span>
                  ) : (
                    <>
                      <Upload className="h-6 w-6" />
                      <span className="text-sm">Click to upload profile image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">Tell The Community About Yourself *</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-slate-700/50 border-cyan-500/20 text-white resize-none"
                placeholder="Share a bit about yourself, your interests, and what brings you to our community..."
                rows={3}
                required
              />
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
          
        </CardContent>
      </Card>
    </div>
  );
};