const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const promoCodeService = require('./promoCodeService');
const messagingService = require('./messagingService');

class AuthService {
  // Register a new user
  async registerUser(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      bio,
      profilePicture,
      promoCode
    } = userData;

    const normalizedEmail = email?.toLowerCase().trim();
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedProfilePicture = profilePicture?.trim();
    const trimmedBio = bio?.trim();
    const normalizedPromoCode = promoCode?.trim().toUpperCase();
    const validationErrors = {};

    if (!normalizedEmail) {
      validationErrors.email = { message: 'Email: Email is required' };
    }

    if (!password || !password.trim()) {
      validationErrors.password = { message: 'Password: Password is required' };
    }

    if (!trimmedFirstName) {
      validationErrors.firstName = { message: 'First Name: First name is required' };
    }

    if (!trimmedLastName) {
      validationErrors.lastName = { message: 'Last Name: Last name is required' };
    }

    if (!trimmedProfilePicture) {
      validationErrors.profilePicture = { message: 'Profile Picture: Profile picture is required' };
    }

    if (!trimmedBio) {
      validationErrors.bio = { message: 'Bio: Bio is required' };
    }

    if (!normalizedPromoCode) {
      validationErrors.promoCode = { message: 'Promo Code: Promo code is required' };
    }

    if (Object.keys(validationErrors).length > 0) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = validationErrors;
      throw validationError;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.name = 'AuthError';
      throw error;
    }

    const { promoCode: promoCodeDocument, isStatic } = await promoCodeService.assertPromoCodeIsValid(normalizedPromoCode);

    // Create new user
    const user = new User({
      email: normalizedEmail,
      password,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      bio: trimmedBio,
      profilePicture: trimmedProfilePicture
    });

    await user.save();
    if (!isStatic) {
      await promoCodeService.recordUsage({ promoCode: promoCodeDocument, userId: user._id });
    }

    await this.sendWelcomeMessage(user).catch(error => {
      console.error('Welcome message dispatch failed:', error);
    });

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

  async sendWelcomeMessage(user) {
    const adminEmail = process.env.ADMIN_SUPPORT_EMAIL || 'team@rentalizer.ai';

    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      console.warn(`Welcome message skipped: admin user with email ${adminEmail} not found.`);
      return;
    }

    const senderName = [adminUser.firstName, adminUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Kristina';

    const recipientName = user.firstName?.trim() || user.lastName?.trim()
      ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
      : user.email;

    const message = `Welcome to Rentalizer, ${recipientName}!\n\nMessage us here if you need help with anything.\n\nKristina\nClient Success`;

    await messagingService.sendMessage({
      sender_id: adminUser._id.toString(),
      recipient_id: user._id.toString(),
      message,
      sender_name: senderName,
      support_category: 'general',
      priority: 'medium'
    });
  }
}

module.exports = new AuthService();
