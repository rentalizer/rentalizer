import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Crown, Mail, Calendar, Settings, Shield, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { format } from 'date-fns';
import { NewsAggregationControls } from '@/components/community/NewsAggregationControls';

interface Member {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  display_name: string | null;
  isAdmin: boolean;
  profile_complete?: boolean;
  avatar_url?: string | null;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const { toast } = useToast();

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchMembers();
    }
  }, [isAdmin, adminLoading]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      // First get user profiles which contain the user IDs we need
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }

      // Get display names from profiles table  
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, first_name, last_name, avatar_url, profile_complete');

      // Get user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Combine the data and sort by creation date (newest first)
      const membersData: Member[] = userProfiles?.map(userProfile => {
        const profile = profiles?.find(p => p.user_id === userProfile.id);
        const adminRole = userRoles?.find(r => r.user_id === userProfile.id && r.role === 'admin');
        
        const displayName = profile?.first_name && profile?.last_name 
          ? `${profile.first_name} ${profile.last_name}`
          : profile?.display_name || userProfile.email.split('@')[0];
        
        return {
          id: userProfile.id,
          email: userProfile.email,
          created_at: userProfile.created_at || '',
          last_sign_in_at: null, // We'll need to get this from auth.users if needed
          email_confirmed_at: userProfile.created_at || '',
          display_name: displayName,
          isAdmin: !!adminRole,
          profile_complete: profile?.profile_complete || false,
          avatar_url: profile?.avatar_url
        };
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      // Check if user is already admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (existingRole) {
        toast({
          title: "User is already an admin",
          description: "This user already has admin privileges.",
        });
        return;
      }

      // Add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });

      if (error) {
        console.error('Error making user admin:', error);
        toast({
          title: "Error",
          description: "Failed to promote user to admin",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setMembers(members.map(member => 
        member.id === userId 
          ? { ...member, isAdmin: true }
          : member
      ));

      toast({
        title: "Admin role granted",
        description: "User has been promoted to admin successfully.",
      });
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) {
        console.error('Error removing admin role:', error);
        toast({
          title: "Error",
          description: "Failed to remove admin role",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setMembers(members.map(member => 
        member.id === userId 
          ? { ...member, isAdmin: false }
          : member
      ));

      toast({
        title: "Admin role removed",
        description: "User admin privileges have been revoked.",
      });
    } catch (error) {
      console.error('Error removing admin role:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full bg-slate-800/50 border-red-500/30">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-300">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Only administrators can access the members dashboard.
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Members Dashboard</h1>
              <p className="text-gray-400">Manage platform members and permissions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              {members.length} Total Members
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300 px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              {members.filter(m => m.isAdmin).length} Admins
            </Badge>
          </div>
        </div>

        {/* News Aggregation Controls */}
        <NewsAggregationControls />

        {/* Members Table */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading members...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Member</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-semibold">
                              {member.display_name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{member.display_name || 'User'}</p>
                            <p className="text-sm text-gray-400">@{member.email.split('@')[0]}</p>
                            {member.profile_complete === false && (
                              <Badge variant="outline" className="border-yellow-500/30 text-yellow-300 text-xs mt-1">
                                Profile Incomplete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.isAdmin ? (
                            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500/30 text-green-300">
                              Active Member
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(member.created_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                                onClick={() => setSelectedMember(member)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-cyan-500/20">
                              <DialogHeader>
                                <DialogTitle className="text-white">Member Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-gray-300">Chat functionality coming soon...</p>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {member.isAdmin && member.email !== 'richie@dialogo.us' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                              onClick={() => handleRemoveAdmin(member.id)}
                            >
                              Remove Admin
                            </Button>
                          ) : !member.isAdmin ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              onClick={() => handleMakeAdmin(member.id)}
                            >
                              <Crown className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminMembers;