import React from 'react';
import { BarChart3, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export const TopNavBar = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="w-full bg-slate-700/90 backdrop-blur-lg border-b border-gray-500/50">
      <div className="container mx-auto px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo only */}
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-cyan-400" style={{
              filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 36px rgba(6, 182, 212, 0.5))'
            }} />
          </div>

          {/* Right side - Login or User info */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-gray-900/50 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <User className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300">{user.email}</span>
                <Badge variant="outline" className="bg-green-900/30 border-green-500/30 text-green-300 text-xs px-2 py-0">
                  Trial
                </Badge>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-medium"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
