import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Medal, Award, Users } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  badge?: string;
  isAdmin?: boolean;
}

export const CommunityLeaderboard = () => {
  // Mock leaderboard data - this would come from the database in a real implementation
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Richie Matthews',
      avatar: 'RM',
      points: 150,
      rank: 1,
      badge: 'Top Contributor',
      isAdmin: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      points: 125,
      rank: 2,
      badge: 'Rising Star'
    },
    {
      id: '3',
      name: 'Mike Chen',
      avatar: 'MC',
      points: 110,
      rank: 3,
      badge: 'Consistent'
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: 'ED',
      points: 95,
      rank: 4
    },
    {
      id: '5',
      name: 'Alex Rodriguez',
      avatar: 'AR',
      points: 88,
      rank: 5
    },
    {
      id: '6',
      name: 'Lisa Park',
      avatar: 'LP',
      points: 82,
      rank: 6
    },
    {
      id: '7',
      name: 'David Kim',
      avatar: 'DK',
      points: 75,
      rank: 7
    },
    {
      id: '8',
      name: 'Jennifer Wilson',
      avatar: 'JW',
      points: 68,
      rank: 8
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-amber-600/30';
      default:
        return 'bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-cyan-400" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              30-Day Leaderboard
            </CardTitle>
          </div>
          <p className="text-gray-300">
            Earn points through posts, comments, and community engagement
          </p>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{leaderboardData.length}</div>
            <div className="text-sm text-gray-400">Active Members</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{leaderboardData[0]?.points || 0}</div>
            <div className="text-sm text-gray-400">Top Score</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round(leaderboardData.reduce((sum, entry) => sum + entry.points, 0) / leaderboardData.length)}
            </div>
            <div className="text-sm text-gray-400">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="bg-slate-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-4">
            {leaderboardData.map((entry) => (
              <Card 
                key={entry.id} 
                className={`transition-all duration-200 cursor-pointer ${getRankStyle(entry.rank)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name and Admin Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">
                          {entry.name}
                        </span>
                        {entry.isAdmin && (
                          <Badge className="bg-red-600/20 text-red-300 border-red-500/30 text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      {entry.badge && (
                        <Badge 
                          variant="outline" 
                          className="border-cyan-500/30 text-cyan-300 text-xs mt-1"
                        >
                          {entry.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-300">
                        {entry.points}
                      </div>
                      <div className="text-xs text-gray-400">
                        points
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="bg-slate-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Create a post</span>
            <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
              +10 pts
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Write a comment</span>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              +5 pts
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Receive a like</span>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              +2 pts
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Daily login</span>
            <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
              +1 pt
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};