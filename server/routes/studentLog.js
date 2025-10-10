const express = require('express');
const router = express.Router();

const StudentLogController = require('../controllers/studentLogController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const {
  validateStudentId,
  validateActivityId,
  validateCreateStudent,
  validateUpdateStudent,
  validateCreateActivity,
  validateUpdateActivity,
  validateActivityQuery
} = require('../middleware/studentLogValidation');

// All student log routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Student routes
router.get('/students', StudentLogController.listStudents);
router.post('/students', validateCreateStudent, StudentLogController.createStudent);
router.get('/students/:studentId', validateStudentId, StudentLogController.getStudent);
router.put('/students/:studentId', validateStudentId, validateUpdateStudent, StudentLogController.updateStudent);
router.delete('/students/:studentId', validateStudentId, StudentLogController.deleteStudent);

// Activities routes
router.get(
  '/students/:studentId/activities',
  validateStudentId,
  validateActivityQuery,
  StudentLogController.listStudentActivities
);

router.post(
  '/students/:studentId/activities',
  validateStudentId,
  validateCreateActivity,
  StudentLogController.createStudentActivity
);

router.put(
  '/activities/:activityId',
  validateActivityId,
  validateUpdateActivity,
  StudentLogController.updateStudentActivity
);

router.delete(
  '/activities/:activityId',
  validateActivityId,
  StudentLogController.deleteStudentActivity
);

module.exports = router;
