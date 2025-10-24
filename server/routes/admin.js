const express = require('express');
const userService = require('../services/userService');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await userService.getAllUsers(
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      message: 'Users retrieved successfully',
      ...result
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving users'
    });
  }
});

// GET /api/admin/members - Detailed member list with filters (admin only)
router.get('/members', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      search,
      status,
      role
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);

    const filters = {};

    if (typeof search === 'string' && search.trim().length > 0) {
      filters.search = search.trim();
    }

    if (typeof status === 'string') {
      if (status === 'active') {
        filters.isActive = true;
      } else if (status === 'inactive') {
        filters.isActive = false;
      }
    }

    if (typeof role === 'string' && role !== 'all' && role.trim().length > 0) {
      filters.role = role.trim();
    }

    const result = await userService.getAllUsers(pageNumber, limitNumber, filters);
    const summary = await userService.getUserStats();

    res.json({
      message: 'Members retrieved successfully',
      members: result.users,
      pagination: result.pagination,
      summary
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving members'
    });
  }
});

// PATCH /api/admin/users/:userId/status - Update user active status (admin only)
router.patch('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        message: 'isActive must be provided as a boolean value',
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
      });
    }

    if (req.user && req.user._id && req.user._id.toString() === userId && isActive === false) {
      return res.status(400).json({
        message: 'You cannot deactivate your own account.',
      });
    }

    const updatedUser = isActive
      ? await userService.activateUser(userId)
      : await userService.deactivateUser(userId);

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user status error:', error);

    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(500).json({
      message: 'Internal server error while updating user status',
    });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await userService.getUserStats();

    res.json({
      message: 'Admin stats retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving stats'
    });
  }
});

module.exports = router;
