import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, ExternalLink, Calendar, Eye, MousePointer, Pin, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  source: string;
  title: string;
  url: string;
  summary: string | null;
  content: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  featured_image_url: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  click_count: number;
  engagement_score: number;
  admin_submitted: boolean;
  submitted_by: string | null;
  status: string;
}

export const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Form state for manual submission
  const [submitForm, setSubmitForm] = useState({
    title: '',
    url: '',
    source: '',
    summary: '',
    tags: [] as string[],
    featured_image_url: ''
  });

  const availableSources = [
    'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
    'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
    'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
    'BiggerPockets', 'Manual Submission'
  ];

  useEffect(() => {
    fetchNewsItems();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (newsItems.length > 5) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % newsItems.length);
      }, 5000); // Scroll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [newsItems.length]);

  // Smooth scroll effect
  useEffect(() => {
    if (scrollContainerRef.current && newsItems.length > 0) {
      const container = scrollContainerRef.current;
      const itemHeight = 120; // Approximate height of each news item
      container.scrollTo({
        top: currentIndex * itemHeight,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching news items...');
      
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });

      console.log('📰 News items query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching news items:', error);
        throw error;
      }

      console.log(`✅ Successfully fetched ${data?.length || 0} news items`);
      setNewsItems(data || []);
    } catch (error) {
      console.error('Error fetching news items:', error);
      toast({
        title: "Error",
        description: "Failed to load news items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = async (newsItem: NewsItem) => {
    try {
      // Increment click count
      await supabase
        .from('news_items')
        .update({ click_count: newsItem.click_count + 1 })
        .eq('id', newsItem.id);
      
      // Update local state
      setNewsItems(prev => 
        prev.map(item => 
          item.id === newsItem.id 
            ? { ...item, click_count: item.click_count + 1 }
            : item
        )
      );

      // Show article in popup
      setSelectedArticle(newsItem);
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still show the article even if tracking fails
      setSelectedArticle(newsItem);
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handlePinToggle = async (newsItem: NewsItem) => {
    if (!isAdmin) return;

    try {
      await supabase
        .from('news_items')
        .update({ is_pinned: !newsItem.is_pinned })
        .eq('id', newsItem.id);

      await fetchNewsItems();
      
      toast({
        title: newsItem.is_pinned ? "Unpinned" : "Pinned",
        description: `Article ${newsItem.is_pinned ? 'unpinned from' : 'pinned to'} top of feed.`,
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: "Error",
        description: "Failed to update pin status.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitNews = async () => {
    if (!submitForm.title || !submitForm.url || !submitForm.source) {
      toast({
        title: "Error",
        description: "Title, URL, and source are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('news_items')
        .insert({
          title: submitForm.title,
          url: submitForm.url,
          source: submitForm.source,
          summary: submitForm.summary || null,
          tags: submitForm.tags,
          featured_image_url: submitForm.featured_image_url || null,
          published_at: new Date().toISOString(),
          admin_submitted: true,
          submitted_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "News item submitted successfully!",
      });

      setSubmitForm({
        title: '',
        url: '',
        source: '',
        summary: '',
        tags: [],
        featured_image_url: ''
      });
      setIsSubmitDialogOpen(false);
      await fetchNewsItems();
    } catch (error) {
      console.error('Error submitting news:', error);
      toast({
        title: "Error",
        description: "Failed to submit news item.",
        variant: "destructive",
      });
    }
  };

  const visibleNewsItems = newsItems.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-cyan-400 text-sm">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold text-cyan-300">Industry News Feed</h3>
        </div>
        
        {isAdmin && (
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-cyan-500/20 text-white max-w-2xl z-50">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">Submit News Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Title *</label>
                  <Input
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter article title"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">URL *</label>
                  <Input
                    value={submitForm.url}
                    onChange={(e) => setSubmitForm(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Source *</label>
                  <Select 
                    value={submitForm.source} 
                    onValueChange={(value) => setSubmitForm(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 z-50">
                      {availableSources.map(source => (
                        <SelectItem key={source} value={source} className="text-white hover:bg-slate-600">
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Summary</label>
                  <Textarea
                    value={submitForm.summary}
                    onChange={(e) => setSubmitForm(prev => ({ ...prev, summary: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Brief summary of the article..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsSubmitDialogOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitNews}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Submit Article
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Scrolling News Feed */}
      <div 
        ref={scrollContainerRef}
        className="space-y-3 max-h-[600px] overflow-hidden"
      >
        {visibleNewsItems.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-8 w-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No news items available</p>
          </div>
        ) : (
          newsItems.map((item, index) => (
            <Card 
              key={item.id} 
              className={`bg-slate-800/50 border-slate-700 hover:border-cyan-500/30 transition-all cursor-pointer ${
                item.is_pinned ? 'ring-1 ring-cyan-500/20' : ''
              }`}
              onClick={() => handleNewsClick(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {item.is_pinned && (
                        <Pin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                      )}
                      <Badge 
                        variant="outline" 
                        className="border-cyan-500/30 text-cyan-400 text-xs flex-shrink-0"
                      >
                        {item.source}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.view_count}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2 hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    
                    {item.summary && (
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                  </div>
                  
                  {item.featured_image_url && (
                    <img 
                      src={item.featured_image_url} 
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Article Popup Modal */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="bg-slate-800 border-cyan-500/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto z-50">
            <DialogHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
                className="absolute -top-2 -right-2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-400"
                >
                  {selectedArticle.source}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(selectedArticle.published_at), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedArticle.view_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <MousePointer className="h-3 w-3" />
                    {selectedArticle.click_count}
                  </div>
                </div>
              </div>
              <DialogTitle className="text-xl font-bold text-white text-left leading-tight">
                {selectedArticle.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedArticle.featured_image_url && (
                <img 
                  src={selectedArticle.featured_image_url} 
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              {selectedArticle.summary && (
                <div className="bg-slate-700/30 p-4 rounded-lg border-l-4 border-cyan-500/50">
                  <p className="text-gray-300 italic">
                    {selectedArticle.summary}
                  </p>
                </div>
              )}
              
              {selectedArticle.content ? (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedArticle.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Full article content not available. Read the complete story at the source.</p>
                </div>
              )}
              
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  {selectedArticle.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-slate-700 text-gray-300 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => handleExternalLink(selectedArticle.url)}
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Full Article
                </Button>
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePinToggle(selectedArticle)}
                    className="text-gray-400 hover:text-cyan-300"
                  >
                    <Pin className="h-4 w-4 mr-1" />
                    {selectedArticle.is_pinned ? 'Unpin' : 'Pin'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};