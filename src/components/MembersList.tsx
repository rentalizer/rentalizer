import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Search, Users, Crown, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Member {
  id: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  is_admin?: boolean;
}

interface MembersListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageMember: (memberId: string, memberName: string) => void;
}

export const MembersList: React.FC<MembersListProps> = ({ open, onOpenChange, onMessageMember }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        getMemberName(member).toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, first_name, last_name, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error fetching members",
          description: "Failed to load member list",
          variant: "destructive"
        });
        return;
      }

      // Fetch all user_profiles to get emails
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('id, email');

      if (userProfilesError) {
        console.error('Error fetching user profiles:', userProfilesError);
      }

      // Get admin roles
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      const adminUserIds = new Set(adminRoles?.map(role => role.user_id) || []);

      // Create a map of user_id to email
      const emailMap = new Map(userProfiles?.map(up => [up.id, up.email]) || []);

      // Map profiles with real email addresses
      const membersList: Member[] = profiles?.map(profile => {
        return {
          id: profile.user_id,
          email: emailMap.get(profile.user_id) || 'No email available',
          display_name: profile.display_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          is_admin: adminUserIds.has(profile.user_id)
        };
      }) || [];

      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error fetching members",
        description: "Failed to load member list",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleMessageClick = (member: Member) => {
    setSelectedMember(member);
    setMessageDialogOpen(true);
  };

  const sendDirectMessage = async () => {
    if (!selectedMember || !messageText.trim() || !user) return;

    setSendingMessage(true);
    try {
      const senderName = user.email?.split('@')[0] || 'Anonymous';
      
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMember.id,
          message: messageText.trim(),
          sender_name: senderName
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${getMemberName(selectedMember)}`,
      });
      
      setMessageText('');
      setMessageDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
    setSendingMessage(false);
  };

  const getMemberName = (member: Member) => {
    if (member.display_name) return member.display_name;
    if (member.first_name && member.last_name) return `${member.first_name} ${member.last_name}`;
    if (member.first_name) return member.first_name;
    return member.email.split('@')[0];
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Members ({members.length})
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto max-h-96 space-y-2">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchQuery ? 'No members found matching your search' : 'No members found'}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getMemberName(member).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{getMemberName(member)}</span>
                        {member.is_admin && (
                          <Crown className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">{member.email}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.is_admin ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMessageClick(member)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-md bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Message {selectedMember ? getMemberName(selectedMember) : ''}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessageDialogOpen(false)}
                className="p-1 h-auto hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Message</label>
              <Textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setMessageDialogOpen(false)}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={sendDirectMessage}
                disabled={!messageText.trim() || sendingMessage}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};