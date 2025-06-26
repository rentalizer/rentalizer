
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const FeatureCard = ({ icon: Icon, title, description, buttonText, onClick }: FeatureCardProps) => {
  return (
    <div className="flex flex-col">
      <Card 
        className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer mb-4 flex-1"
        onClick={onClick}
      >
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
            <Icon className="h-8 w-8 text-blue-400" />
          </div>
          <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-400 text-sm">
            {description}
          </p>
        </CardContent>
      </Card>
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
      >
        <Icon className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};
