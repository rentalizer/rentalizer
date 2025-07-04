import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Calendar, Users, ArrowLeft } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  badge?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
}

export default function FullLeaderboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('30-day');

  const sevenDayData: LeaderboardEntry[] = [
    { id: '1', name: 'Mc Calhoun', avatar: 'MC', points: 4, rank: 1 },
    { id: '2', name: 'Lynn Lueders', avatar: 'LL', points: 3, rank: 2 },
    { id: '3', name: 'Lincoln Khan', avatar: 'LK', points: 2, rank: 3 },
    { id: '4', name: 'Mike Zaldivar', avatar: 'MZ', points: 2, rank: 4 },
    { id: '5', name: 'The Dan Rogul', avatar: 'DR', points: 1, rank: 5 },
  ];

  const thirtyDayData: LeaderboardEntry[] = [
    { id: '1', name: 'Judith Dreher', avatar: 'JD', points: 9, rank: 1 },
    { id: '2', name: 'Lynn Lueders', avatar: 'LL', points: 7, rank: 2 },
    { id: '3', name: 'Edward Badal', avatar: 'EB', points: 6, rank: 3 },
    { id: '4', name: 'Lonnie Castillon', avatar: 'LC', points: 6, rank: 4 },
    { id: '5', name: 'Mc Calhoun', avatar: 'MC', points: 4, rank: 5 },
  ];

  const allTimeData: LeaderboardEntry[] = [
    { id: '0', name: 'Richie Matthews', avatar: 'RM', points: 150, rank: 1, isAdmin: true, avatarUrl: '/lovable-uploads/4cae85e1-7ac3-4a4b-989d-c4cb8ecca460.png' },
    { id: '1', name: 'Edward Badal', avatar: 'EB', points: 91, rank: 2 },
    { id: '2', name: 'Max Sneary', avatar: 'MS', points: 48, rank: 3 },
    { id: '3', name: 'Becky Ta', avatar: 'BT', points: 40, rank: 4 },
    { id: '4', name: 'Jamaal Warren', avatar: 'JW', points: 38, rank: 5 },
    { id: '5', name: 'Misty Hailey', avatar: 'MH', points: 18, rank: 6 },
    { id: '6', name: 'Nate Taylor', avatar: 'NT', points: 18, rank: 7 },
    { id: '7', name: 'Reyna Hernandez', avatar: 'RH', points: 14, rank: 8 },
    { id: '8', name: 'Sheri Alley', avatar: 'SA', points: 14, rank: 9 },
    { id: '9', name: 'Dina Burow', avatar: 'DB', points: 12, rank: 10 },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case '7-day': return sevenDayData;
      case '30-day': return thirtyDayData;
      case 'all-time': return allTimeData;
      default: return thirtyDayData;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">1</div>;
      case 2:
        return <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-sm">2</div>;
      case 3:
        return <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-sm">3</div>;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopNavBar />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/community')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Leaderboards
            </h1>
            <p className="text-gray-400 mt-2">Community rankings and achievements</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: '7-day', label: 'Leaderboard (7-day)', count: sevenDayData.length },
            { id: '30-day', label: 'Leaderboard (30-day)', count: thirtyDayData.length },
            { id: 'all-time', label: 'Leaderboard (all-time)', count: allTimeData.length }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Leaderboard */}
        <Card className="bg-slate-800/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              {getCurrentData().map((entry) => (
                <Card 
                  key={entry.id} 
                  className={`transition-all duration-200 ${getRankStyle(entry.rank)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-12 h-12">
                        {entry.avatarUrl ? (
                          <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
                            {entry.avatar}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Name and Admin Badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg truncate">
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
                        <div className="text-xl font-bold text-gray-400">
                          +{entry.points}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}