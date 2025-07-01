import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface BuildOutSectionProps {
  buildOut: any[];
  setBuildOut: (buildOut: any[]) => void;
  editMode: boolean;
}

export const BuildOutSection: React.FC<BuildOutSectionProps> = ({
  buildOut,
  setBuildOut,
  editMode
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Building2 className="h-5 w-5 text-cyan-400" />
          Build Out Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-400">
          Build out section temporarily disabled
        </div>
      </CardContent>
    </Card>
  );
};