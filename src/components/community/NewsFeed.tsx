import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, ExternalLink, Calendar, Eye, MousePointer, Pin, Plus, X } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { formatDistanceToNow } from 'date-fns';
import newsService, { NewsItem } from '@/services/newsService';
import { useToast } from '@/hooks/use-toast';

interface NewsFeedProps {
  isDayMode?: boolean;
}

export const NewsFeed = ({ isDayMode = false }: NewsFeedProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const { isAdmin } = useAdminRole();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      console.log('🔍 Fetching news items from backend...');
      
      const response = await newsService.getNews({
        page: 1,
        limit: 50,
        status: 'published',
        sortBy: 'published_at',
        sortOrder: 'desc'
      });

      console.log('📰 News items received:', response);

      if (response.success) {
        console.log(`✅ Successfully fetched ${response.data?.length || 0} news items`);
        setNewsItems(response.data || []);
      } else {
        throw new Error('Failed to fetch news items');
      }
    } catch (error) {
      console.error('Error fetching news items:', error);
      toast({
        title: "Error",
        description: "Failed to load news items. Please try again.",
        variant: "destructive",
      });
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = async (newsItem: NewsItem) => {
    try {
      // Track click
      await newsService.trackClick(newsItem._id);
      
      // Update local state
      setNewsItems(prev => 
        prev.map(item => 
          item._id === newsItem._id 
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
      const response = await newsService.togglePin(newsItem._id);
      
      if (response.success) {
        // Update local state immediately for better UX
        setNewsItems(prev =>
          prev.map(item =>
            item._id === newsItem._id
              ? { ...item, is_pinned: !item.is_pinned }
              : item
          )
        );
        
        toast({
          title: newsItem.is_pinned ? "Unpinned" : "Pinned",
          description: `Article ${newsItem.is_pinned ? 'unpinned from' : 'pinned to'} top of feed.`,
        });
        
        // Refresh to get proper sort order
        await fetchNewsItems();
      }
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
      const response = await newsService.createNews({
        title: submitForm.title,
        url: submitForm.url,
        source: submitForm.source,
        summary: submitForm.summary || undefined,
        tags: submitForm.tags.length > 0 ? submitForm.tags : undefined,
        featured_image_url: submitForm.featured_image_url || undefined,
        published_at: new Date().toISOString(),
      });

      if (response.success) {
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
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit news item.",
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
      {/* Header with Add Button - Always visible */}
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
                    placeholder="Brief summary of the article"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Featured Image URL</label>
                  <Input
                    value={submitForm.featured_image_url}
                    onChange={(e) => setSubmitForm(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitDialogOpen(false)}
                    className="border-slate-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitNews}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Empty State */}
      {newsItems.length === 0 ? (
        <div className="text-center py-8">
          <Newspaper className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No news items available yet.</p>
          {isAdmin && (
            <p className="text-sm text-gray-500">
              Click the "Add" button above to submit your first article.
            </p>
          )}
        </div>
      ) : (
        /* News Items */
        <div 
          ref={scrollContainerRef}
          className="space-y-2 max-h-[600px] overflow-y-auto pr-2"
        >
          {visibleNewsItems.map((item) => (
          <Card 
            key={item._id}
            className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
            onClick={() => handleNewsClick(item)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header with title and pin button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Newspaper className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <h4 className="text-white font-semibold text-base truncate leading-snug" title={item.title}>
                      {item.title}
                    </h4>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinToggle(item);
                      }}
                      className={`h-7 w-7 p-0 flex-shrink-0 ${item.is_pinned ? 'text-cyan-400' : 'text-gray-500'}`}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Source and Status badges */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                    {item.source}
                  </Badge>
                  {item.is_pinned && (
                    <Badge className="text-xs bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                      📌 Pinned
                    </Badge>
                  )}
                  {item.is_featured && (
                    <Badge className="text-xs bg-purple-600/20 text-purple-400 border-purple-500/30">
                      ⭐ Featured
                    </Badge>
                  )}
                </div>

                {/* Summary */}
                {item.summary && (
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                )}

                {/* Metadata and stats */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {item.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointer className="h-3.5 w-3.5" />
                      {item.click_count}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-slate-700/50 text-gray-400 px-2 py-0">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Article Preview Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="bg-slate-800 border-cyan-500/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-cyan-300 text-xl">
                  {selectedArticle.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                    {selectedArticle.source}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(selectedArticle.published_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedArticle.view_count} views
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MousePointer className="h-3 w-3" />
                    {selectedArticle.click_count} clicks
                  </span>
                </div>

                {selectedArticle.featured_image_url && (
                  <img 
                    src={selectedArticle.featured_image_url} 
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {selectedArticle.summary && (
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{selectedArticle.summary}</p>
                  </div>
                )}

                {selectedArticle.content && (
                  <div className="text-gray-300 text-sm">
                    <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
                  </div>
                )}

                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedArticle.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-700 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={() => handleExternalLink(selectedArticle.url)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Full Article
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
