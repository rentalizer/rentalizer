
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { rapidApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const { toast } = useToast();
  const [rapidApiKey, setRapidApiKey] = useState<string>('');
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedRapidApiKey = localStorage.getItem('rapidapi_key') || '';
    const savedOpenaiApiKey = localStorage.getItem('openai_api_key') || '';
    
    setRapidApiKey(savedRapidApiKey);
    setOpenaiApiKey(savedOpenaiApiKey);
    
    // Notify parent of existing keys
    onApiKeysChange({
      rapidApiKey: savedRapidApiKey,
      openaiApiKey: savedOpenaiApiKey
    });
  }, [onApiKeysChange]);

  const handleSaveKeys = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage
      if (rapidApiKey) {
        localStorage.setItem('rapidapi_key', rapidApiKey);
      }
      if (openaiApiKey) {
        localStorage.setItem('openai_api_key', openaiApiKey);
      }
      
      // Notify parent component
      onApiKeysChange({
        rapidApiKey: rapidApiKey || undefined,
        openaiApiKey: openaiApiKey || undefined
      });
      
      toast({
        title: "API Keys Saved",
        description: "Your RapidAPI and OpenAI keys have been saved locally.",
      });
      
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save API keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isRapidApiKeyValid = rapidApiKey.length > 10;
  const isOpenaiKeyValid = openaiApiKey.length > 10;

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
      <CardHeader className="pb-4 border-b border-gray-700/50">
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Key className="h-5 w-5 text-cyan-400" />
          API Configuration
        </CardTitle>
        <p className="text-sm text-gray-400">
          Configure your STR Earnings API key for Airbnb data scraping and Rental Rates API for AI features
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-4">
          {/* RapidAPI Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="rapidapi-key" className="text-sm font-medium text-gray-300">
                STR Earnings API
              </label>
              {isRapidApiKeyValid ? (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Required
                </Badge>
              )}
            </div>
            <Input
              id="rapidapi-key"
              type="password"
              value={rapidApiKey}
              onChange={(e) => setRapidApiKey(e.target.value)}
              placeholder="Enter your STR Earnings API key"
              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400"
            />
            <p className="text-xs text-gray-500">
              Get your key from RapidAPI Airbnb Scraper subscription
            </p>
          </div>

          {/* OpenAI Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="openai-key" className="text-sm font-medium text-gray-300">
                Rental Rates API (Optional)
              </label>
              {isOpenaiKeyValid ? (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                  Optional
                </Badge>
              )}
            </div>
            <Input
              id="openai-key"
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="Enter your Rental Rates API key for AI features"
              className="border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400"
            />
            <p className="text-xs text-gray-500">
              Required for AI-powered market insights and recommendations
            </p>
          </div>
        </div>

        <Button
          onClick={handleSaveKeys}
          disabled={isSaving || !rapidApiKey}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save API Keys
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
