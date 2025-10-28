const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Message validation rules
const validateSendMessage = [
  body('recipient_id')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .isMongoId()
    .withMessage('Invalid recipient ID format'),
  
  body('message')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .trim(),
  
  body('message_type')
    .optional()
    .isIn(['text', 'image', 'file', 'system'])
    .withMessage('Invalid message type'),
  
  body('support_category')
    .optional()
    .isIn(['general', 'technical', 'billing', 'account', 'other'])
    .withMessage('Invalid support category'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  handleValidationErrors
];

// Conversation validation rules
const validateGetConversation = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['created_at', 'updated_at'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// Conversations list validation rules
const validateGetConversations = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  handleValidationErrors
];

// Mark as read validation rules
const validateMarkAsRead = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

// Delete message validation rules
const validateDeleteMessage = [
  param('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .isMongoId()
    .withMessage('Invalid message ID format'),
  
  handleValidationErrors
];

// Search messages validation rules
const validateSearchMessages = [
  query('q')
    .notEmpty()
    .withMessage('Search term is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),
  
  query('conversationPartnerId')
    .optional()
    .isMongoId()
    .withMessage('Invalid conversation partner ID format'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  handleValidationErrors
];

// Update message status validation rules
const validateUpdateMessageStatus = [
  param('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .isMongoId()
    .withMessage('Invalid message ID format'),
  
  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  
  body('support_category')
    .optional()
    .isIn(['general', 'technical', 'billing', 'account', 'other'])
    .withMessage('Invalid support category value'),
  
  body()
    .custom((value) => {
      const allowedFields = ['status', 'priority', 'support_category'];
      const hasValidField = allowedFields.some(field => value[field] !== undefined);
      
      if (!hasValidField) {
        throw new Error('At least one valid field (status, priority, support_category) must be provided');
      }
      
      return true;
    }),
  
  handleValidationErrors
];

const validateUpdateMessageContent = [
  param('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .isMongoId()
    .withMessage('Invalid message ID format'),

  body('message')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .trim(),

  handleValidationErrors
];

// Custom validation for message ownership
const validateMessageOwnership = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const DirectMessage = require('../models/DirectMessage');
    const message = await DirectMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is participant or admin
    const isParticipant = message.sender_id.toString() === userId || 
                         message.recipient_id.toString() === userId;
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only access your own messages'
      });
    }

    // Add message to request for use in controller
    req.message = message;
    next();
  } catch (error) {
    console.error('Error validating message ownership:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating message access'
    });
  }
};

// Custom validation for conversation access
const validateConversationAccess = async (req, res, next) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.user.id;

    // Prevent self-conversation
    if (currentUserId === otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot access conversation with yourself'
      });
    }

    // Validate other user exists
    const User = require('../models/User');
    const otherUser = await User.findById(otherUserId);
    
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add other user to request for use in controller
    req.otherUser = otherUser;
    next();
  } catch (error) {
    console.error('Error validating conversation access:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating conversation access'
    });
  }
};

// Rate limiting for message sending
const messageRateLimit = (maxMessages = 10, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    } else {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    if (userRequests.length >= maxMessages) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Too many messages sent recently.',
        retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    userRequests.push(now);
    next();
  };
};

module.exports = {
  validateSendMessage,
  validateGetConversation,
  validateGetConversations,
  validateMarkAsRead,
  validateDeleteMessage,
  validateSearchMessages,
  validateUpdateMessageStatus,
  validateUpdateMessageContent,
  validateMessageOwnership,
  validateConversationAccess,
  messageRateLimit,
  handleValidationErrors
};
