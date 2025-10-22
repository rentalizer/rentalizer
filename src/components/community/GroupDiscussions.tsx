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
import { apiService, type Discussion, type Comment as ApiComment, type PopulatedUser } from '@/services/api';
import { getSocket, joinDiscussionRoom, leaveDiscussionRoom } from '@/services/socket';
import { NewsFeed } from '@/components/community/NewsFeed';
import { MembersList } from '@/components/MembersList';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommentsDialog } from '@/components/community/CommentsDialog';
import { AdminGroupAvatar } from '@/components/community/AdminGroupAvatar';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useProfile } from '@/hooks/useProfile';
import { formatDateWithTimezone, getTimezoneNotice } from '@/utils/timezone';
import { useNavigate } from 'react-router-dom';

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
  user_id: string | PopulatedUser; // Can be either string ID or populated user object
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
  liked_by?: string[];
  likedByCount?: number;
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
  const navigate = useNavigate();
  
  const [discussionsList, setDiscussionsList] = useState<DiscussionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [pinningPosts, setPinningPosts] = useState<Set<string>>(new Set());
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionType | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: {id: string; author: string; avatar: string; avatarUrl?: string | null; content: string; timeAgo: string;}[]}>({});
  const [loadedDiscussionIds, setLoadedDiscussionIds] = useState<Set<string>>(new Set());
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{ url: string; alt: string } | null>(null);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  const { onlineUsers, onlineCount, adminNames, loading: onlineLoading, useWebSocket } = useOnlineUsers();
  const [showMembersList, setShowMembersList] = useState(false);
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [onlineSearch, setOnlineSearch] = useState('');
  
  const filteredOnlineUsers = useMemo(() => {
    const lower = onlineSearch.trim().toLowerCase();
    const filtered = lower
      ? onlineUsers.filter(u => (u.display_name || '').toLowerCase().includes(lower))
      : onlineUsers;
    return [...filtered].sort((a, b) => {
      if (a.is_admin !== b.is_admin) return a.is_admin ? -1 : 1;
      return (a.display_name || '').localeCompare(b.display_name || '');
    });
  }, [onlineSearch, onlineUsers]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 7;

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

  // Helper to extract user ID from user_id field (can be string or PopulatedUser)
  const getUserId = useCallback((userId: string | PopulatedUser | undefined): string | undefined => {
    if (!userId) return undefined;
    if (typeof userId === 'string') return userId;
    return userId._id;
  }, []);

  const getUserAvatar = useCallback(() => {
    const fromProfile = profile?.avatar_url?.trim() ? profile.avatar_url : null;
    const fromUser = user?.profilePicture?.trim() ? user.profilePicture : null;
    return fromProfile || fromUser || null;
  }, [profile?.avatar_url, user?.profilePicture]);

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
            // Normalize profilePicture (convert empty strings to null)
            const normalizedProfilePicture = userObj.profilePicture && userObj.profilePicture.trim() !== '' 
              ? userObj.profilePicture 
              : null;
            
            profilesMap[userId] = {
              id: userId,
              email: userObj.email || '',
              firstName: userObj.firstName || '',
              lastName: userObj.lastName || '',
              profilePicture: normalizedProfilePicture,
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
    // Type guard for user object
    interface CommentUser {
      display_name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      profilePicture?: string;
      avatar_url?: string;
      _id?: string;
      id?: string;
    }
    
    const userObj: CommentUser = (c.user as CommentUser) || {};
    // Handle both old and new user field formats
    const authorName: string = userObj.display_name || 
      (userObj.firstName && userObj.lastName ? `${userObj.firstName} ${userObj.lastName}` : '') ||
      userObj.email?.split('@')[0] || 
      'User';
    // Try various possible avatar fields from backend
    const rawAvatar = userObj.profilePicture || userObj.avatar_url;
    // Normalize avatar URL (convert empty strings to null)
    const possibleAvatarUrl: string | null = (rawAvatar && rawAvatar.trim() !== '') ? rawAvatar : null;
    
    // Normalize id from various possible fields
    interface CommentWithId {
      id?: string;
      _id?: string | { toString?: () => string };
    }
    const commentWithId = c as unknown as CommentWithId;
    const normalizedId = commentWithId.id || 
      (typeof commentWithId._id === 'string' ? commentWithId._id : 
       (typeof commentWithId._id === 'object' && commentWithId._id?.toString ? commentWithId._id.toString() : undefined));
    
    const userId = typeof userObj === 'string' ? userObj : (userObj._id || userObj.id);
    return {
      id: normalizedId,
      author: authorName,
      avatar: getInitials(authorName),
      avatarUrl: possibleAvatarUrl,
      content: c.content,
      timeAgo: formatTimeAgo(c.createdAt),
      userId: userId,
      isEdited: c.isEdited || false,
      editedAt: c.editedAt
    };
  }, [getInitials, formatTimeAgo]);

  // Fetch discussions from backend API with pagination
  const fetchDiscussions = useCallback(async (page: number = 1, append: boolean = false) => {
    console.log(`🔄 Loading discussions page ${page} from backend...`);
    
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await apiService.getDiscussions({
        page: page,
        limit: POSTS_PER_PAGE
      });
      
      console.log('📥 Discussions loaded:', response.data.length, 'discussions');
      console.log('📄 Pagination:', response.pagination);
      
      // Transform backend data to match frontend expectations
      const transformedDiscussions = response.data.map(discussion => {
        const backendIsLiked = typeof discussion.isLiked === 'boolean' ? discussion.isLiked : undefined;
        const fallbackIsLiked = user
          ? (discussion.liked_by || []).some(id => {
              if (!id) return false;
              const candidate = typeof id === 'string' ? id : id.toString?.();
              return candidate === user.id;
            })
          : false;
        const isLiked = backendIsLiked !== undefined ? backendIsLiked : fallbackIsLiked;
        
        const transformed = {
          ...discussion,
          id: discussion._id,
          author: discussion.author_name,
          avatar: discussion.author_avatar || '',
          comments: discussion.comments_count,
          timeAgo: discussion.timeAgo,
          isPinned: discussion.is_pinned,
          isLiked,
          isAdmin: discussion.is_admin_post,
          created_at: discussion.createdAt
        };
        
        console.log('📊 Discussion', discussion._id, 'comment count from backend:', discussion.comments_count);
        return transformed;
      });
      
      if (append) {
        // Append to existing discussions
        setDiscussionsList(prev => [...prev, ...transformedDiscussions]);
      } else {
        // Replace discussions (first load or refresh)
        setDiscussionsList(transformedDiscussions);
        setCurrentPage(1);
      }
      
      // Update pagination state
      setHasMorePosts(response.pagination?.hasNextPage || false);
      
    } catch (error) {
      console.error('❌ Exception loading discussions:', error);
      console.log("Error: Failed to load discussions. Please try again.");
      if (!append) {
        setDiscussionsList([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, POSTS_PER_PAGE]);

  // Load more discussions
  const loadMoreDiscussions = useCallback(() => {
    if (!loadingMore && hasMorePosts) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchDiscussions(nextPage, true);
    }
  }, [currentPage, hasMorePosts, loadingMore, fetchDiscussions]);

  // Load comments when a discussion is selected
  useEffect(() => {
    if (!selectedDiscussion) return;

    const discussionId = selectedDiscussion.id;

    const load = async () => {
      try {
        // Always reload comments to ensure we have the latest data
        const res = await apiService.getCommentsForDiscussion(discussionId, { page: 1, limit: 100, sortOrder: 'asc' });
        console.log('📥 Raw comments from API:', res.data);
        const list = res.data.map(mapApiCommentToUi);
        console.log('📥 Mapped comments for discussion', discussionId, ':', list.length, 'comments');
        console.log('📥 First comment sample:', list[0]);
        setComments(prev => ({ ...prev, [discussionId]: list }));
        setLoadedDiscussionIds(prev => new Set(prev).add(discussionId));
      } catch (e) {
        console.error('Failed to load comments', e);
      }
    };

    load();

    // Join WS room and subscribe to events
    joinDiscussionRoom(discussionId);
    const socket = getSocket();

    // Check socket connection
    console.log('🔌 Socket connected:', socket.connected);
    console.log('🔌 Socket ID:', socket.id);

    const onNew = (payload: { comment: ApiComment; discussionId: string }) => {
      console.log('🆕 Received new_comment event:', payload);
      if (payload.discussionId !== discussionId) {
        console.log('🆕 Ignoring comment for different discussion:', payload.discussionId, 'vs', discussionId);
        return;
      }
      console.log('🆕 New comment from WebSocket:', payload.comment);
      const ui = mapApiCommentToUi(payload.comment);
      console.log('🆕 Mapped comment:', ui);
      let appended = false;
      setComments(prev => {
        const list = prev[discussionId] || [];
        if (list.some(c => c.id === ui.id)) {
          console.log('🆕 Comment already exists, skipping');
          return prev;
        }
        appended = true;
        console.log('🆕 Adding new comment to list');
        return { ...prev, [discussionId]: [...list, ui] };
      });
      if (appended) {
        console.log('🆕 Updating discussion comment count');
        setDiscussionsList(prev => prev.map(d => d.id === discussionId ? { ...d, comments: d.comments + 1 } : d));
      }
    };

    const onUpdated = (payload: { comment: ApiComment; discussionId: string }) => {
      console.log('✏️ Received comment_updated event:', payload);
      if (payload.discussionId !== discussionId) return;
      const ui = mapApiCommentToUi(payload.comment);
      setComments(prev => ({
        ...prev,
        [discussionId]: (prev[discussionId] || []).map(c => c.id === ui.id ? ui : c)
      }));
    };

    const onDeleted = (payload: { commentId: string; discussionId: string }) => {
      console.log('🗑️ Received comment_deleted event:', payload);
      if (payload.discussionId !== discussionId) return;
      setComments(prev => ({
        ...prev,
        [discussionId]: (prev[discussionId] || []).filter(c => c.id !== payload.commentId)
      }));
      setDiscussionsList(prev => prev.map(d => d.id === discussionId ? { ...d, comments: Math.max(0, d.comments - 1) } : d));
    };

    // Add error handler
    const onError = (error: unknown) => {
      console.error('🔌 WebSocket error:', error);
    };

    // Add connection handler
    const onConnect = () => {
      console.log('🔌 WebSocket connected');
    };

    const onDisconnect = () => {
      console.log('🔌 WebSocket disconnected');
    };

    socket.on('new_comment', onNew);
    socket.on('comment_updated', onUpdated);
    socket.on('comment_deleted', onDeleted);
    socket.on('error', onError);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('new_comment', onNew);
      socket.off('comment_updated', onUpdated);
      socket.off('comment_deleted', onDeleted);
      socket.off('error', onError);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      leaveDiscussionRoom(discussionId);
    };
  }, [selectedDiscussion, mapApiCommentToUi]);


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
  const getProfileInfo = useCallback((userId: string | PopulatedUser | undefined, authorName: string, discussionAvatar?: string) => {
    // Helper to normalize avatar URLs (convert empty strings to null)
    const normalizeAvatarUrl = (url: string | null | undefined): string | null => {
      if (!url || url.trim() === '') return null;
      return url;
    };
    
    // For posts without a user_id, use the author name and generate initials
    if (!userId) {
      return {
        avatar_url: normalizeAvatarUrl(discussionAvatar),
        display_name: authorName,
        initials: getInitials(authorName)
      };
    }

    // For the current user's posts, use their current profile from the auth context and backend
    // Handle both populated user object and string user_id
    const discussionUserId = getUserId(userId);
    
    if (user && user.id === discussionUserId) {
      // Use backend profile data if available, fallback to auth context user data
      // Prioritize discussionAvatar if available and not empty
      const normalizedDiscussionAvatar = normalizeAvatarUrl(discussionAvatar);
      const normalizedSupabaseAvatar = normalizeAvatarUrl(supabaseProfile?.avatar_url);
      const normalizedUserPicture = normalizeAvatarUrl(user.profilePicture);
      
      const profilePicture = normalizedDiscussionAvatar || normalizedSupabaseAvatar || normalizedUserPicture;
      const currentDisplayName = supabaseProfile?.display_name || profile?.display_name || user.email?.split('@')[0] || authorName;
      const finalDisplayName = isAdmin ? `${currentDisplayName} (Admin)` : currentDisplayName;
      
      
      return {
        avatar_url: profilePicture,
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
      hasProfilePicture: userProfile?.profilePicture,
      discussionAvatar: discussionAvatar ? 'present' : 'missing'
    });
    
    if (userProfile || discussionAvatar) {
      const displayName = userProfile?.firstName && userProfile?.lastName 
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile?.email?.split('@')[0] || authorName;
      
      // Prioritize discussionAvatar (author_avatar from backend) over userProfile.profilePicture
      const normalizedDiscussionAvatar = normalizeAvatarUrl(discussionAvatar);
      const normalizedUserProfilePicture = normalizeAvatarUrl(userProfile?.profilePicture);
      const avatar = normalizedDiscussionAvatar || normalizedUserProfilePicture;
      
      return {
        avatar_url: avatar,
        display_name: displayName,
        initials: getInitials(displayName)
      };
    }
    
    // Fallback to author name and initials
    return {
      avatar_url: normalizeAvatarUrl(discussionAvatar),
      display_name: authorName,
      initials: getInitials(authorName)
    };
  }, [user, profile, supabaseProfile, isAdmin, userProfiles, getInitials, getUserId]);

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
      const response = await apiService.createComment(discussionId, content);
      console.log('✅ Comment created successfully:', response);
      setNewComment('');
      
      // Fallback: If WebSocket doesn't work, manually refresh comments after a short delay
      setTimeout(async () => {
        try {
          const res = await apiService.getCommentsForDiscussion(discussionId, { page: 1, limit: 100, sortOrder: 'asc' });
          const list = res.data.map(mapApiCommentToUi);
          setComments(prev => ({ ...prev, [discussionId]: list }));
          
          // Update comment count
          setDiscussionsList(prev => prev.map(d => d.id === discussionId ? { ...d, comments: list.length } : d));
          console.log('🔄 Fallback: Refreshed comments manually');
        } catch (e) {
          console.error('Failed to refresh comments as fallback', e);
        }
      }, 1000);
    } catch (e) {
      console.error('Failed to create comment', e);
    }
  }, [newComment, selectedDiscussion, mapApiCommentToUi]);

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

  const canEdit = useCallback((discussion: DiscussionType | Discussion) => {
    // Handle both populated user object and string user_id
    const discussionUserId = getUserId(discussion.user_id);
    
    // Only the post author can edit their own post (even admins cannot edit other users' posts)
    if (user && discussionUserId === user.id) return true;
    return false;
  }, [user, getUserId]);

  const canDelete = useCallback((discussion: DiscussionType | Discussion) => {
    // Only admins can delete posts
    return isAdmin;
  }, [isAdmin]);

  const handleStartEdit = useCallback((discussion: DiscussionType) => {
    // Double-check permissions before starting edit
    if (!canEdit(discussion)) {
      console.log("Access Denied: You can only edit your own posts");
      return;
    }
    
    setEditingPost(discussion.id);
    setEditTitle(discussion.title);
    setEditContent(discussion.content);
  }, [canEdit]);

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

  const hasImagesInContent = useCallback((content: string) => {
    const imagePattern = /!\[[^\]]*\]\([^\)]+\)/;
    return imagePattern.test(content);
  }, []);

  // Render markdown content with images
  const renderContent = useCallback((content: string) => {
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = Array.from(content.matchAll(imagePattern));

    if (matches.length === 0) {
      return content;
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      const index = match.index ?? 0;
      if (index > lastIndex) {
        parts.push(content.substring(lastIndex, index));
      }
      lastIndex = index + match[0].length;
    });

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    let gridClasses = 'mt-3 grid gap-2';
    if (matches.length === 1) {
      gridClasses += ' grid-cols-1 max-w-md mx-auto';
    } else if (matches.length === 2) {
      gridClasses += ' grid-cols-2 max-w-full sm:max-w-3xl sm:mx-auto';
    } else {
      gridClasses += ' grid-cols-2 sm:grid-cols-3 max-w-full sm:max-w-4xl sm:mx-auto';
    }

    const isMultiImage = matches.length > 1;
    const imageElements = matches.map((match, idx) => {
      const alt = match[1];
      const url = match[2];

      return (
        <button
          key={`img-${idx}`}
          type="button"
          className="w-full focus:outline-none overflow-hidden rounded-lg border border-slate-600"
          onClick={() => setImagePreview({ url, alt })}
        >
          <img
            src={url}
            alt={alt}
            className={isMultiImage
              ? 'w-full h-48 sm:h-56 md:h-60 rounded-lg object-cover transition-transform duration-200 hover:scale-[1.02]'
              : 'w-full h-64 sm:h-72 md:h-80 rounded-lg object-cover transition-transform duration-200 hover:scale-[1.02]'}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </button>
      );
    });

    parts.push(
      <div key="image-grid" className={gridClasses}>
        {imageElements}
      </div>
    );

    return parts;
  }, []);

  // Handle post creation callback - refresh discussions list
  const handlePostCreated = useCallback(() => {
    console.log('🔄 New post created - refreshing discussions list');
    setCurrentPage(1);
    setHasMorePosts(true);
    fetchDiscussions(1, false);
  }, [fetchDiscussions]);

  // Handle admin clicking on user name to message them
  const handleMessageUser = useCallback((discussion: DiscussionType) => {
    if (!isAdmin) return;
    
    const discussionUserId = getUserId(discussion.user_id);
    if (!discussionUserId) {
      console.log("Error: Cannot message user - user ID not found");
      return;
    }
    
    // Don't allow messaging yourself
    if (user && discussionUserId === user.id) {
      console.log("Info: Cannot message yourself");
      return;
    }
    
    console.log('📨 Admin messaging user:', discussionUserId, 'from discussion:', discussion.id);
    
    // Use URL parameters and reload the page to ensure state is preserved
    const params = new URLSearchParams({
      messageUserId: discussionUserId,
      messageUserName: discussion.author,
      fromDiscussion: discussion.id
    });
    
    // Navigate with URL parameters and reload (parameters before hash)
    window.location.href = `/community?${params.toString()}#admin-support`;
  }, [isAdmin, getUserId, user]);

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
    <div className="flex flex-col gap-6 lg:flex-row">
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
              const profileInfo = getProfileInfo(discussion.user_id, discussion.author, discussion.avatar);
              
              return (
                <Card key={discussion.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-all duration-300 ease-in-out">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* User Avatar */}
                      <div className="flex flex-col items-center">
                        {discussion.isAdmin ? (
                          <AdminGroupAvatar size="xl" className="shrink-0" />
                        ) : (
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
                        )}
                        {/* Show upload hint for current user's posts without profile picture */}
                        {user && user.id === getUserId(discussion.user_id) && !profileInfo.avatar_url && !discussion.isAdmin && (
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
                        <div className="mb-3 flex flex-col gap-3 sm:mb-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {discussion.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                              {isAdmin && getUserId(discussion.user_id) !== user?.id ? (
                                <button
                                  onClick={() => handleMessageUser(discussion)}
                                  className="text-cyan-300 font-medium hover:text-cyan-200 hover:underline transition-colors cursor-pointer"
                                  title={`Message ${profileInfo.display_name}`}
                                >
                                  {profileInfo.display_name}
                                </button>
                              ) : (
                                <span className="text-cyan-300 font-medium">{profileInfo.display_name}</span>
                              )}
                              {discussion.isAdmin && (
                                <Badge className="hidden sm:inline-flex bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                  Admin
                                </Badge>
                              )}
                              {discussion.isPinned && (
                                <Badge className="hidden sm:inline-flex bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                                  Pinned
                                </Badge>
                              )}
                            </div>

                            {(discussion.isAdmin || discussion.isPinned || canPin(discussion) || canEdit(discussion) || canDelete(discussion)) && (
                              <div className="flex flex-wrap items-center gap-2 sm:hidden">
                                {discussion.isAdmin && (
                                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                    Admin
                                  </Badge>
                                )}
                                {discussion.isPinned && (
                                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                                    Pinned
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1">
                                  {canPin(discussion) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handlePinToggle(discussion.id)}
                                      disabled={pinningPosts.has(discussion.id)}
                                      className={`h-7 w-7 p-0 text-gray-400 transition-all duration-200 ${
                                        discussion.isPinned 
                                          ? 'text-yellow-400 hover:text-yellow-300' 
                                          : 'hover:text-yellow-400'
                                      } ${pinningPosts.has(discussion.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      title={discussion.isPinned ? 'Unpin post' : 'Pin post'}
                                    >
                                      <Pin className={`h-3.5 w-3.5`} />
                                    </Button>
                                  )}
                                  {(canEdit(discussion) || canDelete(discussion)) && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white">
                                          <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="start" sideOffset={4} className="bg-slate-800 border-gray-700">
                                        {canEdit(discussion) && (
                                          <DropdownMenuItem 
                                            onClick={() => handleStartEdit(discussion)}
                                            className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                        )}
                                        {canDelete(discussion) && (
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
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:text-sm">
                              <span title={formatDateWithTimezone(discussion.created_at)}>{discussion.timeAgo}</span>
                              {discussion.category && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="hidden sm:inline">{discussion.category}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Pin Icon and Options Menu */}
                          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
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
                            {(canEdit(discussion) || canDelete(discussion)) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-800 border-gray-700">
                                  {canEdit(discussion) && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStartEdit(discussion)}
                                      className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {canDelete(discussion) && (
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
                                  )}
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

                            {(() => {
                              const contentHasImages = hasImagesInContent(discussion.content);
                              const isExpanded = expandedPost === discussion.id;
                              const shouldTruncate = !contentHasImages && discussion.content.length > 150;
                              const displayContent = shouldTruncate && !isExpanded
                                ? getTruncatedContent(discussion.content)
                                : discussion.content;

                              return (
                                <div 
                                  className={`mb-4 leading-relaxed whitespace-pre-wrap transition-colors ${
                                    isDayMode ? 'text-slate-600 hover:text-slate-700' : 'text-gray-300 hover:text-gray-200'
                                  }`}
                                >
                                  {renderContent(displayContent)}
                                  {shouldTruncate && (
                                    <button
                                      onClick={() => setExpandedPost(isExpanded ? null : discussion.id)}
                                      className="text-cyan-400 ml-2 font-medium hover:text-cyan-300"
                                    >
                                      {isExpanded ? 'Show less' : 'Show more'}
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </>
                        )}

                        {/* Action Buttons - Only show when not editing */}
                        {editingPost !== discussion.id && (
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
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
            
            {/* Show More Button */}
            {!loading && hasMorePosts && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={loadMoreDiscussions}
                  disabled={loadingMore}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    `Show More`
                  )}
                </Button>
              </div>
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
               {/* Total Members hidden per optimization/customer request
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
               */}
               <div
                 className="flex justify-between items-center cursor-pointer hover:text-cyan-300"
                 onClick={() => setShowOnlineModal(true)}
                 role="button"
                 tabIndex={0}
               >
                 {isAdmin ? (
                   <div className="flex flex-col">
                     <span className="text-gray-400">Online Now</span>
                     {adminNames.length > 0 && useWebSocket && (
                       <span className="text-xs text-green-300">
                         Admins: {adminNames.join(', ')}
                       </span>
                     )}
                     {!useWebSocket && (
                       <span className="text-xs text-yellow-400">
                         Connecting...
                       </span>
                     )}
                   </div>
                 ) : (
                   <span className="text-gray-400">Online Now</span>
                 )}
                 <Badge className={`${useWebSocket ? 'bg-green-600/20 text-green-300 border-green-500/30' : 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30'}`}>
                   {onlineLoading ? '...' : (useWebSocket ? onlineCount : '?')}
                 </Badge>
               </div>
             </CardContent>
           </Card>

          <div className="max-h-[800px] overflow-y-auto">
            <NewsFeed isDayMode={isDayMode} />
          </div>

          {/* <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                30-Day Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
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
          </Card> */}

        </div>
      </div>

      <Dialog
        open={!!imagePreview}
        onOpenChange={(open) => {
          if (!open) {
            setImagePreview(null);
          }
        }}
      >
        <DialogContent className="bg-slate-900/80 backdrop-blur-md border border-slate-700 max-w-4xl w-full p-4">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              {imagePreview?.alt || 'Image preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-auto flex justify-center">
            {imagePreview && (
              <img
                src={imagePreview.url}
                alt={imagePreview.alt || 'Full size image'}
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <MembersList
        open={showMembersList}
        onOpenChange={setShowMembersList}
        onMessageMember={(memberId, memberName) => {
          console.log("Message Member: Starting conversation with", memberName);
        }}
      />

      <Dialog open={showOnlineModal} onOpenChange={setShowOnlineModal}>
        <DialogContent className="bg-slate-900 border-gray-700 max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-white">Currently Online</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={onlineSearch}
              onChange={(e) => setOnlineSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-slate-800/80 border-gray-700 text-white placeholder-gray-400"
            />
            {/* List online users with admins on top */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/60">
              {filteredOnlineUsers.length === 0 ? (
                <div className="text-center text-gray-400 py-6">No users online.</div>
              ) : (
                filteredOnlineUsers.map(u => (
                  <div key={u.user_id} className="flex items-center gap-3 p-3">
                    <Avatar className="w-8 h-8">
                      {u.avatar_url ? (
                        <AvatarImage src={u.avatar_url} alt={u.display_name} className="object-cover w-full h-full" />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                        {(u.display_name || 'U').slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm truncate">{u.display_name}</span>
                        {u.is_admin && (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">Admin</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">Last seen: {new Date(u.last_seen).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
