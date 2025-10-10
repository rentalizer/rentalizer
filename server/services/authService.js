const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const promoCodeService = require('./promoCodeService');

class AuthService {
  // Register a new user
  async registerUser(userData) {
    const { email, password, firstName, lastName, bio, profilePicture, promoCode } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.name = 'AuthError';
      throw error;
    }

    const promoCodeDocument = await promoCodeService.assertPromoCodeIsValid(promoCode);

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      bio: bio || null,
      profilePicture: profilePicture || null
    });

    await user.save();
    await promoCodeService.recordUsage({ promoCode: promoCodeDocument, userId: user._id });

    // Generate JWT token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  }

  // Login user
  async loginUser(email, password) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.name = 'AuthError';
      throw error;
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error('Account is deactivated');
      error.name = 'AuthError';
      throw error;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.name = 'AuthError';
      throw error;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    };
  }

  // Refresh user token (optional feature)
  async refreshUserToken(refreshToken) {
    // In a more complex system, you might have separate refresh tokens
    // For now, we'll just generate a new token
    // You could implement refresh token logic here
    
    const error = new Error('Refresh token functionality not implemented');
    error.name = 'AuthError';
    throw error;
  }

  // Verify user token (used by middleware)
  async verifyUserToken(token) {
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        const error = new Error('Invalid token. User not found.');
        error.name = 'AuthError';
        throw error;
      }

      if (!user.isActive) {
        const error = new Error('Account is deactivated.');
        error.name = 'AuthError';
        throw error;
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        const authError = new Error('Invalid token.');
        authError.name = 'AuthError';
        throw authError;
      }
      
      if (error.name === 'TokenExpiredError') {
        const authError = new Error('Token expired.');
        authError.name = 'AuthError';
        throw authError;
      }

      throw error;
    }
  }

  // Check if email exists
  async emailExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  // Get user by email
  async getUserByEmail(email) {
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
