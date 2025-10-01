import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Rss, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import newsService from '@/services/newsService';

export const NewsAggregationControls = () => {
  const [isAggregating, setIsAggregating] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    fetched: number;
    newArticles: number;
    skipped: number;
  } | null>(null);
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();

  if (!isAdmin) {
    return null;
  }

  const handleTriggerAggregation = async () => {
    setIsAggregating(true);
    
    try {
      console.log('🔄 Triggering news aggregation from backend...');
      
      // Call the backend aggregation endpoint
      const result = await newsService.aggregateNews();

      console.log('✅ Aggregation result:', result);
      
      setLastRun(new Date().toLocaleString());
      setLastResult({
        fetched: result.totalFetched,
        newArticles: result.totalNewArticles,
        skipped: result.totalSkipped,
      });
      
      toast({
        title: "News Aggregation Complete",
        description: `Successfully fetched ${result.totalFetched} items. ${result.totalNewArticles} new articles added, ${result.totalSkipped} duplicates skipped.`,
      });

      // Refresh the page to show new articles
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Error triggering aggregation:', error);
      toast({
        title: "Aggregation Failed",
        description: error.message || "Failed to aggregate news feeds. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsAggregating(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Rss className="h-5 w-5 text-cyan-400" />
          News Aggregation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            <p>Automatically fetch latest articles from industry sources:</p>
            <ul className="text-xs text-gray-400 mt-1 ml-4">
              <li>• AirDNA, Skift, VRM Intel</li>
              <li>• Hospitable, PriceLabs, Guesty</li>
              <li>• BiggerPockets STR content</li>
              <li>• ShortTermRentalz</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleTriggerAggregation}
            disabled={isAggregating}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isAggregating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Rss className="h-4 w-4 mr-2" />
            )}
            {isAggregating ? 'Aggregating...' : 'Fetch New Articles'}
          </Button>
          
          {lastRun && (
            <div className="flex items-center gap-1 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              Last run: {lastRun}
            </div>
          )}
        </div>

        {lastResult && (
          <div className="bg-slate-700/30 p-3 rounded text-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-cyan-400 font-semibold">{lastResult.fetched}</div>
                <div className="text-xs text-gray-400">Fetched</div>
              </div>
              <div>
                <div className="text-green-400 font-semibold">{lastResult.newArticles}</div>
                <div className="text-xs text-gray-400">New</div>
              </div>
              <div>
                <div className="text-yellow-400 font-semibold">{lastResult.skipped}</div>
                <div className="text-xs text-gray-400">Skipped</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-700/30 p-3 rounded text-sm">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Backend Integration Active</span>
          </div>
          <p className="text-gray-300 text-xs">
            Connected to Node.js backend with Axios. News is fetched from RSS feeds and stored in MongoDB.
            This automatically checks for duplicates and updates engagement metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
