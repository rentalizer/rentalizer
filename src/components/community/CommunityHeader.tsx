
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Paperclip, Image, Video, Smile, AtSign, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityHeaderProps {
  onPostCreated: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPostCreated }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getUserAvatar = () => profile?.avatar_url || null;
  const getUserName = () => profile?.display_name || user?.email?.split('@')[0] || 'Anonymous User';
  const getUserInitials = () => {
    const name = getUserName();
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const postTitleToUse = postTitle.trim() || 
        (newPost.length > 50 ? newPost.substring(0, 50) + '...' : newPost);
      
      const { data, error } = await supabase
        .from('discussions')
        .insert({
          title: postTitleToUse,
          content: newPost,
          author_name: getUserName(),
          category: 'General',
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community"
      });

      setNewPost('');
      setPostTitle('');
      onPostCreated();
      
    } catch (error) {
      console.error('Exception creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonEmojis = ['😀', '😂', '🤔', '👍', '❤️', '🎉', '💡', '🔥', '💪', '🚀', '✨', '🎯'];

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              {getUserAvatar() ? (
                <AvatarImage 
                  src={getUserAvatar()!} 
                  alt="Your avatar" 
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Write a title..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400"
                />
              </div>

              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px] bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 resize-none"
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-cyan-300"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-slate-700 border border-gray-600 rounded-lg p-3 grid grid-cols-6 gap-2 z-10">
                        {commonEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setNewPost(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-lg hover:bg-slate-600 p-1 rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || isSubmitting}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
