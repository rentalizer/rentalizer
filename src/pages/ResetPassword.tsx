
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log('Validating reset token...');
      
      // Check if we have the required tokens in the URL
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      
      console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      
      if (accessToken && refreshToken && type === 'recovery') {
        try {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Session error:', error);
            throw error;
          }
          
          console.log('Session set successfully:', !!data.session);
          setIsValidToken(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          toast({
            title: "❌ Invalid Reset Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
        }
      } else {
        console.log('Missing required tokens or invalid type');
        toast({
          title: "❌ Invalid Reset Link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    };

    validateToken();
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "❌ Missing Information",
        description: "Please fill in both password fields.",
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

    if (password !== confirmPassword) {
      toast({
        title: "❌ Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        throw error;
      }

      console.log('Password updated successfully');
      setPasswordReset(true);
      
      toast({
        title: "✅ Password Updated",
        description: "Your password has been successfully reset.",
      });
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "❌ Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    // Sign out the user and redirect to home
    supabase.auth.signOut().then(() => {
      navigate('/');
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Validating reset link...</div>
          <div className="text-gray-400 text-sm">Please wait while we verify your request.</div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg">
          <div className="text-center space-y-6">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-300 mb-4">Invalid Reset Link</h1>
              <p className="text-gray-400 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg">
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-300 mb-4">Password Reset Complete</h1>
              <p className="text-gray-400 mb-6">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>
            <Button 
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cyan-300 mb-2">Reset Your Password</h1>
          <p className="text-gray-400">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              minLength={6}
              disabled={isSubmitting}
              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={6}
              disabled={isSubmitting}
              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                'Updating Password...'
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
