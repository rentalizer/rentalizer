import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sofa } from 'lucide-react';

interface FurnishingsSectionProps {
  furnishings: any[];
  setFurnishings: (furnishings: any[]) => void;
  editMode: boolean;
}

export const FurnishingsSection: React.FC<FurnishingsSectionProps> = ({
  furnishings,
  setFurnishings,
  editMode
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Sofa className="h-5 w-5 text-cyan-400" />
          Furnishings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-400">
          Furnishings section temporarily disabled
        </div>
      </CardContent>
    </Card>
  );
};