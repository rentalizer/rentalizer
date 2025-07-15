import { useState } from 'react';
import { Search, Crown, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastActivity?: string;
  unreadCount: number;
  isAdmin: boolean;
  lastMessage?: {
    content: string;
    timestamp: string;
    isFromMember: boolean;
  };
}

interface MembersListProps {
  members: Member[];
  selectedMemberId?: string;
  onMemberSelect: (memberId: string) => void;
  onStartNewConversation?: () => void;
}

export default function MembersList({
  members,
  selectedMemberId,
  onMemberSelect,
  onStartNewConversation
}: MembersListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembers = filteredMembers.sort((a, b) => {
    // Sort by unread messages first, then by online status, then by last activity
    if (a.unreadCount !== b.unreadCount) {
      return b.unreadCount - a.unreadCount;
    }
    if (a.isOnline !== b.isOnline) {
      return a.isOnline ? -1 : 1;
    }
    if (a.lastActivity && b.lastActivity) {
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Members</h2>
          {onStartNewConversation && (
            <Button variant="outline" size="sm" onClick={onStartNewConversation}>
              New Chat
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedMembers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No members found' : 'No members available'}
              </p>
            </div>
          ) : (
            sortedMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => onMemberSelect(member.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMemberId === member.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name and Status */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">
                        {member.name}
                      </span>
                      {member.isAdmin && (
                        <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                      )}
                      {member.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                          {member.unreadCount > 99 ? '99+' : member.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Last message or email */}
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {member.lastMessage ? (
                        <span className={member.lastMessage.isFromMember ? 'font-medium' : ''}>
                          {member.lastMessage.isFromMember ? 'Member: ' : 'You: '}
                          {member.lastMessage.content}
                        </span>
                      ) : (
                        member.email
                      )}
                    </p>

                    {/* Status and time */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className={`inline-flex items-center gap-1 ${member.isOnline ? 'text-green-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {member.isOnline ? 'Online' : 'Offline'}
                      </span>
                      {(member.lastMessage?.timestamp || member.lastActivity) && (
                        <span>
                          {formatDistanceToNow(
                            new Date(member.lastMessage?.timestamp || member.lastActivity!),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
          <span>
            {members.filter(m => m.isOnline).length} online
          </span>
        </div>
      </div>
    </div>
  );
}