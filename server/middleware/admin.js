// Simple admin middleware to check if user has admin privileges
const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (from auth middleware)
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      message: 'Internal server error during admin verification'
    });
  }
};

module.exports = {
  requireAdmin
};
