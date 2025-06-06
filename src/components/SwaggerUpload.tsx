
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Check, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SwaggerSpec {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
  paths?: any;
  components?: any;
}

export const SwaggerUpload: React.FC = () => {
  const [swaggerData, setSwaggerData] = useState<SwaggerSpec | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().includes('swagger') && !file.name.toLowerCase().includes('openapi')) {
      toast({
        title: "⚠️ File Warning",
        description: "This doesn't appear to be a swagger/OpenAPI file, but we'll try to parse it anyway.",
        variant: "destructive",
      });
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      
      // Validate it's a swagger/openapi spec
      if (!parsed.openapi && !parsed.swagger) {
        throw new Error('File does not appear to be a valid OpenAPI/Swagger specification');
      }

      setSwaggerData(parsed);
      
      // Store in localStorage for persistence
      localStorage.setItem('airdna_swagger_spec', JSON.stringify(parsed));
      localStorage.setItem('airdna_swagger_filename', file.name);

      toast({
        title: "✅ Swagger File Loaded",
        description: `Successfully parsed ${file.name} with ${Object.keys(parsed.paths || {}).length} endpoints`,
      });

      console.log('🔍 Swagger spec loaded:', {
        version: parsed.openapi || parsed.swagger,
        title: parsed.info?.title,
        endpointCount: Object.keys(parsed.paths || {}).length,
        hasComponents: !!parsed.components
      });

    } catch (error) {
      console.error('❌ Error parsing swagger file:', error);
      toast({
        title: "❌ Parse Error",
        description: `Failed to parse ${file.name}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSwaggerData = () => {
    setSwaggerData(null);
    setFileName('');
    localStorage.removeItem('airdna_swagger_spec');
    localStorage.removeItem('airdna_swagger_filename');
    
    toast({
      title: "🗑️ Swagger Data Cleared",
      description: "Swagger specification has been removed",
    });
  };

  // Load existing data on mount
  React.useEffect(() => {
    const savedSpec = localStorage.getItem('airdna_swagger_spec');
    const savedFileName = localStorage.getItem('airdna_swagger_filename');
    
    if (savedSpec && savedFileName) {
      try {
        const parsed = JSON.parse(savedSpec);
        setSwaggerData(parsed);
        setFileName(savedFileName);
      } catch (error) {
        console.error('Failed to load saved swagger spec:', error);
      }
    }
  }, []);

  const getEndpointSummary = () => {
    if (!swaggerData?.paths) return null;
    
    const endpoints = Object.entries(swaggerData.paths);
    const marketEndpoints = endpoints.filter(([path]) => 
      path.toLowerCase().includes('market') || 
      path.toLowerCase().includes('property') ||
      path.toLowerCase().includes('rental')
    );
    
    return {
      total: endpoints.length,
      market: marketEndpoints.length,
      endpoints: marketEndpoints.slice(0, 5).map(([path, methods]) => ({
        path,
        methods: Object.keys(methods)
      }))
    };
  };

  const summary = getEndpointSummary();

  return (
    <Card className="shadow-xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-cyan-300">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            AirDNA API Specification
          </div>
          {swaggerData && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearSwaggerData}
                className="border-red-500/30 text-red-300 hover:bg-red-500/10"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!swaggerData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="bg-gray-800/50 border-gray-600 text-gray-100"
              />
              <Button
                disabled={isUploading}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                {isUploading ? (
                  <>Parsing...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              Upload your AirDNA swagger.json or OpenAPI specification file
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center gap-2 p-3 bg-green-600/20 rounded-lg border border-green-500/30">
              <Check className="h-4 w-4 text-green-400" />
              <div className="flex-1">
                <div className="text-green-300 font-medium">{fileName}</div>
                <div className="text-xs text-green-400">
                  {swaggerData.info?.title} v{swaggerData.info?.version}
                </div>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <div className="text-sm font-medium text-cyan-300 mb-2">API Overview</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Total Endpoints:</span>
                    <span className="text-white ml-2">{summary.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Market Related:</span>
                    <span className="text-cyan-300 ml-2">{summary.market}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {showPreview && summary && (
              <div className="p-3 bg-gray-800/30 rounded-lg max-h-60 overflow-y-auto">
                <div className="text-sm font-medium text-cyan-300 mb-2">Market Endpoints Preview</div>
                <div className="space-y-2">
                  {summary.endpoints.map(({ path, methods }, index) => (
                    <div key={index} className="text-xs">
                      <div className="text-cyan-400 font-mono">{path}</div>
                      <div className="text-gray-400 ml-2">
                        {methods.map(method => method.toUpperCase()).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 p-2 bg-blue-600/10 rounded border border-blue-500/20">
          <strong>Note:</strong> Upload your AirDNA OpenAPI/Swagger specification to automatically configure API endpoints and improve data integration.
        </div>
      </CardContent>
    </Card>
  );
};
