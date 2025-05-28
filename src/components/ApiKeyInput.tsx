
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Search } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airbnbApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [airbnbKey, setAirbnbKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);

  const handleSaveKeys = () => {
    // Store in localStorage for session persistence
    if (airbnbKey) localStorage.setItem('airbnb_api_key', airbnbKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    onApiKeysChange({
      airbnbApiKey: airbnbKey || undefined,
      openaiApiKey: openaiKey || undefined
    });
  };

  const handleViewStoredKeys = () => {
    const storedAirbnb = localStorage.getItem('airbnb_api_key') || 'Not set';
    const storedOpenai = localStorage.getItem('openai_api_key') || 'Not set';
    
    console.log('=== STORED API KEYS ===');
    console.log('Airbnb API Key:', storedAirbnb);
    console.log('OpenAI API Key:', storedOpenai);
    console.log('=====================');
    
    setShowStoredKeys(!showStoredKeys);
  };

  const getStoredKeys = () => {
    return {
      airbnb: localStorage.getItem('airbnb_api_key') || 'Not set',
      openai: localStorage.getItem('openai_api_key') || 'Not set'
    };
  };

  // Load keys from localStorage on component mount
  React.useEffect(() => {
    const savedAirbnbKey = localStorage.getItem('airbnb_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    setAirbnbKey(savedAirbnbKey);
    setOpenaiKey(savedOpenaiKey);
    
    if (savedAirbnbKey || savedOpenaiKey) {
      onApiKeysChange({
        airbnbApiKey: savedAirbnbKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
    }
  }, [onApiKeysChange]);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Professional STR Market Intelligence:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Airbnb Search API</Badge>
                <span>Live Airbnb listings data (via RapidAPI)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">OpenAI</Badge>
                <span>AI-powered rental data research ($5-20/month)</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Leave blank to use sample data. Keys are stored locally in your browser.
              </p>
              <p className="text-xs text-green-600 mt-1">
                ✅ Now using Airbnb Search API - the same data source that powers Airbnb!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="airbnb-key" className="text-sm font-medium">
                Airbnb Search API Key (Live STR Data)
              </Label>
              <Input
                id="airbnb-key"
                type={showKeys ? "text" : "password"}
                value={airbnbKey}
                onChange={(e) => setAirbnbKey(e.target.value)}
                placeholder="Enter Airbnb Search RapidAPI key..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from: rapidapi.com/hub (search "Airbnb Search")
              </p>
            </div>

            <div>
              <Label htmlFor="openai-key" className="text-sm font-medium">
                OpenAI API Key (Optional)
              </Label>
              <Input
                id="openai-key"
                type={showKeys ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter OpenAI API key..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from: platform.openai.com/api-keys
              </p>
            </div>
          </div>

          {showStoredKeys && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Currently Stored Keys:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Airbnb Search API:</span> 
                  <span className="ml-2 font-mono text-xs">
                    {getStoredKeys().airbnb === 'Not set' ? 'Not set' : `${getStoredKeys().airbnb.substring(0, 8)}...`}
                  </span>
                </div>
                <div>
                  <span className="font-medium">OpenAI:</span> 
                  <span className="ml-2 font-mono text-xs">
                    {getStoredKeys().openai === 'Not set' ? 'Not set' : `${getStoredKeys().openai.substring(0, 8)}...`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowKeys(!showKeys)}
                className="flex items-center gap-2"
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKeys ? 'Hide' : 'Show'} Keys
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewStoredKeys}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {showStoredKeys ? 'Hide' : 'Find'} Stored Keys
              </Button>
            </div>

            <Button
              onClick={handleSaveKeys}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
