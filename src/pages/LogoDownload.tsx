import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import logo from '@/assets/rentalizer-logo-high-res.png';
import barChartLogo from '@/assets/barchart-logo-high-res.png';
import exactLogo from '@/assets/rentalizer-logo-exact.svg';
import exactLogoPNG from '@/assets/exact-logo-cyan.png';

const LogoDownload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Exact Logo from Site */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Download className="h-6 w-6 text-cyan-400" />
              Exact Logo from Your Site (Cyan Color)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-slate-900/50 rounded-lg p-8 inline-block">
              <img 
                src={exactLogoPNG} 
                alt="Exact Rentalizer Logo PNG with Cyan Color" 
                className="max-w-full h-auto"
                style={{ maxHeight: '200px', minHeight: '100px' }}
              />
            </div>
            <p className="text-gray-300">
              Right-click on the logo above and select "Save image as..." to download the exact PNG with cyan color.
            </p>
          </CardContent>
        </Card>

        {/* Bar Chart Logo */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Download className="h-6 w-6 text-cyan-400" />
              BarChart Logo (Navigation Icon)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-white/10 rounded-lg p-8 inline-block">
              <img 
                src={barChartLogo} 
                alt="Rentalizer BarChart Logo High Resolution" 
                className="max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
            <p className="text-gray-300">
              Right-click on the bar chart logo above and select "Save image as..." to download as PNG.
            </p>
          </CardContent>
        </Card>

        {/* Text Logo */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Download className="h-6 w-6 text-cyan-400" />
              Text Logo (RENTALIZER)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-white/10 rounded-lg p-8 inline-block">
              <img 
                src={logo} 
                alt="Rentalizer Text Logo High Resolution" 
                className="max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
            <p className="text-gray-300">
              Right-click on the text logo above and select "Save image as..." to download as PNG.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoDownload;