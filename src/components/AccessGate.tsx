
import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

interface AccessGateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const ACCESS_PASSCODE = "RENTALIZER2025";

export const AccessGate: React.FC<AccessGateProps> = ({ 
  children, 
  title = "Training & Community Hub",
  subtitle = "Access your account"
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ACCESS_PASSCODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode. Please try again.');
      setPasscode('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
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

          {/* Access Form */}
          <div className="bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="passcode" className="block text-sm font-medium text-gray-300 mb-2">
                  Access Passcode
                </label>
                <div className="relative">
                  <Input
                    id="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3"
              >
                <Lock className="h-4 w-4 mr-2" />
                Access Hub
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Demo access available • Contact for full access
              </p>
            </div>
          </div>

          {/* Demo Note */}
          <div className="mt-6 text-center">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                This is a live demo environment. Use passcode: <span className="font-mono font-bold">RENTALIZER2025</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
