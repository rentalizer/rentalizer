
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, MessageCircle, Heart, Pin, TrendingUp, Calendar, Filter, Image, Video, Smile, Paperclip, AtSign, X, Trash2, Send, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSetup } from '@/components/ProfileSetup';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isPinned?: boolean;
  isLiked?: boolean;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
  }[];
}

export const GroupDiscussions = () => {
  const { user, profile } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General discussion');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<{type: 'image' | 'video' | 'file'; url: string; name: string;}[]>([]);
  const [discussionsList, setDiscussionsList] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: {id: string; author: string; avatar: string; content: string; timeAgo: string;}[]}>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user needs to set up profile
  useEffect(() => {
    if (user && profile && (!profile.display_name || profile.display_name.trim() === '')) {
      setShowProfileSetup(true);
    }
  }, [user, profile]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserAvatar = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return null;
  };

  const getUserName = () => {
    const name = profile?.display_name || user?.email?.split('@')[0] || 'Anonymous User';
    return isAdmin ? `${name} (Admin)` : name;
  };

  const getUserInitials = () => {
    const name = profile?.display_name || user?.email?.split('@')[0] || 'Anonymous User';
    return getInitials(name);
  };

  // Persist discussions in localStorage to prevent deletion
  const DISCUSSIONS_KEY = 'community_discussions';
  
  const loadDiscussions = () => {
    try {
      const saved = localStorage.getItem(DISCUSSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };
  
  const saveDiscussions = (discussions: Discussion[]) => {
    try {
      localStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(discussions));
    } catch (error) {
      console.error('Failed to save discussions:', error);
    }
  };

  // Initialize discussions with saved data
  React.useEffect(() => {
    const savedDiscussions = loadDiscussions();
    setDiscussionsList(savedDiscussions);
  }, []);

  // Functions to handle likes and comments
  const handleLike = (discussionId: string) => {
    setDiscussionsList(prev => prev.map(discussion => 
      discussion.id === discussionId
        ? { 
            ...discussion, 
            isLiked: !discussion.isLiked,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1
          }
        : discussion
    ));
  };

  const handleComment = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
  };

  // Comment handlers
  const handleAddComment = async () => {
    if (newComment.trim() && selectedDiscussion) {
      const comment = {
        id: String(Date.now()),
        author: getUserName(),
        avatar: getUserInitials(),
        content: newComment,
        timeAgo: 'now'
      };
      
      setComments(prev => ({
        ...prev,
        [selectedDiscussion.id]: [...(prev[selectedDiscussion.id] || []), comment]
      }));
      
      // Update discussion comment count
      setDiscussionsList(prev => prev.map(d => 
        d.id === selectedDiscussion.id 
          ? { ...d, comments: d.comments + 1 }
          : d
      ));
      
      // Send email notification for comment
      try {
        await supabase.functions.invoke('community-notification', {
          body: {
            type: 'comment',
            authorName: getUserName(),
            authorEmail: user?.email,
            content: newComment,
            postTitle: selectedDiscussion.title
          }
        });
      } catch (error) {
        console.error('Failed to send comment notification:', error);
      }
      
      setNewComment('');
    }
  };

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setAttachments(prev => [...prev, { type, url, name: file.name }]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Emoji handler
  const handleEmojiSelect = (emoji: string) => {
    setNewPost(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Common emojis
  const commonEmojis = ['😀', '😂', '🤔', '👍', '❤️', '🎉', '💡', '🔥', '💪', '🚀', '✨', '🎯'];

  // Delete post handler
  const handleDeletePost = (discussionId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDiscussionsList(prev => prev.filter(discussion => discussion.id !== discussionId));
    }
  };

  // Edit post handlers
  const handleEditPost = (discussion: Discussion) => {
    setEditingPost(discussion.id);
    setEditContent(discussion.content);
  };

  const handleSaveEdit = (discussionId: string) => {
    if (editContent.trim()) {
      setDiscussionsList(prev => prev.map(discussion => 
        discussion.id === discussionId
          ? { 
              ...discussion, 
              content: editContent,
              title: editContent.length > 50 ? editContent.substring(0, 50) + '...' : editContent
            }
          : discussion
      ));
      setEditingPost(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
  };

  // Pin toggle handler
  const handleTogglePin = (discussionId: string) => {
    setDiscussionsList(prev => prev.map(discussion => 
      discussion.id === discussionId
        ? { ...discussion, isPinned: !discussion.isPinned }
        : discussion
    ));
  };

  // Get truncated content for preview
  const getTruncatedContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleSubmitPost = async () => {
    if (newPost.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      const postTitleToUse = postTitle.trim() || 
        (newPost.length > 50 ? newPost.substring(0, 50) + '...' : newPost);
      
      const newDiscussion: Discussion = {
        id: String(Date.now()),
        title: postTitleToUse,
        content: newPost,
        author: getUserName(),
        avatar: getUserInitials(),
        category: selectedCategory,
        likes: 0,
        comments: 0,
        timeAgo: 'now',
        isLiked: false,
        attachments: attachments.length > 0 ? attachments : undefined
      };
      
      const updatedDiscussions = [newDiscussion, ...discussionsList];
      setDiscussionsList(updatedDiscussions);
      saveDiscussions(updatedDiscussions);
      
      // Send email notification for new post
      try {
        await supabase.functions.invoke('community-notification', {
          body: {
            type: 'post',
            authorName: getUserName(),
            authorEmail: user?.email,
            content: newPost
          }
        });
        
        toast({
          title: "Post created!",
          description: "Your post has been shared with the community"
        });
      } catch (error) {
        console.error('Failed to send post notification:', error);
        toast({
          title: "Post created",
          description: "Your post was created but notification failed to send",
          variant: "destructive"
        });
      }
      
      setNewPost('');
      setPostTitle('');
      setAttachments([]);
      setAttachments([]);
      setShowEmojiPicker(false);
      
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  const categories = ['General discussion', 'Resource Library', 'Success Stories', 'Share Your Wins'];
  const filters = ['All', 'General discussion', 'Resource Library', 'Success Stories', 'Share Your Wins', 'More...'];

  const filteredDiscussions = discussionsList
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'All' || 
                           (selectedFilter === 'General discussion' && discussion.category === 'General discussion') ||
                           (selectedFilter === discussion.category);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort pinned posts to top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl space-y-6">
      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
          <DialogContent className="bg-slate-900/95 border-gray-700 max-w-md">
            <ProfileSetup onComplete={() => setShowProfileSetup(false)} />
          </DialogContent>
        </Dialog>
      )}
      {/* Header with Post Input */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12 flex-shrink-0">
                {getUserAvatar() ? (
                  <AvatarImage src={getUserAvatar()!} alt="Your avatar" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-4">
                {/* Title Input */}
                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Write something..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-cyan-500/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-slate-700">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Content Input */}
                <Textarea
                  placeholder="Write something..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[120px] bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 resize-none"
                />
                
                {/* Attachment Options */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-cyan-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-cyan-300"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-cyan-300"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-cyan-300"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      
                      {/* Emoji Picker */}
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 bg-slate-700 border border-gray-600 rounded-lg p-3 grid grid-cols-6 gap-2 z-10">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="text-lg hover:bg-slate-600 p-1 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-cyan-300"
                    >
                      <AtSign className="h-4 w-4" />
                    </Button>
                    
                    {/* Hidden File Inputs */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, 'file')}
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim() || isSubmitting}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
                
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-600/50 p-2 rounded">
                        {attachment.type === 'image' && <Image className="h-4 w-4 text-cyan-400" />}
                        {attachment.type === 'video' && <Video className="h-4 w-4 text-cyan-400" />}
                        {attachment.type === 'file' && <Paperclip className="h-4 w-4 text-cyan-400" />}
                        <span className="text-sm text-gray-300 flex-1">{attachment.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events Banner */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-300" />
            <div className="flex-1">
              <span className="text-blue-300 font-medium">Property Acquisitions</span>
              <span className="text-gray-300 ml-2">is happening in 8 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter
                ? "bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                : "border-gray-600 text-gray-300 hover:bg-gray-800 whitespace-nowrap"
            }
          >
            {filter}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300 ml-2">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Discussion Posts */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  {getUserAvatar() ? (
                    <AvatarImage src={getUserAvatar()!} alt={discussion.author} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                      {discussion.avatar}
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  {/* Header with Pin and Author */}
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.isPinned && (
                      <Pin className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-cyan-300 font-medium">{discussion.author}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{discussion.timeAgo}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{discussion.category}</span>
                    {discussion.isPinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs ml-2">
                        Pinned
                      </Badge>
                    )}
                    
                    {/* Pin and Edit/Delete buttons - only show for current user's posts */}
                    {discussion.author === getUserName() && (
                      <div className="flex items-center gap-1 ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(discussion.id);
                          }}
                          className={`p-1 ${discussion.isPinned ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}
                          title={discussion.isPinned ? 'Unpin post' : 'Pin post'}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPost(discussion);
                          }}
                          className="text-gray-400 hover:text-blue-400 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(discussion.id);
                          }}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Post Title */}
                  <h3 className="text-xl font-semibold text-white mb-3 hover:text-cyan-300 transition-colors">
                    {discussion.title}
                  </h3>

                  {/* Post Content Preview or Edit Mode */}
                  {editingPost === discussion.id ? (
                    <div className="mb-4 space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 min-h-[100px]"
                        placeholder="Edit your post..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveEdit(discussion.id)}
                          disabled={!editContent.trim()}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap cursor-pointer hover:text-gray-200 transition-colors"
                      onClick={() => setExpandedPost(expandedPost === discussion.id ? null : discussion.id)}
                    >
                      {expandedPost === discussion.id ? discussion.content : getTruncatedContent(discussion.content)}
                      {discussion.content.length > 150 && expandedPost !== discussion.id && (
                        <span className="text-cyan-400 ml-2 font-medium">Read more</span>
                      )}
                      {expandedPost === discussion.id && discussion.content.length > 150 && (
                        <span className="text-cyan-400 ml-2 font-medium">Show less</span>
                      )}
                    </div>
                  )}

                  {/* Attachments Display */}
                  {discussion.attachments && discussion.attachments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {discussion.attachments.map((attachment, index) => (
                        <div key={index} className="inline-flex items-center gap-2 bg-slate-700/50 p-2 rounded mr-2">
                          {attachment.type === 'image' && (
                             <img 
                               src={attachment.url} 
                               alt={attachment.name}
                               className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSelectedImage(attachment.url);
                               }}
                             />
                           )}
                          {attachment.type === 'video' && (
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-cyan-400" />
                              <video 
                                src={attachment.url}
                                className="h-20 w-32 object-cover rounded"
                                controls
                              />
                            </div>
                          )}
                          {attachment.type === 'file' && (
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-cyan-400" />
                              <span className="text-sm text-gray-300">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(discussion.id)}
                      className={`flex items-center gap-2 hover:bg-red-500/10 transition-colors ${discussion.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                    >
                      <Heart className={`h-4 w-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
                      {discussion.likes}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleComment(discussion)}
                          className="flex items-center gap-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {discussion.comments}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white">Comments - {discussion.title}</DialogTitle>
                        </DialogHeader>
                        
                        {/* Comments List */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {comments[discussion.id]?.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {comment.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-cyan-300 font-medium text-sm">{comment.author}</span>
                                  <span className="text-gray-400 text-xs">{comment.timeAgo}</span>
                                </div>
                                <p className="text-gray-300 text-sm">{comment.content}</p>
                              </div>
                            </div>
                          )) || (
                            <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
                          )}
                        </div>
                        
                        {/* Add Comment */}
                        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-700">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            {getUserAvatar() ? (
                              <AvatarImage src={getUserAvatar()!} alt="Your avatar" />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm">
                                {getUserInitials()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                            />
                            <Button
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white self-end"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Avatar Stack for Commenters */}
                    {discussion.comments > 0 && (
                      <div className="flex -space-x-2 ml-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-slate-800"></div>
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-slate-800"></div>
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-slate-800"></div>
                        {discussion.comments > 3 && (
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-xs text-white font-medium">+</span>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-gray-500 text-sm ml-auto">
                      Last comment {discussion.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="bg-slate-800/50 border-gray-700/50">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No discussions found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Image Expansion Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-slate-900/95 border-gray-700 max-w-4xl p-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 text-white hover:bg-slate-800/50 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={selectedImage}
                alt="Expanded view"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg animate-scale-in"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
        </div>
      </div>

      {/* Right Sidebar - Leaderboard */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          {/* Community Stats */}
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Members</span>
                <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">187</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Online Now</span>
                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Admins</span>
                <Badge className="bg-red-600/20 text-red-300 border-red-500/30">3</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 30-Day Leaderboard */}
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                30-Day Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Top 5 members - excluding admins */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                  <div className="flex items-center justify-center w-6 h-6">
                    <Badge className="bg-yellow-500 text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">1</Badge>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Judith Dreher</span>
                    <div className="text-gray-400 font-semibold text-sm">+9 pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30">
                  <div className="flex items-center justify-center w-6 h-6">
                    <Badge className="bg-gray-400 text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">2</Badge>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Lynn Lueders</span>
                    <div className="text-gray-400 font-semibold text-sm">+7 pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30">
                  <div className="flex items-center justify-center w-6 h-6">
                    <Badge className="bg-amber-600 text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">3</Badge>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-sm">LL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Mc Calhoun</span>
                    <div className="text-gray-400 font-semibold text-sm">+4 pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30">
                  <div className="flex items-center justify-center w-6 h-6">
                    <span className="text-gray-400 font-bold text-sm">4</span>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">EB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Edward Badal</span>
                    <div className="text-gray-400 font-semibold text-sm">+6 pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30">
                  <div className="flex items-center justify-center w-6 h-6">
                    <span className="text-gray-400 font-bold text-sm">5</span>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm">LC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Lonnie Castillon</span>
                    <div className="text-gray-400 font-semibold text-sm">+6 pts</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <Button 
                  variant="ghost" 
                  className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-sm"
                  onClick={() => window.location.href = '/leaderboard'}
                >
                  See all leaderboards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
