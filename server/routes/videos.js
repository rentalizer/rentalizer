const express = require('express');
const videoController = require('../controllers/videoController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { uploadDocument } = require('../middleware/upload');
const { 
  validateVideo, 
  validateVideoUpdate, 
  validateVideoReorder, 
  validateBulkUpdate 
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)
// GET /api/videos - Get all videos with filtering and pagination
router.get('/', videoController.getAllVideos);

// GET /api/videos/featured - Get featured videos
router.get('/featured', videoController.getFeaturedVideos);

// GET /api/videos/category/:category - Get videos by category
router.get('/category/:category', videoController.getVideosByCategory);

// GET /api/videos/search - Search videos
router.get('/search', videoController.searchVideos);

// GET /api/videos/categories - Get all video categories
router.get('/categories', videoController.getVideoCategories);

// GET /api/videos/:id - Get video by ID
router.get('/:id', videoController.getVideoById);

// POST /api/videos/:id/view - Increment video views (public but rate-limited)
router.post('/:id/view', videoController.incrementViews);

// Protected routes (authentication required)
// All routes below require authentication
router.use(authenticateToken);

// Admin-only routes
// POST /api/videos - Create new video (Admin only)
router.post('/', requireAdmin, uploadDocument, validateVideo, videoController.createVideo);

// PUT /api/videos/:id - Update video (Admin only)
router.put('/:id', requireAdmin, validateVideoUpdate, videoController.updateVideo);

// DELETE /api/videos/:id - Delete video (Admin only)
router.delete('/:id', requireAdmin, videoController.deleteVideo);

// PATCH /api/videos/:id/featured - Toggle featured status (Admin only)
router.patch('/:id/featured', requireAdmin, videoController.toggleFeatured);

// PUT /api/videos/reorder - Reorder videos (Admin only)
router.put('/reorder', requireAdmin, validateVideoReorder, videoController.reorderVideos);

// GET /api/videos/stats - Get video statistics (Admin only)
router.get('/admin/stats', requireAdmin, videoController.getVideoStats);

// PUT /api/videos/bulk - Bulk update videos (Admin only)
router.put('/bulk', requireAdmin, validateBulkUpdate, videoController.bulkUpdateVideos);

module.exports = router;
