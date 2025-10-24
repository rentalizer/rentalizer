import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiService, AdminMemberSummary, User } from '@/services/api';
import {
  CalendarClock,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MEMBERS_PER_PAGE = 25;

type StatusFilter = 'all' | 'active' | 'inactive';
type RoleFilter = 'all' | 'user' | 'admin' | 'superadmin';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatRelative = (value?: string) => {
  if (!value) return 'No activity recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No activity recorded';

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) return 'Just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  if (diffMs < week) return `${Math.floor(diffMs / day)} day${Math.floor(diffMs / day) > 1 ? 's' : ''} ago`;
  return formatDate(value);
};

const getDisplayName = (member: User) => {
  const parts = [member.firstName, member.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return member.email.split('@')[0];
};

const getInitials = (member: User) => {
  const displayName = getDisplayName(member);
  const segments = displayName.trim().split(/\s+/);
  if (segments.length >= 2) {
    return (segments[0][0] + segments[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
};

const renderStatusBadge = (isActive: boolean) => (
  <Badge
    variant="outline"
    className={
      isActive
        ? 'border-green-500/40 bg-green-500/10 text-green-300'
        : 'border-gray-500/40 bg-gray-500/10 text-gray-300'
    }
  >
    {isActive ? 'Active' : 'Inactive'}
  </Badge>
);

const renderRoleBadge = (role?: string) => {
  switch (role) {
    case 'superadmin':
      return (
        <Badge className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 text-white">
          Super Admin
        </Badge>
      );
    case 'admin':
      return (
        <Badge className="bg-cyan-600/80 text-white">
          Admin
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-200">
          Member
        </Badge>
      );
  }
};

const resolveMemberId = (member: User) => {
  const typedMember = member as User & { _id?: string };
  return typedMember.id || typedMember._id || member.email;
};

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const AdminMembersPanel: React.FC = () => {
  const { toast } = useToast();
  const isMountedRef = useRef(true);
  const { user } = useAuth();

  const [members, setMembers] = useState<User[]>([]);
  const [summary, setSummary] = useState<AdminMemberSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: MEMBERS_PER_PAGE,
    total: 0,
    pages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [pendingStatusToggle, setPendingStatusToggle] = useState<{
    member: User;
    nextStatus: boolean;
  } | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAdminMembers({
        page,
        limit: MEMBERS_PER_PAGE,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(roleFilter !== 'all' ? { role: roleFilter } : {}),
      });

      if (!isMountedRef.current) {
        return;
      }

      setMembers(response.members);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load members', err);

      if (!isMountedRef.current) {
        return;
      }

      setError('Failed to load members. Please try again.');
      toast({
        title: 'Unable to load members',
        description: 'Something went wrong while fetching the member directory.',
        variant: 'destructive',
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [page, debouncedSearch, statusFilter, roleFilter, toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const summaryCards = useMemo(() => {
    const data = summary || {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      adminUsers: 0,
      newUsersToday: 0,
    };

    return [
      {
        label: 'Total Members',
        value: data.totalUsers,
        border: 'border-cyan-500/30',
        accent: 'text-cyan-200',
      },
      {
        label: 'Active',
        value: data.activeUsers,
        border: 'border-green-500/30',
        accent: 'text-green-200',
      },
      {
        label: 'Inactive',
        value: data.inactiveUsers,
        border: 'border-yellow-500/30',
        accent: 'text-yellow-200',
      },
      {
        label: 'Admins',
        value: data.adminUsers,
        border: 'border-purple-500/30',
        accent: 'text-purple-200',
      },
    ];
  }, [summary]);

  const pageStats = useMemo(() => {
    const total = pagination.total ?? 0;
    const limit = pagination.limit ?? MEMBERS_PER_PAGE;
    const currentPage = pagination.page ?? page;
    const totalPages = pagination.pages ?? 1;

    if (total === 0) {
      return {
        start: 0,
        end: 0,
        total,
        currentPage,
        totalPages,
      };
    }

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(start + members.length - 1, total);

    return {
      start,
      end,
      total,
      currentPage,
      totalPages,
    };
  }, [pagination, members.length, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRoleChange = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, pagination.pages || prev + 1));
  };

  const handleMemberClick = useCallback(
    (member: User) => {
      const targetUserId = resolveMemberId(member);
      const currentUserId = user?.id || (user as typeof user & { _id?: string })?._id;
      const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';

      if (!isAdminUser) {
        toast({
          title: 'Admin access required',
          description: 'Only admins can start support messages.',
          variant: 'destructive',
        });
        return;
      }

      if (!targetUserId) {
        console.warn('Cannot open support chat: target member missing identifier.');
        return;
      }

      if (currentUserId && targetUserId.toString() === currentUserId.toString()) {
        toast({
          title: 'Heads up',
          description: 'You cannot message yourself.',
        });
        return;
      }

      const targetName = getDisplayName(member);
      const params = new URLSearchParams({
        messageUserId: targetUserId.toString(),
        messageUserName: targetName,
        fromMembers: 'directory',
      });

      if (typeof window !== 'undefined') {
        window.location.href = `/community?${params.toString()}#admin-support`;
      }
    },
    [toast, user]
  );

  const handleStatusToggle = useCallback(
    async (member: User, nextStatus: boolean) => {
      const memberId = resolveMemberId(member);
      if (!memberId) {
        toast({
          title: 'Unable to update status',
          description: 'Missing member identifier.',
          variant: 'destructive',
        });
        return;
      }

      const memberIdString = memberId.toString();
      setStatusUpdatingId(memberIdString);

      try {
        await apiService.updateAdminMemberStatus(memberIdString, nextStatus);

        toast({
          title: `Member ${nextStatus ? 'activated' : 'deactivated'}`,
          description: `${getDisplayName(member)} is now ${nextStatus ? 'active' : 'inactive'}.`,
        });

        await fetchMembers();
      } catch (err) {
        console.error('Failed to update member status', err);
        toast({
          title: 'Status update failed',
          description:
            err instanceof Error ? err.message : 'Unable to update the member status right now.',
          variant: 'destructive',
        });
      } finally {
        setStatusUpdatingId(null);
      }
    },
    [fetchMembers, toast]
  );

  const requestStatusToggle = useCallback(
    (member: User, nextStatus: boolean) => {
      if (nextStatus) {
        handleStatusToggle(member, nextStatus);
      } else {
        setPendingStatusToggle({ member, nextStatus });
      }
    },
    [handleStatusToggle]
  );

  const confirmStatusToggle = useCallback(() => {
    if (!pendingStatusToggle) return;
    handleStatusToggle(pendingStatusToggle.member, pendingStatusToggle.nextStatus);
    setPendingStatusToggle(null);
  }, [handleStatusToggle, pendingStatusToggle]);

  const cancelStatusToggle = useCallback(() => {
    setPendingStatusToggle(null);
  }, []);

  const showPagination = pageStats.totalPages > 1;

  return (
    <Card className="border-cyan-500/20 bg-slate-900/60 backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-cyan-200">
              <span className="rounded-lg bg-cyan-500/10 p-2">
                <Users className="h-5 w-5" />
              </span>
              Member Directory
            </CardTitle>
            <p className="mt-2 text-sm text-gray-300">
              Browse every member account, view bios, and keep tabs on recent activity.
            </p>
          </div>
          {summary && (
            <Badge className="w-fit bg-green-500/10 text-green-200 hover:bg-green-500/20">
              <CalendarClock className="mr-2 h-4 w-4" />
              {summary.newUsersToday} new {summary.newUsersToday === 1 ? 'member' : 'members'} today
            </Badge>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className={`rounded-lg border ${item.border} bg-slate-900/50 p-4`}
            >
              <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${item.accent}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="h-11 bg-slate-800/80 pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: StatusFilter) => handleStatusChange(value)}>
            <SelectTrigger className="h-11 bg-slate-800/80 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(value: RoleFilter) => handleRoleChange(value)}>
            <SelectTrigger className="h-11 bg-slate-800/80 text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Members</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="superadmin">Super Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cyan-500/20 bg-slate-900/40 p-4">
          <div className="flex flex-col gap-1 text-sm text-gray-300 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex items-center gap-2 text-gray-200">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Showing {pageStats.start === 0 ? 0 : `${pageStats.start}-${pageStats.end}`}
            </span>
            <span className="hidden sm:inline text-gray-500">•</span>
            <span className="text-gray-300">{pageStats.total} total members</span>
            {statusFilter !== 'all' && (
              <>
                <span className="hidden sm:inline text-gray-500">•</span>
                <span className="flex items-center gap-2 text-gray-300">
                  <ShieldAlert className="h-4 w-4 text-amber-300" />
                  Filtered by {statusFilter === 'active' ? 'Active' : 'Inactive'}
                </span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMembers()}
            className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-cyan-500/20 bg-slate-900/30">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-cyan-500/20 bg-slate-900/30 p-8 text-center text-gray-300">
            No members match the current filters.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-900/40">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-slate-800/60">
                    <TableHead className="text-center text-gray-300">Member</TableHead>
                    <TableHead className="text-center text-gray-300">Role</TableHead>
                    <TableHead className="text-center text-gray-300">Status</TableHead>
                    <TableHead className="text-center text-gray-300">Bio</TableHead>
                    <TableHead className="text-center text-gray-300">Joined</TableHead>
                    <TableHead className="text-center text-gray-300">Last Active</TableHead>
                    <TableHead className="text-center text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => {
                    const memberId = resolveMemberId(member);
                    const memberIdString = memberId?.toString() ?? '';
                    const isUpdating = statusUpdatingId === memberIdString;
                    const nextStatus = !Boolean(member.isActive);

                    return (
                      <TableRow key={memberIdString || member.email} className="border-slate-800">
                        <TableCell className="text-left">
                          <button
                            type="button"
                            onClick={() => handleMemberClick(member)}
                            className="group flex w-full items-center gap-3 rounded-lg border border-transparent bg-transparent p-0 text-left transition-colors hover:border-cyan-500/20 focus:outline-none focus-visible:border-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                          >
                            <Avatar className="h-10 w-10 ring-2 ring-cyan-500/20 transition-transform group-hover:scale-105">
                              {member.profilePicture ? (
                                <AvatarImage
                                  src={member.profilePicture}
                                  alt={getDisplayName(member)}
                                />
                              ) : (
                                <AvatarFallback className="bg-cyan-500/20 text-cyan-200">
                                  {getInitials(member)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium text-white group-hover:text-cyan-200">
                                {getDisplayName(member)}
                              </p>
                              <p className="text-sm text-gray-400">{member.email}</p>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell className="text-center">{renderRoleBadge(member.role)}</TableCell>
                        <TableCell className="text-center">{renderStatusBadge(Boolean(member.isActive))}</TableCell>
                        <TableCell className="max-w-xs text-center text-sm text-gray-300">
                          {member.bio ? (
                            member.bio
                          ) : (
                            <span className="text-gray-500">No bio provided</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-300">
                          {formatDate(member.createdAt)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-300">
                          {formatRelative(member.lastLogin)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              size="sm"
                              variant={member.isActive ? 'destructive' : 'outline'}
                              className={
                                member.isActive
                                  ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100'
                                  : 'border-green-500/40 text-green-200 hover:bg-green-500/10'
                              }
                              onClick={() => requestStatusToggle(member, nextStatus)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : member.isActive ? (
                                <UserX className="mr-2 h-4 w-4" />
                              ) : (
                                <UserCheck className="mr-2 h-4 w-4" />
                              )}
                              {isUpdating
                                ? 'Updating...'
                                : member.isActive
                                ? 'Deactivate'
                                : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 md:hidden">
              {members.map((member) => {
                const memberId = resolveMemberId(member);
                const memberIdString = memberId?.toString() ?? '';
                const isUpdating = statusUpdatingId === memberIdString;
                const nextStatus = !Boolean(member.isActive);

                return (
                  <div
                    key={memberIdString || member.email}
                    className="rounded-lg border border-cyan-500/20 bg-slate-900/40 p-4 space-y-4"
                    onClick={() => handleMemberClick(member)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleMemberClick(member);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-cyan-500/20">
                        {member.profilePicture ? (
                          <AvatarImage src={member.profilePicture} alt={getDisplayName(member)} />
                        ) : (
                        <AvatarFallback className="bg-cyan-500/20 text-cyan-100">
                          {getInitials(member)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-base font-semibold text-white">{getDisplayName(member)}</p>
                      <p className="text-sm text-gray-400 break-all">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {renderRoleBadge(member.role)}
                    {renderStatusBadge(Boolean(member.isActive))}
                  </div>

                  <div className="text-sm text-gray-300">
                    {member.bio ? member.bio : <span className="text-gray-500">No bio provided</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <p className="uppercase tracking-wide text-gray-500">Joined</p>
                      <p className="mt-1 text-white/90">{formatDate(member.createdAt)}</p>
                    </div>
                    <div>
                      <p className="uppercase tracking-wide text-gray-500">Last Active</p>
                      <p className="mt-1 text-white/90">{formatRelative(member.lastLogin)}</p>
                    </div>
                  </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={member.isActive ? 'destructive' : 'outline'}
                        className={
                          member.isActive
                            ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100'
                            : 'border-green-500/40 text-green-200 hover:bg-green-500/10'
                        }
                        disabled={isUpdating}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          requestStatusToggle(member, nextStatus);
                        }}
                      >
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : member.isActive ? (
                          <UserX className="mr-2 h-4 w-4" />
                        ) : (
                          <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        {isUpdating
                          ? 'Updating...'
                          : member.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleMemberClick(member);
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showPagination && !isLoading && members.length > 0 && (
          <div className="flex flex-col gap-3 rounded-lg border border-cyan-500/20 bg-slate-900/40 p-4 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Page {pageStats.currentPage} of {pageStats.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={pageStats.currentPage <= 1}
                className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={pageStats.currentPage >= pageStats.totalPages}
                className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={pendingStatusToggle !== null}
        onOpenChange={(open) => {
          if (!open) {
            cancelStatusToggle();
          }
        }}
      >
        <AlertDialogContent className="bg-slate-900 border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-300">Deactivate member?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-300">
              {pendingStatusToggle
                ? `This will prevent ${getDisplayName(pendingStatusToggle.member)} from logging in. They will see an inactive account notice and must contact the admin via the bug report modal.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-gray-200 hover:bg-slate-700" onClick={cancelStatusToggle}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmStatusToggle}
            >
              Deactivate Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AdminMembersPanel;
