
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Upload, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
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
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log('🔍 Loading profile for user:', user?.id);
      
      // Use data from AuthContext - no need to fetch again!
      if (user) {
        console.log('📋 Profile data from AuthContext:', user);

        console.log('📋 Setting form data:', {
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture ? 'Image loaded' : 'No image'
        });
        
        form.reset({
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          bio: user.bio || '',
        });
        
        // Set avatar URL if available
        setAvatarUrl(user.profilePicture || '');
        setProfileComplete(!!(user.firstName && user.lastName));
        console.log('✨ Profile state loaded from AuthContext');
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

      const file = event.target.files?.[0];
      // Reset input so users can re-upload the same file if needed
      event.target.value = '';

      if (!file) {
        console.log('No file selected: Please choose an image to upload');
        return;
      }

      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type: Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        console.log('File too large: Please select an image smaller than 2MB');
        return;
      }

      const { url } = await apiService.uploadAvatar(file);

      if (!url) {
        console.log('Upload failed: No URL returned');
        return;
      }

      setAvatarUrl(url);
      console.log('Success: Profile photo uploaded');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      console.log('Error: Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      console.error('❌ No user found when trying to save profile');
      console.log("Authentication Error: Please sign in again to save your profile");
      return;
    }

    console.log('🔍 User found:', user.id, user.email);

    if (!data.first_name.trim() || !data.last_name.trim()) {
      console.log("Missing Information: Please fill in first name and last name");
      return;
    }

    try {
      console.log('💾 Attempting to update profile with data:', {
        firstName: data.first_name.trim(),
        lastName: data.last_name.trim(),
      });

      // Update profile using AuthContext - this will update both backend and local state
      // No need to call apiService.updateProfile directly - AuthContext handles it
      const result = await updateAuthProfile({
        display_name: `${data.first_name.trim()} ${data.last_name.trim()}`,
        avatar_url: avatarUrl || null,
        // Only include bio for non-admin users
        bio: isAdmin ? null : (data.bio?.trim() || null),
      });

      if (result.error) {
        throw result.error;
      }

      console.log('✅ Profile updated successfully!');
      console.log("Success: Your profile has been updated successfully");

      navigate('/community');
    } catch (error: unknown) {
      console.error('💥 Exception:', error);
      
      let errorMessage = 'Failed to update profile';
      if (error instanceof Error) {
        if (error.message.includes('request entity too large')) {
          errorMessage = 'Profile picture is too large. Please select a smaller image.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log("Error:", errorMessage);
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
  const firstInitial = (watchedFirstName || '').charAt(0).toUpperCase();
  const lastInitial = (watchedLastName || '').charAt(0).toUpperCase();

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
                        {`${firstInitial}${lastInitial}`.trim() || 'U'}
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

                  {/* Only show bio field for non-admin users */}
                  {!isAdmin && (
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
                  )}

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !watchedFirstName.trim() || !watchedLastName.trim()}
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
