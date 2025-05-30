
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
  const [professionalKey, setProfessionalKey] = useState('563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3');
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
    const savedProfessionalKey = localStorage.getItem('professional_data_key') || '563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3';
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

  // Auto-save the AirDNA key on component mount
  React.useEffect(() => {
    if (professionalKey === '563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3') {
      localStorage.setItem('professional_data_key', professionalKey);
      onApiKeysChange({
        airdnaApiKey: professionalKey,
        openaiApiKey: openaiKey || undefined
      });
    }
  }, []);

  return (
    <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
      <CardHeader className="pb-4 border-b border-gray-700/50">
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Key className="h-5 w-5 text-cyan-400" />
          Data Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="professional-key" className="text-sm font-medium text-gray-300">
                Professional Data Key (AirDNA) ✅
              </Label>
              <Input
                id="professional-key"
                type={showKeys ? "text" : "password"}
                value={professionalKey}
                onChange={(e) => setProfessionalKey(e.target.value)}
                placeholder="Enter professional data API key..."
                className="mt-1 border-green-500/30 bg-gray-800/50 text-gray-100 focus:border-green-400 focus:ring-green-400/20 placeholder:text-gray-500"
              />
              <p className="text-xs text-green-400 mt-1">
                ✅ AirDNA API key configured
              </p>
            </div>

            <div>
              <Label htmlFor="openai-key" className="text-sm font-medium text-gray-300">
                AI Research Key (OpenAI) - Required
              </Label>
              <Input
                id="openai-key"
                type={showKeys ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter OpenAI API key (sk-...)..."
                className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from: platform.openai.com/api-keys
              </p>
            </div>
          </div>

          {showStoredKeys && (
            <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-600/30">
              <h4 className="font-medium text-gray-100 mb-2">Currently Stored Keys:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-200">Professional Data:</span> 
                  <span className="ml-2 font-mono text-xs text-gray-300">
                    {getStoredKeys().professional === 'Not set' ? 'Not set' : `${getStoredKeys().professional.substring(0, 8)}...`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-200">AI Research:</span> 
                  <span className="ml-2 font-mono text-xs text-gray-300">
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
                className="flex items-center gap-2 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKeys ? 'Hide' : 'Show'} Keys
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewStoredKeys}
                className="flex items-center gap-2 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
              >
                <Search className="h-4 w-4" />
                {showStoredKeys ? 'Hide' : 'Find'} Stored Keys
              </Button>
            </div>

            <Button
              onClick={handleSaveKeys}
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
