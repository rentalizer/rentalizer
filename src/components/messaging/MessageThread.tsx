import { useState, useEffect, useRef } from 'react';
import { User, Send, Paperclip, MoreVertical, Clock, Check, CheckCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Message as ApiMessage } from '@/services/messagingService';
import { formatDateWithTimezone } from '@/utils/timezone';

export interface Message {
  _id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  sender_name: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  support_category: 'general' | 'technical' | 'billing' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  read_at: string | null;
  created_at: string;
  updated_at: string;
  // Fallback for old field names
  createdAt?: string;
  updatedAt?: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void;
  recipientName: string;
  recipientAvatar?: string;
  isOnline: boolean;
  recipientId?: string;
  onMarkAsRead?: () => void;
}

export default function MessageThread({
  messages,
  currentUserId,
  isTyping,
  onSendMessage,
  onFileUpload,
  recipientName,
  recipientAvatar,
  isOnline,
  recipientId,
  onMarkAsRead
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  const formatLastMessageTime = (timestamp: string) => {
    try {
      if (!timestamp) {
        console.warn('Empty timestamp provided to formatLastMessageTime');
        return 'Unknown time';
      }
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp provided to formatLastMessageTime:', timestamp);
        return 'Unknown time';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.warn('Error formatting timestamp:', timestamp, error);
      return 'Unknown time';
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messages.length > 0 && onMarkAsRead) {
      const hasUnreadMessages = messages.some(msg => 
        msg.recipient_id === currentUserId && !msg.read_at
      );
      if (hasUnreadMessages) {
        onMarkAsRead();
      }
    }
  }, [messages, currentUserId, onMarkAsRead]);

  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    
    onSendMessage(trimmed);
    setNewMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onFileUpload) return;

    setIsUploading(true);
    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700">
        <div className="relative">
          {/* Group Avatar - 2 overlapping avatars */}
          <div className="relative flex items-center">
            {/* First avatar */}
            <div className="relative z-20">
              <Avatar className="h-8 w-8 border-2 border-slate-800">
                <AvatarImage 
                  src="/admin/adminRetalizer.jpg" 
                  alt="Admin 1"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs">
                  A1
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Second avatar (slightly overlapping) */}
            <div className="relative -ml-3 z-10">
              <Avatar className="h-8 w-8 border-2 border-slate-800">
                <AvatarImage 
                  src="/admin/adminRentalizer2.jpg" 
                  alt="Admin 2"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs">
                  A2
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-slate-800 rounded-full" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-white text-sm">{recipientName}</h3>
          <p className="text-xs text-slate-400">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            const isRead = !!message.read_at;
            
            // Debug logging
            console.log('Message alignment check:', {
              messageId: message._id,
              sender_id: message.sender_id,
              currentUserId: currentUserId,
              isOwn: isOwn,
              message: message.message
            });
            
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isOwn ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      isOwn
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  
                  {/* Message metadata */}
                  <div className={`flex items-center gap-1 mt-1 text-xs text-slate-400 ${
                    isOwn ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <span title={formatDateWithTimezone(message.created_at || message.createdAt || '')}>
                      {formatLastMessageTime(message.created_at || message.createdAt || '')}
                    </span>
                    
                    {/* Read status for own messages */}
                    {isOwn && (
                      <div className="flex items-center">
                        {isRead ? (
                          <CheckCheck className="h-3 w-3 text-blue-400" />
                        ) : (
                          <Check className="h-3 w-3 text-slate-500" />
                        )}
                      </div>
                    )}
                    
                    {/* Support category badge for admin messages */}
                    {!isOwn && message.support_category !== 'general' && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1 py-0.5 h-4 border-slate-500/30 text-slate-400"
                      >
                        {message.support_category}
                      </Badge>
                    )}
                    
                    {/* Priority indicator */}
                    {message.priority === 'high' || message.priority === 'urgent' ? (
                      <div className={`w-2 h-2 rounded-full ${
                        message.priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">Start a conversation</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Send a message to {recipientName} to start the conversation.
                </p>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            disabled={isUploading}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !onFileUpload}
            className="border-slate-600"
          >
            <Paperclip className="h-4 w-4" />
          </Button> */}
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isUploading}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}