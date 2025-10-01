const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { uploadPhoto, handleUploadError } = require('../middleware/upload');
const { 
  validateNewsItem, 
  validateNewsItemUpdate, 
  validateObjectId,
  validatePagination,
  validateAggregation 
} = require('../middleware/newsValidation');

// Public routes (no authentication required)
router.get('/', validatePagination, newsController.getNewsItems);
router.get('/trending', newsController.getTrendingNews);
router.get('/featured', newsController.getFeaturedNews);
router.get('/stats', newsController.getNewsStats);
router.get('/stats/by-source', newsController.getNewsBySource);
router.get('/search', validatePagination, newsController.searchNews);
router.get('/sources', newsController.getAvailableSources);
router.get('/source/:source', validatePagination, newsController.getNewsBySourceName);
router.get('/:id', validateObjectId, newsController.getNewsItemById);

// Public click tracking (no auth required for analytics)
router.post('/:id/click', validateObjectId, newsController.incrementClickCount);

// Protected routes (authentication required)
router.post('/', authenticateToken, uploadPhoto, handleUploadError, validateNewsItem, newsController.createNewsItem);
router.put('/:id', authenticateToken, validateObjectId, validateNewsItemUpdate, newsController.updateNewsItem);
router.delete('/:id', authenticateToken, validateObjectId, newsController.deleteNewsItem);

// Admin-only routes
router.post('/:id/pin', authenticateToken, requireAdmin, validateObjectId, newsController.togglePin);
router.post('/:id/feature', authenticateToken, requireAdmin, validateObjectId, newsController.toggleFeatured);
router.post('/aggregate', authenticateToken, requireAdmin, validateAggregation, newsController.triggerAggregation);
router.post('/aggregate/:source', authenticateToken, requireAdmin, newsController.fetchFromSource);
router.patch('/sources/:source', authenticateToken, requireAdmin, newsController.toggleSource);

module.exports = router;

