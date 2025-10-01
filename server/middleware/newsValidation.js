const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware for news item creation
 */
const validateNewsItem = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters'),
  
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL().withMessage('URL must be a valid URL'),
  
  body('source')
    .optional()
    .trim()
    .isIn([
      'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
      'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
      'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
      'BiggerPockets', 'Manual Submission'
    ]).withMessage('Invalid news source'),
  
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Summary cannot exceed 1000 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Content cannot exceed 10000 characters'),
  
  body('published_at')
    .optional()
    .isISO8601().withMessage('Published date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters'),
  
  body('featured_image_url')
    .optional()
    .trim()
    .isURL().withMessage('Featured image URL must be a valid URL'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for news item update
 */
const validateNewsItemUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters'),
  
  body('url')
    .optional()
    .trim()
    .isURL().withMessage('URL must be a valid URL'),
  
  body('source')
    .optional()
    .trim()
    .isIn([
      'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
      'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
      'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
      'BiggerPockets', 'Manual Submission'
    ]).withMessage('Invalid news source'),
  
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Summary cannot exceed 1000 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Content cannot exceed 10000 characters'),
  
  body('published_at')
    .optional()
    .isISO8601().withMessage('Published date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters'),
  
  body('featured_image_url')
    .optional()
    .trim()
    .isURL().withMessage('Featured image URL must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
  
  body('is_pinned')
    .optional()
    .isBoolean().withMessage('is_pinned must be a boolean'),
  
  body('is_featured')
    .optional()
    .isBoolean().withMessage('is_featured must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for MongoDB ObjectId parameters
 */
const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid news item ID'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for pagination parameters
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for aggregation request
 */
const validateAggregation = [
  body('sources')
    .optional()
    .isArray().withMessage('Sources must be an array'),
  
  body('sources.*')
    .optional()
    .isIn([
      'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
      'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
      'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
      'BiggerPockets'
    ]).withMessage('Invalid news source'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateNewsItem,
  validateNewsItemUpdate,
  validateObjectId,
  validatePagination,
  validateAggregation
};

