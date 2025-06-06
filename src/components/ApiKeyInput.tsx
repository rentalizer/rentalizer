
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Search, Copy, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { mashvisorApiKey?: string; openaiApiKey?: string }) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [mashvisorKey, setMashvisorKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [showStoredKeys, setShowStoredKeys] = useState(false);
  const [foundKeys, setFoundKeys] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const getKeyStatus = (key: string) => {
    if (!key) return 'missing';
    if (key.length < 10) return 'invalid';
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="h-3 w-3 text-green-500" />;
      case 'invalid': return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'missing': return <X className="h-3 w-3 text-red-500" />;
      default: return <X className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">Active</Badge>;
      case 'invalid': return <Badge className="bg-yellow-600 text-white text-xs px-1.5 py-0.5">Invalid</Badge>;
      case 'missing': return <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">Missing</Badge>;
      default: return <Badge className="bg-gray-600 text-white text-xs px-1.5 py-0.5">Unknown</Badge>;
    }
  };

  const handleSaveKeys = () => {
    if (mashvisorKey) localStorage.setItem('mashvisor_api_key', mashvisorKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    onApiKeysChange({
      mashvisorApiKey: mashvisorKey || undefined,
      openaiApiKey: openaiKey || undefined
    });

    toast({
      title: "✅ API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  const handleClearKeys = () => {
    setMashvisorKey('');
    setOpenaiKey('');
    localStorage.removeItem('mashvisor_api_key');
    localStorage.removeItem('openai_api_key');
    
    onApiKeysChange({
      mashvisorApiKey: undefined,
      openaiApiKey: undefined
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

  React.useEffect(() => {
    const savedMashvisorKey = localStorage.getItem('mashvisor_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    setMashvisorKey(savedMashvisorKey);
    setOpenaiKey(savedOpenaiKey);
    
    if (savedMashvisorKey || savedOpenaiKey) {
      onApiKeysChange({
        mashvisorApiKey: savedMashvisorKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
    }
  }, []);

  return (
    <Card className="shadow-xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg max-w-xl mx-auto">
      <CardHeader className="pb-2 border-b border-gray-700/50">
        <CardTitle className="flex items-center justify-between text-cyan-300 text-sm">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-cyan-400" />
            Market Intelligence API Configuration
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
            {/* Mashvisor API Key */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-cyan-300">Mashvisor API Key</label>
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                {getStatusIcon(getKeyStatus(mashvisorKey))}
                <div className="flex-1 min-w-0">
                  <Input
                    id="mashvisor-key"
                    type={showKeys ? "text" : "password"}
                    value={mashvisorKey}
                    onChange={(e) => setMashvisorKey(e.target.value)}
                    placeholder="Enter your Mashvisor API key"
                    className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {mashvisorKey && showKeys && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(mashvisorKey, 'Mashvisor API')}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  {getStatusBadge(getKeyStatus(mashvisorKey))}
                </div>
              </div>
            </div>

            {/* OpenAI API Key */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-cyan-300">OpenAI API Key</label>
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                {getStatusIcon(getKeyStatus(openaiKey))}
                <div className="flex-1 min-w-0">
                  <Input
                    id="openai-key"
                    type={showKeys ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="Enter OpenAI API key"
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
                  {getStatusBadge(getKeyStatus(openaiKey))}
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
              Mashvisor API provides monthly STR revenue and rent data. OpenAI API enables AI-powered market insights.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
