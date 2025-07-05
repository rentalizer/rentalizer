import React from 'react';
import { Button } from '@/components/ui/button';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export const AdminSetup = () => {
  const { isAdmin, makeAdmin, loading } = useAdminRole();
  const { toast } = useToast();

  // Force check admin status on mount
  React.useEffect(() => {
    console.log('AdminSetup - isAdmin status:', isAdmin, 'loading:', loading);
  }, [isAdmin, loading]);

  const handleMakeAdmin = async () => {
    const success = await makeAdmin();
    if (success) {
      toast({
        title: "Admin Role Granted",
        description: "You now have administrator privileges.",
      });
    } else {
      toast({
        title: "Info",
        description: "You are already an administrator.",
        variant: "default"
      });
    }
  };

  // Don't show the button if user is already admin
  if (isAdmin) {
    console.log('User is admin, hiding AdminSetup button');
    return null; 
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