const User = require('../models/User');
const r2StorageService = require('./r2StorageService');

class UserService {
  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    return user;
  }

  // Update user profile
  async updateUser(userId, updateData) {
    const { firstName, lastName, bio, profilePicture } = updateData;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    const previousProfilePicture = user.profilePicture;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio || null; // Convert empty string to null

    if (profilePicture !== undefined) {
      if (profilePicture === '') {
        user.profilePicture = null;
      } else {
        user.profilePicture = profilePicture;
      }
    }

    await user.save();

    if (
      previousProfilePicture &&
      previousProfilePicture !== user.profilePicture
    ) {
      const key = r2StorageService.extractKeyFromUrl(previousProfilePicture);
      if (key) {
        r2StorageService.deleteObject(key).catch((err) => {
          console.warn('⚠️  Failed to remove previous avatar from R2:', err.message);
        });
      }
    }

    return user;
  }

  // Change user password
  async changeUserPassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.name = 'AuthError';
      throw error;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return true;
  }

  // Delete user account
  async deleteUser(userId, password) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    // Verify password before deletion
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Password is incorrect');
      error.name = 'AuthError';
      throw error;
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    return true;
  }

  // Permanently delete user (admin only, requires deactivation first)
  async permanentlyDeleteUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (user.isActive) {
      const error = new Error('User must be deactivated before deletion');
      error.name = 'ValidationError';
      throw error;
    }

    const profilePicture = user.profilePicture;

    await User.findByIdAndDelete(userId);

    if (profilePicture) {
      const key = r2StorageService.extractKeyFromUrl(profilePicture);
      if (key) {
        r2StorageService.deleteObject(key).catch((err) => {
          console.warn('⚠️  Failed to remove user avatar from R2:', err.message);
        });
      }
    }

    return true;
  }

  // Deactivate user account
  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return user;
  }

  // Activate user account
  async activateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return user;
  }

  // Get all users (admin function)
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const query = {};
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.search) {
      query.$or = [
        { email: { $regex: filters.search, $options: 'i' } },
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get user statistics
  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      newUsersToday
    };
  }
}

module.exports = new UserService();
