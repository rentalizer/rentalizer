const express = require('express');
const router = express.Router();

// Import controller and middleware
const directMessageController = require('../controllers/directMessageController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const {
  validateSendMessage,
  validateGetConversation,
  validateGetConversations,
  validateMarkAsRead,
  validateDeleteMessage,
  validateSearchMessages,
  validateUpdateMessageStatus,
  validateMessageOwnership,
  validateConversationAccess,
  messageRateLimit
} = require('../middleware/messageValidation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   POST /api/messages
 * @desc    Send a direct message
 * @access  Private
 */
router.post(
  '/',
  messageRateLimit(20, 60000), // 20 messages per minute
  validateSendMessage,
  directMessageController.sendMessage
);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get user's conversations list
 * @access  Private
 */
router.get(
  '/conversations',
  validateGetConversations,
  directMessageController.getConversations
);

/**
 * @route   GET /api/messages/conversation/:userId
 * @desc    Get conversation between current user and specified user
 * @access  Private
 */
router.get(
  '/conversation/:userId',
  validateGetConversation,
  validateConversationAccess,
  directMessageController.getConversation
);

/**
 * @route   PUT /api/messages/conversation/:userId/read
 * @desc    Mark conversation as read
 * @access  Private
 */
router.put(
  '/conversation/:userId/read',
  validateMarkAsRead,
  validateConversationAccess,
  directMessageController.markConversationAsRead
);

/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread message count for current user
 * @access  Private
 */
router.get(
  '/unread-count',
  directMessageController.getUnreadCount
);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message (soft delete)
 * @access  Private (sender or admin only)
 */
router.delete(
  '/:messageId',
  validateDeleteMessage,
  validateMessageOwnership,
  directMessageController.deleteMessage
);

/**
 * @route   GET /api/messages/search
 * @desc    Search messages
 * @access  Private
 */
router.get(
  '/search',
  validateSearchMessages,
  directMessageController.searchMessages
);

/**
 * @route   GET /api/messages/stats
 * @desc    Get messaging statistics
 * @access  Private (user's own stats, admin can see all)
 */
router.get(
  '/stats',
  directMessageController.getMessagingStats
);

/**
 * @route   GET /api/messages/support-categories
 * @desc    Get available support categories
 * @access  Private
 */
router.get(
  '/support-categories',
  directMessageController.getSupportCategories
);

/**
 * @route   GET /api/messages/priority-levels
 * @desc    Get available priority levels
 * @access  Private
 */
router.get(
  '/priority-levels',
  directMessageController.getPriorityLevels
);

/**
 * @route   GET /api/messages/statuses
 * @desc    Get available message statuses
 * @access  Private
 */
router.get(
  '/statuses',
  directMessageController.getMessageStatuses
);

// Admin-only routes
/**
 * @route   GET /api/messages/admins
 * @desc    Get all admin users
 * @access  Private (Admin only)
 */
router.get(
  '/admins',
  requireAdmin,
  directMessageController.getAdminUsers
);

/**
 * @route   GET /api/messages/users
 * @desc    Get all users for admin messaging
 * @access  Admin only
 */
router.get(
  '/users',
  requireAdmin,
  directMessageController.getAllUsers
);

/**
 * @route   GET /api/messages/admin/first
 * @desc    Get first available admin for support
 * @access  Private
 */
router.get(
  '/admin/first',
  directMessageController.getFirstAdmin
);

/**
 * @route   PUT /api/messages/:messageId/status
 * @desc    Update message status (admin only)
 * @access  Private (Admin only)
 */
router.put(
  '/:messageId/status',
  requireAdmin,
  validateUpdateMessageStatus,
  validateMessageOwnership,
  directMessageController.updateMessageStatus
);

module.exports = router;
