import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CompsSectionProps {
  comps: any[];
  setComps: (comps: any[]) => void;
  editMode: boolean;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  comps,
  setComps,
  editMode
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Property Comps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-400">
          Comps section temporarily disabled
        </div>
      </CardContent>
    </Card>
  );
};