
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, MessageCircle, TrendingUp, Clock } from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  participants: number;
  messages: number;
  lastActivity: string;
  tags: string[];
  isHot?: boolean;
}

export const GroupDiscussions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const discussions: Discussion[] = [
    {
      id: '1',
      title: 'Market Analysis: Best Cities for 2025',
      author: 'John Smith',
      avatar: 'JS',
      category: 'Market Research',
      participants: 28,
      messages: 156,
      lastActivity: '5m ago',
      tags: ['market-analysis', '2025', 'cities'],
      isHot: true
    },
    {
      id: '3',
      title: 'LLC Formation for Rental Business',
      author: 'Robert Wilson',
      avatar: 'RW',
      category: 'Business Formation',
      participants: 34,
      messages: 203,
      lastActivity: '2h ago',
      tags: ['llc', 'business', 'formation'],
      isHot: true
    },
    {
      id: '5',
      title: 'Scaling Your Portfolio: Growth Strategies',
      author: 'Alex Thompson',
      avatar: 'AT',
      category: 'Business Formation',
      participants: 52,
      messages: 334,
      lastActivity: '4h ago',
      tags: ['scaling', 'portfolio', 'growth']
    },
    {
      id: '6',
      title: 'Guest Communication Best Practices',
      author: 'Sophie Lee',
      avatar: 'SL',
      category: 'Operations',
      participants: 37,
      messages: 178,
      lastActivity: '6h ago',
      tags: ['communication', 'guests', 'service']
    }
  ];

  const categories = ['all', 'Market Research', 'Business Formation', 'Operations'];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Market Research': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Business Formation': 'bg-orange-500/20 border-orange-500/30 text-orange-300',
      'Operations': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Group Discussions</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {discussions.length} active
          </Badge>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 whitespace-nowrap"
              }
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Discussions Grid */}
      <div className="grid gap-4">
        {filteredDiscussions.map(discussion => (
          <Card key={discussion.id} className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {discussion.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white hover:text-cyan-300 transition-colors">
                        {discussion.title}
                      </h3>
                      {discussion.isHot && (
                        <Badge className="bg-red-500/20 border-red-500/30 text-red-300">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-cyan-300">{discussion.author}</span>
                      <Badge className={getCategoryColor(discussion.category)}>
                        {discussion.category}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {discussion.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-300 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {discussion.participants} participants
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.messages} messages
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {discussion.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No discussions found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
