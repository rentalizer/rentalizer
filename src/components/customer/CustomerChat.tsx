
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, Bot, Sparkles } from 'lucide-react';
import { useKnowledgeBase } from '@/contexts/KnowledgeBaseContext';
import { KnowledgeBaseService } from '@/services/knowledgeBaseService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const CustomerChat = () => {
  const { videos } = useKnowledgeBase();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI assistant trained on Richie's rental arbitrage expertise. I can help you with property selection, the 3X strategy, automation, scaling, and much more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    KnowledgeBaseService.setVideos(videos);
  }, [videos]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = KnowledgeBaseService.generateResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const stats = KnowledgeBaseService.getStats();

  const suggestedQuestions = [
    "How do I find good rental arbitrage properties?",
    "What is the 3X strategy?",
    "How do I automate guest communication?",
    "What are the key metrics to track?",
    "How do I scale my rental arbitrage business?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
              <Sparkles className="h-6 w-6 text-blue-500" />
              Ask Richie - Rental Arbitrage Expert
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Get instant answers from Richie's proven rental arbitrage strategies and experience
            </p>
            {stats.totalVideos > 0 && (
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {stats.totalVideos} Knowledge Sources
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.totalTopics} Topics Available
                </Badge>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-[600px]">
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-900 border'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0 order-3 mt-1">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      className="text-xs bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t bg-white p-6">
              <div className="flex gap-3">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about rental arbitrage, property selection, automation, scaling..."
                  className="flex-1 min-h-[60px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 h-auto shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
