const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Room management for discussions
class RoomManager {
  constructor() {
    this.rooms = new Map(); // discussionId -> Set of socketIds
  }

  joinRoom(socketId, discussionId) {
    if (!this.rooms.has(discussionId)) {
      this.rooms.set(discussionId, new Set());
    }
    this.rooms.get(discussionId).add(socketId);
  }

  leaveRoom(socketId, discussionId) {
    if (this.rooms.has(discussionId)) {
      this.rooms.get(discussionId).delete(socketId);
      if (this.rooms.get(discussionId).size === 0) {
        this.rooms.delete(discussionId);
      }
    }
  }

  getRoomMembers(discussionId) {
    return this.rooms.get(discussionId) || new Set();
  }

  removeSocket(socketId) {
    for (const [discussionId, members] of this.rooms.entries()) {
      if (members.has(socketId)) {
        members.delete(socketId);
        if (members.size === 0) {
          this.rooms.delete(discussionId);
        }
      }
    }
  }
}

// Comment handler for WebSocket events
class CommentHandler {
  constructor(io, roomManager) {
    this.io = io;
    this.roomManager = roomManager;
  }

  // Handle new comment
  async handleNewComment(socket, data) {
    try {
      const { discussionId, content } = data;
      const userId = socket.userId;

      // Validate discussion exists
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) {
        socket.emit('error', { message: 'Discussion not found' });
        return;
      }

      // Create comment
      const comment = new Comment({
        discussion: discussionId,
        user: userId,
        content: content.trim()
      });

      await comment.save();
      await comment.populate('user', 'display_name email avatar_url role');

      // Update discussion's comment count
      await Discussion.findByIdAndUpdate(discussionId, {
        $inc: { comments_count: 1 },
        last_activity: new Date()
      });

      // Broadcast to all users in the discussion room
      this.io.to(`discussion_${discussionId}`).emit('new_comment', {
        comment: comment.toPublicJSON(),
        discussionId
      });

      // Send confirmation to sender
      socket.emit('comment_created', {
        success: true,
        comment: comment.toPublicJSON()
      });

    } catch (error) {
      console.error('Error handling new comment:', error);
      socket.emit('error', { message: 'Failed to create comment' });
    }
  }

  // Handle comment update
  async handleCommentUpdate(socket, data) {
    try {
      const { commentId, content } = data;
      const userId = socket.userId;

      const comment = await Comment.findById(commentId).populate('user', 'display_name email avatar_url role');
      if (!comment) {
        socket.emit('error', { message: 'Comment not found' });
        return;
      }

      // Check permissions
      if (comment.user._id.toString() !== userId && socket.userRole !== 'admin') {
        socket.emit('error', { message: 'You can only edit your own comments' });
        return;
      }

      if (comment.isDeleted) {
        socket.emit('error', { message: 'Cannot edit deleted comment' });
        return;
      }

      // Update comment
      comment.content = content.trim();
      comment.isEdited = true;
      comment.editedAt = new Date();
      await comment.save();

      // Broadcast update
      this.io.to(`discussion_${comment.discussion}`).emit('comment_updated', {
        comment: comment.toPublicJSON(),
        discussionId: comment.discussion
      });

      socket.emit('comment_updated_confirmation', {
        success: true,
        comment: comment.toPublicJSON()
      });

    } catch (error) {
      console.error('Error handling comment update:', error);
      socket.emit('error', { message: 'Failed to update comment' });
    }
  }

  // Handle comment deletion
  async handleCommentDelete(socket, data) {
    try {
      const { commentId } = data;
      const userId = socket.userId;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        socket.emit('error', { message: 'Comment not found' });
        return;
      }

      // Check permissions
      if (comment.user.toString() !== userId && socket.userRole !== 'admin') {
        socket.emit('error', { message: 'You can only delete your own comments' });
        return;
      }

      if (comment.isDeleted) {
        socket.emit('error', { message: 'Comment already deleted' });
        return;
      }

      // Soft delete
      comment.isDeleted = true;
      comment.deletedAt = new Date();
      await comment.save();

      // Update discussion's comment count
      await Discussion.findByIdAndUpdate(comment.discussion, {
        $inc: { comments_count: -1 },
        last_activity: new Date()
      });

      // Broadcast deletion
      this.io.to(`discussion_${comment.discussion}`).emit('comment_deleted', {
        commentId: comment._id,
        discussionId: comment.discussion
      });

      socket.emit('comment_deleted_confirmation', {
        success: true,
        commentId: comment._id
      });

    } catch (error) {
      console.error('Error handling comment deletion:', error);
      socket.emit('error', { message: 'Failed to delete comment' });
    }
  }

  // Handle comment reaction
  async handleCommentReaction(socket, data) {
    try {
      const { commentId, reactionType } = data;
      const userId = socket.userId;

      const validReactions = ['like', 'love', 'laugh', 'angry', 'sad'];
      if (!validReactions.includes(reactionType)) {
        socket.emit('error', { message: 'Invalid reaction type' });
        return;
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        socket.emit('error', { message: 'Comment not found' });
        return;
      }

      if (comment.isDeleted) {
        socket.emit('error', { message: 'Cannot react to deleted comment' });
        return;
      }

      // Check if user already reacted with this type
      const existingReaction = comment.reactions.find(
        r => r.user.toString() === userId && r.type === reactionType
      );

      if (existingReaction) {
        // Remove existing reaction
        comment.reactions = comment.reactions.filter(
          r => !(r.user.toString() === userId && r.type === reactionType)
        );
      } else {
        // Remove any existing reaction from this user
        comment.reactions = comment.reactions.filter(
          r => r.user.toString() !== userId
        );

        // Add new reaction
        comment.reactions.push({
          user: userId,
          type: reactionType
        });
      }

      await comment.save();

      // Broadcast reaction
      this.io.to(`discussion_${comment.discussion}`).emit('comment_reaction', {
        commentId: comment._id,
        discussionId: comment.discussion,
        reactionType,
        reactionCounts: comment.reactionCounts,
        isReacted: !existingReaction
      });

    } catch (error) {
      console.error('Error handling comment reaction:', error);
      socket.emit('error', { message: 'Failed to react to comment' });
    }
  }
}

