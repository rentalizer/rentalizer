const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const commentController = require('../controllers/commentController');
const { handleValidationErrors } = require('../middleware/validation');

// Validation middleware
const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment content must be between 1 and 2000 characters')
    .escape(),
  handleValidationErrors
];

const reactionValidation = [
  body('reactionType')
    .optional()
    .isIn(['like', 'love', 'laugh', 'angry', 'sad'])
    .withMessage('Invalid reaction type'),
  handleValidationErrors
];

const moderationValidation = [
  body('action')
    .isIn(['approve', 'reject', 'hide'])
    .withMessage('Invalid moderation action'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Moderation reason must be less than 500 characters'),
  handleValidationErrors
];

const discussionIdValidation = [
  param('discussionId')
    .isMongoId()
    .withMessage('Invalid discussion ID'),
  handleValidationErrors
];

const commentIdValidation = [
  param('commentId')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  handleValidationErrors
];

// Public routes (no authentication required)
/**
 * @route   GET /api/comments/discussion/:discussionId
 * @desc    Get comments for a discussion
 * @access  Public
 */
router.get('/discussion/:discussionId', ...discussionIdValidation, commentController.getCommentsByDiscussion);

/**
 * @route   GET /api/comments/stats/:discussionId
 * @desc    Get comment statistics for a discussion
 * @access  Public
 */
router.get('/stats/:discussionId', ...discussionIdValidation, commentController.getCommentStats);

// Protected routes (authentication required)
/**
 * @route   POST /api/comments/discussion/:discussionId
 * @desc    Create a new comment
 * @access  Private
 */
router.post('/discussion/:discussionId', 
  authenticateToken, 
  ...discussionIdValidation, 
  ...commentValidation, 
  commentController.createComment
);

/**
 * @route   PUT /api/comments/:commentId
 * @desc    Update a comment
 * @access  Private
 */
router.put('/:commentId', 
  authenticateToken, 
  ...commentIdValidation, 
  ...commentValidation, 
  commentController.updateComment
);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment (soft delete)
 * @access  Private
 */
router.delete('/:commentId', 
  authenticateToken, 
  ...commentIdValidation, 
  commentController.deleteComment
);

/**
 * @route   POST /api/comments/:commentId/react
 * @desc    React to a comment (like, love, etc.)
 * @access  Private
 */
router.post('/:commentId/react', 
  authenticateToken, 
  ...commentIdValidation, 
  ...reactionValidation, 
  commentController.reactToComment
);

// Admin routes
/**
 * @route   POST /api/comments/:commentId/moderate
 * @desc    Moderate a comment (admin only)
 * @access  Private (Admin)
 */
router.post('/:commentId/moderate', 
  authenticateToken, 
  ...commentIdValidation, 
  ...moderationValidation, 
  commentController.moderateComment
);

/**
 * @route   POST /api/comments/recalculate-counts
 * @desc    Recalculate comment counts for all discussions (admin only)
 * @access  Private (Admin)
 */
router.post('/recalculate-counts', 
  authenticateToken, 
  commentController.recalculateCommentCounts
);

module.exports = router;
