const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');
const User = require('../models/User');

class CommentService {
  // Get comments for a discussion with pagination and filtering
  static async getCommentsByDiscussion(discussionId, options = {}) {
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      includeDeleted = false,
      includeModerated = true
    } = options;

    // Build query
    const query = { discussion: discussionId };
    
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    
    if (!includeModerated) {
      query.isModerated = false;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const comments = await Comment.find(query)
      .populate('user', 'firstName lastName email profilePicture role')
      .populate('reactions.user', 'firstName lastName profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalComments = await Comment.countDocuments(query);

    return {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNextPage: page * limit < totalComments,
        hasPrevPage: page > 1
      }
    };
  }

  // Create a new comment
  static async createComment(discussionId, userId, content) {
    // Validate discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      throw new Error('Discussion not found');
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const comment = new Comment({
      discussion: discussionId,
      user: userId,
      content: content.trim()
    });

    await comment.save();
    await comment.populate('user', 'display_name email avatar_url role');

    return comment;
  }

  // Update a comment
  static async updateComment(commentId, userId, content, userRole = 'user') {
    const comment = await Comment.findById(commentId).populate('user', 'display_name email avatar_url role');
    
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check permissions
    if (comment.user._id.toString() !== userId && userRole !== 'admin') {
      throw new Error('You can only edit your own comments');
    }

    if (comment.isDeleted) {
      throw new Error('Cannot edit deleted comment');
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    
    await comment.save();
    return comment;
  }

  // Delete a comment (soft delete)
  static async deleteComment(commentId, userId, userRole = 'user') {
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check permissions
    if (comment.user.toString() !== userId && userRole !== 'admin') {
      throw new Error('You can only delete your own comments');
    }

    if (comment.isDeleted) {
      throw new Error('Comment already deleted');
    }

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    
    await comment.save();
    return comment;
  }

  // React to a comment
  static async reactToComment(commentId, userId, reactionType) {
    const validReactions = ['like', 'love', 'laugh', 'angry', 'sad'];
    if (!validReactions.includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.isDeleted) {
      throw new Error('Cannot react to deleted comment');
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
    return {
      comment,
      isReacted: !existingReaction,
      reactionType,
      reactionCounts: comment.reactionCounts
    };
  }

  // Get comment statistics
  static async getCommentStats(discussionId) {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      throw new Error('Discussion not found');
    }

    const totalComments = await Comment.countDocuments({
      discussion: discussionId,
      isDeleted: false
    });

    const reactionStats = await Comment.aggregate([
      { $match: { discussion: discussion._id, isDeleted: false } },
      { $unwind: '$reactions' },
      { $group: { _id: '$reactions.type', count: { $sum: 1 } } }
    ]);

    const stats = reactionStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return {
      totalComments,
      reactionStats: stats,
      discussionId
    };
  }

  // Moderate a comment (admin only)
  static async moderateComment(commentId, action, reason, moderatorId) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    switch (action) {
      case 'approve':
        comment.isModerated = false;
        comment.moderatedBy = null;
        comment.moderationReason = null;
        break;
      case 'reject':
        comment.isModerated = true;
        comment.moderatedBy = moderatorId;
        comment.moderationReason = reason || 'Content policy violation';
        break;
      case 'hide':
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        comment.moderatedBy = moderatorId;
        comment.moderationReason = reason || 'Hidden by moderator';
        break;
      default:
        throw new Error('Invalid moderation action');
    }

    await comment.save();
    return comment;
  }

  // Get user's comment activity
  static async getUserCommentActivity(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      includeDeleted = false
    } = options;

    const query = { user: userId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find(query)
      .populate('discussion', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalComments = await Comment.countDocuments(query);

    return {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNextPage: page * limit < totalComments,
        hasPrevPage: page > 1
      }
    };
  }

  // Get recent comments across all discussions
  static async getRecentComments(options = {}) {
    const {
      limit = 10,
      includeDeleted = false
    } = options;

    const query = {};
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const comments = await Comment.find(query)
      .populate('user', 'display_name avatar_url')
      .populate('discussion', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return comments;
  }
}

module.exports = CommentService;
