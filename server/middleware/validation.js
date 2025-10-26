const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation middleware for profile updates
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profilePicture')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty values
      // Check if it's a valid URL or base64 data URL
      if (value.startsWith('data:image/') || value.startsWith('http')) {
        return true;
      }
      throw new Error('Profile picture must be a valid URL or base64 data URL');
    }),
  handleValidationErrors
];

// Validation middleware for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

// Validation middleware for account deletion
const validateAccountDeletion = [
  body('password')
    .notEmpty()
    .withMessage('Password is required for account deletion'),
  handleValidationErrors
];

// Registration validation rules
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('promoCode')
    .notEmpty()
    .withMessage('Promo code is required')
    .isLength({ min: 6, max: 24 })
    .withMessage('Promo code must be between 6 and 24 characters')
    .trim()
    .toUpperCase(),
  handleValidationErrors
];

// Login validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Discussion validation rules
const validateDiscussion = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('author_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),
  body('author_avatar')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty values
      // Check if it's a valid URL or base64 data URL
      if (value.startsWith('data:image/') || value.startsWith('http')) {
        return true;
      }
      throw new Error('Author avatar must be a valid URL or base64 data URL');
    }),
  body('category')
    .optional()
    .isIn(['General', 'Market Analysis', 'Property Management', 'Investment Strategies', 'Legal & Compliance', 'Technology', 'Networking', 'Success Stories', 'Q&A'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array')
    .custom((attachments) => !attachments || attachments.length <= 3)
    .withMessage('You can add up to 3 attachments'),
  body('attachments.*.type')
    .optional()
    .isIn(['image', 'video', 'document'])
    .withMessage('Attachment type must be image, video, or document'),
  body('attachments.*.url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),
  body('attachments.*.filename')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Attachment filename must be between 1 and 255 characters'),
  body('attachments.*.size')
    .optional()
    .isInt({ min: 0, max: 5 * 1024 * 1024 })
    .withMessage('Attachment size must be 5MB or smaller'),
  body('attachments.*.storageKey')
    .optional()
    .trim()
    .isLength({ min: 1, max: 512 })
    .withMessage('Attachment storage key must be between 1 and 512 characters'),
  handleValidationErrors
];

// Discussion update validation rules (more lenient)
const validateDiscussionUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('category')
    .optional()
    .isIn(['General', 'Market Analysis', 'Property Management', 'Investment Strategies', 'Legal & Compliance', 'Technology', 'Networking', 'Success Stories', 'Q&A'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array')
    .custom((attachments) => !attachments || attachments.length <= 3)
    .withMessage('You can add up to 3 attachments'),
  body('attachments.*.type')
    .optional()
    .isIn(['image', 'video', 'document'])
    .withMessage('Attachment type must be image, video, or document'),
  body('attachments.*.url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),
  body('attachments.*.filename')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Attachment filename must be between 1 and 255 characters'),
  body('attachments.*.size')
    .optional()
    .isInt({ min: 0, max: 5 * 1024 * 1024 })
    .withMessage('Attachment size must be 5MB or smaller'),
  body('attachments.*.storageKey')
    .optional()
    .trim()
    .isLength({ min: 1, max: 512 })
    .withMessage('Attachment storage key must be between 1 and 512 characters'),
  handleValidationErrors
];

// Video validation rules
const validateVideo = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('thumbnail')
    .custom((value) => {
      if (!value) {
        throw new Error('Thumbnail is required');
      }
      
      const isFilePath = /^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);
      const isR2Url = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value);

      if (!isFilePath && !isR2Url) {
        throw new Error('Thumbnail must be a valid image URL');
      }
      
      return true;
    }),
  body('category')
    .isIn(['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Training Replays', 'Documents Library'])
    .withMessage('Category must be one of: Business Formation, Market Research, Property Acquisition, Operations, Training Replays, Documents Library'),
  body('videoUrl')
    .isURL({ protocols: ['https'] })
    .withMessage('Video URL must be a valid HTTPS URL')
    .custom((value) => {
      // Check if it's a Loom URL
      if (!/^https:\/\/www\.loom\.com\/share\/[a-zA-Z0-9]+/.test(value)) {
        throw new Error('Video URL must be a valid Loom share URL');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('isLive')
    .optional()
    .isBoolean()
    .withMessage('isLive must be a boolean value'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  handleValidationErrors
];

// Video update validation rules (more lenient)
const validateVideoUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('thumbnail')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty values
      
      // Allow both file paths (uploaded files) and external URLs for updates
      const isFilePath = /^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);
      const isUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value);
      
      if (!isFilePath && !isUrl) {
        throw new Error('Thumbnail must be an uploaded image file or valid image URL');
      }
      
      return true;
    }),
  body('category')
    .optional()
    .isIn(['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Training Replays', 'Documents Library'])
    .withMessage('Category must be one of: Business Formation, Market Research, Property Acquisition, Operations, Training Replays, Documents Library'),
  body('videoUrl')
    .optional()
    .isURL({ protocols: ['https'] })
    .withMessage('Video URL must be a valid HTTPS URL')
    .custom((value) => {
      if (!value) return true; // Allow empty values
      // Check if it's a Loom URL
      if (!/^https:\/\/www\.loom\.com\/share\/[a-zA-Z0-9]+/.test(value)) {
        throw new Error('Video URL must be a valid Loom share URL');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('isLive')
    .optional()
    .isBoolean()
    .withMessage('isLive must be a boolean value'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  handleValidationErrors
];

// Video reorder validation rules
const validateVideoReorder = [
  body('videoOrders')
    .isArray({ min: 1 })
    .withMessage('Video orders must be a non-empty array'),
  body('videoOrders.*.videoId')
    .isMongoId()
    .withMessage('Each video ID must be a valid MongoDB ObjectId'),
  body('videoOrders.*.order')
    .isInt({ min: 0 })
    .withMessage('Each order must be a non-negative integer'),
  handleValidationErrors
];

// Bulk update validation rules
const validateBulkUpdate = [
  body('videoIds')
    .isArray({ min: 1 })
    .withMessage('Video IDs must be a non-empty array'),
  body('videoIds.*')
    .isMongoId()
    .withMessage('Each video ID must be a valid MongoDB ObjectId'),
  body('updateData')
    .isObject()
    .withMessage('Update data must be an object'),
  handleValidationErrors
];

// Document validation rules
const validDocumentCategories = ['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Documents Library', 'Training Replays'];

const validateDocument = [
  body('category')
    .notEmpty()
    .withMessage('Document category is required')
    .isIn(validDocumentCategories)
    .withMessage('Invalid document category'),
  handleValidationErrors
];

// Document update validation rules (more lenient)
const validateDocumentUpdate = [
  body('category')
    .optional()
    .isIn(validDocumentCategories)
    .withMessage('Invalid document category'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateAccountDeletion,
  validateDiscussion,
  validateDiscussionUpdate,
  validateVideo,
  validateVideoUpdate,
  validateVideoReorder,
  validateBulkUpdate,
  validateDocument,
  validateDocumentUpdate,
  handleValidationErrors
};
