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
import { LeadCapture } from './LeadCapture';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [questionsRemaining, setQuestionsRemaining] = useState(0);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Only show on home page for non-logged-in users
  const shouldShow = !user && (window.location.pathname === '/' || window.location.pathname === '/landing');

  // If shouldn't show, return null
  if (!shouldShow) {
    return null;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Check lead usage for rate limiting
  const checkLeadUsage = async (leadCaptureId: string) => {
    try {
      const { data: lead, error } = await supabase
        .from('lead_captures')
        .select('total_questions_asked')
        .eq('id', leadCaptureId)
        .single();

      if (error) throw error;
      
      const remaining = Math.max(0, 10 - (lead?.total_questions_asked || 0));
      setQuestionsRemaining(remaining);
      return remaining;
    } catch (error) {
      console.error('Error checking lead usage:', error);
      return 0;
    }
  };

  const handleLeadCaptureSuccess = (leadCaptureId: string) => {
    setLeadId(leadCaptureId);
    setShowLeadCapture(false);
    checkLeadUsage(leadCaptureId);
  };

  const handleChatOpen = () => {
    if (!leadId) {
      setShowLeadCapture(true);
    } else {
      setIsOpen(true);
    }
  };

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
      
      console.log('🔄 Processing recorded audio...');
      const audioBlob = await audioRecorderRef.current.stop();
      console.log('📄 Converting to base64...');
      const base64Audio = await blobToBase64(audioBlob);
      console.log('🚀 Sending to speech-to-text function...');

      // Transcribe audio using our edge function
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      console.log('📨 Function response:', { data, error });

      if (error) {
        console.error('❌ Function error:', error);
        throw error;
      }

      if (data?.text) {
        console.log('✅ Transcription successful:', data.text);
        setCurrentQuestion(data.text);
        toast({
          title: "Transcription Complete",
          description: "Your question has been transcribed. Click send to submit.",
        });
      } else {
        console.error('❌ No text in response:', data);
        throw new Error('No text transcribed');
      }
    } catch (error) {
      console.error('❌ Error transcribing audio:', error);
      toast({
        title: "Transcription Error",
        description: error.message || "Failed to transcribe audio. Please try again or type your question.",
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
      console.log('🎵 Starting TTS for text:', text.substring(0, 50) + '...');
      stopCurrentAudio(); // Stop any currently playing audio
      setIsSpeaking(true);
      if (messageId) setSpeakingMessageId(messageId);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: '9BWtsMINqrJLrRacOk9x' // Aria voice - very natural
        }
      });

      console.log('🎵 TTS response:', { data, error });

      if (error) {
        console.error('❌ TTS function error:', error);
        throw error;
      }

      if (data?.audioContent) {
        console.log('🔊 Playing audio response...');
        const audioData = `data:audio/mpeg;base64,${data.audioContent}`;
        const audio = new Audio(audioData);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          console.log('✅ Audio playback ended');
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          currentAudioRef.current = null;
        };
        
        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          currentAudioRef.current = null;
          throw new Error('Failed to play audio');
        };
        
        await audio.play();
        console.log('🎵 Audio started playing');
      } else {
        console.error('❌ No audio content in response:', data);
        throw new Error('No audio content received');
      }
    } catch (error) {
      console.error('❌ TTS Error:', error);
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
    if (!currentQuestion.trim() || !leadId || isLoading || questionsRemaining <= 0) return;

    // Limit question length for free users (500 characters)
    if (currentQuestion.length > 500) {
      toast({
        title: "Question Too Long",
        description: "Please limit your question to 500 characters for free access.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    stopCurrentAudio(); // Stop any playing audio
    const questionId = Date.now().toString();

    try {
      const { data, error } = await supabase.functions.invoke('ask-richie-lead', {
        body: {
          question: currentQuestion.trim(),
          leadId: leadId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response');
      }

      if (data.rateLimited) {
        toast({
          title: "Question Limit Reached",
          description: "You've used all 10 free questions. Contact us for more access!",
          variant: "destructive"
        });
        setQuestionsRemaining(0);
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
      setQuestionsRemaining(prev => Math.max(0, prev - 1));

      console.log('🎵 About to check voice settings - voiceEnabled:', voiceEnabled, 'answer:', !!data.answer);
      
      // Automatically speak the answer if voice is enabled
      if (voiceEnabled && data.answer) {
        console.log('🎵 Voice is enabled, starting TTS in 800ms...');
        // Small delay to let the user see the text first
        setTimeout(() => {
          console.log('🎵 Calling speakAnswer now...');
          speakAnswer(data.answer, questionId);
        }, 800);
      } else {
        console.log('❌ Voice not enabled or no answer - voiceEnabled:', voiceEnabled, 'hasAnswer:', !!data.answer);
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
    <>
      {/* Lead Capture Dialog */}
      <LeadCapture 
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSuccess={handleLeadCaptureSuccess}
      />

      {/* Ask Richie Button */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={handleChatOpen}
          className="relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full w-16 h-16 shadow-lg group"
          title="Ask AI Richie"
        >
          <Bot className="h-8 w-8" />
          {leadId && questionsRemaining > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 text-white"
            >
              {questionsRemaining}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed top-20 left-1/2 transform -translate-x-1/2 w-96 h-[600px] z-40 border-cyan-500/20 bg-slate-900/95 backdrop-blur-sm">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  ✕
                </Button>
              </div>
            </div>
            {leadId && (
              <div className="text-sm text-cyan-300 mt-2">
                Questions remaining: {questionsRemaining}/10
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
                        
                        {/* Sources - Hidden per user request */}

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

               {/* Recording status */}
               {isRecording && (
                 <div className="mx-4 mb-2 bg-red-600/20 border border-red-500/50 rounded-lg p-2 text-center">
                   <div className="flex items-center justify-center gap-2 text-red-400">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-xs font-medium">Recording... Click mic to stop</span>
                   </div>
                 </div>
               )}

               {/* Transcribing status */}
               {isTranscribing && (
                 <div className="mx-4 mb-2 bg-blue-600/20 border border-blue-500/50 rounded-lg p-2 text-center">
                   <div className="flex items-center justify-center gap-2 text-blue-400">
                     <Loader2 className="w-3 h-3 animate-spin" />
                     <span className="text-xs font-medium">Transcribing your voice...</span>
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
                   disabled={isLoading || isRecording || isTranscribing}
                 />
                 
                 {/* Voice recording button */}
                 <Button
                   type="button"
                   onClick={isRecording ? stopRecording : startRecording}
                   disabled={isLoading || isTranscribing}
                   className={`${
                     isRecording 
                       ? 'bg-red-600 hover:bg-red-500 animate-pulse' 
                       : 'bg-slate-600 hover:bg-slate-500'
                   }`}
                   title={isRecording ? 'Stop recording' : 'Start voice recording'}
                 >
                   {isTranscribing ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                   ) : isRecording ? (
                     <MicOff className="h-4 w-4" />
                   ) : (
                     <Mic className="h-4 w-4" />
                   )}
                 </Button>

                 <Button
                   onClick={askRichie}
                   disabled={!currentQuestion.trim() || isLoading || isRecording || isTranscribing}
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
          </CardContent>
        </Card>
      )}
    </>
  );
};