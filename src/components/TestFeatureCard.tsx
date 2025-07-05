import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, Play } from 'lucide-react';

interface TestFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const TestFeatureCard = ({ icon: Icon, title, description, buttonText, onClick }: TestFeatureCardProps) => {
  return (
    <div className="flex flex-col">
      <Card 
        className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1 hover:scale-105"
        onClick={onClick}
      >
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors relative">
            <Icon className="h-8 w-8 text-blue-400" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          </div>
          <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-400 text-sm mb-4">
            {description}
          </p>
          <div className="text-xs text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to see live demo
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white group-hover:scale-105 transition-transform"
      >
        <Play className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};