
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, MapPin, Calendar, Plus, Upload, User } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Member {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  joinedDate: string;
  avatar: string;
  status: 'active' | 'inactive';
  membershipType: 'free' | 'pro' | 'lifetime';
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Leah Ryu',
      username: '@leah-ryu-6300',
      bio: 'Sr product designer passionate about real estate investing',
      location: 'San Francisco, CA',
      joinedDate: 'Jun 24, 2025',
      avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      membershipType: 'lifetime'
    },
    {
      id: '2',
      name: 'Jacob Ortiz',
      username: '@jacob-ortiz-4321',
      bio: 'Real estate enthusiast learning the ropes',
      location: 'Austin, TX',
      joinedDate: 'Jun 23, 2025',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      membershipType: 'free'
    },
    {
      id: '3',
      name: 'Vinod Kumar',
      username: '@vinod-kumar-8339',
      bio: 'New Entrepreneur in the Airbnb Rental Business',
      location: 'New York, NY',
      joinedDate: 'Jun 22, 2025',
      avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      membershipType: 'pro'
    }
  ]);

  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      location: ''
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: data.name,
      username: data.username.startsWith('@') ? data.username : `@${data.username}`,
      bio: data.bio,
      location: data.location,
      joinedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      avatar: selectedImage || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      membershipType: 'free'
    };

    setMembers(prev => [...prev, newMember]);
    setIsCreateProfileModalOpen(false);
    form.reset();
    setSelectedImage(null);
  };

  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case 'lifetime': return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      case 'pro': return 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-slate-600/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-cyan-300 mb-2">Community Members</h2>
          <p className="text-slate-400">Connect with fellow real estate investors</p>
        </div>
        
        <Dialog open={isCreateProfileModalOpen} onOpenChange={setIsCreateProfileModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyan-300">Create Your Profile</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedImage || undefined} />
                      <AvatarFallback className="bg-slate-700 text-slate-400">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-cyan-600 hover:bg-cyan-700 rounded-full p-2 cursor-pointer">
                      <Upload className="h-4 w-4 text-white" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-slate-400">Upload your profile picture</p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="@username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="City, State"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateProfileModalOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Create Profile
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-slate-700 text-slate-400">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{member.name}</h3>
                  <p className="text-sm text-slate-400 truncate">{member.username}</p>
                  <Badge className={`mt-1 ${getMembershipBadgeColor(member.membershipType)}`}>
                    {member.membershipType === 'lifetime' ? 'Lifetime' : 
                     member.membershipType === 'pro' ? 'Pro' : 'Free'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm leading-relaxed">{member.bio}</p>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  <span>Joined {member.joinedDate}</span>
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${
                    member.status === 'active' ? 'bg-green-400' : 'bg-slate-500'
                  }`} />
                  <span className="capitalize">{member.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-300">{members.length}</div>
              <div className="text-sm text-slate-400">Total Members</div>
            </div>
            <div className="h-8 w-px bg-slate-600" />
            <div>
              <div className="text-2xl font-bold text-green-300">
                {members.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-slate-400">Active</div>
            </div>
            <div className="h-8 w-px bg-slate-600" />
            <div>
              <div className="text-2xl font-bold text-purple-300">
                {members.filter(m => m.membershipType === 'lifetime').length}
              </div>
              <div className="text-sm text-slate-400">Lifetime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
