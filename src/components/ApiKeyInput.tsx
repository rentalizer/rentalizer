
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, Search } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [professionalKey, setProfessionalKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);

  const handleSaveKeys = () => {
    // Store in localStorage for session persistence
    if (professionalKey) localStorage.setItem('professional_data_key', professionalKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    onApiKeysChange({
      airdnaApiKey: professionalKey || undefined,
      openaiApiKey: openaiKey || undefined
    });
  };

  const handleViewStoredKeys = () => {
    const storedProfessional = localStorage.getItem('professional_data_key') || 'Not set';
    const storedOpenai = localStorage.getItem('openai_api_key') || 'Not set';
    
    console.log('=== STORED API KEYS ===');
    console.log('Professional Data Key:', storedProfessional);
    console.log('OpenAI API Key:', storedOpenai);
    console.log('=====================');
    
    setShowStoredKeys(!showStoredKeys);
  };

  const getStoredKeys = () => {
    return {
      professional: localStorage.getItem('professional_data_key') || 'Not set',
      openai: localStorage.getItem('openai_api_key') || 'Not set'
    };
  };

  // Load keys from localStorage on component mount
  React.useEffect(() => {
    const savedProfessionalKey = localStorage.getItem('professional_data_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    setProfessionalKey(savedProfessionalKey);
    setOpenaiKey(savedOpenaiKey);
    
    if (savedProfessionalKey || savedOpenaiKey) {
      onApiKeysChange({
        airdnaApiKey: savedProfessionalKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
    }
  }, [onApiKeysChange]);

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          Data Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="professional-key" className="text-sm font-medium">
                Professional Data Key (Optional)
              </Label>
              <Input
                id="professional-key"
                type={showKeys ? "text" : "password"}
                value={professionalKey}
                onChange={(e) => setProfessionalKey(e.target.value)}
                placeholder="Enter professional data API key..."
                className="mt-1 border-blue-200 focus:border-cyan-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from: rapidapi.com/hub (search for short-term rental data)
              </p>
            </div>

            <div>
              <Label htmlFor="openai-key" className="text-sm font-medium">
                AI Research Key (Optional)
              </Label>
              <Input
                id="openai-key"
                type={showKeys ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter AI research API key..."
                className="mt-1 border-blue-200 focus:border-cyan-400"
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
                  <span className="font-medium">Professional Data:</span> 
                  <span className="ml-2 font-mono text-xs">
                    {getStoredKeys().professional === 'Not set' ? 'Not set' : `${getStoredKeys().professional.substring(0, 8)}...`}
                  </span>
                </div>
                <div>
                  <span className="font-medium">AI Research:</span> 
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
                className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKeys ? 'Hide' : 'Show'} Keys
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewStoredKeys}
                className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
              >
                <Search className="h-4 w-4" />
                {showStoredKeys ? 'Hide' : 'Find'} Stored Keys
              </Button>
            </div>

            <Button
              onClick={handleSaveKeys}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
