import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Edit, Trash2, Check, X, MoreHorizontal, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DiscussionType } from './GroupDiscussions';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { getSocket } from '@/services/socket';

interface Comment {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
  avatar: string;
  avatarUrl?: string | null;
  userId?: string;
  isEdited?: boolean;
  editedAt?: string;
}

interface CommentsDialogProps {
  discussion: DiscussionType;
  comments: Comment[];
  newComment: string;
  onCommentChange: (comment: string) => void;
  onAddComment: () => void;
  onDiscussionSelect: (discussion: DiscussionType) => void;
  getUserAvatar: () => string | null;
  getUserInitials: () => string;
  onCommentUpdate?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
}

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  discussion,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onDiscussionSelect,
  getUserAvatar,
  getUserInitials,
  onCommentUpdate,
  onCommentDelete
}) => {
  const { user } = useAuth();
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const previousCommentsLength = useRef(comments.length);

  // Scroll to bottom when comments change
  const scrollToBottom = useCallback(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
    setShowNewMessagesButton(false);
  }, []);

  // Check if user is at bottom of scroll
  const checkIfAtBottom = useCallback(() => {
    if (!commentsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
    const threshold = 100; // pixels from bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < threshold;
    setIsAtBottom(atBottom);
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // Always scroll to bottom when dialog opens
  useEffect(() => {
    if (dialogOpen && comments.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } else if (!dialogOpen) {
      // Reset state when dialog closes
      setShowNewMessagesButton(false);
      setIsAtBottom(true);
    }
  }, [dialogOpen, comments.length, scrollToBottom]);

  // Auto-scroll when new comments are added
  useEffect(() => {
    const commentsLength = comments.length;
    const hasNewComments = commentsLength > previousCommentsLength.current;
    
    if (hasNewComments) {
      if (isAtBottom) {
        // User is at bottom, auto-scroll to show new comments
        scrollToBottom();
      } else {
        // User is not at bottom, show "new messages" button
        setShowNewMessagesButton(true);
      }
    }
    
    previousCommentsLength.current = commentsLength;
  }, [comments.length, isAtBottom, scrollToBottom]);

  // Check if current user can edit/delete a comment
  const canEditOrDelete = useCallback((comment: Comment) => {
    if (!user) return false;
    // User can edit/delete their own comments
    return comment.userId === user.id;
  }, [user]);

  // Handle starting edit
  const handleStartEdit = useCallback((comment: Comment) => {
    const normalizedId = comment.id || (comment as Comment & { _id?: string })._id;
    console.log('🔍 Starting edit for comment:', comment);
    console.log('🔍 Comment ID (normalized):', normalizedId);
    setEditingComment(normalizedId);
    setEditContent(comment.content);
  }, []);

  // Handle canceling edit
  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
    setEditContent('');
    setSavingEdit(false);
  }, []);

  // Handle saving edit
  const handleSaveEdit = useCallback(async () => {
    if (!editContent.trim() || !editingComment) return;
    
    const commentId = editingComment;
    console.log('💾 Saving edit for comment ID:', commentId);
    console.log('💾 Edit content:', editContent.trim());
    
    setSavingEdit(true);
    try {
      // Update via API
      await apiService.updateComment(commentId, editContent.trim());
      
      // Call parent callback if provided
      if (onCommentUpdate) {
        onCommentUpdate(commentId, editContent.trim());
      }
      
      handleCancelEdit();
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setSavingEdit(false);
    }
  }, [editContent, editingComment, onCommentUpdate, handleCancelEdit]);

  // Handle deleting comment
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setDeletingComment(commentId);
    try {
      // Delete via API
      await apiService.deleteComment(commentId);
      
      // Call parent callback if provided
      if (onCommentDelete) {
        onCommentDelete(commentId);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingComment(null);
    }
  }, [onCommentDelete]);
  return (
    <Dialog onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDiscussionSelect(discussion)}
          className="flex items-center gap-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {discussion.comments}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-gray-700 w-full max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-hidden flex flex-col p-4 sm:max-w-2xl sm:max-h-[80vh] sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-white">Comments - {discussion.title}</DialogTitle>
        </DialogHeader>
        
        <div 
          ref={commentsContainerRef}
          className="flex-1 overflow-y-auto space-y-4 min-h-0 relative"
          onScroll={handleScroll}
        >
          {comments?.map((comment, index) => (
            <div key={comment.id || `${comment.author}-${index}`} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                {comment.avatarUrl ? (
                  <AvatarImage 
                    src={comment.avatarUrl} 
                    alt={comment.author}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm">
                  {comment.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-medium text-sm">{comment.author}</span>
                    <span className="text-gray-400 text-xs">{comment.timeAgo}</span>
                    {comment.isEdited && (
                      <span className="text-gray-500 text-xs">(edited)</span>
                    )}
                  </div>
                  
                  {/* Edit/Delete Menu - Only show for comment author */}
                  {canEditOrDelete(comment) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          disabled={savingEdit || deletingComment === comment.id}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-gray-700">
                        <DropdownMenuItem 
                          onClick={() => handleStartEdit(comment)}
                          className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {/* Comment Content - Edit Mode or View Mode */}
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[60px] text-sm"
                      disabled={savingEdit}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={savingEdit || !editContent.trim()}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-6 px-2 text-xs"
                      >
                        {savingEdit ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={savingEdit}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-slate-700 h-6 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                )}
              </div>
            </div>
          )) || (
            <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
          <div ref={commentsEndRef} />
          
          {/* New Messages Button */}
          {showNewMessagesButton && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                onClick={scrollToBottom}
                variant="outline"
                size="sm"
                className="bg-slate-800/90 backdrop-blur-sm border-slate-600 text-gray-300 hover:bg-slate-700/90 hover:text-white shadow-md p-2 opacity-80 hover:opacity-100 transition-all duration-200 rounded-full"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex items-start gap-3 mt-4 pt-4 border-t border-gray-700">
          <Avatar className="w-8 h-8 flex-shrink-0">
            {getUserAvatar() ? (
              <AvatarImage 
                src={getUserAvatar()!} 
                alt="Your avatar"
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              className="flex-1 bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
            />
            <Button
              onClick={onAddComment}
              disabled={!newComment.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
