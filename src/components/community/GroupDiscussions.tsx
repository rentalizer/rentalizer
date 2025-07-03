
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Search, MessageCircle, Heart, Pin, TrendingUp, Calendar, Filter } from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isPinned?: boolean;
  isLiked?: boolean;
}

export const GroupDiscussions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const discussions: Discussion[] = [
    {
      id: '1',
      title: 'Welcome aboard!',
      content: "We're thrilled to have you join our vibrant community of rental entrepreneurs! 🎉 Whether you're a seasoned host or just starting out, you're in the right place to learn, connect, and grow together. Here's a...",
      author: 'Richie Matthews',
      avatar: 'RM',
      category: 'General',
      likes: 40,
      comments: 59,
      timeAgo: 'Feb 24',
      isPinned: true
    },
    {
      id: '2',
      title: 'Market Analysis Question',
      content: 'When doing market analysis on AirDNA, are we still adjusting the performance price tiers to Midscale/upscale? or are we not bothering with that anymore? I didn\'t see it on the Marketing Research...',
      author: 'The Dan Rogul',
      avatar: 'DR',
      category: 'General',
      likes: 0,
      comments: 0,
      timeAgo: '1h'
    },
    {
      id: '3',
      title: 'Hello from Virginia',
      content: 'Hello everyone! I just joined today. I\'m from the Virginia area (DMV). I\'m truly excited to be part of the Rental Arbitrage University and look forward to learning, collaborating, and growing our businesses...',
      author: 'Lincoln Khan',
      avatar: 'LK',
      category: 'General',
      likes: 0,
      comments: 0,
      timeAgo: '3h'
    },
    {
      id: '4',
      title: 'Best Furniture Sourcing Strategies',
      content: 'Managing 5 properties now and looking for bulk purchasing options. What are your go-to sources for affordable, durable furniture that guests love?',
      author: 'Maria Johnson',
      avatar: 'MJ',
      category: 'Resource Library',
      likes: 15,
      comments: 23,
      timeAgo: '1d'
    },
    {
      id: '5',
      title: 'First month: $3,200 profit from Phoenix property',
      content: 'Breakdown of numbers and lessons learned from my first deal. Happy to share the details and answer any questions!',
      author: 'David Kim',
      avatar: 'DK',
      category: 'Success Stories',
      likes: 67,
      comments: 34,
      timeAgo: '2d'
    }
  ];

  const filters = ['All', 'General discussion', 'Resource Library', 'Success Stories', 'Share Your Wins', 'More...'];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
                         (selectedFilter === 'General discussion' && discussion.category === 'General') ||
                         (selectedFilter === discussion.category);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Post Input */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              YOU
            </div>
            <Input
              placeholder="Write something"
              className="flex-1 bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events Banner */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-300" />
            <div className="flex-1">
              <span className="text-blue-300 font-medium">Property Acquisitions</span>
              <span className="text-gray-300 ml-2">is happening in 8 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter
                ? "bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                : "border-gray-600 text-gray-300 hover:bg-gray-800 whitespace-nowrap"
            }
          >
            {filter}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Discussion Posts */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {discussion.avatar}
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  {/* Header with Pin and Author */}
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.isPinned && (
                      <Pin className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-cyan-300 font-medium">{discussion.author}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{discussion.timeAgo}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{discussion.category}</span>
                    {discussion.isPinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs ml-2">
                        Pinned
                      </Badge>
                    )}
                  </div>

                  {/* Post Title */}
                  <h3 className="text-xl font-semibold text-white mb-3 hover:text-cyan-300 transition-colors">
                    {discussion.title}
                  </h3>

                  {/* Post Content Preview */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {discussion.content}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex items-center gap-2 hover:bg-red-500/10 ${discussion.isLiked ? 'text-red-400' : 'text-gray-400'}`}
                    >
                      <Heart className={`h-4 w-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
                      {discussion.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300">
                      <MessageCircle className="h-4 w-4" />
                      {discussion.comments}
                    </Button>

                    {/* Avatar Stack for Commenters */}
                    {discussion.comments > 0 && (
                      <div className="flex -space-x-2 ml-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-slate-800"></div>
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-slate-800"></div>
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-slate-800"></div>
                        {discussion.comments > 3 && (
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-xs text-white font-medium">+</span>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-gray-500 text-sm ml-auto">
                      Last comment {discussion.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="bg-slate-800/50 border-gray-700/50">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No discussions found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
