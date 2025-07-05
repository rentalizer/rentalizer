import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Video,
  Calendar,
  TrendingUp,
  Heart,
  Reply,
  Pin,
  Star
} from 'lucide-react';

interface CommunityDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const CommunityDemo = ({ currentStep, isRunning }: CommunityDemoProps) => {
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-cyan-400" />
          Community Hub - Connect & Learn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Discussion Threads */}
          <Card className="bg-slate-700/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg text-cyan-300">Discussion Threads</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  RM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Pin className="h-3 w-3 text-yellow-400" />
                    <span className="text-sm font-medium text-white truncate">Welcome to the Community!</span>
                  </div>
                  <div className="text-xs text-gray-400">Richie Matthews • 2h ago</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Reply className="h-3 w-3" />
                      23
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      45
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  JS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">Best markets for 2024?</span>
                  </div>
                  <div className="text-xs text-gray-400">John Smith • 4h ago</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Reply className="h-3 w-3" />
                      12
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      18
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  MJ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">My first deal closed!</span>
                  </div>
                  <div className="text-xs text-gray-400">Maria Johnson • 6h ago</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Reply className="h-3 w-3" />
                      8
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      24
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Library */}
          <Card className="bg-slate-700/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-lg text-purple-300">Resource Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Getting Started Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Lease Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Email Scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Market Analysis Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Legal Guidelines</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <div className="text-xs text-gray-400">📚 50+ resources available</div>
              </div>
            </CardContent>
          </Card>

          {/* Video Library */}
          <Card className="bg-slate-700/50 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-blue-300">Video Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Weekly Coaching Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Deal Analysis Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Market Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Success Stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Q&A Sessions</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <div className="text-xs text-gray-400">🎥 New content weekly</div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-slate-700/50 border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-lg text-orange-300">Top Performers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      1
                    </div>
                    <span className="text-sm text-white">Alex Thompson</span>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    12 deals
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      2
                    </div>
                    <span className="text-sm text-white">Sarah Chen</span>
                  </div>
                  <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                    10 deals
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      3
                    </div>
                    <span className="text-sm text-white">Mike Rodriguez</span>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    8 deals
                  </Badge>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-600">
                <div className="text-xs text-gray-400">🏆 Updated monthly</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">1,247</div>
            <div className="text-sm text-gray-400">Active Members</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">3,892</div>
            <div className="text-sm text-gray-400">Deals Closed</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">$12.4M</div>
            <div className="text-sm text-gray-400">Revenue Generated</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">847</div>
            <div className="text-sm text-gray-400">Success Stories</div>
          </div>
        </div>

        {/* Upcoming Events */}
        <Card className="bg-slate-700/30 border-slate-600 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Community Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">Weekly Coaching Call</div>
                  <div className="text-sm text-gray-400">Tomorrow at 7:00 PM EST</div>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  Join Live
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">Market Analysis Workshop</div>
                  <div className="text-sm text-gray-400">Friday at 6:00 PM EST</div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Register
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">Success Stories Panel</div>
                  <div className="text-sm text-gray-400">Next Monday at 8:00 PM EST</div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  RSVP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};