import React from 'react';
import { Button } from '@/components/ui/button';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export const AdminSetup = () => {
  const { isAdmin, makeAdmin, loading } = useAdminRole();
  const { toast } = useToast();

  const handleMakeAdmin = async () => {
    const success = await makeAdmin();
    if (success) {
      toast({
        title: "Admin Role Granted",
        description: "You now have administrator privileges.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to grant admin privileges. Check console for details.",
        variant: "destructive"
      });
    }
  };

  if (isAdmin) {
    return null; // Hide component if already admin
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleMakeAdmin}
        disabled={loading}
        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg"
      >
        <Shield className="h-4 w-4 mr-2" />
        Make Me Admin
      </Button>
    </div>
  );
};