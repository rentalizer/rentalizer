
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, User, Lock, UserPlus } from 'lucide-react';

interface LoginDialogProps {
  trigger?: React.ReactNode;
}

export const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${isSignUp ? 'Sign up' : 'Login'} attempted with:`, { email, password });
    // Add your authentication logic here
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 border border-cyan-500/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 flex items-center gap-2">
            {isSignUp ? (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up for Rentalizer
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In to Rentalizer
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSignUp 
              ? "Create your account to access professional STR market analysis"
              : "Sign in to access your subscription and professional market data"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
              placeholder="Enter your email"
              required
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
              placeholder={isSignUp ? "Create a password" : "Enter your password"}
              required
              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>

          {isSignUp && (
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-xs text-cyan-200">
                💎 Professional subscription required for live market data access
              </p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              {isSignUp ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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
              className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Need an account? Sign up"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
