import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Crown, MessageCircle, Clock, Circle } from 'lucide-react';
import { Conversation } from '@/services/messagingService';

interface MembersListProps {
  members: Conversation[];
  selectedMemberId?: string;
  onMemberSelect: (memberId: string) => void;
  onlineUsers?: Set<string>;
}

export default function MembersList({
  members,
  selectedMemberId,
  onMemberSelect,
  onlineUsers = new Set()
}: MembersListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getDisplayName = (member: Conversation) => {
    const { firstName, lastName, email } = member.participant;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return email.split('@')[0];
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    const fullName = `${member.participant.firstName} ${member.participant.lastName}`.toLowerCase();
    const email = member.participant.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  // Sort members by unread count, online status, and last message time
  const sortedMembers = filteredMembers.sort((a, b) => {
    // First sort by unread count (descending)
    if (a.unread_count !== b.unread_count) {
      return b.unread_count - a.unread_count;
    }
    
    // Then sort by online status (online first)
    const aOnline = onlineUsers.has(a.participant_id) || (a.participant as { isOnline?: boolean }).isOnline;
    const bOnline = onlineUsers.has(b.participant_id) || (b.participant as { isOnline?: boolean }).isOnline;
    if (aOnline !== bOnline) {
      return aOnline ? -1 : 1;
    }
    
    // Then sort by last message time (descending)
    if (a.last_message && b.last_message) {
      return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
    }
    
    // If one has a message and the other doesn't
    if (a.last_message && !b.last_message) return -1;
    if (!a.last_message && b.last_message) return 1;
    
    // Finally sort by name
    const aName = getDisplayName(a).toLowerCase();
    const bName = getDisplayName(b).toLowerCase();
    return aName.localeCompare(bName);
  });

  const getInitials = (member: Conversation) => {
    const { firstName, lastName, email } = member.participant;
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const formatLastMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const truncateMessage = (message: string, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-80 bg-slate-800/90 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">Members</h3>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedMembers.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {searchTerm ? 'No members found' : 'No users available'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedMembers.map((member) => {
                const isSelected = selectedMemberId === member.participant_id;
                const hasUnread = member.unread_count > 0;
                const isAdmin = member.participant.role === 'admin' || member.participant.role === 'superadmin';
                
                return (
                  <div
                    key={member.participant_id}
                    onClick={() => onMemberSelect(member.participant_id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-cyan-600/20 border border-cyan-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700/80 border border-transparent hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={member.participant.profilePicture} 
                            alt={getDisplayName(member)} 
                          />
                          <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm">
                            {getInitials(member)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Online status indicator */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                          onlineUsers.has(member.participant_id) || (member.participant as { isOnline?: boolean }).isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        
                        {/* Admin badge */}
                        {isAdmin && (
                          <div className="absolute -top-1 -right-1">
                            <Crown className="h-4 w-4 text-yellow-400" />
                          </div>
                        )}
                        
                        {/* Unread indicator */}
                        {hasUnread && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white text-sm truncate">
                            {getDisplayName(member)}
                          </h4>
                          
                          {/* Unread count badge */}
                          {hasUnread && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-2 py-0.5 h-5 min-w-5 flex items-center justify-center animate-pulse"
                            >
                              {member.unread_count > 99 ? '99+' : member.unread_count}
                            </Badge>
                          )}
                        </div>

                        {/* Last message */}
                        {member.last_message ? (
                          <div className="space-y-1">
                            <p className="text-slate-300 text-xs truncate">
                              <span className={`font-medium ${
                                member.last_message.sender_id === member.participant_id 
                                  ? 'text-cyan-400' 
                                  : 'text-slate-400'
                              }`}>
                                {member.last_message.sender_id === member.participant_id ? 'You: ' : ''}
                              </span>
                              {truncateMessage(member.last_message.message)}
                            </p>
                            
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>{formatLastMessageTime(member.last_message.created_at)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs italic">No messages yet</p>
                        )}

                        {/* Role badge */}
                        {isAdmin && (
                          <div className="mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 h-5 border-yellow-400/30 text-yellow-400"
                            >
                              Admin
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-xs">
            {members.length} {members.length === 1 ? 'user' : 'users'}
          </p>
          {members.length > 0 && (
            <p className="text-slate-500 text-xs mt-1">
              {members.filter(m => onlineUsers.has(m.participant_id) || (m.participant as { isOnline?: boolean }).isOnline).length} online
            </p>
          )}
        </div>
      </div>
    </div>
  );
}