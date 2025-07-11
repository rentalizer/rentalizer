
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '@/components/TopNavBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSetup = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      bio: '',
    },
  });

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
          form.reset({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            bio: data.bio || '',
          });
        } else if (data.display_name) {
          // If only display_name exists, try to split it into first/last
          console.log('🔄 Splitting display_name into first/last:', data.display_name);
          const nameParts = data.display_name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          console.log('📝 Setting names - First:', firstName, 'Last:', lastName);
          form.reset({
            first_name: firstName,
            last_name: lastName,
            bio: data.bio || '',
          });
        }
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

  const onSubmit = async (data: ProfileFormData) => {
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

    if (!data.first_name.trim() || !data.last_name.trim() || !avatarUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in first name, last name, and upload a profile picture",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('💾 Attempting to save profile with data:', {
        user_id: user.id,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        bio: data.bio?.trim() || null,
        avatar_url: avatarUrl || '',
        display_name: `${data.first_name.trim()} ${data.last_name.trim()}`,
        profile_complete: true
      });

      // Use direct Supabase call with explicit auth
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔑 Current session:', !!session);

      const { data: savedData, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          bio: data.bio?.trim() || null,
          avatar_url: avatarUrl || '',
          display_name: `${data.first_name.trim()} ${data.last_name.trim()}`,
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

      console.log('✅ Profile saved successfully!', savedData);
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

  const watchedFirstName = form.watch('first_name');
  const watchedLastName = form.watch('last_name');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">
                {watchedFirstName || watchedLastName ? 'Edit Your Profile' : 'Complete Your Profile'}
              </CardTitle>
              <p className="text-gray-400">
                {watchedFirstName || watchedLastName
                  ? 'Update your member profile information'
                  : 'Create your member profile to connect with the community'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Incomplete Profile Warning */}
              {!profileComplete && (watchedFirstName || watchedLastName || avatarUrl) && (
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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={avatarUrl} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-2xl">
                        {watchedFirstName.charAt(0)}{watchedLastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <Label htmlFor="avatar-upload" className="sr-only">
                        Upload avatar
                      </Label>
                      <Button
                        type="button"
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
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Enter your first name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Enter your last name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">About Yourself</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Tell the community about yourself, your real estate experience, goals, etc."
                            rows={4}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-400 mt-1">
                          This will be visible to other community members
                        </p>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !watchedFirstName.trim() || !watchedLastName.trim() || !avatarUrl}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {form.formState.isSubmitting ? 'Saving...' : (watchedFirstName || watchedLastName ? 'Update Profile' : 'Save Profile')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
