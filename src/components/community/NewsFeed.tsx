import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, ExternalLink, Calendar, Eye, MousePointer, Pin, Plus, Filter, TrendingUp } from 'lucide-react';
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
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();

  // Form state for manual submission
  const [submitForm, setSubmitForm] = useState({
    title: '',
    url: '',
    source: '',
    summary: '',
    tags: [] as string[],
    featured_image_url: ''
  });

  const availableTags = [
    'Regulations', 'Tech Updates', 'Market Trends', 'Industry News',
    'Software', 'Analytics', 'Pricing', 'Operations', 'Legal'
  ];

  const availableSources = [
    'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
    'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
    'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
    'BiggerPockets', 'Manual Submission'
  ];

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('is_pinned', { ascending: false });

      // Apply secondary sort
      if (sortBy === 'recent') {
        query = query.order('published_at', { ascending: false });
      } else {
        query = query.order('engagement_score', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Filter by tag if selected
      if (selectedTag !== 'all') {
        filteredData = filteredData.filter(item => 
          item.tags && item.tags.includes(selectedTag)
        );
      }

      setNewsItems(filteredData);
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

      // Open link in new tab
      window.open(newsItem.url, '_blank');
      
      // Update local state
      setNewsItems(prev => 
        prev.map(item => 
          item.id === newsItem.id 
            ? { ...item, click_count: item.click_count + 1 }
            : item
        )
      );
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still open the link even if tracking fails
      window.open(newsItem.url, '_blank');
    }
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

  const uniqueTags = Array.from(
    new Set(newsItems.flatMap(item => item.tags || []))
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-cyan-400">Loading news feed...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-cyan-300">Industry News Feed</h2>
        </div>
        
        {isAdmin && (
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit News
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-cyan-500/20 text-white max-w-2xl">
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
                    <SelectContent className="bg-slate-700 border-slate-600">
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
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Featured Image URL</label>
                  <Input
                    value={submitForm.featured_image_url}
                    onChange={(e) => setSubmitForm(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-600">All Topics</SelectItem>
              {uniqueTags.map(tag => (
                <SelectItem key={tag} value={tag} className="text-white hover:bg-slate-600">
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <Select value={sortBy} onValueChange={(value: 'recent' | 'trending') => setSortBy(value)}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="recent" className="text-white hover:bg-slate-600">Recent</SelectItem>
              <SelectItem value="trending" className="text-white hover:bg-slate-600">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={fetchNewsItems}
          variant="outline"
          size="sm"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          Refresh
        </Button>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {newsItems.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Newspaper className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No news items found. Check back soon for updates!</p>
            </CardContent>
          </Card>
        ) : (
          newsItems.map((item) => (
            <Card 
              key={item.id} 
              className={`bg-slate-800/50 border-slate-700 hover:border-cyan-500/30 transition-colors ${
                item.is_pinned ? 'ring-2 ring-cyan-500/20' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.is_pinned && (
                        <Pin className="h-4 w-4 text-cyan-400" />
                      )}
                      <Badge 
                        variant="outline" 
                        className="border-cyan-500/30 text-cyan-400 text-xs"
                      >
                        {item.source}
                      </Badge>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.view_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3" />
                          {item.click_count}
                        </div>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-white mb-2 cursor-pointer hover:text-cyan-300 transition-colors"
                      onClick={() => handleNewsClick(item)}
                    >
                      {item.title}
                    </h3>
                    
                    {item.summary && (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {item.summary}
                      </p>
                    )}
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
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
                  </div>
                  
                  {item.featured_image_url && (
                    <img 
                      src={item.featured_image_url} 
                      alt={item.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNewsClick(item)}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-0"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read Article
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePinToggle(item)}
                      className="text-gray-400 hover:text-cyan-300"
                    >
                      <Pin className="h-4 w-4 mr-1" />
                      {item.is_pinned ? 'Unpin' : 'Pin'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};