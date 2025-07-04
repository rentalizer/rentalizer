import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Users, Book, Video, Bell, Plus } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityLeaderboard } from '@/components/community/CommunityLeaderboard';
import { ContactChat } from '@/components/ContactChat';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight py-2">
              Training & Community Hub
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Users className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Video className="h-4 w-4 mr-2" />
              Training Videos & Documents
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Book className="h-4 w-4 mr-2" />
              Business Documents
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Users className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Other Tabs */}
          <TabsContent value="discussions" className="mt-8">
            <GroupDiscussions />
          </TabsContent>
          <TabsContent value="calendar" className="mt-8">
            <CommunityCalendar />
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <VideoLibrary />
          </TabsContent>

          <TabsContent value="messages" className="mt-8">
            <MessageThreads />
          </TabsContent>


          <TabsContent value="documents" className="mt-8">
            <DocumentsLibrary />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-8">
            <CommunityLeaderboard />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
