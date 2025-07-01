
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminEditModeProps {
  onEditModeChange?: (isEditing: boolean) => void;
}

export const AdminEditMode = ({ onEditModeChange }: AdminEditModeProps) => {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if user is admin (you can adjust this logic based on your admin setup)
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('richie');

  // Don't show edit mode for non-admin users
  if (!isAdmin) {
    return null;
  }

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    onEditModeChange?.(newEditMode);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-300">
          ADMIN
        </Badge>
        <Button
          onClick={toggleEditMode}
          size="sm"
          variant={isEditMode ? "destructive" : "outline"}
          className={isEditMode 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300"
          }
        >
          {isEditMode ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Exit Edit
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Mode
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
