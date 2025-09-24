const userService = require('../services/userService');

class UserController {
  // GET /api/user/profile
  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      
      const user = await userService.getUserById(userId);

      res.json({
        message: 'Profile retrieved successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('Profile retrieval error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.status(500).json({
        message: 'Internal server error while retrieving profile'
      });
    }
  }

  // PUT /api/user/profile
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { firstName, lastName, bio, profilePicture } = req.body;

      const updatedUser = await userService.updateUser(userId, {
        firstName,
        lastName,
        bio,
        profilePicture
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bio: updatedUser.bio,
          profilePicture: updatedUser.profilePicture,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          lastLogin: updatedUser.lastLogin,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });

    } catch (error) {
      console.error('Profile update error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        message: 'Internal server error while updating profile'
      });
    }
  }

  // PUT /api/user/change-password
  async changePassword(req, res) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      await userService.changeUserPassword(userId, currentPassword, newPassword);

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Password change error:', error);

      if (error.name === 'AuthError') {
        return res.status(401).json({
          message: error.message
        });
      }

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        message: 'Internal server error while changing password'
      });
    }
  }

  // DELETE /api/user/account
  async deleteAccount(req, res) {
    try {
      const userId = req.user._id;
      const { password } = req.body;

      await userService.deleteUser(userId, password);

      res.json({
        message: 'Account deleted successfully'
      });

    } catch (error) {
      console.error('Account deletion error:', error);

      if (error.name === 'AuthError') {
        return res.status(401).json({
          message: error.message
        });
      }

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.status(500).json({
        message: 'Internal server error while deleting account'
      });
    }
  }
}

module.exports = new UserController();
