import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Paperclip, Image, Video, Smile, AtSign, X, Check, AlertCircle, Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { AdminGroupAvatar } from '@/components/community/AdminGroupAvatar';

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

interface PhotoUpload {
  id: string;
  file: File;
  url?: string;
  uploaded: boolean;
  uploading: boolean;
  uploadProgress: number;
  error?: string;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ onPostCreated, isDayMode = false }) => {
  const { user, profile } = useAuth();
  const { profile: supabaseProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [videoUpload, setVideoUpload] = useState<VideoUpload | null>(null);
  const [photoUploads, setPhotoUploads] = useState<PhotoUpload[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';

  const getUserAvatar = () => {
    const avatar = supabaseProfile?.avatar_url || user?.profilePicture;
    // Normalize avatar (convert empty strings to null)
    return (avatar && avatar.trim() !== '') ? avatar : null;
  };
  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split('@')[0] || 'Anonymous User';
  };
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

  const createUploadId = () => {
    const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined;
    if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
      return globalCrypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handlePhotoUpload = () => {
    if (photoUploads.length >= 3) {
      console.log('Photo limit reached: Maximum of 3 photos per post.');
      return;
    }
    photoInputRef.current?.click();
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
        setVideoUpload(prev => prev ? { ...prev, uploading: false, uploadProgress: 0, error: 'Upload failed: ' + error.message } : null);
        return null;
      }

      console.log('Video upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('community-videos')
        .getPublicUrl(filePath);

      console.log('Video public URL:', publicUrl);

      // Update video upload status to uploaded with URL and full progress - NO TOAST
      setVideoUpload(prev => prev ? { 
        ...prev, 
        uploading: false, 
        uploaded: true, 
        url: publicUrl, 
        uploadProgress: 100,
        error: undefined
      } : null);

      return publicUrl;
    } catch (error) {
      console.error('Exception uploading video:', error);
      setVideoUpload(prev => prev ? { 
        ...prev, 
        uploading: false, 
        uploadProgress: 0,
        error: 'Upload failed: ' + (error as Error).message 
      } : null);
      return null;
    }
  };

  const uploadPhotoFile = async (file: File, uploadId: string): Promise<string | null> => {
    const updatePhotoUpload = (updater: (item: PhotoUpload) => PhotoUpload) => {
      setPhotoUploads(prev => prev.map(item => item.id === uploadId ? updater(item) : item));
    };

    let progressInterval: ReturnType<typeof setInterval> | undefined;

    try {
      // Check if user is authenticated
      if (!user) {
        console.error('User not authenticated');
        updatePhotoUpload(item => ({ ...item, uploading: false, error: 'User not authenticated' }));
        return null;
      }

      // Update photo upload status to uploading with progress
      updatePhotoUpload(item => ({ ...item, uploading: true, uploadProgress: 10, error: undefined }));

      console.log('📤 Uploading photo to Node.js backend...');
      console.log('User ID:', user.id);
      console.log('File size:', file.size);

      // Simulate progress updates
      progressInterval = setInterval(() => {
        setPhotoUploads(prev => prev.map(item => 
          item.id === uploadId 
            ? { ...item, uploadProgress: Math.min(item.uploadProgress + 20, 90) } 
            : item
        ));
      }, 500);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('photo', file);

      // Get auth token
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      // Upload to Node.js backend
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/upload/photo`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (response.data.success) {
        const photoUrl = response.data.data.url;
        console.log('✅ Photo upload successful:', photoUrl);

        // Update photo upload status to uploaded with URL and full progress
        updatePhotoUpload(item => ({
          ...item,
          uploading: false,
          uploaded: true,
          url: photoUrl,
          uploadProgress: 100,
          error: undefined
        }));

        return photoUrl;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Exception uploading photo:', error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      updatePhotoUpload(item => ({
        ...item,
        uploading: false,
        uploadProgress: 0,
        error: 'Upload failed: ' + (error as Error).message
      }));
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        console.log("File too large:", `${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if user is authenticated before proceeding
    if (!user) {
      console.log("Authentication required: Please sign in to upload files");
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
      console.log("Invalid file type: Please select a valid video file (.mp4, .mov, .avi, .webm)");
      return;
    }

    // Check file size (1GB limit)
    const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
    if (videoFile.size > maxSize) {
      console.log("File too large: Video file must be smaller than 1GB");
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log("Authentication required: Please sign in to upload videos");
      return;
    }

    // Initialize video upload state immediately - this makes it show right away
    setVideoUpload({
      file: videoFile,
      uploaded: false,
      uploading: false,
      uploadProgress: 0,
      url: undefined,
      error: undefined
    });

    // Start upload process
    await uploadVideoFile(videoFile);

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handlePhotoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - photoUploads.length;
    if (remainingSlots <= 0) {
      console.log('Photo limit reached: Maximum of 3 photos per post.');
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    const validPhotos: File[] = [];
    files.forEach(file => {
      if (!validImageTypes.includes(file.type)) {
        console.log(`Invalid file type: ${file.name} is not a supported image format (.jpg, .jpeg, .png, .gif, .webp)`);
        return;
      }
      if (file.size > maxSize) {
        console.log(`File too large: ${file.name} is larger than 5MB`);
        return;
      }
      validPhotos.push(file);
    });

    if (validPhotos.length === 0) {
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    const photosToProcess = validPhotos.slice(0, remainingSlots);
    if (validPhotos.length > remainingSlots) {
      console.log(`Photo limit reached: Only the first ${remainingSlots} photo(s) were added (maximum 3 photos per post).`);
    }

    if (!user) {
      console.log("Authentication required: Please sign in to upload photos");
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    const uploadsToAdd = photosToProcess.map(file => ({
      id: createUploadId(),
      file,
      uploaded: false,
      uploading: false,
      uploadProgress: 0,
      url: undefined,
      error: undefined
    }));

    setPhotoUploads(prev => [...prev, ...uploadsToAdd]);

    for (const upload of uploadsToAdd) {
      await uploadPhotoFile(upload.file, upload.id);
    }

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

  const removePhotoUpload = (uploadId: string) => {
    setPhotoUploads(prev => prev.filter(item => item.id !== uploadId));
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
    
    // Check if user is authenticated
    if (!user) {
      console.log("Authentication required: Please sign in to create a post");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postTitleToUse = postTitle.trim() || 
        (newPost.length > 50 ? newPost.substring(0, 50) + '...' : newPost);
      
      // Add file attachments, video, and photo to post content if any were uploaded
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

      // Add photos if uploaded
      const uploadedPhotos = photoUploads.filter(photo => photo.uploaded && photo.url);
      if (uploadedPhotos.length > 0) {
        const photoLinks = uploadedPhotos.map(photo => `![${photo.file.name}](${photo.url})`).join('\n\n');
        contentWithMedia = `${contentWithMedia}\n\n${photoLinks}`;
      }
      
      console.log('Creating discussion with data:', {
        title: postTitleToUse,
        content: contentWithMedia,
        author_name: getUserName(),
        category: 'General',
        author_avatar: user?.profilePicture
      });
      
      const response = await apiService.createDiscussion({
        title: postTitleToUse,
        content: contentWithMedia,
        author_name: getUserName(),
        category: 'General',
        author_avatar: user?.profilePicture
      });
      
      console.log('Discussion created successfully:', response.data);

      const attachmentCount = uploadedFiles.length + (videoUpload?.uploaded ? 1 : 0) + uploadedPhotos.length;
      console.log("Post created:", attachmentCount > 0 
        ? `Your post has been shared with ${attachmentCount} attachment(s)`
        : "Your post has been shared with the community");

      setNewPost('');
      setPostTitle('');
      setAttachedFiles([]);
      setVideoUpload(null);
      setPhotoUploads([]);
      setUploadSuccess(null);
      setIsVideoPlaying(false);
      onPostCreated();
      
    } catch (error) {
      console.error('Exception creating post:', error);
      console.log("Error: Failed to create post. Please try again.");
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
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-0">
              {isAdminUser ? (
                <AdminGroupAvatar size="xl" className="shrink-0" />
              ) : (
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
              )}
              <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2 sm:hidden">
                <span className="text-cyan-300 font-medium">{getUserName()}</span>
                {isAdminUser ? (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                    Admin
                  </Badge>
                ) : null}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="hidden sm:flex items-center gap-2 mb-2">
                  <span className="text-cyan-300 font-medium">{getUserName()}</span>
                  {isAdminUser ? (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                      Admin
                    </Badge>
                  ) : null}
                </div>
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
                  <div className="w-full rounded-lg border border-cyan-500/20 bg-slate-700/30 p-3 space-y-3">
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

                {/* Video upload display - This stays visible after upload */}
                {videoUpload && (
                  <div className="w-full rounded-lg border border-cyan-500/20 bg-slate-700/30 p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-300">
                        Video Upload
                      </span>
                      {videoUpload.uploaded && (
                        <span className="text-xs text-green-400">✓ uploaded</span>
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
                            Video Ready
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Photo upload display - This stays visible after upload */}
                {photoUploads.length > 0 && (
                  <div className="w-full rounded-lg border border-cyan-500/20 bg-slate-700/30 p-3 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Image className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-300">
                        Photo Uploads
                      </span>
                      <span className="text-xs text-gray-400">
                        ({photoUploads.length}/3)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {photoUploads.map((upload) => (
                        <div
                          key={upload.id}
                          className="space-y-3 rounded-lg border border-slate-500/30 bg-slate-600/20 p-3"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                              {upload.uploading ? (
                                <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              ) : upload.uploaded ? (
                                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                              ) : upload.error ? (
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              ) : (
                                <Image className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm text-gray-200 break-words" title={upload.file.name}>
                                  {upload.file.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                  <span>{(upload.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  {upload.uploaded && <span className="text-green-400">• ready</span>}
                                  {upload.uploading && <span className="text-yellow-400">• uploading</span>}
                                  {upload.error && <span className="text-red-400 break-words">• {upload.error}</span>}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removePhotoUpload(upload.id)}
                              className="self-center rounded p-1 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 sm:self-auto"
                              title="Remove photo"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Upload progress bar - only shown during upload */}
                          {upload.uploading && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Uploading photo...</span>
                                <span>{Math.round(upload.uploadProgress)}%</span>
                              </div>
                              <Progress value={upload.uploadProgress} className="h-2" />
                            </div>
                          )}

                          {/* Photo preview - shown after successful upload */}
                          {upload.uploaded && upload.url && (
                            <div className="relative">
                              <img
                                src={upload.url}
                                alt={`Preview of ${upload.file.name}`}
                                className="w-full h-48 object-cover rounded-lg border border-slate-500/30"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                Photo Ready
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={photoUploads.length >= 3}
                      className={`${photoUploads.length > 0 ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400'} hover:text-cyan-300 relative disabled:opacity-60 disabled:cursor-not-allowed`}
                      onClick={handlePhotoUpload}
                      title={photoUploads.length >= 3 ? 'Maximum of 3 photos attached' : photoUploads.length > 0 ? `${photoUploads.length} photo(s) attached` : 'Upload photos'}
                    >
                      <Image className="h-4 w-4" />
                      {photoUploads.length > 0 && (
                        <span className="ml-1 text-xs bg-cyan-500 text-white rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                          {photoUploads.length}
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  <input
                    ref={photoInputRef}
                    type="file"
                    className="hidden"
                    onChange={handlePhotoSelect}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                  />
                  
                  {/* <div className="relative">
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
                  </div> */}
                  
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
