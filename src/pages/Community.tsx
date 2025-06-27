
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
import { ContactChat } from '@/components/ContactChat';

const Community = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
          </div>
          
          {/* Community Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">247</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-sm text-gray-400">Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">89</div>
              <div className="text-sm text-gray-400">Resources</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Users className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Users className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Book className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Quick Actions */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-800/50 border-cyan-500/20 mb-6">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Discussion
                    </Button>
                    <div className="w-full">
                      <ContactChat />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-cyan-500/30 text-cyan-300"
                      onClick={() => setActiveTab('calendar')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Weekly Live Training</div>
                          <div className="text-sm text-gray-400">Today 5:00 PM PST</div>
                        </div>
                        <Badge variant="outline" className="border-green-500/30 text-green-300">Live</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Market Research</div>
                          <div className="text-sm text-gray-400">Jun 5, 4:00 PM PST</div>
                        </div>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">Upcoming</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          RM
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Richie Matthews</span>
                            <span className="text-sm text-gray-400">shared a video</span>
                            <span className="text-xs text-gray-500">30m ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">Advanced Rental Arbitrage Strategies for 2025</div>
                          <div className="text-sm text-gray-300">New training video covering market analysis and deal structuring...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          AR
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Alex Rodriguez</span>
                            <span className="text-sm text-gray-400">asked a question</span>
                            <span className="text-xs text-gray-500">1h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">How to negotiate with landlords on lease terms?</div>
                          <div className="text-sm text-gray-300">Looking for advice on getting better terms for rental arbitrage deals...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          TM
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Team Member</span>
                            <span className="text-sm text-gray-400">posted content</span>
                            <span className="text-xs text-gray-500">2h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">Updated Cash Flow Calculator Template</div>
                          <div className="text-sm text-gray-300">New Excel template with automated calculations and market data integration...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          MJ
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Maria Johnson</span>
                            <span className="text-sm text-gray-400">asked a question</span>
                            <span className="text-xs text-gray-500">3h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">Best furniture sourcing strategies for multiple properties?</div>
                          <div className="text-sm text-gray-300">Managing 5 properties now and looking for bulk purchasing options...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          DK
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">David Kim</span>
                            <span className="text-sm text-gray-400">shared success story</span>
                            <span className="text-xs text-gray-500">4h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">First month: $3,200 profit from Phoenix property</div>
                          <div className="text-sm text-gray-300">Breakdown of numbers and lessons learned from my first deal...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          RM
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Richie Matthews</span>
                            <span className="text-sm text-gray-400">shared a document</span>
                            <span className="text-xs text-gray-500">6h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">2025 Market Outlook Report</div>
                          <div className="text-sm text-gray-300">Comprehensive analysis of emerging markets and opportunities...</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          SL
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">Sarah Lee</span>
                            <span className="text-sm text-gray-400">asked a question</span>
                            <span className="text-xs text-gray-500">8h ago</span>
                          </div>
                          <div className="text-cyan-300 font-medium mb-2">Insurance requirements for rental arbitrage?</div>
                          <div className="text-sm text-gray-300">What type of insurance coverage do I need for my first property...</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="calendar" className="mt-8">
            <CommunityCalendar />
          </TabsContent>

          <TabsContent value="messages" className="mt-8">
            <MessageThreads />
          </TabsContent>

          <TabsContent value="discussions" className="mt-8">
            <GroupDiscussions />
          </TabsContent>

          <TabsContent value="documents" className="mt-8">
            <DocumentsLibrary />
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <VideoLibrary />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
