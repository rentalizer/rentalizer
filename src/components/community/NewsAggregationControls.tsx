import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Rss, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';

export const NewsAggregationControls = () => {
  const [isAggregating, setIsAggregating] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();

  if (!isAdmin) {
    return null;
  }

  const handleTriggerAggregation = async () => {
    setIsAggregating(true);
    
    try {
      console.log('Triggering news aggregation...');
      
      const { data, error } = await supabase.functions.invoke('aggregate-news', {
        body: { manual_trigger: true }
      });

      if (error) {
        console.error('Aggregation error:', error);
        throw error;
      }

      console.log('Aggregation result:', data);
      
      setLastRun(new Date().toLocaleString());
      
      toast({
        title: "News Aggregation Complete",
        description: `Successfully processed feeds. ${data?.totalNewArticles || 0} new articles added.`,
      });

      // Refresh the page to show new articles
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error triggering aggregation:', error);
      toast({
        title: "Aggregation Failed",
        description: "Failed to aggregate news feeds. Check console for details.",
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

        <div className="bg-slate-700/30 p-3 rounded text-sm">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Automatic Scheduling</span>
          </div>
          <p className="text-gray-300 text-xs">
            To run this automatically every hour, you can set up a cron job in Supabase. 
            This will keep your news feed updated with the latest industry articles.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};