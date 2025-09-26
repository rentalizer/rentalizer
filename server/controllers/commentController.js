const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get comments for a discussion
const getCommentsByDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query;

    // Validate discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Get comments
    const comments = await Comment.getCommentsByDiscussion(discussionId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    });

    // Get total count for pagination
    const totalComments = await Comment.countDocuments({
      discussion: discussionId,
      isDeleted: false
    });

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNextPage: page * limit < totalComments,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validate discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Create comment
    const comment = new Comment({
      discussion: discussionId,
      user: userId,
      content: content.trim()
    });

    await comment.save();
    await comment.populate('user', 'firstName lastName email profilePicture role');

    // Update discussion's comment count
    await Discussion.findByIdAndUpdate(discussionId, {
      $inc: { comments_count: 1 },
      last_activity: new Date()
    });

    // Emit real-time event via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${discussionId}`).emit('new_comment', {
        comment: comment.toPublicJSON(),
        discussionId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment.toPublicJSON()
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Find comment
    const comment = await Comment.findById(commentId).populate('user', 'firstName lastName email profilePicture role');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit deleted comment'
      });
    }

    // Update comment
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    // Emit real-time event via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${comment.discussion}`).emit('comment_updated', {
        comment: comment.toPublicJSON(),
        discussionId: comment.discussion
      });
    }

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment.toPublicJSON()
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a comment (soft delete)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    // Check if already deleted
    if (comment.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Comment already deleted'
      });
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

    // Emit real-time event via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${comment.discussion}`).emit('comment_deleted', {
        commentId: comment._id,
        discussionId: comment.discussion
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// React to a comment (like, love, etc.)
const reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reactionType = 'like' } = req.body;
    const userId = req.user.id;

    // Validate reaction type
    const validReactions = ['like', 'love', 'laugh', 'angry', 'sad'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type'
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot react to deleted comment'
      });
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
      await comment.save();

      res.json({
        success: true,
        message: 'Reaction removed',
        data: {
          reactionType,
          isReacted: false,
          reactionCounts: comment.reactionCounts
        }
      });
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

      await comment.save();

      res.json({
        success: true,
        message: 'Reaction added',
        data: {
          reactionType,
          isReacted: true,
          reactionCounts: comment.reactionCounts
        }
      });
    }

    // Emit real-time event via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${comment.discussion}`).emit('comment_reaction', {
        commentId: comment._id,
        discussionId: comment.discussion,
        reactionType,
        reactionCounts: comment.reactionCounts
      });
    }
  } catch (error) {
    console.error('Error reacting to comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get comment statistics
const getCommentStats = async (req, res) => {
  try {
    const { discussionId } = req.params;

    // Validate discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Get comment statistics
    const stats = await Comment.getCommentStats(discussionId);

    res.json({
      success: true,
      message: 'Comment statistics retrieved successfully',
      data: {
        ...stats,
        discussionId
      }
    });
  } catch (error) {
    console.error('Error getting comment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Moderate a comment (admin only)
const moderateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { action, reason } = req.body; // action: 'approve', 'reject', 'hide'
    const userId = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Apply moderation action
    switch (action) {
      case 'approve':
        comment.isModerated = false;
        comment.moderatedBy = null;
        comment.moderationReason = null;
        break;
      case 'reject':
        comment.isModerated = true;
        comment.moderatedBy = userId;
        comment.moderationReason = reason || 'Content policy violation';
        break;
      case 'hide':
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        comment.moderatedBy = userId;
        comment.moderationReason = reason || 'Hidden by moderator';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid moderation action'
        });
    }

    await comment.save();

    // Emit real-time event via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`discussion_${comment.discussion}`).emit('comment_moderated', {
        commentId: comment._id,
        discussionId: comment.discussion,
        action,
        reason
      });
    }

    res.json({
      success: true,
      message: `Comment ${action}d successfully`,
      data: {
        commentId: comment._id,
        action,
        reason
      }
    });
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Recalculate comment counts for all discussions (utility function)
const recalculateCommentCounts = async (req, res) => {
  try {
    const discussions = await Discussion.find({});
    let updatedCount = 0;

    for (const discussion of discussions) {
      const actualCount = await Comment.countDocuments({
        discussion: discussion._id,
        isDeleted: false
      });

      if (discussion.comments_count !== actualCount) {
        await Discussion.findByIdAndUpdate(discussion._id, {
          comments_count: actualCount
        });
        updatedCount++;
        console.log(`Updated discussion ${discussion._id}: ${discussion.comments_count} -> ${actualCount}`);
      }
    }

    res.json({
      success: true,
      message: `Recalculated comment counts for ${updatedCount} discussions`,
      data: { updatedCount }
    });
  } catch (error) {
    console.error('Error recalculating comment counts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCommentsByDiscussion,
  createComment,
  updateComment,
  deleteComment,
  reactToComment,
  getCommentStats,
  moderateComment,
  recalculateCommentCounts
};
