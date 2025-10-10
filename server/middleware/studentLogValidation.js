const { body, param, query } = require('express-validator');
const { ACTIVITY_TYPES, MATERIAL_TYPES } = require('../models/StudentLogActivity');
const handleValidationErrors = require('./validation').handleValidationErrors;

const validateStudentId = [
  param('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID format'),
  handleValidationErrors
];

const validateActivityId = [
  param('activityId')
    .notEmpty()
    .withMessage('Activity ID is required')
    .isMongoId()
    .withMessage('Invalid activity ID format'),
  handleValidationErrors
];

const baseStudentRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Name must be between 1 and 120 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'paused', 'completed'])
    .withMessage('Status must be one of: active, inactive, paused, completed'),
  body('legacyId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Legacy ID cannot exceed 50 characters'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be an integer between 0 and 100'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const validateCreateStudent = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  ...baseStudentRules,
  handleValidationErrors
];

const validateUpdateStudent = [
  ...baseStudentRules,
  handleValidationErrors
];

const baseActivityRules = [
  body('type')
    .optional()
    .isIn(ACTIVITY_TYPES)
    .withMessage(`Type must be one of: ${ACTIVITY_TYPES.join(', ')}`),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date'),
  body('material')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Material name cannot exceed 200 characters'),
  body('materialType')
    .optional()
    .isIn(MATERIAL_TYPES)
    .withMessage(`Material type must be one of: ${MATERIAL_TYPES.join(', ')}`),
  body('materialUrl')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Material URL cannot exceed 500 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('score')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Score cannot exceed 50 characters'),
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Duration cannot exceed 50 characters'),
  body('serverId')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Server ID cannot exceed 120 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Category cannot exceed 120 characters'),
  body('views')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Views must be a non-negative integer'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
];

const validateCreateActivity = [
  body('type')
    .notEmpty()
    .withMessage('Type is required'),
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('date')
    .notEmpty()
    .withMessage('Date is required'),
  ...baseActivityRules,
  handleValidationErrors
];

const validateUpdateActivity = [
  ...baseActivityRules,
  handleValidationErrors
];

const validateActivityQuery = [
  query('type')
    .optional()
    .isIn(ACTIVITY_TYPES)
    .withMessage(`Type must be one of: ${ACTIVITY_TYPES.join(', ')}`),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Limit must be between 1 and 200'),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer'),
  handleValidationErrors
];

module.exports = {
  validateStudentId,
  validateActivityId,
  validateCreateStudent,
  validateUpdateStudent,
  validateCreateActivity,
  validateUpdateActivity,
  validateActivityQuery
};
