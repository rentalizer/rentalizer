const Comment = require('../models/Comment');

/**
 * Format comment for public display
 * @param {Object} comment - Comment document
 * @param {string} currentUserId - Current user ID for reaction status
 * @returns {Object} Formatted comment
 */
const formatCommentForDisplay = (comment, currentUserId = null) => {
  const formatted = {
    id: comment._id,
    content: comment.content,
    isEdited: comment.isEdited,
    editedAt: comment.editedAt,
    isDeleted: comment.isDeleted,
    isModerated: comment.isModerated,
    moderationReason: comment.moderationReason,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: {
      id: comment.user._id,
      display_name: comment.user.display_name,
      avatar_url: comment.user.avatar_url,
      role: comment.user.role
    },
    reactions: comment.reactions || [],
    reactionCounts: comment.reactionCounts || {},
    totalReactions: comment.totalReactions || 0
  };

  // Add user's reaction status if currentUserId is provided
  if (currentUserId) {
    const userReaction = comment.reactions?.find(
      r => r.user.toString() === currentUserId
    );
    formatted.userReaction = userReaction ? userReaction.type : null;
  }

  return formatted;
};

/**
 * Validate comment content
 * @param {string} content - Comment content
 * @returns {Object} Validation result
 */
const validateCommentContent = (content) => {
  const errors = [];

  if (!content || typeof content !== 'string') {
    errors.push('Comment content is required');
  } else {
    const trimmed = content.trim();
    
    if (trimmed.length === 0) {
      errors.push('Comment content cannot be empty');
    } else if (trimmed.length < 1) {
      errors.push('Comment content must be at least 1 character long');
    } else if (trimmed.length > 2000) {
      errors.push('Comment content cannot exceed 2000 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize comment content
 * @param {string} content - Raw comment content
 * @returns {string} Sanitized content
 */
const sanitizeCommentContent = (content) => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Check if user can edit comment
 * @param {Object} comment - Comment document
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {boolean} Can edit
 */
const canEditComment = (comment, userId, userRole = 'user') => {
  if (!comment || !userId) return false;
  if (comment.isDeleted) return false;
  if (userRole === 'admin') return true;
  return comment.user.toString() === userId;
};

/**
 * Check if user can delete comment
 * @param {Object} comment - Comment document
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {boolean} Can delete
 */
const canDeleteComment = (comment, userId, userRole = 'user') => {
  if (!comment || !userId) return false;
  if (userRole === 'admin') return true;
  return comment.user.toString() === userId;
};

/**
 * Check if user can moderate comment
 * @param {string} userRole - User role
 * @returns {boolean} Can moderate
 */
const canModerateComment = (userRole) => {
  return userRole === 'admin' || userRole === 'moderator';
};

/**
 * Get reaction statistics for a discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Object} Reaction statistics
 */
const getReactionStats = async (discussionId) => {
  try {
    const stats = await Comment.aggregate([
      { $match: { discussion: discussionId, isDeleted: false } },
      { $unwind: '$reactions' },
      { $group: { _id: '$reactions.type', count: { $sum: 1 } } }
    ]);

    const reactionStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return {
      totalReactions: stats.reduce((sum, stat) => sum + stat.count, 0),
      reactionTypes: reactionStats
    };
  } catch (error) {
    console.error('Error getting reaction stats:', error);
    return { totalReactions: 0, reactionTypes: {} };
  }
};

/**
 * Get comment activity summary for a user
 * @param {string} userId - User ID
 * @returns {Object} Activity summary
 */
const getUserCommentActivity = async (userId) => {
  try {
    const totalComments = await Comment.countDocuments({
      user: userId,
      isDeleted: false
    });

    const totalReactions = await Comment.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $unwind: '$reactions' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    const recentComments = await Comment.find({
      user: userId,
      isDeleted: false
    })
    .populate('discussion', 'title')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

    return {
      totalComments,
      totalReactions: totalReactions[0]?.count || 0,
      recentComments: recentComments.map(comment => ({
        id: comment._id,
        content: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
        discussion: comment.discussion,
        createdAt: comment.createdAt
      }))
    };
  } catch (error) {
    console.error('Error getting user comment activity:', error);
    return { totalComments: 0, totalReactions: 0, recentComments: [] };
  }
};

/**
 * Check for spam patterns in comment content
 * @param {string} content - Comment content
 * @returns {Object} Spam check result
 */
const checkForSpam = (content) => {
  if (!content || typeof content !== 'string') {
    return { isSpam: false, reasons: [] };
  }

  const reasons = [];
  const lowerContent = content.toLowerCase();

  // Check for excessive repetition
  const words = lowerContent.split(/\s+/);
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const maxRepetition = Math.max(...Object.values(wordCounts));
  if (maxRepetition > 5) {
    reasons.push('Excessive word repetition');
  }

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7 && content.length > 10) {
    reasons.push('Excessive capitalization');
  }

  // Check for excessive special characters
  const specialCharRatio = (content.match(/[^a-zA-Z0-9\s]/g) || []).length / content.length;
  if (specialCharRatio > 0.3) {
    reasons.push('Excessive special characters');
  }

  // Check for common spam patterns
  const spamPatterns = [
    /(.)\1{4,}/, // Repeated characters
    /(https?:\/\/[^\s]+){3,}/, // Multiple URLs
    /(buy|sell|click|free|win|prize|offer)/i // Common spam words
  ];

  spamPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      reasons.push('Contains spam patterns');
    }
  });

  return {
    isSpam: reasons.length > 0,
    reasons
  };
};

module.exports = {
  formatCommentForDisplay,
  validateCommentContent,
  sanitizeCommentContent,
  canEditComment,
  canDeleteComment,
  canModerateComment,
  getReactionStats,
  getUserCommentActivity,
  checkForSpam
};
