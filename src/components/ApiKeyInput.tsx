import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, Search, Copy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [airbnbKey, setAirbnbKey] = useState('');
  const [mashvisorKey, setMashvisorKey] = useState('563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3');
  const [airdnaKey, setAirdnaKey] = useState('563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3');
  const [openaiKey, setOpenaiKey] = useState('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');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);
  const [foundKeys, setFoundKeys] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

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

  const findAllStoredKeys = () => {
    console.log('🔍 SEARCHING FOR ALL API KEYS...');
    
    const allKeys: {[key: string]: string} = {};
    
    // Search all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          allKeys[key] = value;
        }
      }
    }
    
    console.log('🗂️ ALL STORED KEYS FOUND:', allKeys);
    
    // Show specific API keys
    const apiKeys = {
      'openai_api_key': localStorage.getItem('openai_api_key') || 'NOT FOUND',
      'airdna_api_key': localStorage.getItem('airdna_api_key') || 'NOT FOUND', 
      'mashvisor_api_key': localStorage.getItem('mashvisor_api_key') || 'NOT FOUND',
      'airbnb_api_key': localStorage.getItem('airbnb_api_key') || 'NOT FOUND',
      'professional_data_key': localStorage.getItem('professional_data_key') || 'NOT FOUND'
    };
    
    console.log('🔑 SPECIFIC API KEYS:', apiKeys);
    
    setFoundKeys(allKeys);
    setShowStoredKeys(!showStoredKeys);
    
    const keyCount = Object.keys(allKeys).length;
    toast({
      title: `🔍 Found ${keyCount} Total Keys`,
      description: "All stored keys are now displayed below. Check browser console for full details.",
    });
  };

  const copyToClipboard = async (text: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "✅ Copied!",
        description: `${keyName} copied to clipboard`,
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "❌ Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Load keys from localStorage on component mount
  React.useEffect(() => {
    const savedAirbnbKey = localStorage.getItem('airbnb_api_key') || '';
    const savedMashvisorKey = localStorage.getItem('mashvisor_api_key') || '563ec2eceemshee4a0b6d8e03f721b10e5cjen566818f3fc3';
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
    localStorage.setItem('mashvisor_api_key', mashvisorKey);
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
        <CardTitle className="flex items-center justify-between text-cyan-300">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-cyan-400" />
            Aggregate Data Configuration
          </div>
          <Button
            onClick={findAllStoredKeys}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-500 text-white"
          >
            <Search className="h-4 w-4 mr-1" />
            Find All Stored Keys
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Show Found Keys Section */}
          {showStoredKeys && (
            <div className="bg-gray-800/60 p-4 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <h4 className="font-medium text-yellow-300">All Stored Keys Found:</h4>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {Object.keys(foundKeys).length > 0 ? (
                  Object.entries(foundKeys).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200">{key}</div>
                        <div className="text-xs font-mono text-gray-400 truncate">
                          {showKeys ? value : `${value.substring(0, 10)}...`}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(value, key)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No keys found in storage</div>
                )}
              </div>
            </div>
          )}

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
                  Mashvisor API Key ✅
                </Label>
                <Input
                  id="mashvisor-key"
                  type={showKeys ? "text" : "password"}
                  value={mashvisorKey}
                  onChange={(e) => setMashvisorKey(e.target.value)}
                  placeholder="Enter Mashvisor API key..."
                  className="mt-1 border-green-500/30 bg-gray-800/50 text-gray-100 focus:border-green-400 focus:ring-green-400/20 placeholder:text-gray-500"
                />
                <p className="text-xs text-green-400 mt-1">
                  ✅ Investment analysis data
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

          <div className="flex items-center justify-between flex-wrap gap-2">
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
