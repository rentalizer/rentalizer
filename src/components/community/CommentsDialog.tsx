import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Edit, Trash2, Check, X, MoreHorizontal } from 'lucide-react';
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

  // Check if current user can edit/delete a comment
  const canEditOrDelete = useCallback((comment: Comment) => {
    if (!user) return false;
    // User can edit/delete their own comments
    return comment.userId === user.id;
  }, [user]);

  // Handle starting edit
  const handleStartEdit = useCallback((comment: Comment) => {
    const normalizedId = (comment as any).id || (comment as any)._id;
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
  }, [editContent, onCommentUpdate]);

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
    <Dialog>
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
      <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Comments - {discussion.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments?.map((comment, index) => (
            <div key={comment.id || `${comment.author}-${index}`} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {comment.avatar}
              </div>
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
        </div>
        
        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-700">
          <Avatar className="w-8 h-8 flex-shrink-0">
            {getUserAvatar() ? (
              <AvatarImage 
                src={getUserAvatar()!} 
                alt="Your avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            )}
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
