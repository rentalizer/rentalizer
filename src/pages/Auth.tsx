import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Upload, User, Ticket, LogIn, UserPlus } from 'lucide-react';

export const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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
    return <Navigate to="/community#discussions" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      console.log("Missing fields: Please enter both email and password");
      return;
    }

    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      console.log("Welcome back! You have been signed in successfully");
    } catch (error) {
      console.error('Login error:', error);
      console.log("Login failed:", error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoginLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        console.log("No file selected: Please select an image to upload");
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log("Invalid file type: Please select an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        console.log("File too large: Please select an image smaller than 2MB");
        return;
      }

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Only store if it's a reasonable size (less than 1MB base64)
        if (result.length < 1000000) {
          setAvatarUrl(result);
          console.log("Success: Profile photo selected");
        } else {
          console.log("File too large: Please select a smaller image");
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      console.log("Error: Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail.trim() || !signupPassword.trim() || !firstName.trim() || !lastName.trim()) {
      console.log("Missing fields: Please fill in first name, last name, email, and password");
      return;
    }

    if (signupPassword.length < 6) {
      console.log("Password too short: Password must be at least 6 characters long");
      return;
    }

    setSignupLoading(true);

    try {
      const displayName = `${firstName} ${lastName}`;
      await signUp(signupEmail, signupPassword, {
        displayName,
        firstName,
        lastName,
        bio: bio.trim() || undefined,
        profilePicture: avatarUrl || undefined
      });
      console.log("Welcome! Your account has been created successfully. Please check your email to verify your account.");
    } catch (error) {
      console.error('Signup error:', error);
      console.log("Signup failed:", error instanceof Error ? error.message : "Failed to create account");
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
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-3 pb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-lg">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  disabled={uploading || signupLoading}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Upload className="h-3 w-3 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                Optional: Add a profile picture (max 2MB)
              </p>
            </div>

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
                  disabled={signupLoading}
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
                  disabled={signupLoading}
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
                disabled={signupLoading}
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
                  disabled={signupLoading}
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

            {/* Bio field */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">About Yourself (Optional)</Label>
              <Textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the community about yourself, your real estate experience, goals, etc."
                rows={3}
                className="bg-slate-700/50 border-cyan-500/20 text-white resize-none"
                disabled={signupLoading}
                maxLength={500}
              />
              <p className="text-xs text-gray-400">This will be visible to other community members</p>
            </div>
            
            <Button
              type="submit"
              disabled={signupLoading || uploading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {signupLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
              </form>
            </TabsContent>
          </Tabs>
          
        </CardContent>
      </Card>
    </div>
  );
};