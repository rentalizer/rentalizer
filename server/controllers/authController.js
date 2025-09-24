const authService = require('../services/authService');

class AuthController {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const result = await authService.registerUser({
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'User with this email already exists'
        });
      }

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      if (error.name === 'AuthError') {
        return res.status(400).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Internal server error during registration'
      });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.loginUser(email, password);

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });

    } catch (error) {
      console.error('Login error:', error);

      if (error.name === 'AuthError') {
        return res.status(401).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Internal server error during login'
      });
    }
  }

  // POST /api/auth/refresh (optional - refresh token endpoint)
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshUserToken(refreshToken);

      res.json({
        message: 'Token refreshed successfully',
        token: result.token
      });

    } catch (error) {
      console.error('Token refresh error:', error);

      if (error.name === 'AuthError') {
        return res.status(401).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Internal server error during token refresh'
      });
    }
  }

  // POST /api/auth/logout (optional - logout endpoint)
  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is typically handled client-side
      // by removing the token. However, you could implement token blacklisting here.
      
      res.json({
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        message: 'Internal server error during logout'
      });
    }
  }
}

module.exports = new AuthController();
