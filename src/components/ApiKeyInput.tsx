
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Search } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [airdnaKey, setAirdnaKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);

  const handleSaveKeys = () => {
    // Store in localStorage for session persistence
    if (airdnaKey) localStorage.setItem('airdna_api_key', airdnaKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    onApiKeysChange({
      airdnaApiKey: airdnaKey || undefined,
      openaiApiKey: openaiKey || undefined
    });
  };

  const handleViewStoredKeys = () => {
    const storedAirdna = localStorage.getItem('airdna_api_key') || 'Not set';
    const storedOpenai = localStorage.getItem('openai_api_key') || 'Not set';
    
    console.log('=== STORED API KEYS ===');
    console.log('AirDNA API Key:', storedAirdna);
    console.log('OpenAI API Key:', storedOpenai);
    console.log('=====================');
    
    setShowStoredKeys(!showStoredKeys);
  };

  const getStoredKeys = () => {
    return {
      airdna: localStorage.getItem('airdna_api_key') || 'Not set',
      openai: localStorage.getItem('openai_api_key') || 'Not set'
    };
  };

  // Load keys from localStorage on component mount
  React.useEffect(() => {
    const savedAirdnaKey = localStorage.getItem('airdna_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    setAirdnaKey(savedAirdnaKey);
    setOpenaiKey(savedOpenaiKey);
    
    if (savedAirdnaKey || savedOpenaiKey) {
      onApiKeysChange({
        airdnaApiKey: savedAirdnaKey || undefined,
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
            <h4 className="font-medium text-blue-900 mb-2">API Integration Options:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">AirDNA</Badge>
                <span>For real STR revenue data ($99+/month)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">OpenAI</Badge>
                <span>For AI-powered rental data research</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Leave blank to use sample data. Keys are stored locally in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="airdna-key" className="text-sm font-medium">
                AirDNA API Key (Optional)
              </Label>
              <Input
                id="airdna-key"
                type={showKeys ? "text" : "password"}
                value={airdnaKey}
                onChange={(e) => setAirdnaKey(e.target.value)}
                placeholder="Enter AirDNA API key..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from: airdna.co/vacation-rental-data-api
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
                  <span className="font-medium">AirDNA:</span> 
                  <span className="ml-2 font-mono text-xs">
                    {getStoredKeys().airdna === 'Not set' ? 'Not set' : `${getStoredKeys().airdna.substring(0, 8)}...`}
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
