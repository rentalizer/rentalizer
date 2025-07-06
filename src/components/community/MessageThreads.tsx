
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Search, Pin, Reply, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Discussion {
  id: string;
  author_name: string;
  title: string;
  content: string;
  created_at: string;
  category: string;
  comments_count: number;
  likes_count: number;
  user_id: string;
  author_avatar?: string;
}

export const MessageThreads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedDiscussions, setLikedDiscussions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscussions();
    fetchUserLikes();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('discussion_likes')
        .select('discussion_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setLikedDiscussions(new Set(data?.map(like => like.discussion_id) || []));
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const toggleLike = async (discussionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to like discussions",
          variant: "destructive",
        });
        return;
      }

      const isLiked = likedDiscussions.has(discussionId);
      
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setLikedDiscussions(prev => {
          const newSet = new Set(prev);
          newSet.delete(discussionId);
          return newSet;
        });
      } else {
        // Like
        const { error } = await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: user.id
          });

        if (error) throw error;
        
        setLikedDiscussions(prev => new Set([...prev, discussionId]));
      }

      // Refresh discussions to get updated counts
      fetchDiscussions();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Loading discussions...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Message Threads</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {discussions.length} threads
          </Badge>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search threads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
        />
      </div>

      {/* Message Threads */}
      <div className="space-y-4">
        {filteredDiscussions.map(discussion => (
          <Card key={discussion.id} className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {getInitials(discussion.author_name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white hover:text-cyan-300 cursor-pointer">
                        {discussion.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-400 flex-shrink-0">{formatTimeAgo(discussion.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-cyan-300">{discussion.author_name}</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {discussion.category}
                    </Badge>
                  </div>

                  <p className="text-gray-300 mb-3 line-clamp-2">{discussion.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-cyan-300 h-8 px-2"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      {discussion.comments_count || 0} replies
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleLike(discussion.id)}
                      className={`h-8 px-2 ${
                        likedDiscussions.has(discussion.id) 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-gray-400 hover:text-red-300'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${likedDiscussions.has(discussion.id) ? 'fill-current' : ''}`} />
                      {discussion.likes_count || 0}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No threads found</h3>
            <p className="text-gray-400">Try adjusting your search terms or start a new thread</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
