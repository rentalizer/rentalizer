import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageSquare, Crown, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  profile_complete: boolean;
  isAdmin?: boolean;
}

const Members = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [dmMessage, setDmMessage] = useState('');
  const [sendingDM, setSendingDM] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Get all profiles - show everyone, not just complete profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Get admin roles
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      const adminUserIds = adminRoles?.map(role => role.user_id) || [];

      // Combine data and mark admins
      const profilesWithAdminFlag = profilesData?.map(profile => ({
        ...profile,
        isAdmin: adminUserIds.includes(profile.user_id)
      })) || [];

      setProfiles(profilesWithAdminFlag);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load member profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendDirectMessage = async () => {
    if (!selectedProfile || !dmMessage.trim() || !user) return;

    try {
      setSendingDM(true);
      
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedProfile.user_id,
          message: dmMessage.trim(),
          sender_name: user.email?.split('@')[0] || 'Anonymous'
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message sent",
        description: "Your message has been sent to the admin",
      });
      
      setDmMessage('');
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingDM(false);
    }
  };

  const getInitials = (profile: Profile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getFullName = (profile: Profile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile.display_name || 'Member';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Community Members</h1>
              <p className="text-gray-400">Connect with fellow real estate investors</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            {profiles.length} Active Members
          </Badge>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading members...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-lg font-semibold">
                          {getInitials(profile)}
                        </AvatarFallback>
                      </Avatar>
                      {profile.isAdmin && (
                        <Crown className="h-5 w-5 text-purple-400 absolute -top-1 -right-1" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{getFullName(profile)}</h3>
                      {profile.isAdmin && (
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          Admin
                        </Badge>
                      )}
                      {profile.bio && (
                        <p className="text-sm text-gray-400 line-clamp-3">{profile.bio}</p>
                      )}
                    </div>

                    <div className="flex gap-2 w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                            onClick={() => setSelectedProfile(profile)}
                          >
                            <User className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-cyan-500/20">
                          <DialogHeader>
                            <DialogTitle className="text-white">{getFullName(profile)}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.avatar_url || ''} />
                                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xl font-semibold">
                                  {getInitials(profile)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            {profile.bio && (
                              <div>
                                <h4 className="text-cyan-300 font-medium mb-2">About</h4>
                                <p className="text-gray-300">{profile.bio}</p>
                              </div>
                            )}
                            {profile.isAdmin && (
                              <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                                <Crown className="h-3 w-3 mr-1" />
                                Administrator
                              </Badge>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {profile.isAdmin && user && profile.user_id !== user.id && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"  
                              variant="outline"
                              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              onClick={() => setSelectedProfile(profile)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-purple-500/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">Message {getFullName(profile)}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Type your message..."
                                value={dmMessage}
                                onChange={(e) => setDmMessage(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={sendDirectMessage}
                                  disabled={!dmMessage.trim() || sendingDM}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {sendingDM ? 'Sending...' : 'Send Message'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {profiles.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No members yet</h3>
            <p className="text-gray-500">No members found in the community</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Members;