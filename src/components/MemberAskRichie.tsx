import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, ChevronDown, ChevronUp, Clock, ExternalLink, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioRecorder, blobToBase64, playAudioFromBase64 } from '@/utils/audioRecorder';

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

export const MemberAskRichie = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState<{[key: string]: boolean}>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Stop any currently playing audio
  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      stopCurrentAudio(); // Stop any playing audio
      audioRecorderRef.current = new AudioRecorder();
      await audioRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording",
        description: "Speak your question now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop voice recording and transcribe
  const stopRecording = async () => {
    if (!audioRecorderRef.current) return;

    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const audioBlob = await audioRecorderRef.current.stop();
      const base64Audio = await blobToBase64(audioBlob);

      // Transcribe audio using our edge function
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data?.text) {
        setCurrentQuestion(data.text);
        toast({
          title: "Transcription Complete",
          description: "Your question has been transcribed. Click send to submit.",
        });
      } else {
        throw new Error('No text transcribed');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again or type your question.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      audioRecorderRef.current = null;
    }
  };

  // Speak the answer using text-to-speech
  const speakAnswer = async (text: string, messageId?: string) => {
    if (!text.trim() || !voiceEnabled) return;

    try {
      stopCurrentAudio(); // Stop any currently playing audio
      setIsSpeaking(true);
      if (messageId) setSpeakingMessageId(messageId);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: '9BWtsMINqrJLrRacOk9x' // Aria voice - very natural
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audioData = `data:audio/mpeg;base64,${data.audioContent}`;
        const audio = new Audio(audioData);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          currentAudioRef.current = null;
        };
        
        audio.onerror = (e) => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          currentAudioRef.current = null;
          throw new Error('Failed to play audio');
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      toast({
        title: "Audio Error",
        description: "Failed to play audio response.",
        variant: "destructive"
      });
    }
  };

  const askRichie = async () => {
    if (!currentQuestion.trim() || !user || isLoading) return;

    setIsLoading(true);
    stopCurrentAudio(); // Stop any playing audio
    const questionId = Date.now().toString();

    try {
      const { data, error } = await supabase.functions.invoke('ask-richie', {
        body: {
          question: currentQuestion.trim()
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response');
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

      // Automatically speak the answer if voice is enabled
      if (voiceEnabled && data.answer) {
        setTimeout(() => {
          speakAnswer(data.answer, questionId);
        }, 800);
      }

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
              RM
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white text-lg font-semibold">Ask AI Richie</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`${voiceEnabled ? 'text-cyan-400' : 'text-gray-500'} hover:text-cyan-300`}
            title={voiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled'}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

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
                <div className="flex items-start justify-between">
                  <div 
                    className="text-sm whitespace-pre-wrap flex-1"
                    dangerouslySetInnerHTML={{ 
                      __html: formatAnswer(message.answer) 
                    }}
                  />
                  {/* Voice Controls */}
                  <div className="flex items-center gap-1 ml-2">
                    {speakingMessageId === message.id && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Volume2 className="w-3 h-3 animate-pulse" />
                      </div>
                    )}
                    {voiceEnabled && speakingMessageId !== message.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakAnswer(message.answer, message.id)}
                        className="text-cyan-400 hover:text-cyan-300 p-1 h-auto"
                        title="Read answer aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                    {speakingMessageId === message.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopCurrentAudio}
                        className="text-red-400 hover:text-red-300 p-1 h-auto"
                        title="Stop speaking"
                      >
                        <VolumeX className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <Collapsible 
                    open={sourcesOpen[message.id]} 
                    onOpenChange={() => toggleSources(message.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="mt-2 p-1 h-auto text-cyan-400 hover:text-cyan-300 text-xs"
                      >
                        <span className="mr-1">Sources ({message.sources.length})</span>
                        {sourcesOpen[message.id] ? 
                          <ChevronUp className="h-3 w-3" /> : 
                          <ChevronDown className="h-3 w-3" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="text-xs text-gray-400 bg-slate-600/30 p-2 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-cyan-300">{source.title}</span>
                              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                {source.docType}
                              </Badge>
                            </div>
                            <p className="mt-1 text-gray-300">{source.reference}</p>
                            {source.url && (
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-1 text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                              >
                                <span>View source</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Metadata */}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.tokensUsed && (
                    <span>• {message.tokensUsed} tokens</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-cyan-500/20 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Richie about rental arbitrage..."
              disabled={isLoading || isTranscribing}
              className="bg-slate-700 border-cyan-500/30 text-white placeholder:text-gray-400"
            />
          </div>
          
          {/* Voice Input */}
          <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || isTranscribing}
            className={`border-cyan-500/30 ${isRecording ? 'bg-red-500/20 text-red-400' : 'text-cyan-400'} hover:bg-cyan-500/10`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isTranscribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {/* Send Button */}
          <Button 
            onClick={askRichie}
            disabled={!currentQuestion.trim() || isLoading || isTranscribing}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};