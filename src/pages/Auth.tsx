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
import { useToast } from '@/hooks/use-toast';
import { validateSignupData, validateEmail, validatePassword, validateName, validateBio, getPasswordStrength } from '@/utils/authValidation';
import { Eye, EyeOff, Upload, User, Ticket, LogIn, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  
  // Validation state
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; message: string } | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [bioError, setBioError] = useState('');
  const [avatarError, setAvatarError] = useState('');

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

  // Clear validation errors
  const clearValidationErrors = () => {
    setEmailError('');
    setPasswordError('');
    setFirstNameError('');
    setLastNameError('');
    setBioError('');
    setAvatarError('');
  };

  // Real-time validation functions
  const validateEmailField = (email: string) => {
    const validation = validateEmail(email);
    setEmailError(validation.isValid ? '' : validation.message);
    return validation.isValid;
  };

  const validatePasswordField = (password: string) => {
    const validation = validatePassword(password);
    setPasswordError(validation.isValid ? '' : validation.message);
    
    // Update password strength
    if (password.length > 0) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
    
    return validation.isValid;
  };

  const validateNameField = (name: string, fieldName: string, setter: (error: string) => void) => {
    if (!name.trim()) {
      setter('');
      return true; // Don't show error for empty field until submit
    }
    
    const validation = validateName(name, fieldName);
    setter(validation.isValid ? '' : validation.message);
    return validation.isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both email and password to sign in.",
      });
      return;
    }

    // Validate email format
    if (!validateEmailField(loginEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: emailError,
      });
      return;
    }

    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      toast({
        variant: "success",
        title: "Welcome Back!",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      
      // Handle specific error types
      let title = "Login Failed";
      let description = errorMessage;
      
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('incorrect')) {
        title = "Invalid Credentials";
        description = "The email or password you entered is incorrect. Please try again.";
      } else if (errorMessage.includes('User not found')) {
        title = "Account Not Found";
        description = "No account found with this email address. Please check your email or sign up for a new account.";
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        title = "Connection Error";
        description = "Unable to connect to the server. Please check your internet connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title,
        description,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setAvatarError('');

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          variant: "destructive",
          title: "No File Selected",
          description: "Please select an image to upload.",
        });
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorMsg = "Invalid file type. Please select an image file (JPEG, PNG, GIF, or WebP).";
        setAvatarError(errorMsg);
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: errorMsg,
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        const errorMsg = "File is too large. Please select an image smaller than 2MB.";
        setAvatarError(errorMsg);
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: errorMsg,
        });
        return;
      }

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Only store if it's a reasonable size (less than 1MB base64)
        if (result.length < 1000000) {
          setAvatarUrl(result);
          setAvatarError('');
          toast({
            variant: "success",
            title: "Profile Photo Selected",
            description: "Your profile photo has been successfully selected.",
          });
        } else {
          const errorMsg = "File is too large. Please select a smaller image.";
          setAvatarError(errorMsg);
          toast({
            variant: "destructive",
            title: "File Too Large",
            description: errorMsg,
          });
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMsg = "Failed to upload avatar. Please try again.";
      setAvatarError(errorMsg);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMsg,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Validate all fields
    const signupData = {
      email: signupEmail,
      password: signupPassword,
      firstName,
      lastName,
      bio: bio.trim(),
      profilePicture: avatarUrl
    };
    
    const validation = validateSignupData(signupData);
    
    if (!validation.isValid) {
      // Parse the validation message to set specific field errors
      const errorMessage = validation.message;
      
      // Set specific field errors based on the validation message
      if (errorMessage.includes('Email:')) {
        const emailError = errorMessage.split('Email: ')[1]?.split('\n')[0] || errorMessage;
        setEmailError(emailError);
      }
      if (errorMessage.includes('Password:')) {
        const passwordError = errorMessage.split('Password: ')[1]?.split('\n')[0] || errorMessage;
        setPasswordError(passwordError);
      }
      if (errorMessage.includes('First Name:')) {
        const firstNameError = errorMessage.split('First Name: ')[1]?.split('\n')[0] || errorMessage;
        setFirstNameError(firstNameError);
      }
      if (errorMessage.includes('Last Name:')) {
        const lastNameError = errorMessage.split('Last Name: ')[1]?.split('\n')[0] || errorMessage;
        setLastNameError(lastNameError);
      }
      if (errorMessage.includes('Bio:')) {
        const bioError = errorMessage.split('Bio: ')[1]?.split('\n')[0] || errorMessage;
        setBioError(bioError);
      }
      if (errorMessage.includes('Profile Picture:')) {
        const avatarError = errorMessage.split('Profile Picture: ')[1]?.split('\n')[0] || errorMessage;
        setAvatarError(avatarError);
      }
      
      // Show toast with the full error message
      const displayMessage = errorMessage.includes('\n• ') 
        ? errorMessage.replace(/\n• /g, '\n• ')
        : errorMessage;
        
      toast({
        variant: "destructive",
        title: "Please Fix the Following Issues",
        description: displayMessage,
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
        bio: bio.trim() || undefined,
        profilePicture: avatarUrl || undefined
      });
      
      toast({
        variant: "success",
        title: "Account Created Successfully!",
        description: "Welcome to the community! Your account has been created successfully.",
      });
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      
      // Handle specific error types
      let title = "Signup Failed";
      let description = errorMessage;
      
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        title = "Email Already Exists";
        description = "An account with this email address already exists. Please try signing in instead.";
        setEmailError("This email is already registered");
      } else if (errorMessage.includes('Invalid email')) {
        title = "Invalid Email";
        description = "Please enter a valid email address.";
        setEmailError("Please enter a valid email address");
      } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
        title = "Weak Password";
        description = "Please choose a stronger password.";
        setPasswordError("Please choose a stronger password");
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        title = "Connection Error";
        description = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (errorMessage.includes('validation') || errorMessage.includes('required')) {
        title = "Missing Information";
        description = "Please fill in all required fields correctly.";
      }
      
      toast({
        variant: "destructive",
        title,
        description,
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
              {avatarError && (
                <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                  <XCircle className="h-4 w-4" />
                  {avatarError}
                </div>
              )}
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
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (e.target.value.length > 0) {
                      validateNameField(e.target.value, "First name", setFirstNameError);
                    } else {
                      setFirstNameError('');
                    }
                  }}
                  className={`bg-slate-700/50 text-white ${
                    firstNameError ? 'border-red-500/50 focus:border-red-400' : 'border-cyan-500/20 focus:border-cyan-400'
                  }`}
                  required
                  disabled={signupLoading}
                />
                {firstNameError ? (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <XCircle className="h-4 w-4" />
                    {firstNameError}
                  </div>
                ) : firstName && validateName(firstName, "First name").isValid && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Looks good
                  </div>
                )}
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
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (e.target.value.length > 0) {
                      validateNameField(e.target.value, "Last name", setLastNameError);
                    } else {
                      setLastNameError('');
                    }
                  }}
                  className={`bg-slate-700/50 text-white ${
                    lastNameError ? 'border-red-500/50 focus:border-red-400' : 'border-cyan-500/20 focus:border-cyan-400'
                  }`}
                  required
                  disabled={signupLoading}
                />
                {lastNameError ? (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <XCircle className="h-4 w-4" />
                    {lastNameError}
                  </div>
                ) : lastName && validateName(lastName, "Last name").isValid && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Looks good
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
              <Input
                id="signup-email"
                name="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  if (e.target.value.length > 0) {
                    validateEmailField(e.target.value);
                  } else {
                    setEmailError('');
                  }
                }}
                className={`bg-slate-700/50 text-white ${
                  emailError ? 'border-red-500/50 focus:border-red-400' : 'border-cyan-500/20 focus:border-cyan-400'
                }`}
                required
                disabled={signupLoading}
              />
              {emailError ? (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <XCircle className="h-4 w-4" />
                  {emailError}
                </div>
              ) : signupEmail && validateEmail(signupEmail).isValid && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Email looks good
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (e.target.value.length > 0) {
                      validatePasswordField(e.target.value);
                    } else {
                      setPasswordError('');
                      setPasswordStrength(null);
                    }
                  }}
                  className={`bg-slate-700/50 text-white pr-10 ${
                    passwordError ? 'border-red-500/50 focus:border-red-400' : 'border-cyan-500/20 focus:border-cyan-400'
                  }`}
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
              
              {/* Password strength indicator */}
              {passwordStrength && (
                <div className="flex items-center gap-2 text-sm">
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.strength === 'weak' ? 'text-red-400' :
                    passwordStrength.strength === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {passwordStrength.strength === 'weak' ? <XCircle className="h-4 w-4" /> :
                     passwordStrength.strength === 'medium' ? <AlertCircle className="h-4 w-4" /> :
                     <CheckCircle className="h-4 w-4" />}
                    {passwordStrength.message}
                  </div>
                </div>
              )}
              
              {passwordError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <XCircle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number
              </p>
            </div>

            {/* Bio field */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">About Yourself (Optional)</Label>
              <Textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (e.target.value.length > 0) {
                    const validation = validateBio(e.target.value);
                    setBioError(validation.isValid ? '' : validation.message);
                  } else {
                    setBioError('');
                  }
                }}
                placeholder="Tell the community about yourself, your real estate experience, goals, etc."
                rows={3}
                className={`bg-slate-700/50 text-white resize-none ${
                  bioError ? 'border-red-500/50 focus:border-red-400' : 'border-cyan-500/20 focus:border-cyan-400'
                }`}
                disabled={signupLoading}
                maxLength={500}
              />
              {bioError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <XCircle className="h-4 w-4" />
                  {bioError}
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">This will be visible to other community members</p>
                <p className="text-xs text-gray-500">{bio.length}/500</p>
              </div>
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