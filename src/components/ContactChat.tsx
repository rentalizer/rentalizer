
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';

export const ContactChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();

  // Fetch admin users for member to send messages to
  useEffect(() => {
    if (!isAdmin && user) {
      fetchAdminUsers();
    }
  }, [isAdmin, user]);

  // Fetch messages for admin view
  useEffect(() => {
    if (isAdmin && isOpen) {
      fetchMessages();
    }
  }, [isAdmin, isOpen]);

  const fetchAdminUsers = async () => {
    try {
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (adminRoles && adminRoles.length > 0) {
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', adminRoles.map(r => r.user_id));

        setProfiles(adminProfiles || []);
        if (adminProfiles && adminProfiles.length > 0) {
          setSelectedRecipient(adminProfiles[0].user_id);
        }
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: messagesData } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(display_name, avatar_url, first_name, last_name),
          recipient:profiles!direct_messages_recipient_id_fkey(display_name, avatar_url, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your message",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send messages",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user's profile for sender name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      const senderName = profile?.display_name || 
                        (profile?.first_name && profile?.last_name ? 
                         `${profile.first_name} ${profile.last_name}` : 
                         user.email?.split('@')[0] || 'Member');

      const recipientId = selectedRecipient || profiles[0]?.user_id;

      if (!recipientId) {
        toast({
          title: "Error",
          description: "No admin available to receive message",
          variant: "destructive",
        });
        return;
      }

      // Save direct message to database
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim(),
          sender_name: senderName,
        });

      if (error) {
        console.error('Error saving message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message Sent!",
        description: "Your message has been delivered to the admin.",
      });

      // Reset form and close dialog
      setMessage('');
      setIsOpen(false);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message Deleted",
        description: "The message has been removed",
      });

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/10"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isAdmin ? 'Manage Messages' : 'Direct Message Us'}
        </Button>
      </DialogTrigger>
      <DialogContent className={`bg-gray-900 border border-gray-700 ${isAdmin ? 'sm:max-w-4xl max-h-[80vh]' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle className="text-cyan-300 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {isAdmin ? 'Message Management' : 'Send Direct Message'}
          </DialogTitle>
        </DialogHeader>
        
        {isAdmin ? (
          // Admin view - show all messages with delete capability
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No messages yet
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={msg.sender?.avatar_url} 
                          alt={msg.sender_name}
                        />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {msg.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">
                          {msg.sender?.display_name || 
                           (msg.sender?.first_name && msg.sender?.last_name ? 
                            `${msg.sender.first_name} ${msg.sender.last_name}` : 
                            msg.sender_name)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-gray-200 pl-13">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Member view - simple message compose
          <div className="space-y-4">
            {profiles.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Send to:</label>
                <select
                  value={selectedRecipient || ''}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  {profiles.map((profile) => (
                    <option key={profile.user_id} value={profile.user_id}>
                      {profile.display_name || 
                       (profile.first_name && profile.last_name ? 
                        `${profile.first_name} ${profile.last_name}` : 
                        'Admin')}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="bg-slate-800/30 rounded-lg p-4 min-h-[120px]">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="bg-transparent border-none resize-none text-white placeholder-gray-400 focus-visible:ring-0 p-0"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
