
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

export const SecurityNotice: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-semibold text-green-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security Features Active
            </h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>✅ API keys are encrypted and stored locally</p>
              <p>✅ Input validation and sanitization enabled</p>
              <p>✅ Rate limiting protection active</p>
              <p>✅ Secure authentication with session management</p>
            </div>
            <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-600/20 rounded border border-yellow-500/30">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-yellow-300">
                Never share API keys or enter them on untrusted websites
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