// Setup WebSocket handlers
const setupWebSocketHandlers = (io) => {
  const roomManager = new RoomManager();
  const commentHandler = new CommentHandler(io, roomManager);

  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('firstName lastName email profilePicture role');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      socket.user = user;
      socket.userRole = user.role;
      const computedName = (user.firstName || user.lastName)
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
        : (user.email ? user.email.split('@')[0] : 'User');
      socket.userDisplayName = computedName;
      
      next();
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userDisplayName} connected via WebSocket`);

    // Join discussion room
    socket.on('join_discussion', (data) => {
      const { discussionId } = data;
      socket.join(`discussion_${discussionId}`);
      roomManager.joinRoom(socket.id, discussionId);
      
      console.log(`User ${socket.userDisplayName} joined discussion ${discussionId}`);
      
      // Notify others in the room
      socket.to(`discussion_${discussionId}`).emit('user_joined', {
        userId: socket.userId,
        user: socket.user,
        discussionId
      });
    });

    // Leave discussion room
    socket.on('leave_discussion', (data) => {
      const { discussionId } = data;
      socket.leave(`discussion_${discussionId}`);
      roomManager.leaveRoom(socket.id, discussionId);
      
      console.log(`User ${socket.userDisplayName} left discussion ${discussionId}`);
      
      // Notify others in the room
      socket.to(`discussion_${discussionId}`).emit('user_left', {
        userId: socket.userId,
        discussionId
      });
    });

    // Comment events
    socket.on('new_comment', (data) => {
      commentHandler.handleNewComment(socket, data);
    });

    socket.on('update_comment', (data) => {
      commentHandler.handleCommentUpdate(socket, data);
    });

    socket.on('delete_comment', (data) => {
      commentHandler.handleCommentDelete(socket, data);
    });

    socket.on('react_to_comment', (data) => {
      commentHandler.handleCommentReaction(socket, data);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { discussionId } = data;
      socket.to(`discussion_${discussionId}`).emit('user_typing', {
        userId: socket.userId,
        user: socket.user,
        discussionId
      });
    });

    socket.on('typing_stop', (data) => {
      const { discussionId } = data;
      socket.to(`discussion_${discussionId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        discussionId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userDisplayName} disconnected`);
      roomManager.removeSocket(socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return { roomManager, commentHandler };
};

module.exports = { setupWebSocketHandlers, RoomManager, CommentHandler };
