import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, AlertCircle, Check, X, Loader2, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ApiKeyInputProps {
  onApiKeysChange: (keys: { airdnaApiKey?: string; openaiApiKey?: string }) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [airdnaKey, setAirdnaKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [keyTestResults, setKeyTestResults] = useState<{[key: string]: 'testing' | 'valid' | 'invalid' | 'untested'}>({
    airdna: 'untested'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const getKeyStatus = (key: string, keyType: 'airdna') => {
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

  // Load API keys from database
  const loadApiKeys = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_api_keys')
        .select('airdna_api_key')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setAirdnaKey(data.airdna_api_key || '');
        onApiKeysChange({
          airdnaApiKey: data.airdna_api_key || undefined
        });
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleSaveKeys = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save API keys.",
        variant: "destructive"
      });
      return;
    }

    if (!airdnaKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your AirDNA API key.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .upsert([
          {
            user_id: user.id,
            airdna_api_key: airdnaKey.trim()
          }
        ]);

      if (error) throw error;

      toast({
        title: "✅ API Key Saved",
        description: "Your AirDNA API key has been saved successfully.",
      });

      onApiKeysChange({
        airdnaApiKey: airdnaKey.trim()
      });

    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error Saving Key",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearKeys = async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      setAirdnaKey('');
      
      onApiKeysChange({
        airdnaApiKey: undefined
      });

      toast({
        title: "🗑️ API Key Cleared",
        description: "Your API key has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing API keys:', error);
      toast({
        title: "Error",
        description: "Failed to clear API key.",
        variant: "destructive"
      });
    }
  };

  const testConnection = async () => {
    if (!airdnaKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your AirDNA API key first.",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    setKeyTestResults(prev => ({ ...prev, airdna: 'testing' }));

    try {
      // Test RapidAPI AirDNA with available endpoints
      const response = await fetch('https://airdna1.p.rapidapi.com/suggest_market', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': airdnaKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com',
        },
      });

      if (response.ok) {
        toast({
          title: "✅ AirDNA API Connection Successful",
          description: "Your RapidAPI AirDNA key is working correctly.",
        });
        setKeyTestResults(prev => ({ ...prev, airdna: 'valid' }));
      } else if (response.status === 401) {
        toast({
          title: "❌ Invalid API Key",
          description: "Please check your RapidAPI AirDNA subscription key.",
          variant: "destructive"
        });
        setKeyTestResults(prev => ({ ...prev, airdna: 'invalid' }));
      } else if (response.status === 403) {
        toast({
          title: "❌ Access Forbidden",
          description: "Please check your RapidAPI subscription status.",
          variant: "destructive"
        });
        setKeyTestResults(prev => ({ ...prev, airdna: 'invalid' }));
      } else {
        toast({
          title: "❌ AirDNA API Connection Failed",
          description: `API error: ${response.status} ${response.statusText}`,
          variant: "destructive"
        });
        setKeyTestResults(prev => ({ ...prev, airdna: 'invalid' }));
      }
    } catch (error) {
      console.error('API test failed:', error);
      toast({
        title: "❌ Connection Test Failed",
        description: "Could not connect to AirDNA API.",
        variant: "destructive"
      });
      setKeyTestResults(prev => ({ ...prev, airdna: 'invalid' }));
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [user]);

  // Also handle OpenAI key from localStorage for backward compatibility
  useEffect(() => {
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    if (savedOpenaiKey) {
      setOpenaiKey(savedOpenaiKey);
      onApiKeysChange({
        airdnaApiKey: airdnaKey || undefined,
        openaiApiKey: savedOpenaiKey || undefined
      });
    }
  }, [airdnaKey]);

  return (
    <Card className="shadow-xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg max-w-xl mx-auto">
      <CardHeader className="pb-2 border-b border-gray-700/50">
        <CardTitle className="flex items-center justify-between text-cyan-300 text-sm">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-cyan-400" />
            API Configuration
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-3">
        <div className="space-y-3">
          {!user && (
            <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <p className="text-yellow-300 text-sm">Please log in to save API keys to your account.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {/* AirDNA API Key */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-cyan-300">AirDNA API Key</Label>
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
                  {getStatusBadge(getKeyStatus(airdnaKey, 'airdna'))}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Get your API key from{" "}
                <a 
                  href="https://rapidapi.com/airdna/api/airdna1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  RapidAPI AirDNA
                </a>
              </p>
            </div>

            {/* OpenAI API Key (Local Storage) */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-cyan-300">OpenAI API Key (Optional)</Label>
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                <div className="flex-1 min-w-0">
                  <Input
                    id="openai-key"
                    type={showKeys ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setOpenaiKey(newKey);
                      if (newKey) {
                        localStorage.setItem('openai_api_key', newKey);
                      } else {
                        localStorage.removeItem('openai_api_key');
                      }
                      onApiKeysChange({
                        airdnaApiKey: airdnaKey || undefined,
                        openaiApiKey: newKey || undefined
                      });
                    }}
                    placeholder="Enter your OpenAI API key (stored locally)"
                    className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-100 focus:border-cyan-400 focus:ring-cyan-400/20 placeholder:text-gray-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">Used only for generating neighborhood names when needed.</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs px-2 py-1 h-7"
            >
              {showKeys ? <Eye className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={testConnection}
                disabled={testing || !airdnaKey.trim()}
                size="sm"
                variant="outline"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 h-7"
              >
                {testing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <TestTube className="h-3 w-3 mr-1" />}
                Test Connection
              </Button>

              <Button
                onClick={handleSaveKeys}
                disabled={saving || !user || !airdnaKey.trim()}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-2 py-1 h-7"
              >
                {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                Save to Database
              </Button>

              <Button
                onClick={handleClearKeys}
                disabled={saving || !user}
                variant="outline"
                size="sm"
                className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white text-xs px-2 py-1 h-7"
              >
                Clear Keys
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ApiKeyInput };