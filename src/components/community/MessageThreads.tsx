
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Pin, Reply, Heart, Send } from 'lucide-react';

interface Message {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  replies: number;
  likes: number;
  isPinned?: boolean;
  tags: string[];
}

export const MessageThreads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      author: 'Richie Matthews',
      avatar: 'RM',
      title: 'Welcome to the Community!',
      content: 'Welcome everyone to our Rental Arbitrage University community! This is your space to connect, share experiences, and learn from each other...',
      timestamp: '2h ago',
      replies: 23,
      likes: 45,
      isPinned: true,
      tags: ['welcome', 'announcement']
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      avatar: 'SJ',
      title: 'Best practices for market research?',
      content: 'I\'m new to rental arbitrage and wondering what tools and methods you all use for market research. Any recommendations?',
      timestamp: '4h ago',
      replies: 12,
      likes: 18,
      tags: ['market-research', 'beginners']
    },
    {
      id: '3',
      author: 'Mike Chen',
      avatar: 'MC',
      title: 'Successful deal in Austin - Case Study',
      content: 'Just closed a great deal in Austin! Here\'s a breakdown of the numbers and how I found this property...',
      timestamp: '1d ago',
      replies: 31,
      likes: 67,
      tags: ['case-study', 'austin', 'success']
    },
    {
      id: '4',
      author: 'Lisa Rodriguez',
      avatar: 'LR',
      title: 'Furnishing on a budget - Tips & Tricks',
      content: 'Sharing some cost-effective furnishing strategies that have worked well for my properties...',
      timestamp: '2d ago',
      replies: 19,
      likes: 34,
      tags: ['furnishing', 'budget', 'tips']
    },
    {
      id: '5',
      author: 'David Kim',
      avatar: 'DK',
      title: 'Dealing with difficult landlords',
      content: 'Has anyone dealt with landlords who are hesitant about subleasing? Looking for negotiation strategies...',
      timestamp: '3d ago',
      replies: 15,
      likes: 22,
      tags: ['landlords', 'negotiation', 'help']
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Here you would typically send the comment to your backend
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Message Threads</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {messages.length} threads
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search threads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
        />
      </div>

      {/* Comment Input Field */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts with the community..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Threads */}
      <div className="space-y-4">
        {filteredMessages.map(message => (
          <Card key={message.id} className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {message.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {message.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                      <h3 className="font-semibold text-white hover:text-cyan-300 cursor-pointer">
                        {message.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-400 flex-shrink-0">{message.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-cyan-300">{message.author}</span>
                    {message.isPinned && (
                      <Badge variant="outline" className="border-yellow-500/30 text-yellow-300 text-xs">
                        Pinned
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-300 mb-3 line-clamp-2">{message.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {message.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="border-purple-500/30 text-purple-300 text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-cyan-300 h-8 px-2"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      {message.replies} replies
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-red-300 h-8 px-2"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {message.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No threads found</h3>
            <p className="text-gray-400">Try adjusting your search terms or start a new discussion</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
