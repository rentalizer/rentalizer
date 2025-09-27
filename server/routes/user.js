const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateProfileUpdate, 
  validatePasswordChange, 
  validateAccountDeletion 
} = require('../middleware/validation');

const router = express.Router();

// GET /api/user/profile - Protected route
router.get('/profile', authenticateToken, userController.getProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, userController.updateProfile);

// PUT /api/user/change-password - Change password
router.put('/change-password', authenticateToken, validatePasswordChange, userController.changePassword);

// DELETE /api/user/account - Delete account
router.delete('/account', authenticateToken, validateAccountDeletion, userController.deleteAccount);

module.exports = router;
