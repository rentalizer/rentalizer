
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle, User, Bot, Loader2, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessGate } from '@/components/AccessGate';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AskRichie = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hey there! I'm Richie's AI assistant, trained on all his rental arbitrage expertise. I'm here to help you with questions about starting and managing your rental business. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Call your AI assistant API here
      const response = await fetch('/api/ask-richie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
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

  return (
    <AccessGate
      requiredAccess="essentials"
      moduleName="Ask Richie AI"
      moduleDescription="Get instant answers to your rental arbitrage questions from Richie's AI assistant, trained on all his coaching materials and expertise."
      moduleIcon={<MessageCircle className="h-8 w-8 text-cyan-400" />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-cyan-400"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Ask Richie AI</h1>
                    <p className="text-sm text-gray-400">Your Personal Rental Arbitrage Coach</p>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                <Crown className="h-4 w-4 mr-1" />
                Premium Feature
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Chat Container */}
          <Card className="h-[calc(100vh-200px)] bg-slate-800/50 border-gray-700/50 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-cyan-300 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Richie's AI Assistant
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Trained on Richie's live coaching sessions, documents, and rental arbitrage expertise
              </p>
            </CardHeader>
            
            <CardContent className="flex flex-col h-full p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                            : 'bg-slate-700/50 text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="flex-shrink-0 order-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                        <span className="text-gray-400">Richie's AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700/50 p-6">
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Richie's AI about rental arbitrage, property management, scaling strategies..."
                    className="flex-1 bg-slate-700/50 border-gray-600/50 text-white placeholder-gray-400 min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 h-auto"
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

          {/* Quick Tips */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-cyan-300 mb-2">💡 Quick Tips</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Ask about property selection criteria</li>
                  <li>• Get help with pricing strategies</li>
                  <li>• Learn about automation tools</li>
                  <li>• Understand legal requirements</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-cyan-300 mb-2">🎯 Popular Questions</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "How do I find my first rental property?"</li>
                  <li>• "What's the best way to scale to 10 units?"</li>
                  <li>• "How should I handle difficult guests?"</li>
                  <li>• "What are the key metrics to track?"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccessGate>
  );
};

export default AskRichie;
