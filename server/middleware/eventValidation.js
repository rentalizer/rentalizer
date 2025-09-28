const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
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

// Event creation validation
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
    
  body('event_date')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Event date must be a valid date')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
    
  body('event_time')
    .notEmpty()
    .withMessage('Event time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Event time must be in HH:MM format'),
    
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isIn(['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours'])
    .withMessage('Duration must be one of: 30 minutes, 1 hour, 1.5 hours, 2 hours, 3 hours'),
    
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isIn(['Zoom', 'Google Meet', 'Microsoft Teams', 'In Person'])
    .withMessage('Location must be one of: Zoom, Google Meet, Microsoft Teams, In Person'),
    
  body('zoom_link')
    .trim()
    .notEmpty()
    .withMessage('Zoom link is required')
    .isLength({ max: 500 })
    .withMessage('Zoom link cannot exceed 500 characters'),
    
  body('event_type')
    .notEmpty()
    .withMessage('Event type is required')
    .isIn(['training', 'webinar', 'discussion', 'workshop'])
    .withMessage('Event type must be one of: training, webinar, discussion, workshop'),
    
  body('attendees')
    .optional()
    .isIn(['All members', 'Premium members only', 'Invited members only'])
    .withMessage('Attendees must be one of: All members, Premium members only, Invited members only'),
    
  body('is_recurring')
    .optional()
    .isBoolean()
    .withMessage('is_recurring must be a boolean value'),
    
  body('remind_members')
    .optional()
    .isBoolean()
    .withMessage('remind_members must be a boolean value'),
    
  body('max_attendees')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max attendees must be between 1 and 1000'),
    
  body('cover_image')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      if (tags) {
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.length > 30) {
            throw new Error('Each tag must be a string with maximum 30 characters');
          }
        }
      }
      return true;
    }),
    
  // Custom validation for zoom_link when location is Zoom
  body().custom((body) => {
    if (body.location === 'Zoom' && body.zoom_link) {
      // Allow any non-empty string for zoom_link when location is Zoom
      // Users can enter meeting IDs, room names, or full URLs
      if (typeof body.zoom_link !== 'string' || body.zoom_link.trim().length === 0) {
        throw new Error('Zoom link is required when location is Zoom');
      }
    }
    return true;
  }),
  
  handleValidationErrors
];

// Event update validation (same as create but all fields optional)
const validateUpdateEvent = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
    
  body('event_date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date')
    .custom((value) => {
      if (value) {
        const eventDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
          throw new Error('Event date cannot be in the past');
        }
      }
      return true;
    }),
    
  body('event_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Event time must be in HH:MM format'),
    
  body('duration')
    .optional()
    .isIn(['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours'])
    .withMessage('Duration must be one of: 30 minutes, 1 hour, 1.5 hours, 2 hours, 3 hours'),
    
  body('location')
    .optional()
    .isIn(['Zoom', 'Google Meet', 'Microsoft Teams', 'In Person'])
    .withMessage('Location must be one of: Zoom, Google Meet, Microsoft Teams, In Person'),
    
  body('zoom_link')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Zoom link cannot exceed 500 characters'),
    
  body('event_type')
    .optional()
    .isIn(['training', 'webinar', 'discussion', 'workshop'])
    .withMessage('Event type must be one of: training, webinar, discussion, workshop'),
    
  body('attendees')
    .optional()
    .isIn(['All members', 'Premium members only', 'Invited members only'])
    .withMessage('Attendees must be one of: All members, Premium members only, Invited members only'),
    
  body('is_recurring')
    .optional()
    .isBoolean()
    .withMessage('is_recurring must be a boolean value'),
    
  body('remind_members')
    .optional()
    .isBoolean()
    .withMessage('remind_members must be a boolean value'),
    
  body('max_attendees')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max attendees must be between 1 and 1000'),
    
  body('cover_image')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      if (tags) {
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.length > 30) {
            throw new Error('Each tag must be a string with maximum 30 characters');
          }
        }
      }
      return true;
    }),
    
  handleValidationErrors
];

// Event ID validation
const validateEventId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  handleValidationErrors
];

// Query parameters validation for getting events
const validateEventQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('type')
    .optional()
    .isIn(['training', 'webinar', 'discussion', 'workshop'])
    .withMessage('Type must be one of: training, webinar, discussion, workshop'),
    
  query('date_from')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid date'),
    
  query('date_to')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid date'),
    
  query('year')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
    
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
    
  handleValidationErrors
];

// Event invitation validation
const validateEventInvitation = [
  body('user_ids')
    .isArray({ min: 1 })
    .withMessage('User IDs must be an array with at least one user'),
    
  body('user_ids.*')
    .isMongoId()
    .withMessage('Each user ID must be a valid MongoDB ObjectId'),
    
  handleValidationErrors
];

// RSVP validation
const validateRSVP = [
  body('status')
    .isIn(['accepted', 'declined', 'maybe'])
    .withMessage('Status must be one of: accepted, declined, maybe'),
    
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
    
  handleValidationErrors
];

module.exports = {
  validateCreateEvent,
  validateUpdateEvent,
  validateEventId,
  validateEventQuery,
  validateEventInvitation,
  validateRSVP,
  handleValidationErrors
};
