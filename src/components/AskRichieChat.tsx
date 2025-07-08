import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, ChevronDown, ChevronUp, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    docType: string;
    url?: string;
    reference: string;
  }>;
  timestamp: string;
  tokensUsed?: number;
}

export const AskRichieChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState<{[key: string]: boolean}>({});
  const [dailyUsage, setDailyUsage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check daily usage for rate limiting
  useEffect(() => {
    if (user && isOpen) {
      checkDailyUsage();
    }
  }, [user, isOpen]);

  const checkDailyUsage = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('richie_chat_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);

    setDailyUsage(count || 0);
  };

  const askRichie = async () => {
    if (!currentQuestion.trim() || !user || isLoading) return;

    setIsLoading(true);
    const questionId = Date.now().toString();

    try {
      const { data, error } = await supabase.functions.invoke('ask-richie', {
        body: {
          question: currentQuestion.trim(),
          userId: user.id
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response');
      }

      if (data.rateLimited) {
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your 25 questions per day. Upgrade to Pro for unlimited access.",
          variant: "destructive"
        });
        return;
      }

      if (data.noContent) {
        toast({
          title: "Knowledge Base Empty",
          description: "No training content available yet. Please check back later.",
          variant: "destructive"
        });
        return;
      }

      const newMessage: ChatMessage = {
        id: questionId,
        question: currentQuestion.trim(),
        answer: data.answer,
        sources: data.sources || [],
        timestamp: data.timestamp,
        tokensUsed: data.tokensUsed
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentQuestion('');
      setDailyUsage(prev => prev + 1);

    } catch (error) {
      console.error('Error asking Richie:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Richie. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askRichie();
    }
  };

  const toggleSources = (messageId: string) => {
    setSourcesOpen(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const formatAnswer = (text: string) => {
    // Convert bullet points and special formatting
    return text
      .replace(/^•\s/gm, '• ')
      .replace(/^⇒\s/gm, '⇒ ')
      .replace(/\[doc-(\d+):\s*([^\]]+)\]/g, '<span class="text-cyan-400 font-medium">[doc-$1: $2]</span>');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Ask Richie Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full w-16 h-16 shadow-lg group"
          title="Ask AI Richie"
        >
          <Bot className="h-8 w-8" />
          {dailyUsage > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 text-white"
            >
              {dailyUsage}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-36 right-4 w-96 h-[600px] z-40 border-cyan-500/20 bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-cyan-500/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                    RM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white text-lg">Ask AI Richie</CardTitle>
                  <p className="text-cyan-300 text-sm">Rental Arbitrage Expert</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-cyan-300 hover:text-cyan-200"
              >
                ✕
              </Button>
            </div>
            {user.subscription_status === 'trial' && (
              <div className="text-sm text-orange-300 mt-2">
                Free: {dailyUsage}/25 questions today
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 h-[480px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-cyan-500" />
                  <p className="text-sm">Ask me anything about rental arbitrage!</p>
                  <p className="text-xs mt-1">I'll answer based on Richie's training materials.</p>
                </div>
              )}

              {messages.map(message => (
                <div key={message.id} className="space-y-3">
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">{message.question}</p>
                    </div>
                  </div>

                  {/* Richie's Answer */}
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-gray-300 p-3 rounded-lg max-w-[85%]">
                      <div 
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: formatAnswer(message.answer) 
                        }}
                      />
                      
                      {/* Sources */}
                      {message.sources.length > 0 && (
                        <Collapsible 
                          open={sourcesOpen[message.id]} 
                          onOpenChange={() => toggleSources(message.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                            >
                              <span className="text-xs">
                                Sources ({message.sources.length})
                              </span>
                              {sourcesOpen[message.id] ? (
                                <ChevronUp className="h-3 w-3 ml-1" />
                              ) : (
                                <ChevronDown className="h-3 w-3 ml-1" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-1">
                            {message.sources.map(source => (
                              <div 
                                key={source.id} 
                                className="text-xs text-gray-400 flex items-center gap-2"
                              >
                                <span className="text-cyan-400">{source.reference}:</span>
                                <span>{source.title}</span>
                                {source.url && (
                                  <ExternalLink className="h-3 w-3" />
                                )}
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-gray-300 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Richie is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about rental arbitrage..."
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
                <Button
                  onClick={askRichie}
                  disabled={!currentQuestion.trim() || isLoading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};