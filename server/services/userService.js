const User = require('../models/User');

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

    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (bio !== undefined) updateFields.bio = bio || null; // Convert empty string to null
    // Only update profilePicture if it's not empty string
    if (profilePicture !== undefined && profilePicture !== '') {
      updateFields.profilePicture = profilePicture;
    } else if (profilePicture === '') {
      // If explicitly set to empty string, set to null
      updateFields.profilePicture = null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday
    };
  }
}

module.exports = new UserService();
