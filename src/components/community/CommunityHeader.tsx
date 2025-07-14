
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Paperclip, Image, Video, Smile, AtSign, X, Check, AlertCircle, Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityHeaderProps {
  onPostCreated: () => void;
  isDayMode?: boolean;
}

interface AttachedFile {
  file: File;
  url?: string;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
}

interface VideoUpload {
  file: File;
  url?: string;
  uploaded: boolean;
  uploading: boolean;
  uploadProgress: number;
  error?: string;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPostCreated, isDayMode = false }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [videoUpload, setVideoUpload] = useState<VideoUpload | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file: File) => {
    return file.type.startsWith('video/');
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const uploadSingleFile = async (file: File, index: number): Promise<string | null> => {
    try {
      // Update file status to uploading
      setAttachedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, uploading: true, error: undefined } : item
      ));

      // Check if user is authenticated
      if (!user) {
        console.error('User not authenticated');
        setAttachedFiles(prev => prev.map((item, i) => 
          i === index ? { ...item, uploading: false, error: 'User not authenticated' } : item
        ));
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `community-attachments/${fileName}`;

      console.log('Uploading file to:', filePath);
      console.log('User ID:', user.id);
      console.log('File size:', file.size);

      // Upload with explicit options
      const { data, error } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        setAttachedFiles(prev => prev.map((item, i) => 
          i === index ? { ...item, uploading: false, error: 'Upload failed: ' + error.message } : item
        ));
        return null;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Update file status to uploaded with URL
      setAttachedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, uploading: false, uploaded: true, url: publicUrl } : item
      ));

      // Show success message
      setUploadSuccess(`${file.name} uploaded successfully!`);
      setTimeout(() => setUploadSuccess(null), 3000);

      return publicUrl;
    } catch (error) {
      console.error('Exception uploading file:', error);
      setAttachedFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, uploading: false, error: 'Upload failed: ' + (error as Error).message } : item
      ));
      return null;
    }
  };

  const uploadVideoFile = async (file: File): Promise<string | null> => {
    try {
      // Check if user is authenticated
      if (!user) {
        console.error('User not authenticated');
        setVideoUpload(prev => prev ? { ...prev, uploading: false, error: 'User not authenticated' } : null);
        return null;
      }

      // Update video upload status to uploading with progress
      setVideoUpload(prev => prev ? { ...prev, uploading: true, uploadProgress: 10, error: undefined } : null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `community-videos/${fileName}`;

      console.log('Uploading video to:', filePath);
      console.log('User ID:', user.id);
      console.log('File size:', file.size);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setVideoUpload(prev => prev ? { 
          ...prev, 
          uploadProgress: Math.min(prev.uploadProgress + 20, 90) 
        } : null);
      }, 500);

      // Upload with progress tracking
      const { data, error } = await supabase.storage
        .from('community-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Video upload error:', error);
        setVideoUpload(prev => prev ? { ...prev, uploading: false, error: 'Upload failed: ' + error.message } : null);
        return null;
      }

      console.log('Video upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('community-videos')
        .getPublicUrl(filePath);

      console.log('Video public URL:', publicUrl);

      // Update video upload status to uploaded with URL and full progress
      setVideoUpload(prev => prev ? { 
        ...prev, 
        uploading: false, 
        uploaded: true, 
        url: publicUrl, 
        uploadProgress: 100 
      } : null);

      // Show success message
      toast({
        title: "Video uploaded!",
        description: `${file.name} has been uploaded successfully`
      });

      return publicUrl;
    } catch (error) {
      console.error('Exception uploading video:', error);
      setVideoUpload(prev => prev ? { 
        ...prev, 
        uploading: false, 
        error: 'Upload failed: ' + (error as Error).message 
      } : null);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (validFiles.length === 0) return;

    // Check if user is authenticated before proceeding
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive"
      });
      return;
    }

    // Add files to state with initial status
    const newAttachedFiles: AttachedFile[] = validFiles.map(file => ({
      file,
      uploaded: false,
      uploading: false
    }));

    setAttachedFiles(prev => [...prev, ...newAttachedFiles]);

    // Upload files immediately
    const startIndex = attachedFiles.length;
    for (let i = 0; i < validFiles.length; i++) {
      await uploadSingleFile(validFiles[i], startIndex + i);
    }

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const videoFile = files[0];

    if (!videoFile) return;

    // Check file type
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    if (!validVideoTypes.includes(videoFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file (.mp4, .mov, .avi, .webm)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (1GB limit)
    const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
    if (videoFile.size > maxSize) {
      toast({
        title: "File too large",
        description: "Video file must be smaller than 1GB",
        variant: "destructive"
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive"
      });
      return;
    }

    // Set initial video upload state - this will make it show immediately
    setVideoUpload({
      file: videoFile,
      uploaded: false,
      uploading: false,
      uploadProgress: 0
    });

    // Start upload
    await uploadVideoFile(videoFile);

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideoUpload = () => {
    setVideoUpload(null);
    setIsVideoPlaying(false);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const postTitleToUse = postTitle.trim() || 
        (newPost.length > 50 ? newPost.substring(0, 50) + '...' : newPost);
      
      // Add file attachments and video to post content if any were uploaded
      let contentWithMedia = newPost;
      const uploadedFiles = attachedFiles.filter(item => item.uploaded && item.url);
      
      if (uploadedFiles.length > 0) {
        const fileLinks = uploadedFiles.map(item => {
          const fileName = item.file.name;
          return `📎 [${fileName}](${item.url})`;
        }).join('\n');
        contentWithMedia = `${newPost}\n\n${fileLinks}`;
      }
      
      // Add video if uploaded
      if (videoUpload?.uploaded && videoUpload.url) {
        const videoLink = `🎥 [${videoUpload.file.name}](${videoUpload.url})`;
        contentWithMedia = `${contentWithMedia}\n\n${videoLink}`;
      }
      
      const { data, error } = await supabase
        .from('discussions')
        .insert({
          title: postTitleToUse,
          content: contentWithMedia,
          author_name: getUserName(),
          category: 'General',
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const attachmentCount = uploadedFiles.length + (videoUpload?.uploaded ? 1 : 0);
      toast({
        title: "Post created!",
        description: attachmentCount > 0 
          ? `Your post has been shared with ${attachmentCount} attachment(s)`
          : "Your post has been shared with the community"
      });

      setNewPost('');
      setPostTitle('');
      setAttachedFiles([]);
      setVideoUpload(null);
      setUploadSuccess(null);
      setIsVideoPlaying(false);
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

  const getUploadedCount = () => attachedFiles.filter(file => file.uploaded).length;
  const getUploadingCount = () => attachedFiles.filter(file => file.uploading).length;
  const getErrorCount = () => attachedFiles.filter(file => file.error).length;

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

              <div className="space-y-3">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className={`min-h-[120px] border-cyan-500/20 resize-none ${isDayMode ? 'bg-slate-100 text-slate-700 placeholder-slate-500' : 'bg-slate-700/50 text-white placeholder-gray-400'}`}
                />
                
                {/* File attachments display */}
                {attachedFiles.length > 0 && (
                  <div className="bg-slate-700/30 border border-cyan-500/20 rounded-lg p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-300">
                        Attached Files ({attachedFiles.length})
                      </span>
                      {getUploadedCount() > 0 && (
                        <span className="text-xs text-green-400">
                          {getUploadedCount()} uploaded
                        </span>
                      )}
                      {getUploadingCount() > 0 && (
                        <span className="text-xs text-yellow-400">
                          {getUploadingCount()} uploading...
                        </span>
                      )}
                      {getErrorCount() > 0 && (
                        <span className="text-xs text-red-400">
                          {getErrorCount()} failed
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachedFiles.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between bg-slate-600/50 rounded-lg px-3 py-2 border border-slate-500/30">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {item.uploading ? (
                                <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              ) : item.uploaded ? (
                                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                              ) : item.error ? (
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              ) : (
                                <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm text-gray-200 truncate" title={item.file.name}>
                                  {item.file.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                  {item.error && (
                                    <span className="text-red-400 ml-2">• {item.error}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0 p-1 hover:bg-red-500/10 rounded transition-colors"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Image preview for uploaded images */}
                          {item.uploaded && item.url && isImageFile(item.file) && (
                            <div className="relative">
                              <img
                                src={item.url}
                                alt={`Preview of ${item.file.name}`}
                                className="w-full h-32 object-cover rounded-lg border border-slate-500/30"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                Preview
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video upload display - This will show and persist after upload */}
                {videoUpload && (
                  <div className="bg-slate-700/30 border border-cyan-500/20 rounded-lg p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-300">
                        Video Upload
                      </span>
                      {videoUpload.uploaded && (
                        <span className="text-xs text-green-400">uploaded</span>
                      )}
                      {videoUpload.uploading && (
                        <span className="text-xs text-yellow-400">uploading...</span>
                      )}
                      {videoUpload.error && (
                        <span className="text-xs text-red-400">failed</span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* File info section */}
                      <div className="flex items-center justify-between bg-slate-600/50 rounded-lg px-3 py-2 border border-slate-500/30">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {videoUpload.uploading ? (
                            <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          ) : videoUpload.uploaded ? (
                            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          ) : videoUpload.error ? (
                            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                          ) : (
                            <Video className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-gray-200 truncate" title={videoUpload.file.name}>
                              {videoUpload.file.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {(videoUpload.file.size / 1024 / 1024).toFixed(2)} MB
                              {videoUpload.error && (
                                <span className="text-red-400 ml-2">• {videoUpload.error}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={removeVideoUpload}
                          className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0 p-1 hover:bg-red-500/10 rounded transition-colors"
                          title="Remove video"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Upload progress bar - only shown during upload */}
                      {videoUpload.uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Uploading video...</span>
                            <span>{Math.round(videoUpload.uploadProgress)}%</span>
                          </div>
                          <Progress value={videoUpload.uploadProgress} className="h-2" />
                        </div>
                      )}

                      {/* Video preview - shown after successful upload */}
                      {videoUpload.uploaded && videoUpload.url && (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            src={videoUpload.url}
                            className="w-full h-48 object-cover rounded-lg border border-slate-500/30 bg-black"
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                            onEnded={() => setIsVideoPlaying(false)}
                            controls={false}
                            preload="metadata"
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={toggleVideoPlayback}
                              className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors shadow-lg"
                            >
                              {isVideoPlaying ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6 ml-1" />
                              )}
                            </button>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Video Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
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
                  
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${videoUpload ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400'} hover:text-cyan-300 relative`}
                      onClick={handleVideoUpload}
                      title={videoUpload ? 'Video attached' : 'Upload video'}
                    >
                      <Video className="h-4 w-4" />
                      {videoUpload && (
                        <span className="ml-1 text-xs bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          1
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  <input
                    ref={videoInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleVideoSelect}
                    accept="video/mp4,video/mov,video/avi,video/webm,video/quicktime"
                  />
                  
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${attachedFiles.length > 0 ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400'} hover:text-cyan-300 relative`}
                      onClick={handleFileAttach}
                      title={attachedFiles.length > 0 ? `${attachedFiles.length} file(s) attached` : 'Attach files'}
                    >
                      <Paperclip className="h-4 w-4" />
                      {attachedFiles.length > 0 && (
                        <span className="ml-1 text-xs bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {attachedFiles.length}
                        </span>
                      )}
                    </Button>
                    
                    {/* Success message */}
                    {uploadSuccess && (
                      <div className="absolute bottom-full left-0 mb-2 bg-green-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                        <Check className="h-3 w-3 inline mr-1" />
                        {uploadSuccess}
                      </div>
                    )}
                  </div>
                  
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
