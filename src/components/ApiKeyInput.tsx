
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
  const [airbnbKey, setAirbnbKey] = useState('');
  const [mashvisorKey, setMashvisorKey] = useState('');
  const [airdnaKey, setAirdnaKey] = useState('563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3');
  const [openaiKey, setOpenaiKey] = useState('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');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);

  const handleSaveKeys = () => {
    // Store in localStorage for session persistence
    if (airbnbKey) localStorage.setItem('airbnb_api_key', airbnbKey);
    if (mashvisorKey) localStorage.setItem('mashvisor_api_key', mashvisorKey);
    if (airdnaKey) localStorage.setItem('airdna_api_key', airdnaKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    onApiKeysChange({
      airdnaApiKey: airdnaKey || undefined,
      openaiApiKey: openaiKey || undefined
    });
  };

  const handleViewStoredKeys = () => {
    const storedAirbnb = localStorage.getItem('airbnb_api_key') || 'Not set';
    const storedMashvisor = localStorage.getItem('mashvisor_api_key') || 'Not set';
    const storedAirDNA = localStorage.getItem('airdna_api_key') || 'Not set';
    const storedOpenai = localStorage.getItem('openai_api_key') || 'Not set';
    
    console.log('=== STORED API KEYS ===');
    console.log('Airbnb API Key:', storedAirbnb);
    console.log('Mashvisor API Key:', storedMashvisor);
    console.log('AirDNA API Key:', storedAirDNA);
    console.log('OpenAI API Key:', storedOpenai);
    console.log('=====================');
    
    setShowStoredKeys(!showStoredKeys);
  };

  const getStoredKeys = () => {
    return {
      airbnb: localStorage.getItem('airbnb_api_key') || 'Not set',
      mashvisor: localStorage.getItem('mashvisor_api_key') || 'Not set',
      airdna: localStorage.getItem('airdna_api_key') || 'Not set',
      openai: localStorage.getItem('openai_api_key') || 'Not set'
    };
  };

  // Load keys from localStorage on component mount
  React.useEffect(() => {
    const savedAirbnbKey = localStorage.getItem('airbnb_api_key') || '';
    const savedMashvisorKey = localStorage.getItem('mashvisor_api_key') || '';
    const savedAirDNAKey = localStorage.getItem('airdna_api_key') || '563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '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';
    
    setAirbnbKey(savedAirbnbKey);
    setMashvisorKey(savedMashvisorKey);
    setAirdnaKey(savedAirDNAKey);
    setOpenaiKey(savedOpenaiKey);
    
    if (savedAirDNAKey || savedOpenaiKey) {
      onApiKeysChange({
        airdnaApiKey: savedAirDNAKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
    }
  }, [onApiKeysChange]);

  // Auto-save API keys on component mount
  React.useEffect(() => {
    localStorage.setItem('airdna_api_key', airdnaKey);
    localStorage.setItem('openai_api_key', openaiKey);
    onApiKeysChange({
      airdnaApiKey: airdnaKey,
      openaiApiKey: openaiKey
    });
  }, []);

  return (
    <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
      <CardHeader className="pb-4 border-b border-gray-700/50">
        <CardTitle className="flex items-center gap-2 text-cyan-300">
          <Key className="h-5 w-5 text-cyan-400" />
          Aggregate Data Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Professional Data Keys Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Professional Data Keys</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="airbnb-key" className="text-sm font-medium text-gray-300">
                  Airbnb API Key
                </Label>
                <Input
                  id="airbnb-key"
                  type={showKeys ? "text" : "password"}
                  value={airbnbKey}
                  onChange={(e) => setAirbnbKey(e.target.value)}
                  placeholder="Enter Airbnb API key..."
                  className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Direct Airbnb listing data
                </p>
              </div>

              <div>
                <Label htmlFor="mashvisor-key" className="text-sm font-medium text-gray-300">
                  Mashvisor API Key
                </Label>
                <Input
                  id="mashvisor-key"
                  type={showKeys ? "text" : "password"}
                  value={mashvisorKey}
                  onChange={(e) => setMashvisorKey(e.target.value)}
                  placeholder="Enter Mashvisor API key..."
                  className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Investment analysis data
                </p>
              </div>

              <div>
                <Label htmlFor="airdna-key" className="text-sm font-medium text-gray-300">
                  AirDNA API Key ✅
                </Label>
                <Input
                  id="airdna-key"
                  type={showKeys ? "text" : "password"}
                  value={airdnaKey}
                  onChange={(e) => setAirdnaKey(e.target.value)}
                  placeholder="Enter AirDNA API key..."
                  className="mt-1 border-green-500/30 bg-gray-800/50 text-gray-100 focus:border-green-400 focus:ring-green-400/20 placeholder:text-gray-500"
                />
                <p className="text-xs text-green-400 mt-1">
                  ✅ Market analytics data
                </p>
              </div>
            </div>
          </div>

          {/* AI Research Key Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">AI Research Key</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="openai-key" className="text-sm font-medium text-gray-300">
                  OpenAI API Key ✅
                </Label>
                <Input
                  id="openai-key"
                  type={showKeys ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="Enter OpenAI API key (sk-...)..."
                  className="mt-1 border-green-500/30 bg-gray-800/50 text-gray-100 focus:border-green-400 focus:ring-green-400/20 placeholder:text-gray-500"
                />
                <p className="text-xs text-green-400 mt-1">
                  ✅ OpenAI API key configured
                </p>
              </div>
            </div>
          </div>

          {showStoredKeys && (
            <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-600/30">
              <h4 className="font-medium text-gray-100 mb-2">Currently Stored Keys:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-200">Airbnb:</span> 
                  <span className="ml-2 font-mono text-xs text-gray-300">
                    {getStoredKeys().airbnb === 'Not set' ? 'Not set' : `${getStoredKeys().airbnb.substring(0, 8)}...`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-200">Mashvisor:</span> 
                  <span className="ml-2 font-mono text-xs text-gray-300">
                    {getStoredKeys().mashvisor === 'Not set' ? 'Not set' : `${getStoredKeys().mashvisor.substring(0, 8)}...`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-200">AirDNA:</span> 
                  <span className="ml-2 font-mono text-xs text-gray-300">
                    {getStoredKeys().airdna === 'Not set' ? 'Not set' : `${getStoredKeys().airdna.substring(0, 8)}...`}
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
