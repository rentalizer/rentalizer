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
