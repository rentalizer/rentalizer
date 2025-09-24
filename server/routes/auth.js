const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/refresh (optional)
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout (optional)
router.post('/logout', authController.logout);

module.exports = router;
