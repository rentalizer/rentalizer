import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const AirDNATest = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testAirDNAEndpoints = async () => {
    setLoading(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('test-airdna');
      
      if (error) {
        console.error('Error testing AirDNA:', error);
        setResults([{ error: error.message }]);
      } else {
        console.log('AirDNA test results:', data);
        setResults(data.results || []);
      }
    } catch (err) {
      console.error('Failed to test AirDNA:', err);
      setResults([{ error: 'Failed to test AirDNA API' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>AirDNA API Endpoint Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testAirDNAEndpoints} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing AirDNA Endpoints...' : 'Test AirDNA API'}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2 text-sm">
                    {result.endpoint && (
                      <div>
                        <strong>Endpoint:</strong> {result.endpoint}
                      </div>
                    )}
                    {result.status && (
                      <div>
                        <strong>Status:</strong> 
                        <span className={result.status === 200 ? 'text-green-600' : 'text-red-600'}>
                          {result.status} - {result.statusText}
                        </span>
                      </div>
                    )}
                    {result.response && (
                      <div>
                        <strong>Response:</strong>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                          {result.response}
                        </pre>
                      </div>
                    )}
                    {result.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AirDNATest;