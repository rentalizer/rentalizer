
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
  const [rapidApiKey, setRapidApiKey] = useState<string>('563ec2eceemshee4eb6d8e03f721p1oe15cjsn5666181f3c3');
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('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');
  const [isSaving, setIsSaving] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage - check multiple possible keys
    const savedRapidApiKey = localStorage.getItem('rapidapi_key') || 
                            localStorage.getItem('professional_data_key') || 
                            localStorage.getItem('airdna_api_key') || 
                            '563ec2eceemshee4eb6d8e03f721p1oe15cjsn5666181f3c3'; // Default API key
    const savedOpenaiApiKey = localStorage.getItem('openai_api_key') || 
                             localStorage.getItem('OPENAI_API_KEY') || 
                             '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'; // Default OpenAI API key
    
    console.log('🔍 Loading API Keys from localStorage:', {
      rapidApiKey: savedRapidApiKey ? `${savedRapidApiKey.substring(0, 8)}... (${savedRapidApiKey.length} chars)` : 'Not found',
      openaiApiKey: savedOpenaiApiKey ? `${savedOpenaiApiKey.substring(0, 8)}... (${savedOpenaiApiKey.length} chars)` : 'Not found'
    });
    
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
      // Save to localStorage with multiple keys for compatibility
      if (rapidApiKey) {
        localStorage.setItem('rapidapi_key', rapidApiKey);
        localStorage.setItem('professional_data_key', rapidApiKey);
        localStorage.setItem('airdna_api_key', rapidApiKey);
      }
      if (openaiApiKey) {
        localStorage.setItem('openai_api_key', openaiApiKey);
        localStorage.setItem('OPENAI_API_KEY', openaiApiKey);
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

  const handleToggleShowKeys = () => {
    setShowKeys(!showKeys);
    
    if (!showKeys) {
      // Log the keys when showing them
      console.log('🔑 Current API Keys:', {
        'STR Earnings API': rapidApiKey || 'Not set',
        'Rental Rates API': openaiApiKey || 'Not set'
      });
      
      toast({
        title: "API Keys Revealed",
        description: "API keys are now visible in the input fields. Check console for full details.",
      });
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
              {isRapidApiKeyValid && (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              )}
            </div>
            <Input
              id="rapidapi-key"
              type={showKeys ? "text" : "password"}
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
              type={showKeys ? "text" : "password"}
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
            onClick={handleToggleShowKeys}
            variant="outline"
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            {showKeys ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Keys
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Keys
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
