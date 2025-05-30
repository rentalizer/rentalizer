
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Check, X, AlertCircle, Copy, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ApiKeyStatus: React.FC = () => {
  const [showKeys, setShowKeys] = useState(false);
  const [apiKeys, setApiKeys] = useState<{
    airdna?: string;
    openai?: string;
    mashvisor?: string;
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadApiKeys = () => {
      const keys = {
        airdna: localStorage.getItem('professional_data_key') || '',
        openai: localStorage.getItem('openai_api_key') || '',
        mashvisor: localStorage.getItem('mashvisor_api_key') || ''
      };
      
      console.log('🔑 Current API Keys Status:', {
        airdna: keys.airdna ? `${keys.airdna.substring(0, 8)}... (${keys.airdna.length} chars)` : 'Not set',
        openai: keys.openai ? `${keys.openai.substring(0, 8)}... (${keys.openai.length} chars)` : 'Not set',
        mashvisor: keys.mashvisor ? `${keys.mashvisor.substring(0, 8)}... (${keys.mashvisor.length} chars)` : 'Not set'
      });
      
      setApiKeys(keys);
    };

    loadApiKeys();
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadApiKeys();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getKeyStatus = (key: string) => {
    if (!key) return 'missing';
    if (key.length < 10) return 'invalid';
    return 'valid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <Check className="h-4 w-4 text-green-500" />;
      case 'invalid': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'missing': return <X className="h-4 w-4 text-red-500" />;
      default: return <X className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid': return <Badge className="bg-green-600 text-white">Active</Badge>;
      case 'invalid': return <Badge className="bg-yellow-600 text-white">Invalid</Badge>;
      case 'missing': return <Badge className="bg-red-600 text-white">Missing</Badge>;
      default: return <Badge className="bg-gray-600 text-white">Unknown</Badge>;
    }
  };

  const maskKey = (key: string) => {
    if (!key) return 'Not configured';
    if (key.length <= 12) return key.substring(0, 4) + '***';
    return key.substring(0, 8) + '***' + key.substring(key.length - 4);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "✅ Copied to Clipboard",
        description: `${label} API key copied successfully`,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "❌ Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const findAllStoredKeys = () => {
    console.log('🔍 Searching for all stored API keys...');
    
    const allKeys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('api') || key.includes('key'))) {
        const value = localStorage.getItem(key);
        allKeys[key] = value ? `${value.substring(0, 8)}... (${value.length} chars)` : 'Empty';
      }
    }
    
    console.log('🗂️ All API-related keys found:', allKeys);
    
    const keyCount = Object.keys(allKeys).length;
    toast({
      title: `🔍 Found ${keyCount} API Keys`,
      description: keyCount > 0 ? "Check browser console for full details" : "No API keys found in storage",
    });
    
    return allKeys;
  };

  const testApiConnection = async () => {
    console.log('🧪 Testing API connections...');
    
    // Test OpenAI
    if (apiKeys.openai) {
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKeys.openai}`,
          }
        });
        console.log('🤖 OpenAI API Test:', response.ok ? 'SUCCESS' : `FAILED (${response.status})`);
      } catch (error) {
        console.log('🤖 OpenAI API Test: FAILED', error);
      }
    }
    
    // Log current environment
    console.log('🌍 Environment Info:', {
      url: window.location.href,
      origin: window.location.origin,
      isLocalhost: window.location.hostname === 'localhost',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Card className="shadow-lg border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-cyan-300">
          <span>API Key Status</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={findAllStoredKeys}
              className="border-yellow-600 text-yellow-300 hover:bg-yellow-800"
            >
              <Search className="h-4 w-4 mr-1" />
              Find All Keys
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowKeys(!showKeys)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {showKeys ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={testApiConnection}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Test APIs
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* OpenAI API */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-md">
            <div className="flex items-center gap-3">
              {getStatusIcon(getKeyStatus(apiKeys.openai || ''))}
              <div className="flex-1">
                <span className="text-white font-medium">OpenAI API</span>
                <div className="text-xs text-gray-400 font-mono">
                  {showKeys ? (apiKeys.openai || 'Not set') : maskKey(apiKeys.openai || '')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {apiKeys.openai && showKeys && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(apiKeys.openai!, 'OpenAI')}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {getStatusBadge(getKeyStatus(apiKeys.openai || ''))}
            </div>
          </div>

          {/* AirDNA API */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-md">
            <div className="flex items-center gap-3">
              {getStatusIcon(getKeyStatus(apiKeys.airdna || ''))}
              <div className="flex-1">
                <span className="text-white font-medium">AirDNA API</span>
                <div className="text-xs text-gray-400 font-mono">
                  {showKeys ? (apiKeys.airdna || 'Not set') : maskKey(apiKeys.airdna || '')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {apiKeys.airdna && showKeys && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(apiKeys.airdna!, 'AirDNA')}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {getStatusBadge(getKeyStatus(apiKeys.airdna || ''))}
            </div>
          </div>

          {/* Mashvisor API */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-md">
            <div className="flex items-center gap-3">
              {getStatusIcon(getKeyStatus(apiKeys.mashvisor || ''))}
              <div className="flex-1">
                <span className="text-white font-medium">Mashvisor API</span>
                <div className="text-xs text-gray-400 font-mono">
                  {showKeys ? (apiKeys.mashvisor || 'Not set') : maskKey(apiKeys.mashvisor || '')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {apiKeys.mashvisor && showKeys && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(apiKeys.mashvisor!, 'Mashvisor')}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {getStatusBadge(getKeyStatus(apiKeys.mashvisor || ''))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
          <div className="text-sm text-blue-300">
            <strong>Environment:</strong> {window.location.hostname === 'localhost' ? 'Preview/Development' : 'Production'}
          </div>
          <div className="text-xs text-blue-400 mt-1">
            Click "Find All Keys" to search for all stored API keys in your browser
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
