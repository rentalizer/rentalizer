import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: any;
  }
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, MessageCircle, Heart, Pin, TrendingUp, Calendar, Edit, Trash2, Send, MoreHorizontal, BarChart3 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSetup } from '@/components/ProfileSetup';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewsFeed } from '@/components/community/NewsFeed';
import { MembersList } from '@/components/MembersList';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMemberCount } from '@/hooks/useMemberCount';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

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
  created_at: string;
  isPinned?: boolean;
  isLiked?: boolean;
  user_id?: string;
  isMockData?: boolean;
}

interface UserProfile {
  user_id: string;
  avatar_url: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
}

export const GroupDiscussions = ({ isDayMode = false }: { isDayMode?: boolean }) => {
  const { user, profile } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  
  const [discussionsList, setDiscussionsList] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: {id: string; author: string; avatar: string; content: string; timeAgo: string;}[]}>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  const { memberCount, loading: memberCountLoading } = useMemberCount();
  const { onlineCount, adminNames, loading: onlineLoading } = useOnlineUsers();
  const [showMembersList, setShowMembersList] = useState(false);

  // Check if user needs to set up profile
  useEffect(() => {
    if (user && profile && (!profile.display_name || profile.display_name.trim() === '')) {
      setShowProfileSetup(true);
    }
  }, [user, profile]);

  // Memoized helper functions to prevent re-renders
  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getUserAvatar = useCallback(() => {
    return profile?.avatar_url || null;
  }, [profile?.avatar_url]);

  const getUserName = useCallback(() => {
    const name = profile?.display_name || user?.email?.split('@')[0] || 'Anonymous User';
    return isAdmin ? `${name} (Admin)` : name;
  }, [profile?.display_name, user?.email, isAdmin]);

  const getUserInitials = useCallback(() => {
    const name = profile?.display_name || user?.email?.split('@')[0] || 'Anonymous User';
    return getInitials(name);
  }, [profile?.display_name, user?.email, getInitials]);

  // Check if a discussion is from an admin
  const isAdminPost = useCallback((discussion: Discussion) => {
    // Check if the author name contains "(Admin)" or if the user_id matches current admin user
    return discussion.author.includes('(Admin)') || 
           (user && discussion.user_id === user.id && isAdmin);
  }, [user, isAdmin]);

  // Fetch user profiles
  const fetchUserProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, avatar_url, display_name, first_name, last_name');

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      const profilesMap: {[key: string]: UserProfile} = {};
      data?.forEach(profile => {
        profilesMap[profile.user_id] = profile;
      });
      
      setUserProfiles(profilesMap);
    } catch (error) {
      console.error('Exception fetching user profiles:', error);
    }
  }, []);

  // Fetch discussions from database with proper sorting
  const fetchDiscussions = useCallback(async () => {
    console.log('🔄 Fetching discussions from database...');
    
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching discussions:', error);
        return;
      }
      
      console.log('📥 Raw data from database:', data?.length || 0, 'discussions');
      
      // Convert database format to component format
      const formattedDiscussions = (data || []).map(discussion => ({
        id: discussion.id,
        title: discussion.title,
        content: discussion.content,
        author: discussion.author_name,
        avatar: getInitials(discussion.author_name),
        category: discussion.category,
        likes: discussion.likes_count || 0,
        comments: discussion.comments_count || 0,
        timeAgo: formatTimeAgo(discussion.created_at),
        created_at: discussion.created_at,
        user_id: discussion.user_id,
        isPinned: discussion.is_pinned || false,
        isLiked: false,
        isMockData: false
      }));

      console.log('✅ Formatted discussions:', formattedDiscussions.length);
      console.log('📌 Pinned discussions:', formattedDiscussions.filter(d => d.isPinned).length);
      setDiscussionsList(formattedDiscussions);
    } catch (error) {
      console.error('❌ Exception fetching discussions:', error);
    }
  }, [getInitials]);

  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  // Initialize data - ONLY fetch once on mount
  useEffect(() => {
    fetchUserProfiles();
    fetchDiscussions();
  }, []); // Empty dependency array - only run once on mount

  // Fixed profile info function - this was the source of the bug
  const getProfileInfo = useCallback((userId: string | undefined, authorName: string) => {
    console.log('🔍 Getting profile info for:', { userId, authorName, currentUserId: user?.id });
    
    // For posts without a user_id, use the author name and generate initials
    if (!userId) {
      return {
        avatar_url: null,
        display_name: authorName,
        initials: getInitials(authorName)
      };
    }

    // For the current user's posts, use their current profile from the auth context
    if (user && user.id === userId) {
      const currentDisplayName = profile?.display_name || user.email?.split('@')[0] || authorName;
      const finalDisplayName = isAdmin ? `${currentDisplayName} (Admin)` : currentDisplayName;
      
      console.log('✅ Using current user profile:', { 
        displayName: finalDisplayName, 
        avatarUrl: profile?.avatar_url 
      });
      
      return {
        avatar_url: profile?.avatar_url,
        display_name: finalDisplayName,
        initials: getInitials(currentDisplayName)
      };
    }

    // For other users, get their profile from the profiles map
    const userProfile = userProfiles[userId];
    if (userProfile) {
      const displayName = userProfile.display_name || userProfile.first_name || authorName;
      return {
        avatar_url: userProfile.avatar_url,
        display_name: displayName,
        initials: getInitials(displayName)
      };
    }
    
    // Fallback to author name and initials
    return {
      avatar_url: null,
      display_name: authorName,
      initials: getInitials(authorName)
    };
  }, [user, profile, isAdmin, userProfiles, getInitials]);

  // Since we're already sorting in the database query, we don't need complex sorting here
  const filteredDiscussions = useMemo(() => {
    console.log('🔍 Filtering discussions. Total discussions:', discussionsList.length);
    const pinnedCount = discussionsList.filter(d => d.isPinned).length;
    console.log('📌 Pinned posts:', pinnedCount, 'Regular posts:', discussionsList.length - pinnedCount);
    console.log('📌 First 3 posts order:', discussionsList.slice(0, 3).map(d => ({ title: d.title.substring(0, 30), isPinned: d.isPinned })));
    
    return discussionsList; // Already sorted from database
  }, [discussionsList]);

  const handleLike = useCallback((discussionId: string) => {
    setDiscussionsList(prev => prev.map(discussion => 
      discussion.id === discussionId
        ? { 
            ...discussion, 
            isLiked: !discussion.isLiked,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1
          }
        : discussion
    ));
  }, []);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || !selectedDiscussion) return;

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
    
    setDiscussionsList(prev => prev.map(d => 
      d.id === selectedDiscussion.id 
        ? { ...d, comments: d.comments + 1 }
        : d
    ));
    
    setNewComment('');
  }, [newComment, selectedDiscussion, getUserName, getUserInitials]);

  const handlePinToggle = useCallback(async (discussionId: string) => {
    if (!isAdmin) {
      return;
    }

    const discussion = discussionsList.find(d => d.id === discussionId);
    if (!discussion) {
      return;
    }

    try {
      const newPinnedStatus = !discussion.isPinned;
      
      // Update database first
      const { error } = await supabase
        .from('discussions')
        .update({ is_pinned: newPinnedStatus })
        .eq('id', discussionId);

      if (error) {
        console.error('❌ Error updating pin status:', error);
        toast({
          title: "Error",
          description: "Failed to update pin status",
          variant: "destructive"
        });
        return;
      }

      // Refresh the discussions list to get proper sorting
      await fetchDiscussions();

      toast({
        title: newPinnedStatus ? "Post Pinned" : "Post Unpinned",
        description: newPinnedStatus 
          ? "This post will now appear at the top of the discussions" 
          : "This post will no longer be pinned",
      });

      console.log('✅ Pin status updated successfully');
    } catch (error) {
      console.error('❌ Exception updating pin status:', error);
      toast({
        title: "Error",
        description: "There was an error updating the pin status",
        variant: "destructive"
      });
    }
  }, [isAdmin, discussionsList, toast, fetchDiscussions]);

  const handleDeleteDiscussion = useCallback(async (discussionId: string) => {
    try {
      // First delete from database to ensure admin permissions work
      const { data, error } = await supabase
        .from('discussions')
        .delete()
        .eq('id', discussionId)
        .select();
        
      console.log('🗑️ Delete response data:', data);
      console.log('🗑️ Delete response error:', error);
        
      if (error) {
        console.error('❌ Database deletion failed:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast({
          title: "Error",
          description: `Failed to delete discussion: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No rows were deleted - discussion may not exist or permission denied');
        toast({
          title: "Warning", 
          description: "No discussion was deleted. It may not exist or you may not have permission.",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Database deletion successful - deleted rows:', data.length);

      // After successful database deletion, update UI
      setDiscussionsList(prevDiscussions => {
        const newDiscussions = prevDiscussions.filter(d => d.id !== discussionId);
        console.log('🗑️ UI updated - discussions count:', newDiscussions.length);
        return newDiscussions;
      });

      toast({
        title: "Discussion Deleted",
        description: "Discussion has been permanently removed.",
      });

    } catch (error) {
      console.error('❌ Exception during deletion:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the discussion.",
        variant: "destructive"
      });
    }
  }, [toast, user?.id, isAdmin, discussionsList.length]);

  const canEditOrDelete = useCallback((discussion: Discussion) => {
    // Admins can edit/delete any post
    if (isAdmin) return true;
    // Users can only edit/delete their own posts
    if (user && discussion.user_id === user.id) return true;
    return false;
  }, [isAdmin, user]);

  const canPin = useCallback((discussion: Discussion) => {
    // Only admins can pin/unpin posts AND the post must be from an admin
    return isAdmin && isAdminPost(discussion);
  }, [isAdmin, isAdminPost]);

  const getTruncatedContent = useCallback((content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }, []);

  // Handle post creation callback - refresh discussions list
  const handlePostCreated = useCallback(() => {
    console.log('🔄 New post created - refreshing discussions list');
    fetchDiscussions();
  }, [fetchDiscussions]);

  // Debug render
  console.log('🎨 RENDERING GroupDiscussions with', filteredDiscussions.length, 'discussions');

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
          <CommunityHeader onPostCreated={handlePostCreated} isDayMode={isDayMode} />


          {/* Discussion Posts */}
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => {
              const profileInfo = getProfileInfo(discussion.user_id, discussion.author);
              
              return (
                <Card key={discussion.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        {profileInfo.avatar_url ? (
                          <AvatarImage 
                            src={profileInfo.avatar_url} 
                            alt={`${discussion.author}'s avatar`}
                            className="object-cover w-full h-full"
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                          {profileInfo.initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {discussion.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                            <span className="text-cyan-300 font-medium">{profileInfo.display_name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400 text-sm">{discussion.timeAgo}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400 text-sm">{discussion.category}</span>
                            {discussion.isPinned && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs ml-2">
                                Pinned
                              </Badge>
                            )}
                          </div>
                          
                          {/* Pin Icon and Options Menu */}
                          <div className="flex items-center gap-2">
                            {/* Pin Icon for Admin Posts Only */}
                            {canPin(discussion) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePinToggle(discussion.id)}
                                className={`h-8 w-8 p-0 transition-colors ${
                                  discussion.isPinned 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-gray-400 hover:text-yellow-400'
                                }`}
                                title={discussion.isPinned ? 'Unpin post' : 'Pin post'}
                              >
                                <Pin className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Options Menu */}
                            {canEditOrDelete(discussion) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-800 border-gray-700">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setEditingPost(discussion.id);
                                      setEditContent(discussion.content);
                                    }}
                                    className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      console.log('🗑️ DELETE BUTTON CLICKED for discussion:', discussion.id);
                                      handleDeleteDiscussion(discussion.id);
                                    }}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        <h3 className={`text-xl font-semibold mb-3 ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                          {discussion.title}
                        </h3>

                        <div 
                          className={`mb-4 leading-relaxed whitespace-pre-wrap cursor-pointer transition-colors ${
                            isDayMode ? 'text-slate-600 hover:text-slate-700' : 'text-gray-300 hover:text-gray-200'
                          }`}
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
                                onClick={() => setSelectedDiscussion(discussion)}
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
                              
                              <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-700">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  {getUserAvatar() ? (
                                    <AvatarImage 
                                      src={getUserAvatar()!} 
                                      alt="Your avatar"
                                      className="object-cover w-full h-full"
                                    />
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex justify-between items-center">
                  {isAdmin ? (
                    <button
                      onClick={() => setShowMembersList(true)}
                      className="text-gray-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      Total Members
                    </button>
                  ) : (
                    <span className="text-gray-400">Total Members</span>
                  )}
                   <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">
                     {memberCountLoading ? '...' : memberCount}
                   </Badge>
                </div>
               <div className="flex justify-between items-center">
                 {isAdmin ? (
                   <div className="flex flex-col">
                     <span className="text-gray-400">Online Now</span>
                     {adminNames.length > 0 && (
                       <span className="text-xs text-green-300">
                         Admins: {adminNames.join(', ')}
                       </span>
                     )}
                   </div>
                 ) : (
                   <span className="text-gray-400">Online Now</span>
                 )}
                 <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                   {onlineLoading ? '...' : onlineCount}
                 </Badge>
               </div>
             </CardContent>
           </Card>

          <div className="max-h-[800px] overflow-y-auto">
            <NewsFeed isDayMode={isDayMode} />
          </div>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                30-Day Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                {/* Leaderboard entries */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                  <Badge className="bg-yellow-500 text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">1</Badge>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm truncate">Judith Dreher</span>
                    <div className="text-gray-400 font-semibold text-sm">+9 pts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <MembersList
        open={showMembersList}
        onOpenChange={setShowMembersList}
        onMessageMember={(memberId, memberName) => {
          toast({
            title: "Message Member",
            description: `Starting conversation with ${memberName}`,
          });
        }}
      />
    </div>
  );
};
