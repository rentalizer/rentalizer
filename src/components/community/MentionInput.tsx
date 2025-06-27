
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useMentions, User } from '@/hooks/useMentions';
import { cn } from '@/lib/utils';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}

export const MentionInput = ({ 
  value, 
  onChange, 
  placeholder = "Type your message...", 
  className,
  disabled = false,
  minHeight = "100px"
}: MentionInputProps) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { filteredUsers, filterUsers } = useMentions();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPosition);
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

      if (mentionMatch) {
        const query = mentionMatch[1];
        setMentionQuery(query);
        filterUsers(query);
        setShowMentions(true);
        setSelectedMentionIndex(0);

        // Calculate position for dropdown
        const rect = textarea.getBoundingClientRect();
        const lineHeight = 24; // Approximate line height
        const lines = textBeforeCursor.split('\n').length;
        setMentionPosition({
          top: rect.top + (lines * lineHeight) + 30,
          left: rect.left + 10,
        });
      } else {
        setShowMentions(false);
      }
    };

    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('selectionchange', handleInput);

    return () => {
      textarea.removeEventListener('input', handleInput);
      textarea.removeEventListener('selectionchange', handleInput);
    };
  }, [value, filterUsers]);

  const insertMention = (user: User) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Find the @ symbol position
    const mentionStartIndex = textBeforeCursor.lastIndexOf('@');
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = textAfterCursor;
    
    const newValue = `${beforeMention}@${user.name} ${afterMention}`;
    onChange(newValue);
    setShowMentions(false);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = mentionStartIndex + user.name.length + 2;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMentions || filteredUsers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          insertMention(filteredUsers[selectedMentionIndex]);
        }
        break;
      case 'Escape':
        setShowMentions(false);
        break;
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(className)}
        disabled={disabled}
        style={{ minHeight }}
      />
      
      {showMentions && filteredUsers.length > 0 && (
        <Card 
          className="absolute z-50 bg-slate-800 border-cyan-500/20 shadow-lg max-w-xs"
          style={{
            top: mentionPosition.top,
            left: mentionPosition.left,
          }}
        >
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                    index === selectedMentionIndex 
                      ? "bg-cyan-600/20 text-cyan-300" 
                      : "hover:bg-slate-700/50 text-gray-300"
                  )}
                  onClick={() => insertMention(user)}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.avatar}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
