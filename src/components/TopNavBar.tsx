
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3, User, LogOut, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

const READ_DISCUSSION_STORAGE_KEY = 'rentalizerAdminDiscussionReadIds';

export const TopNavBar = () => {
  const { user, signOut, isLoading } = useAuth();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: recentPostsData, isLoading: notificationsLoading, isError: notificationsError } = useQuery({
    queryKey: ['admin-recent-discussions'],
    queryFn: () => apiService.getDiscussions({
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    enabled: Boolean(user && isAdmin),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const recentPosts = recentPostsData?.data?.slice(0, 5) ?? [];
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(READ_DISCUSSION_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setReadNotificationIds(parsed.filter((id): id is string => typeof id === 'string'));
      }
    } catch (error) {
      console.error('Failed to parse stored notification ids', error);
    }
  }, []);

  const readIdsSet = useMemo(() => new Set(readNotificationIds), [readNotificationIds]);

  const getNotificationId = useCallback((post: any) => {
    const id = post?._id || post?.id;
    if (id) {
      const normalizedId = typeof id === 'string' ? id : String(id);
      if (normalizedId.trim() !== '') {
        return normalizedId;
      }
    }

    const createdAt = post?.created_at || post?.createdAt;
    const title = post?.title;
    if (createdAt || title) {
      return `${createdAt ?? 'unknown'}-${title ?? 'untitled'}`;
    }

    return undefined;
  }, []);

  const unreadCount = useMemo(() => {
    if (!recentPosts.length) return 0;
    return recentPosts.reduce((count, post) => {
      const notificationId = getNotificationId(post);
      if (!notificationId) return count;
      return readIdsSet.has(notificationId) ? count : count + 1;
    }, 0);
  }, [recentPosts, readIdsSet, getNotificationId]);

  const markNotificationRead = useCallback((post: any) => {
    const notificationId = getNotificationId(post);
    if (!notificationId) return;

    setReadNotificationIds(prev => {
      if (prev.includes(notificationId)) {
        return prev;
      }

      const updated = [...prev, notificationId];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(READ_DISCUSSION_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, [getNotificationId]);

  const handleClearAllNotifications = useCallback(() => {
    setReadNotificationIds(prev => {
      const merged = new Set(prev);
      recentPosts.forEach(post => {
        const id = getNotificationId(post);
        if (id) {
          merged.add(id);
        }
      });
      const updated = Array.from(merged);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(READ_DISCUSSION_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, [getNotificationId, recentPosts]);

  const handleNotificationsOpenChange = useCallback(
    (open: boolean) => {
      setNotificationsOpen(open);
    },
    []
  );

  const handleNotificationClick = useCallback((post: any) => {
    markNotificationRead(post);
    setNotificationsOpen(false);

    const discussionId = post?._id ?? post?.id ?? null;
    const highlightState = discussionId
      ? { highlightDiscussionId: String(discussionId), highlightToken: Date.now() }
      : undefined;

    if (location.pathname === '/community') {
      if (highlightState && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('rentalizer-highlight-discussion', { detail: highlightState })
        );
      } else {
        navigate({ pathname: '/community', hash: '#discussions' }, { replace: false });
      }
      return;
    }

    navigate(
      { pathname: '/community', hash: '#discussions' },
      { state: highlightState }
    );
  }, [location.pathname, markNotificationRead, navigate, setNotificationsOpen]);

  const handleSignOut = async () => {
    try {
      console.log('🔄 TopNavBar: Starting logout process...');
      await signOut();
      console.log('✅ TopNavBar: Logout completed');
    } catch (error) {
      console.error('❌ TopNavBar: Error signing out:', error);
    }
  };

  // const navigationItems: any[] = [
  //   { name: 'Programs', path: '/sales' }
  // ];

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-slate-700/95 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <BarChart3 className="h-8 w-8 text-cyan-400" style={{
                filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 36px rgba(6, 182, 212, 0.5))'
              }} />
            </Link>
          </div>

          {/* Center - Navigation (only show for logged-in users) */}
          {/* {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = isActiveTab(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400'
                    }`}
                  >
                    {item.name}
                    {item.hasNotification && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0 min-w-[16px] h-4 rounded-full">
                        1
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          )} */}

          {/* Right side - Menu and User */}
          <div className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <DropdownMenu open={notificationsOpen} onOpenChange={handleNotificationsOpenChange}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 shrink-0 rounded-full border border-cyan-500/30 bg-slate-800/60 text-cyan-300 hover:bg-slate-700/70 hover:text-cyan-200"
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-80 border border-slate-700/60 bg-slate-900/95 text-white shadow-xl backdrop-blur"
                      >
                      <DropdownMenuLabel className="text-xs uppercase tracking-wide text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Recent Community Posts</span>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleClearAllNotifications();
                              }}
                              className="text-[11px] font-normal uppercase tracking-wide text-cyan-300 transition hover:text-cyan-200"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-800/80" />
                      <div className="max-h-72 overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="flex items-center justify-center py-6 text-slate-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-cyan-300" />
                            Loading posts...
                          </div>
                        ) : notificationsError ? (
                          <div className="px-3 py-4 text-sm text-red-300">
                            Unable to load community updates right now.
                          </div>
                        ) : recentPosts.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-slate-400">
                            No recent member posts yet.
                          </div>
                        ) : (
                          recentPosts.map((post, index) => {
                            const createdAt = post.created_at || post.createdAt;
                            const timestamp = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Just now';
                            const title = post.title || 'Untitled discussion';
                            const author = post.author_name || 'Community Member';
                            const key = post._id || post.id || `post-${index}`;
                            const notificationId = getNotificationId(post);
                            const isUnread = notificationId ? !readIdsSet.has(notificationId) : false;

                            return (
                              <DropdownMenuItem
                                key={key}
                                onSelect={(event) => {
                                  event.preventDefault();
                                  handleNotificationClick(post);
                                }}
                                className={`flex flex-col items-start gap-1 rounded-md px-3 py-2 text-left text-sm focus:bg-slate-800/80 ${
                                  isUnread ? 'bg-slate-800/70 text-white' : 'bg-transparent text-slate-300'
                                }`}
                              >
                                <span className={`w-full truncate font-medium ${isUnread ? 'text-white' : 'text-slate-200'}`}>
                                  {title}
                                </span>
                                <span className="w-full truncate text-xs text-slate-400">
                                  {author} • {timestamp}
                                </span>
                                {isUnread && (
                                  <span className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                                    New
                                  </span>
                                )}
                              </DropdownMenuItem>
                            );
                          })
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-cyan-400" />
                  <div className="relative z-50">
                    <Link 
                      to="/profile-setup" 
                      className="text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer underline-offset-4 hover:underline font-medium"
                    >
                      {user?.email || 'Profile'}
                    </Link>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
            
            {!user && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-medium"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
