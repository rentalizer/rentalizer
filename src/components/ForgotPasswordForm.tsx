
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordFormProps {
  onBack: () => void;
  initialEmail?: string;
}

export const ForgotPasswordForm = ({ onBack, initialEmail = '' }: ForgotPasswordFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 Starting password reset for:', email);
    
    if (!email) {
      toast({
        title: "❌ Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "❌ Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use the current origin for the redirect URL
      const currentOrigin = window.location.origin;
      const redirectTo = `${currentOrigin}/reset-password`;
      console.log('🔗 Reset redirect URL:', redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      }

      console.log('✅ Password reset email sent successfully');
      setEmailSent(true);
      toast({
        title: "✅ Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      
    } catch (error: any) {
      console.error('💥 Password reset failed:', error);
      
      let errorMessage = "Failed to send reset email. Please try again.";
      
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account first.";
      } else if (error.message?.includes('User not found')) {
        errorMessage = "No account found with this email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">Check Your Email</h3>
          <p className="text-gray-400 mb-4">
            We've sent password reset instructions to:
          </p>
          <p className="text-cyan-200 font-medium mb-4">{email}</p>
          <p className="text-sm text-gray-500">
            Click the link in the email to reset your password. If you don't see it, check your spam folder.
          </p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            Send Another Email
          </Button>
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-cyan-300 mb-2">Reset Your Password</h3>
        <p className="text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-gray-300 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={isSubmitting}
          className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>
      
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white disabled:opacity-50"
        >
          {isSubmitting ? (
            'Sending Reset Email...'
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Send Reset Email
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    </form>
  );
};
