import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const TestLogo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <Card className="bg-slate-800/50 border-cyan-500/20 max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Download className="h-6 w-6 text-cyan-400" />
            Your Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-slate-900/50 rounded-lg p-8 inline-block">
            <img 
              src="/lovable-uploads/7bd31141-d3df-4e3e-9f94-29f10eb8c732.png" 
              alt="Rentalizer Logo" 
              className="max-w-full h-auto"
              style={{ width: '1460px', height: '752px', objectFit: 'contain' }}
            />
          </div>
          <p className="text-gray-300">
            Right-click on the logo above and select "Save image as..." to download.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestLogo;