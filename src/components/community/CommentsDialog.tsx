import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { DiscussionType } from './GroupDiscussions';

interface Comment {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
  avatar: string;
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
}

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  discussion,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onDiscussionSelect,
  getUserAvatar,
  getUserInitials
}) => {
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-300 font-medium text-sm">{comment.author}</span>
                  <span className="text-gray-400 text-xs">{comment.timeAgo}</span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
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
