
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { rapidApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const { toast } = useToast();
  const [rapidApiKey, setRapidApiKey] = useState<string>('');
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);

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
        description: "Your STR Earnings and Rental Rates API keys have been saved locally.",
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

  const handleViewStoredKeys = () => {
    const storedRapidApi = localStorage.getItem('rapidapi_key') || 'Not set';
    const storedOpenai = localStorage.getItem('openai_api_key') || 'Not set';
    
    console.log('🔑 Stored API Keys:', {
      'STR Earnings API': storedRapidApi.length > 0 ? `${storedRapidApi.substring(0, 8)}... (${storedRapidApi.length} chars)` : 'Not set',
      'Rental Rates API': storedOpenai.length > 0 ? `${storedOpenai.substring(0, 8)}... (${storedOpenai.length} chars)` : 'Not set'
    });
    
    toast({
      title: "API Keys Status",
      description: `STR Earnings: ${storedRapidApi !== 'Not set' ? 'Loaded' : 'Not set'} | Rental Rates: ${storedOpenai !== 'Not set' ? 'Loaded' : 'Not set'}. Check console for details.`,
    });
    
    setShowStoredKeys(!showStoredKeys);
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
              {isRapidApiKeyValid && (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
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
                Rental Rates API
              </label>
              {isOpenaiKeyValid && (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
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

        <div className="flex gap-2">
          <Button
            onClick={handleSaveKeys}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
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
          
          <Button
            onClick={handleViewStoredKeys}
            variant="outline"
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            {showStoredKeys ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
