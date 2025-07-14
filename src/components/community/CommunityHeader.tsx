
import React, { useState, useRef } from 'react';
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
  isDayMode?: boolean;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPostCreated, isDayMode = false }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setAttachedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: "Files attached",
        description: `${validFiles.length} file(s) ready to upload`
      });
    }

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of attachedFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `community-attachments/${fileName}`;

        const { data, error } = await supabase.storage
          .from('course-materials')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('course-materials')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Exception uploading file:', error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    return uploadedUrls;
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let fileUrls: string[] = [];
      
      // Upload files if any are attached
      if (attachedFiles.length > 0) {
        fileUrls = await uploadFiles();
      }

      const postTitleToUse = postTitle.trim() || 
        (newPost.length > 50 ? newPost.substring(0, 50) + '...' : newPost);
      
      // Add file attachments to post content if any were uploaded
      let contentWithFiles = newPost;
      if (fileUrls.length > 0) {
        const fileLinks = fileUrls.map(url => {
          const fileName = url.split('/').pop() || 'attachment';
          return `📎 [${fileName}](${url})`;
        }).join('\n');
        contentWithFiles = `${newPost}\n\n${fileLinks}`;
      }
      
      const { data, error } = await supabase
        .from('discussions')
        .insert({
          title: postTitleToUse,
          content: contentWithFiles,
          author_name: getUserName(),
          category: 'General',
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post created!",
        description: attachedFiles.length > 0 
          ? `Your post has been shared with ${attachedFiles.length} attachment(s)`
          : "Your post has been shared with the community"
      });

      setNewPost('');
      setPostTitle('');
      setAttachedFiles([]);
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

              {/* File attachments display */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-medium">Attached Files:</label>
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                        <button
                          onClick={() => removeAttachedFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-cyan-300"
                    onClick={handleFileAttach}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mp3,.zip,.rar"
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
