import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '@/components/TopNavBar';

const ProfileSetup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log('🔍 Loading profile for user:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      console.log('📊 Profile query result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        console.log('📋 Profile data found:', data);
        // If detailed profile exists, use it
        if (data.first_name || data.last_name) {
          console.log('✅ Using first_name/last_name from profile');
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
        } else if (data.display_name) {
          // If only display_name exists, try to split it into first/last
          console.log('🔄 Splitting display_name into first/last:', data.display_name);
          const nameParts = data.display_name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          console.log('📝 Setting names - First:', firstName, 'Last:', lastName);
          setFirstName(firstName);
          setLastName(lastName);
        }
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setProfileComplete(data.profile_complete || false);
        console.log('✨ Profile state updated');
      } else {
        console.log('❌ No profile data found');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          title: "No file selected",
          description: "Please select an image to upload",
          variant: "destructive",
        });
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = `${user?.id}/avatar-${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) {
      console.error('❌ No user found when trying to save profile');
      toast({
        title: "Authentication Error", 
        description: "Please sign in again to save your profile",
        variant: "destructive",
      });
      return;
    }

    console.log('🔍 User found:', user.id, user.email);

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in first name and last name",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      console.log('💾 Attempting to save profile with data:', {
        user_id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl || '',
        display_name: `${firstName.trim()} ${lastName.trim()}`,
        profile_complete: true
      });

      // Use direct Supabase call with explicit auth
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔑 Current session:', !!session);

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl || '',
          display_name: `${firstName.trim()} ${lastName.trim()}`,
          profile_complete: true
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Supabase error:', error);
        toast({
          title: "Database Error",
          description: `Save failed: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Profile saved successfully!', data);
      toast({
        title: "Success!",
        description: "Your profile has been saved successfully",
      });

      navigate('/community');
    } catch (error: any) {
      console.error('💥 Exception:', error);
      toast({
        title: "Error",
        description: `Unexpected error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-cyan-300 text-xl">Please sign in to access this page</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">
                {firstName || lastName ? 'Edit Your Profile' : 'Complete Your Profile'}
              </CardTitle>
              <p className="text-gray-400">
                {firstName || lastName 
                  ? 'Update your member profile information'
                  : 'Create your member profile to connect with the community'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Incomplete Profile Warning */}
              {!profileComplete && (firstName || lastName || avatarUrl) && (
                <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-yellow-300 font-medium">Profile Incomplete</p>
                      <p className="text-yellow-200 text-sm">
                        Complete your profile to use the platform and connect with the community
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-2xl">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Label htmlFor="avatar-upload" className="sr-only">
                    Upload avatar
                  </Label>
                  <Button
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    disabled={uploading}
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Upload a profile picture (required)
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-300">
                  About Yourself
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Tell the community about yourself, your real estate experience, goals, etc."
                  rows={4}
                />
                <p className="text-sm text-gray-400 mt-1">
                  This will be visible to other community members
                </p>
              </div>

              <Button
                onClick={saveProfile}
                disabled={saving || !firstName.trim() || !lastName.trim() || !avatarUrl}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (firstName || lastName ? 'Update Profile' : 'Save Profile')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;