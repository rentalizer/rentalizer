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
import { apiService, type Discussion } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { NewsFeed } from '@/components/community/NewsFeed';
import { MembersList } from '@/components/MembersList';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMemberCount } from '@/hooks/useMemberCount';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

// Frontend Discussion interface (transformed from backend)
interface DiscussionType {
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
  isLiked: boolean;
  user_id: string;
  isAdmin?: boolean;
  // Backend fields for transformation
  _id: string;
  author_name: string;
  author_avatar?: string;
  comments_count: number;
  is_pinned: boolean;
  is_admin_post: boolean;
  // Additional backend fields
  views_count: number;
  liked_by: string[];
  tags: string[];
  attachments: any[];
  is_active: boolean;
  last_activity: string;
  updatedAt: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  role?: string;
}

export const GroupDiscussions = ({ isDayMode = false }: { isDayMode?: boolean }) => {
  const { user, profile } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  
  const [discussionsList, setDiscussionsList] = useState<DiscussionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [pinningPosts, setPinningPosts] = useState<Set<string>>(new Set());
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionType | null>(null);
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
  const isAdminPost = useCallback((discussion: DiscussionType) => {
    // Check if the author name contains "(Admin)" or if the user_id matches current admin user
    return discussion.author.includes('(Admin)') || 
           (user && discussion.user_id === user.id && isAdmin);
  }, [user, isAdmin]);

  // Fetch user profiles from custom backend
  const fetchUserProfiles = useCallback(async () => {
    try {
      // For now, we'll use the current user's profile from auth context
      // In the future, you might want to add an endpoint to fetch all user profiles
      if (user) {
        const profilesMap: {[key: string]: UserProfile} = {};
        profilesMap[user.id] = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          bio: user.bio,
          role: user.role
        };
        setUserProfiles(profilesMap);
        console.log('✅ User profiles loaded:', profilesMap);
      }
    } catch (error) {
      console.error('Exception fetching user profiles:', error);
    }
  }, [user]);

  // Mock discussions data with different users including admin
  const mockDiscussions = useMemo(() => [
    {
      id: 'mock-1',
      title: 'Welcome to the Rentalizer Community! 🏠',
      content: 'Hey everyone! Welcome to our amazing community of rental entrepreneurs. I\'m excited to see all the great discussions and insights we\'ll be sharing here. Feel free to introduce yourself and share your rental investment journey!',
      author: 'Richie (Admin)',
      avatar: 'RA',
      category: 'General',
      likes: 24,
      comments: 3,
      timeAgo: '2 hours ago',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: '00000000-0000-0000-0000-000000000001', // Admin user ID
      isPinned: true,
      isLiked: false,
      isMockData: true,
      isAdmin: true
    },
    {
      id: 'mock-2',
      title: 'First Property Analysis - Need Advice!',
      content: 'Hi everyone! I\'m looking at my first rental property and could use some advice. It\'s a 3BR/2BA single-family home in a decent neighborhood. The numbers look good on paper, but I\'m nervous about the market timing. Any experienced investors have thoughts on current market conditions?',
      author: 'Sarah Johnson',
      avatar: 'SJ',
      category: 'Investment Advice',
      likes: 12,
      comments: 2,
      timeAgo: '4 hours ago',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user_id: '00000000-0000-0000-0000-000000000003',
      isPinned: false,
      isLiked: false,
      isMockData: true
    },
    {
      id: 'mock-3',
      title: 'Property Management Software Recommendations?',
      content: 'What property management software do you all use? I\'m managing 8 units now and my Excel spreadsheets are getting out of hand. Looking for something that can handle tenant communication, rent collection, and maintenance requests. Budget is around $50-100/month.',
      author: 'Mike Chen',
      avatar: 'MC',
      category: 'Tools & Technology',
      likes: 18,
      comments: 2,
      timeAgo: '6 hours ago',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user_id: '00000000-0000-0000-0000-000000000004',
      isPinned: false,
      isLiked: false,
      isMockData: true
    },
    {
      id: 'mock-4',
      title: 'Success Story: Bought My 5th Property! 🎉',
      content: 'Just closed on my 5th rental property today! Started with one duplex 3 years ago and now I have 5 units generating $8,500/month in rental income. The key was finding the right market and being patient with the numbers. Thanks to this community for all the advice along the way!',
      author: 'Jessica Martinez',
      avatar: 'JM',
      category: 'Success Stories',
      likes: 32,
      comments: 2,
      timeAgo: '1 day ago',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user_id: '00000000-0000-0000-0000-000000000005',
      isPinned: false,
      isLiked: false,
      isMockData: true
    },
    {
      id: 'mock-5',
      title: 'Market Analysis: Phoenix vs Austin - Which is Better?',
      content: 'I\'m considering expanding to either Phoenix or Austin and would love to hear from investors in those markets. What are the current cap rates, vacancy rates, and growth projections? Also, how are the local regulations and landlord-tenant laws? Any insights would be greatly appreciated!',
      author: 'David Thompson',
      avatar: 'DT',
      category: 'Market Analysis',
      likes: 15,
      comments: 2,
      timeAgo: '2 days ago',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: '00000000-0000-0000-0000-000000000006',
      isPinned: false,
      isLiked: false,
      isMockData: true
    }
  ], []);

  // Mock comments for discussions
  const mockComments = useMemo(() => ({
    'mock-1': [
      { id: 'c1', author: 'Sarah Johnson', avatar: 'SJ', content: 'Thanks for the warm welcome! Excited to be part of this community.', timeAgo: '1 hour ago' },
      { id: 'c2', author: 'Mike Chen', avatar: 'MC', content: 'Great to have everyone here! Looking forward to learning and sharing.', timeAgo: '45 min ago' },
      { id: 'c3', author: 'Jessica Martinez', avatar: 'JM', content: 'This is going to be an amazing resource for all of us!', timeAgo: '30 min ago' }
    ],
    'mock-2': [
      { id: 'c4', author: 'Mike Chen', avatar: 'MC', content: 'Congrats on taking the first step! What\'s the purchase price and expected rent?', timeAgo: '3 hours ago' },
      { id: 'c5', author: 'David Thompson', avatar: 'DT', content: 'I\'d recommend running the numbers through the 1% rule first.', timeAgo: '2 hours ago' }
    ],
    'mock-3': [
      { id: 'c6', author: 'Sarah Johnson', avatar: 'SJ', content: 'I use Rent Manager - it\'s been great for tenant communication!', timeAgo: '5 hours ago' },
      { id: 'c7', author: 'Jessica Martinez', avatar: 'JM', content: 'Check out Buildium too, fits your budget perfectly.', timeAgo: '4 hours ago' }
    ],
    'mock-4': [
      { id: 'c8', author: 'Sarah Johnson', avatar: 'SJ', content: 'Amazing milestone! What was your strategy for finding properties?', timeAgo: '20 hours ago' },
      { id: 'c9', author: 'Mike Chen', avatar: 'MC', content: 'Congratulations! That\'s inspiring for new investors like me.', timeAgo: '18 hours ago' }
    ],
    'mock-5': [
      { id: 'c10', author: 'Sarah Johnson', avatar: 'SJ', content: 'Phoenix has better cap rates right now, but Austin has more growth potential.', timeAgo: '1 day ago' },
      { id: 'c11', author: 'Jessica Martinez', avatar: 'JM', content: 'Consider the tax implications too - Texas has no state income tax!', timeAgo: '23 hours ago' }
    ]
  }), []);

  // Fetch discussions from backend API
  const fetchDiscussions = useCallback(async () => {
    console.log('🔄 Loading discussions from backend...');
    setLoading(true);
    
    try {
      const response = await apiService.getDiscussions({
        page: 1,
        limit: 50
        // Remove server-side sorting since we're doing it locally
      });
      
      console.log('📥 Discussions loaded:', response.data.length, 'discussions');
      console.log('📌 Pinned discussions:', response.data.filter(d => d.is_pinned).length);
      
      // Transform backend data to match frontend expectations
      const transformedDiscussions = response.data.map(discussion => {
        const isLiked = user ? discussion.liked_by.includes(user.id) : false;
        console.log(`🔍 Discussion "${discussion.title}":`, {
          liked_by: discussion.liked_by,
          current_user_id: user?.id,
          isLiked: isLiked
        });
        
        return {
          ...discussion,
          id: discussion._id,
          author: discussion.author_name,
          avatar: discussion.author_avatar || '',
          comments: discussion.comments_count,
          timeAgo: discussion.timeAgo,
          isPinned: discussion.is_pinned,
          isLiked: isLiked,
          isAdmin: discussion.is_admin_post,
          created_at: discussion.createdAt
        };
      });
      
      setDiscussionsList(transformedDiscussions);
      
      // Set mock comments for now (we'll implement comments API later)
      setComments(mockComments);
    } catch (error) {
      console.error('❌ Exception loading discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

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
        avatarUrl: user.profilePicture 
      });
      
      return {
        avatar_url: user.profilePicture,
        display_name: finalDisplayName,
        initials: getInitials(currentDisplayName)
      };
    }

    // For other users, get their profile from the profiles map
    const userProfile = userProfiles[userId];
    if (userProfile) {
      const displayName = userProfile.firstName && userProfile.lastName 
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile.email?.split('@')[0] || authorName;
      return {
        avatar_url: userProfile.profilePicture,
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

  // Sort discussions locally: pinned posts first, then by creation date
  const filteredDiscussions = useMemo(() => {
    console.log('🔍 Filtering and sorting discussions. Total discussions:', discussionsList.length);
    
    const sortedDiscussions = [...discussionsList].sort((a, b) => {
      // First, sort by pinned status (pinned posts first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // If both have same pinned status, sort by creation date (newest first)
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
    
    const pinnedCount = sortedDiscussions.filter(d => d.isPinned).length;
    console.log('📌 Pinned posts:', pinnedCount, 'Regular posts:', sortedDiscussions.length - pinnedCount);
    console.log('📌 First 3 posts order:', sortedDiscussions.slice(0, 3).map(d => ({ title: d.title.substring(0, 30), isPinned: d.isPinned })));
    
    return sortedDiscussions;
  }, [discussionsList]);

  const handleLike = useCallback(async (discussionId: string) => {
    // Prevent multiple clicks while processing
    if (likingPosts.has(discussionId)) return;
    
    // Find the current discussion to get the current state
    const currentDiscussion = discussionsList.find(d => d.id === discussionId);
    if (!currentDiscussion) return;
    
    // Optimistic update - update UI immediately
    const optimisticIsLiked = !currentDiscussion.isLiked;
    const optimisticLikes = optimisticIsLiked 
      ? currentDiscussion.likes + 1 
      : Math.max(0, currentDiscussion.likes - 1);
    
    setDiscussionsList(prev => prev.map(discussion => 
      discussion.id === discussionId
        ? { 
            ...discussion, 
            isLiked: optimisticIsLiked,
            likes: optimisticLikes
          }
        : discussion
    ));
    
    try {
      // Add to loading state (for preventing multiple clicks)
      setLikingPosts(prev => new Set(prev).add(discussionId));
      
      // Call the backend API to like/unlike the discussion
      const response = await apiService.likeDiscussion(discussionId);
      
      // Update with actual response from backend (in case of any discrepancies)
      setDiscussionsList(prev => prev.map(discussion => 
        discussion.id === discussionId
          ? { 
              ...discussion, 
              isLiked: response.data.isLiked,
              likes: response.data.likesCount
            }
          : discussion
      ));
      
      console.log('✅ Like status updated:', response.data);
    } catch (error) {
      console.error('❌ Error updating like status:', error);
      
      // Rollback optimistic update on error
      setDiscussionsList(prev => prev.map(discussion => 
        discussion.id === discussionId
          ? { 
              ...discussion, 
              isLiked: currentDiscussion.isLiked,
              likes: currentDiscussion.likes
            }
          : discussion
      ));
      
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Remove from loading state
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  }, [toast, likingPosts, discussionsList]);

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
    if (!isAdmin || pinningPosts.has(discussionId)) {
      return;
    }

    const discussion = discussionsList.find(d => d.id === discussionId);
    if (!discussion) {
      return;
    }

    // Optimistic update - update UI immediately
    const optimisticPinnedStatus = !discussion.isPinned;
    
    setDiscussionsList(prev => prev.map(d => 
      d.id === discussionId
        ? { ...d, isPinned: optimisticPinnedStatus }
        : d
    ));

    try {
      // Add to loading state
      setPinningPosts(prev => new Set(prev).add(discussionId));
      
      // Call the backend API
      const response = await apiService.pinDiscussion(discussionId);
      const actualPinnedStatus = response.data.isPinned;

      // Update with actual response from backend
      setDiscussionsList(prev => prev.map(d => 
        d.id === discussionId
          ? { ...d, isPinned: actualPinnedStatus }
          : d
      ));

      toast({
        title: actualPinnedStatus ? "Post Pinned" : "Post Unpinned",
        description: actualPinnedStatus 
          ? "This post will now appear at the top of the discussions" 
          : "This post will no longer be pinned",
      });

      console.log('✅ Pin status updated successfully');
    } catch (error) {
      console.error('❌ Exception updating pin status:', error);
      
      // Rollback optimistic update on error
      setDiscussionsList(prev => prev.map(d => 
        d.id === discussionId
          ? { ...d, isPinned: discussion.isPinned }
          : d
      ));
      
      toast({
        title: "Error",
        description: "There was an error updating the pin status",
        variant: "destructive"
      });
    } finally {
      // Remove from loading state
      setPinningPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  }, [isAdmin, discussionsList, toast, fetchDiscussions, pinningPosts]);

  const handleDeleteDiscussion = useCallback(async (discussionId: string) => {
    try {
      // Delete from database
      const response = await apiService.deleteDiscussion(discussionId);
      console.log('🗑️ Delete response:', response);

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

  const canPin = useCallback((discussion: DiscussionType) => {
    // Only admins can pin/unpin posts (any post, not just admin posts)
    return isAdmin;
  }, [isAdmin]);

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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-2 text-cyan-300">Loading discussions...</span>
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No discussions yet</h3>
                <p className="text-gray-400">Be the first to start a conversation!</p>
              </div>
            ) : (
              filteredDiscussions.map((discussion) => {
              const profileInfo = getProfileInfo(discussion.user_id, discussion.author);
              
              return (
                <Card key={discussion.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-all duration-300 ease-in-out">
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
                            {discussion.isAdmin && (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                Admin
                              </Badge>
                            )}
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
                                disabled={pinningPosts.has(discussion.id)}
                                className={`h-8 w-8 p-0 transition-all duration-200 ${
                                  discussion.isPinned 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-gray-400 hover:text-yellow-400'
                                } ${pinningPosts.has(discussion.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={discussion.isPinned ? 'Unpin post' : 'Pin post'}
                              >
                                <Pin className={`h-4 w-4 transition-transform duration-200 ${
                                  discussion.isPinned ? 'scale-110' : 'hover:scale-105'
                                }`} />
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
                            disabled={likingPosts.has(discussion.id)}
                            className={`flex items-center gap-2 hover:bg-red-500/10 transition-all duration-200 ${discussion.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} ${likingPosts.has(discussion.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`h-4 w-4 transition-transform duration-200 ${discussion.isLiked ? 'fill-current scale-110' : 'hover:scale-105'}`} />
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
            })
            )}
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
