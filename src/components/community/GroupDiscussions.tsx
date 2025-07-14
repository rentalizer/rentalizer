import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Search, Filter, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AttachmentViewer } from './AttachmentViewer';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  attachments?: string[];
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

interface GroupDiscussionsProps {
  refreshTrigger?: number;
  isDayMode: boolean;
}

export const GroupDiscussions: React.FC<GroupDiscussionsProps> = ({ refreshTrigger = 0, isDayMode }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const categories = ['All', 'General', 'Market Analysis', 'Deals', 'Q&A', 'Resources'];

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (discussionId: string) => {
    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [discussionId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async (discussionId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: user.id
          });
      }

      // Refresh discussions to update like count
      fetchDiscussions();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (discussionId: string) => {
    if (!user || !newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: discussionId,
          content: newComment,
          author_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
          user_id: user.id
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(discussionId);
      toast({
        title: "Comment added!",
        description: "Your comment has been posted"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleDiscussion = (discussionId: string) => {
    if (expandedDiscussion === discussionId) {
      setExpandedDiscussion(null);
    } else {
      setExpandedDiscussion(discussionId);
      if (!comments[discussionId]) {
        fetchComments(discussionId);
      }
    }
  };

  const deleteDiscussion = async (discussionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('discussions')
        .delete()
        .eq('id', discussionId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Discussion deleted",
        description: "Your discussion has been removed"
      });
      
      fetchDiscussions();
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast({
        title: "Error",
        description: "Failed to delete discussion",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [refreshTrigger]);

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Card className={`${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-800/50 border-cyan-500/20'}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-24 rounded-lg ${isDayMode ? 'bg-slate-200' : 'bg-slate-700/50'}`}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className={`${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-800/50 border-cyan-500/20'}`}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDayMode ? 'text-slate-400' : 'text-gray-400'}`} />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDayMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-700/50 border-slate-600'}`}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    (isDayMode ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-cyan-600 hover:bg-cyan-700") : 
                    (isDayMode ? "border-slate-300 hover:bg-slate-100 text-slate-700" : "border-slate-600 hover:bg-slate-700")
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussions */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <Card className={`${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-800/50 border-cyan-500/20'}`}>
            <CardContent className="p-8 text-center">
              <div className={isDayMode ? 'text-slate-600' : 'text-gray-400'}>
                {searchTerm || selectedCategory !== 'All' ? 
                  'No discussions match your filters' : 
                  'No discussions yet. Be the first to start a conversation!'
                }
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDiscussions.map(discussion => (
            <Card key={discussion.id} className={`${isDayMode ? 'bg-white border-slate-200 hover:border-cyan-400/40' : 'bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40'} transition-colors`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {discussion.author_avatar ? (
                          <AvatarImage src={discussion.author_avatar} alt={discussion.author_name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm">
                            {discussion.author_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className={`font-medium ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{discussion.author_name}</div>
                        <div className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                          {new Date(discussion.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${isDayMode ? 'border-cyan-600/30 text-cyan-700' : 'border-cyan-500/30 text-cyan-300'}`}>
                        {discussion.category}
                      </Badge>
                      {user?.id === discussion.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDiscussion(discussion.id)}
                          className={`p-2 ${isDayMode ? 'text-slate-400 hover:text-red-600' : 'text-gray-400 hover:text-red-400'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{discussion.title}</h3>
                    <p className={`leading-relaxed ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{discussion.content}</p>
                  </div>

                  {/* Attachments */}
                  {discussion.attachments && discussion.attachments.length > 0 && (
                    <AttachmentViewer attachments={discussion.attachments} />
                  )}

                  {/* Actions */}
                  <div className={`flex items-center gap-4 pt-2 border-t ${isDayMode ? 'border-slate-200' : 'border-slate-700'}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(discussion.id)}
                      className={`flex items-center gap-2 ${isDayMode ? 'text-slate-600 hover:text-red-600' : 'text-gray-400 hover:text-red-400'}`}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{discussion.likes_count || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDiscussion(discussion.id)}
                      className={`flex items-center gap-2 ${isDayMode ? 'text-slate-600 hover:text-cyan-700' : 'text-gray-400 hover:text-cyan-300'}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{discussion.comments_count || 0}</span>
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedDiscussion === discussion.id && (
                    <div className={`space-y-4 pt-4 border-t ${isDayMode ? 'border-slate-200' : 'border-slate-700'}`}>
                      {/* Existing Comments */}
                      {comments[discussion.id]?.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={`text-xs ${isDayMode ? 'bg-slate-200 text-slate-700' : 'bg-slate-600'}`}>
                              {comment.author_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-medium ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{comment.author_name}</span>
                              <span className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className={`text-sm ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{comment.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      {user && (
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                              {(profile?.display_name || user.email?.split('@')[0] || 'A').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className={`min-h-[80px] resize-none ${isDayMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-700/50 border-slate-600'}`}
                            />
                            <Button
                              onClick={() => handleComment(discussion.id)}
                              disabled={!newComment.trim() || submittingComment}
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              {submittingComment ? 'Posting...' : 'Comment'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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
