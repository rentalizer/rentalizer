
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, User, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccessGateProps {
  children: React.ReactNode;
  requiredAccess: 'essentials' | 'complete';
  moduleName: string;
  moduleDescription: string;
  moduleIcon: React.ReactNode;
}

export const AccessGate = ({ 
  children, 
  requiredAccess, 
  moduleName, 
  moduleDescription, 
  moduleIcon 
}: AccessGateProps) => {
  const { hasEssentialsAccess, hasCompleteAccess, upgradeSubscription } = useAuth();

  const hasAccess = requiredAccess === 'essentials' 
    ? hasEssentialsAccess || hasCompleteAccess
    : hasCompleteAccess;

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgrade = async () => {
    try {
      await upgradeSubscription();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-2xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="h-8 w-8 text-gray-400" />
            {moduleIcon}
          </div>
          <CardTitle className="text-xl text-gray-300">
            {moduleName} Access Required
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-400">
            {moduleDescription}
          </p>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              {requiredAccess === 'complete' ? (
                <Crown className="h-5 w-5 text-purple-400" />
              ) : (
                <Zap className="h-5 w-5 text-cyan-400" />
              )}
              <Badge variant="outline" className={`${
                requiredAccess === 'complete' 
                  ? 'border-purple-500/50 text-purple-300' 
                  : 'border-cyan-500/50 text-cyan-300'
              }`}>
                {requiredAccess === 'complete' ? 'All-In-One System Required' : 'Market Insights + Calculator Required'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Upgrade your subscription to access this module
            </p>
          </div>

          <Button
            onClick={handleUpgrade}
            size="lg"
            className={`w-full mt-4 ${
              requiredAccess === 'complete'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
            } text-white`}
          >
            {requiredAccess === 'complete' ? (
              <>
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to All-In-One System
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Upgrade to Market Insights + Calculator
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 mt-3">
            This module is currently in development and will be available soon for subscribers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
