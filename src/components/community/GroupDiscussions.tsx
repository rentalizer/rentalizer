import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Extend Window interface for Calendly
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly: any;
  }
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageCircle, Heart, Pin, TrendingUp, Calendar, Edit, Trash2, Send, MoreHorizontal, BarChart3, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSetup } from '@/components/ProfileSetup';
import { useAdminRole } from '@/hooks/useAdminRole';
import { apiService, type Discussion, type Comment as ApiComment } from '@/services/api';
import { getSocket, joinDiscussionRoom, leaveDiscussionRoom } from '@/services/socket';
import { NewsFeed } from '@/components/community/NewsFeed';
import { MembersList } from '@/components/MembersList';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommentsDialog } from '@/components/community/CommentsDialog';
import { useMemberCount } from '@/hooks/useMemberCount';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useProfile } from '@/hooks/useProfile';

// Type for user objects that could be populated or just strings
interface PopulatedUser {
  _id?: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  bio?: string;
  role?: string;
}

// Frontend Discussion interface (transformed from backend)
export interface DiscussionType {
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
  attachments: { type: "video" | "image" | "document"; url: string; filename: string; size: number; }[];
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
  const { profile: supabaseProfile } = useProfile();
  const { isAdmin } = useAdminRole();
  
  const [discussionsList, setDiscussionsList] = useState<DiscussionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [pinningPosts, setPinningPosts] = useState<Set<string>>(new Set());
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionType | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: {id: string; author: string; avatar: string; content: string; timeAgo: string;}[]}>({});
  const [loadedDiscussionIds, setLoadedDiscussionIds] = useState<Set<string>>(new Set());
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
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

  // Fetch user profiles from discussions data
  const fetchUserProfiles = useCallback(async () => {
    try {
      const profilesMap: {[key: string]: UserProfile} = {};
      
      // Add current user's profile from auth context
      if (user) {
        profilesMap[user.id] = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          bio: user.bio,
          role: user.role
        };
      }
      
      // Extract user profiles from discussions data
      discussionsList.forEach(discussion => {
        if (discussion.user_id && typeof discussion.user_id === 'object') {
          const userObj = discussion.user_id as PopulatedUser;
          const userId = userObj._id || userObj.id;
          if (userId && !profilesMap[userId]) {
            profilesMap[userId] = {
              id: userId,
              email: userObj.email || '',
              firstName: userObj.firstName || '',
              lastName: userObj.lastName || '',
              profilePicture: userObj.profilePicture || null,
              bio: userObj.bio || '',
              role: userObj.role || 'user'
            };
          }
        }
      });
      
      setUserProfiles(profilesMap);
      console.log('✅ User profiles loaded:', {
        totalProfiles: Object.keys(profilesMap).length,
        currentUserId: user?.id,
        profilesWithPictures: Object.values(profilesMap).filter(p => p.profilePicture).length
      });
    } catch (error) {
      console.error('Exception fetching user profiles:', error);
    }
  }, [user, discussionsList]);

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

  // Time ago helper must be defined before being referenced
  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  // Map backend comment to UI comment
  const mapApiCommentToUi = useCallback((c: ApiComment) => {
    const userObj: any = c.user || {};
    // Handle both old and new user field formats
    const authorName: string = userObj.display_name || 
      (userObj.firstName && userObj.lastName ? `${userObj.firstName} ${userObj.lastName}` : '') ||
      userObj.email?.split('@')[0] || 
      'User';
    // Normalize id from various possible fields
    const normalizedId = (c as any).id || (c as any)._id || (typeof (c as any)._id === 'object' && (c as any)._id?.toString ? (c as any)._id.toString() : undefined);
    const userId = typeof userObj === 'string' ? userObj : (userObj._id || userObj.id);
    return {
      id: normalizedId,
      author: authorName,
      avatar: getInitials(authorName),
      content: c.content,
      timeAgo: formatTimeAgo(c.createdAt),
      userId: userId,
      isEdited: c.isEdited || false,
      editedAt: c.editedAt
    };
  }, [getInitials, formatTimeAgo]);

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
        
        const transformed = {
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
        
        console.log('📊 Discussion', discussion._id, 'comment count from backend:', discussion.comments_count);
        return transformed;
      });
      
      setDiscussionsList(transformedDiscussions);
    } catch (error) {
      console.error('❌ Exception loading discussions:', error);
      console.log("Error: Failed to load discussions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load comments when a discussion is selected
  useEffect(() => {
    if (!selectedDiscussion) return;

    const discussionId = selectedDiscussion.id;

    const load = async () => {
      try {
        // Avoid reloading if already loaded in this session
        if (!loadedDiscussionIds.has(discussionId)) {
          const res = await apiService.getCommentsForDiscussion(discussionId, { page: 1, limit: 100, sortOrder: 'asc' });
          console.log('📥 Raw comments from API:', res.data);
          const list = res.data.map(mapApiCommentToUi);
          console.log('📥 Mapped comments for discussion', discussionId, ':', list.length, 'comments');
          console.log('📥 First comment sample:', list[0]);
          setComments(prev => ({ ...prev, [discussionId]: list }));
          setLoadedDiscussionIds(prev => new Set(prev).add(discussionId));
        }
      } catch (e) {
        console.error('Failed to load comments', e);
      }
    };

    load();

    // Join WS room and subscribe to events
    joinDiscussionRoom(discussionId);
    const socket = getSocket();

    const onNew = (payload: { comment: ApiComment; discussionId: string }) => {
      if (payload.discussionId !== discussionId) return;
      console.log('🆕 New comment from WebSocket:', payload.comment);
      const ui = mapApiCommentToUi(payload.comment);
      console.log('🆕 Mapped comment:', ui);
      let appended = false;
      setComments(prev => {
        const list = prev[discussionId] || [];
        if (list.some(c => c.id === ui.id)) return prev;
        appended = true;
        return { ...prev, [discussionId]: [...list, ui] };
      });
      if (appended) {
        setDiscussionsList(prev => prev.map(d => d.id === discussionId ? { ...d, comments: d.comments + 1 } : d));
      }
    };

    const onUpdated = (payload: { comment: ApiComment; discussionId: string }) => {
      if (payload.discussionId !== discussionId) return;
      const ui = mapApiCommentToUi(payload.comment);
      setComments(prev => ({
        ...prev,
        [discussionId]: (prev[discussionId] || []).map(c => c.id === ui.id ? ui : c)
      }));
    };

    const onDeleted = (payload: { commentId: string; discussionId: string }) => {
      if (payload.discussionId !== discussionId) return;
      setComments(prev => ({
        ...prev,
        [discussionId]: (prev[discussionId] || []).filter(c => c.id !== payload.commentId)
      }));
      setDiscussionsList(prev => prev.map(d => d.id === discussionId ? { ...d, comments: Math.max(0, d.comments - 1) } : d));
    };

    socket.on('new_comment', onNew);
    socket.on('comment_updated', onUpdated);
    socket.on('comment_deleted', onDeleted);

    return () => {
      socket.off('new_comment', onNew);
      socket.off('comment_updated', onUpdated);
      socket.off('comment_deleted', onDeleted);
      leaveDiscussionRoom(discussionId);
    };
  }, [selectedDiscussion, mapApiCommentToUi, loadedDiscussionIds]);


  // Initialize data - fetch when user data is available
  useEffect(() => {
    if (user) {
      fetchDiscussions();
    }
  }, [user, fetchDiscussions]); // Depend on user to ensure profile data is loaded

  // Fetch user profiles after discussions are loaded
  useEffect(() => {
    if (user && discussionsList.length > 0) {
      fetchUserProfiles();
    }
  }, [user, discussionsList, fetchUserProfiles]);

  // Fixed profile info function - this was the source of the bug
  const getProfileInfo = useCallback((userId: string | undefined, authorName: string) => {
    
    // For posts without a user_id, use the author name and generate initials
    if (!userId) {
      return {
        avatar_url: null,
        display_name: authorName,
        initials: getInitials(authorName)
      };
    }

    // For the current user's posts, use their current profile from the auth context and backend
    // Handle both populated user object and string user_id
    const discussionUserId = userId && typeof userId === 'object' 
      ? (userId as PopulatedUser)._id || (userId as PopulatedUser).id
      : userId;
    
    if (user && user.id === discussionUserId) {
      // Use backend profile data if available, fallback to auth context user data
      const profilePicture = supabaseProfile?.avatar_url || user.profilePicture;
      const currentDisplayName = supabaseProfile?.display_name || profile?.display_name || user.email?.split('@')[0] || authorName;
      const finalDisplayName = isAdmin ? `${currentDisplayName} (Admin)` : currentDisplayName;
      
      
      return {
        avatar_url: profilePicture || null,
        display_name: finalDisplayName,
        initials: getInitials(currentDisplayName)
      };
    }

    // For other users, get their profile from the profiles map
    const userProfile = userProfiles[discussionUserId];
    console.log('🔍 Looking up user profile:', {
      discussionUserId,
      userProfile,
      userProfilesKeys: Object.keys(userProfiles),
      hasProfilePicture: userProfile?.profilePicture
    });
    
    if (userProfile) {
      const displayName = userProfile.firstName && userProfile.lastName 
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile.email?.split('@')[0] || authorName;
      
      
      return {
        avatar_url: userProfile.profilePicture || null,
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
  }, [user, profile, supabaseProfile, isAdmin, userProfiles, getInitials]);

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
      
      console.log("Error: Failed to update like status. Please try again.");
    } finally {
      // Remove from loading state
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  }, [likingPosts, discussionsList]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || !selectedDiscussion) return;
    const discussionId = selectedDiscussion.id;
    const content = newComment.trim();
    try {
      await apiService.createComment(discussionId, content);
      // Do not mutate local comments or counts here; rely on 'new_comment' WS event
      setNewComment('');
    } catch (e) {
      console.error('Failed to create comment', e);
    }
  }, [newComment, selectedDiscussion]);

  // Handle comment update
  const handleCommentUpdate = useCallback((commentId: string, content: string) => {
    if (!selectedDiscussion) return;
    const discussionId = selectedDiscussion.id;
    
    setComments(prev => ({
      ...prev,
      [discussionId]: (prev[discussionId] || []).map(comment => 
        comment.id === commentId 
          ? { ...comment, content, isEdited: true }
          : comment
      )
    }));
  }, [selectedDiscussion]);

  // Handle comment delete
  const handleCommentDelete = useCallback((commentId: string) => {
    if (!selectedDiscussion) return;
    const discussionId = selectedDiscussion.id;
    
    setComments(prev => ({
      ...prev,
      [discussionId]: (prev[discussionId] || []).filter(comment => comment.id !== commentId)
    }));
    
    // Update discussion comment count
    setDiscussionsList(prev => prev.map(d => 
      d.id === discussionId 
        ? { ...d, comments: Math.max(0, d.comments - 1) }
        : d
    ));
  }, [selectedDiscussion]);

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

      console.log(actualPinnedStatus ? "Post Pinned: This post will now appear at the top of the discussions" : "Post Unpinned: This post will no longer be pinned");

      console.log('✅ Pin status updated successfully');
    } catch (error) {
      console.error('❌ Exception updating pin status:', error);
      
      // Rollback optimistic update on error
      setDiscussionsList(prev => prev.map(d => 
        d.id === discussionId
          ? { ...d, isPinned: discussion.isPinned }
          : d
      ));
      
      console.log("Error: There was an error updating the pin status");
    } finally {
      // Remove from loading state
      setPinningPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  }, [isAdmin, discussionsList, pinningPosts]);

  const canEditOrDelete = useCallback((discussion: Discussion) => {
    // Handle both populated user object and string user_id
    const discussionUserId = discussion.user_id && typeof discussion.user_id === 'object' 
      ? (discussion.user_id as PopulatedUser)._id || (discussion.user_id as PopulatedUser).id
      : discussion.user_id;
    
    
    // Admins can edit/delete any post
    if (isAdmin) return true;
    // Users can only edit/delete their own posts
    if (user && discussionUserId === user.id) return true;
    return false;
  }, [isAdmin, user]);

  const handleStartEdit = useCallback((discussion: DiscussionType) => {
    // Double-check permissions before starting edit
    if (!canEditOrDelete(discussion)) {
      console.log("Access Denied: You can only edit your own posts");
      return;
    }
    
    setEditingPost(discussion.id);
    setEditTitle(discussion.title);
    setEditContent(discussion.content);
  }, [canEditOrDelete]);

  const handleCancelEdit = useCallback(() => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setSavingEdit(false);
  }, []);

  const handleSaveEdit = useCallback(async (discussionId: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      console.log("Error: Title and content are required");
      return;
    }

    setSavingEdit(true);
    
    try {
      // Call the backend API to update the discussion
      const response = await apiService.updateDiscussion(discussionId, {
        title: editTitle.trim(),
        content: editContent.trim()
      });

      // Update local state with the response
      setDiscussionsList(prev => prev.map(discussion => 
        discussion.id === discussionId
          ? { 
              ...discussion, 
              title: response.data.title,
              content: response.data.content
            }
          : discussion
      ));

      // Clear edit state
      handleCancelEdit();

      console.log("Post Updated: Your post has been successfully updated");

      console.log('✅ Post updated successfully:', response.data);
    } catch (error) {
      console.error('❌ Error updating post:', error);
      console.log("Error: Failed to update post. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  }, [editTitle, editContent, handleCancelEdit]);

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

      console.log("Discussion Deleted: Discussion has been permanently removed.");

    } catch (error) {
      console.error('❌ Exception during deletion:', error);
      console.log("Error: There was an error deleting the discussion.");
    }
  }, []);

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

  // Don't render until user data is available
  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-2 text-cyan-300">Loading user data...</span>
      </div>
    );
  }

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
                      <div className="flex flex-col items-center">
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
                        {/* Show upload hint for current user's posts without profile picture */}
                        {user && user.id === discussion.user_id && !profileInfo.avatar_url && (
                          <div className="mt-1">
                            <a 
                              href="/profile-setup" 
                              className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                              title="Upload a profile picture"
                            >
                              📷
                            </a>
                          </div>
                        )}
                      </div>

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
                                    onClick={() => handleStartEdit(discussion)}
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

                        {/* Title and Content - Edit Mode or View Mode */}
                        {editingPost === discussion.id ? (
                          <div className="space-y-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-cyan-400">
                              <Edit className="h-4 w-4" />
                              <span>Editing post...</span>
                            </div>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Post title..."
                              className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400"
                              disabled={savingEdit}
                            />
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="What's on your mind?"
                              className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px] resize-none"
                              disabled={savingEdit}
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleSaveEdit(discussion.id)}
                                disabled={savingEdit || !editTitle.trim() || !editContent.trim()}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {savingEdit ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Save
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                disabled={savingEdit}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-slate-700"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}

                        {/* Action Buttons - Only show when not editing */}
                        {editingPost !== discussion.id && (
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
                          
                          <CommentsDialog
                            discussion={discussion}
                            comments={comments[discussion.id] || []}
                            newComment={newComment}
                            onCommentChange={setNewComment}
                            onAddComment={handleAddComment}
                            onDiscussionSelect={setSelectedDiscussion}
                            getUserAvatar={getUserAvatar}
                            getUserInitials={getUserInitials}
                            onCommentUpdate={handleCommentUpdate}
                            onCommentDelete={handleCommentDelete}
                          />
                        </div>
                        )}
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
          console.log("Message Member: Starting conversation with", memberName);
        }}
      />
    </div>
  );
};
