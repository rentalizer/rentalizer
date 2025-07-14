
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image, Video, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileUpload, useFileUpload } from './FileUpload';

interface CommunityHeaderProps {
  onPostCreated: () => void;
  isDayMode?: boolean;
}

interface AttachmentFile {
  file: File;
  preview?: string;
  id: string;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPostCreated, isDayMode = false }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { uploadFiles } = useFileUpload();
  
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

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
      
      // Upload attachments first
      let uploadedUrls: string[] = [];
      if (attachments.length > 0 && user?.id) {
        uploadedUrls = await uploadFiles(attachments, user.id);
      }

      const { data, error } = await supabase
        .from('discussions')
        .insert({
          title: postTitleToUse,
          content: newPost,
          author_name: getUserName(),
          category: 'General',
          user_id: user?.id,
          attachments: uploadedUrls.length > 0 ? uploadedUrls : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post created!",
        description: attachments.length > 0 
          ? `Your post with ${attachments.length} attachment(s) has been shared with the community`
          : "Your post has been shared with the community"
      });

      setNewPost('');
      setPostTitle('');
      setAttachments([]);
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
                  className={`border-cyan-500/20 ${isDayMode ? 'bg-slate-100 text-slate-700 placeholder-slate-500' : 'bg-slate-700/50 text-white placeholder-gray-400'}`}
                />
              </div>

              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className={`min-h-[120px] border-cyan-500/20 resize-none ${isDayMode ? 'bg-slate-100 text-slate-700 placeholder-slate-500' : 'bg-slate-700/50 text-white placeholder-gray-400'}`}
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-cyan-300"
                    onClick={() => {
                      // TODO: Add image upload functionality
                      toast({
                        title: "Coming Soon",
                        description: "Image upload functionality will be available soon"
                      });
                    }}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-cyan-300"
                    onClick={() => {
                      // TODO: Add video upload functionality
                      toast({
                        title: "Coming Soon", 
                        description: "Video upload functionality will be available soon"
                      });
                    }}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  
                  <FileUpload
                    onFilesChange={setAttachments}
                    maxFiles={5}
                    maxSizeBytes={10 * 1024 * 1024}
                  />

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
                      <div className="absolute bottom-full left-0 mb-2 bg-slate-700 border border-gray-600 rounded-lg p-4 shadow-lg z-10 min-w-[200px]">
                        <div className="grid grid-cols-4 gap-3">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewPost(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-xl hover:bg-slate-600 p-2 rounded transition-colors flex items-center justify-center w-10 h-10 hover:scale-110 transform duration-200"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
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
