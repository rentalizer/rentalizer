import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const AuthTest: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const testHealthCheck = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.healthCheck();
      toast({
        title: "Health Check Success",
        description: `Server: ${response.message} at ${response.timestamp}`,
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getProfile();
      toast({
        title: "Profile Retrieved",
        description: `Welcome ${response.user.firstName || response.user.email}!`,
      });
    } catch (error) {
      toast({
        title: "Profile Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Backend Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Please log in to test backend connection.</p>
          <Button onClick={testHealthCheck} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Server Health"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
          <p className="text-sm text-gray-600">User ID: {user.id}</p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testHealthCheck} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Server Health"}
          </Button>
          
          <Button onClick={testProfile} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Profile Access"}
          </Button>
          
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
