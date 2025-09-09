
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Search, Copy, AlertCircle, Check, X, Loader2, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airdnaApiKey?: string; openaiApiKey?: string; rentcastApiKey?: string }) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [airdnaKey, setAirdnaKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [rentcastKey, setRentcastKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);
  const [foundKeys, setFoundKeys] = useState<{[key: string]: string}>({});
  const [testingKeys, setTestingKeys] = useState(false);
  const [keyTestResults, setKeyTestResults] = useState<{[key: string]: 'testing' | 'valid' | 'invalid' | 'untested'}>({
    openai: 'untested',
    airdna: 'untested',
    rentcast: 'untested'
  });
  const { toast } = useToast();

  const getKeyStatus = (key: string, keyType: 'openai' | 'airdna' | 'rentcast') => {
    if (!key) return 'missing';
    if (key.length < 10) return 'invalid';
    
    const testResult = keyTestResults[keyType];
    if (testResult === 'testing') return 'testing';
    if (testResult === 'valid') return 'verified';
    if (testResult === 'invalid') return 'failed';
    
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Check className="h-3 w-3 text-green-500" />;
      case 'active': return <Check className="h-3 w-3 text-blue-500" />;
      case 'testing': return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
      case 'failed': return <X className="h-3 w-3 text-red-500" />;
      case 'invalid': return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'missing': return <X className="h-3 w-3 text-red-500" />;
      default: return <X className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">✓ Verified</Badge>;
      case 'active': return <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">Ready</Badge>;
      case 'testing': return <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">Testing...</Badge>;
      case 'failed': return <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">✗ Failed</Badge>;
      case 'invalid': return <Badge className="bg-yellow-600 text-white text-xs px-1.5 py-0.5">Invalid</Badge>;
      case 'missing': return <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">Missing</Badge>;
      default: return <Badge className="bg-gray-600 text-white text-xs px-1.5 py-0.5">Unknown</Badge>;
    }
  };

  const handleSaveKeys = () => {
    if (airdnaKey) localStorage.setItem('airdna_api_key', airdnaKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    if (rentcastKey) localStorage.setItem('rentcast_api_key', rentcastKey);
    
    onApiKeysChange({
      airdnaApiKey: airdnaKey || undefined,
      openaiApiKey: openaiKey || undefined,
      rentcastApiKey: rentcastKey || undefined
    });

    toast({
      title: "✅ API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  const handleClearKeys = () => {
    setAirdnaKey('');
    setOpenaiKey('');
    setRentcastKey('');
    localStorage.removeItem('airdna_api_key');
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('rentcast_api_key');
    
    onApiKeysChange({
      airdnaApiKey: undefined,
      openaiApiKey: undefined,
      rentcastApiKey: undefined
    });

    toast({
      title: "🗑️ API Keys Cleared",
      description: "Your API keys have been cleared.",
    });
  };

  const findAllStoredKeys = () => {
    console.log('🔍 SEARCHING FOR ALL API KEYS...');
    
    const allKeys: {[key: string]: string} = {};
    
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

  const testApiKeys = async () => {
    setTestingKeys(true);
    setKeyTestResults({
      openai: openaiKey ? 'testing' : 'untested',
      airdna: airdnaKey ? 'testing' : 'untested',
      rentcast: rentcastKey ? 'testing' : 'untested'
    });

    const results: {[key: string]: 'valid' | 'invalid' | 'untested'} = {
      openai: 'untested',
      airdna: 'untested',
      rentcast: 'untested'
    };

    // Test OpenAI API key
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          results.openai = 'valid';
          toast({
            title: "✅ OpenAI API Key Valid",
            description: "Your OpenAI API key is working correctly.",
          });
        } else {
          results.openai = 'invalid';
          toast({
            title: "❌ OpenAI API Key Invalid",
            description: "Your OpenAI API key failed authentication.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('OpenAI API test failed:', error);
        results.openai = 'invalid';
        toast({
          title: "❌ OpenAI API Test Failed",
          description: "Could not connect to OpenAI API.",
          variant: "destructive",
        });
      }
    }

    // Test AirDNA API key (if provided)
    if (airdnaKey) {
      // Note: This is a placeholder - you would need the actual AirDNA API endpoint
      // For now, just check if it looks like a valid API key format
      if (airdnaKey.length > 20) {
        results.airdna = 'valid';
        toast({
          title: "ℹ️ AirDNA API Key Format Valid",
          description: "Key format appears correct (actual API test not implemented).",
        });
      } else {
        results.airdna = 'invalid';
        toast({
          title: "❌ AirDNA API Key Invalid",
          description: "API key format appears incorrect.",
          variant: "destructive",
        });
      }
    }

    // Test RentCast API key (if provided)
    if (rentcastKey) {
      // Note: This is a placeholder - you would need the actual RentCast API endpoint
      // For now, just check if it looks like a valid API key format
      if (rentcastKey.length > 20) {
        results.rentcast = 'valid';
        toast({
          title: "ℹ️ RentCast API Key Format Valid",
          description: "Key format appears correct (actual API test not implemented).",
        });
      } else {
        results.rentcast = 'invalid';
        toast({
          title: "❌ RentCast API Key Invalid",
          description: "API key format appears incorrect.",
          variant: "destructive",
        });
      }
    }

    setKeyTestResults(results);
    setTestingKeys(false);

    const validCount = Object.values(results).filter(result => result === 'valid').length;
    const totalTested = Object.values(results).filter(result => result !== 'untested').length;
    
    toast({
      title: `API Test Complete`,
      description: `${validCount} of ${totalTested} API keys verified successfully.`,
    });
  };

  React.useEffect(() => {
    const savedAirDNAKey = localStorage.getItem('airdna_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    const savedRentcastKey = localStorage.getItem('rentcast_api_key') || '';
    
    setAirdnaKey(savedAirDNAKey);
    setOpenaiKey(savedOpenaiKey);
    setRentcastKey(savedRentcastKey);
    
    if (savedAirDNAKey || savedOpenaiKey || savedRentcastKey) {
      onApiKeysChange({
        airdnaApiKey: savedAirDNAKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined,
        rentcastApiKey: savedRentcastKey || undefined
      });
    }
  }, []);

  return (
    <Card className="shadow-xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg max-w-xl mx-auto">
      <CardHeader className="pb-2 border-b border-gray-700/50">
        <CardTitle className="flex items-center justify-between text-cyan-300 text-sm">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-cyan-400" />
            API Configuration
          </div>
          <Button
            onClick={findAllStoredKeys}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs px-2 py-1 h-6"
          >
            <Search className="h-3 w-3 mr-1" />
            Find All Keys
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3">
        <div className="space-y-3">
          {/* Show Found Keys Section */}
          {showStoredKeys && (
            <div className="bg-gray-800/60 p-3 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <h4 className="font-medium text-yellow-300 text-sm">All Stored Keys Found:</h4>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.keys(foundKeys).length > 0 ? (
                  Object.entries(foundKeys).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-200">{key}</div>
                        <div className="text-xs font-mono text-gray-400 truncate">
                          {showKeys ? value : `${value.substring(0, 10)}...`}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(value, key)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xs">No keys found in storage</div>
                )}
              </div>
            </div>
          )}

            {/* API Key Inputs with Status - Compact */}
            <div className="grid grid-cols-1 gap-3">
              {/* STR Revenue API Key (AirDNA) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-cyan-300">STR Revenue API (AirDNA)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                  {getStatusIcon(getKeyStatus(airdnaKey, 'airdna'))}
                  <div className="flex-1 min-w-0">
                    <Input
                      id="airdna-key"
                      type={showKeys ? "text" : "password"}
                      value={airdnaKey}
                      onChange={(e) => {
                        setAirdnaKey(e.target.value);
                        setKeyTestResults(prev => ({ ...prev, airdna: 'untested' }));
                      }}
                      placeholder="Enter your AirDNA API key"
                      className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {airdnaKey && showKeys && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(airdnaKey, 'AirDNA API')}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    {getStatusBadge(getKeyStatus(airdnaKey, 'airdna'))}
                  </div>
                </div>
              </div>

              {/* RentCast API Key */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-cyan-300">STR Revenue API (RentCast)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                  {getStatusIcon(getKeyStatus(rentcastKey, 'rentcast'))}
                  <div className="flex-1 min-w-0">
                    <Input
                      id="rentcast-key"
                      type={showKeys ? "text" : "password"}
                      value={rentcastKey}
                      onChange={(e) => {
                        setRentcastKey(e.target.value);
                        setKeyTestResults(prev => ({ ...prev, rentcast: 'untested' }));
                      }}
                      placeholder="Enter your RentCast API key"
                      className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {rentcastKey && showKeys && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(rentcastKey, 'RentCast API')}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    {getStatusBadge(getKeyStatus(rentcastKey, 'rentcast'))}
                  </div>
                </div>
              </div>

              {/* Rental Rates API Key */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-cyan-300">Rental Rates API (OpenAI)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                  {getStatusIcon(getKeyStatus(openaiKey, 'openai'))}
                  <div className="flex-1 min-w-0">
                    <Input
                      id="openai-key"
                      type={showKeys ? "text" : "password"}
                      value={openaiKey}
                      onChange={(e) => {
                        setOpenaiKey(e.target.value);
                        setKeyTestResults(prev => ({ ...prev, openai: 'untested' }));
                      }}
                      placeholder="Enter your OpenAI API key"
                      className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {openaiKey && showKeys && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(openaiKey, 'OpenAI API')}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    {getStatusBadge(getKeyStatus(openaiKey, 'openai'))}
                  </div>
                </div>
              </div>
            </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              className="flex items-center gap-1 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 text-xs px-2 py-1 h-6"
            >
              {showKeys ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={testApiKeys}
                disabled={testingKeys || (!airdnaKey && !openaiKey && !rentcastKey)}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs px-2 py-1 h-6"
              >
                {testingKeys ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-3 w-3 mr-1" />
                    Test Keys
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleClearKeys}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-300 hover:bg-red-500/10 text-xs px-2 py-1 h-6"
              >
                Clear All
              </Button>
              
              <Button
                onClick={handleSaveKeys}
                size="sm"
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 text-xs px-3 py-1 h-6"
              >
                Save Config
              </Button>
            </div>
          </div>

          <div className="mt-2 p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="text-xs text-blue-300">
              <strong>Environment:</strong> {window.location.hostname === 'localhost' ? 'Preview/Development' : 'Production'}
            </div>
            <div className="text-xs text-blue-400 mt-1">
              Click "Test Keys" to verify your API keys are working correctly
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ApiKeyInput };
