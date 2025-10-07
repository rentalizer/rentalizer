const express = require('express');
const bugReportController = require('../controllers/bugReportController');

const router = express.Router();

/**
 * @route   POST /api/bug-report
 * @desc    Submit a bug report
 * @access  Public
 */
router.post('/', bugReportController.submitBugReport);

module.exports = router;

