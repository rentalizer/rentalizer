const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validateDiscussion, validateDiscussionUpdate } = require('../middleware/validation');
const { uploadDiscussionAttachment, handleUploadError } = require('../middleware/upload');

// Public routes (no authentication required)
router.get('/', discussionController.getDiscussions);
router.get('/stats', discussionController.getDiscussionStats);
router.get('/popular', discussionController.getPopularDiscussions);
router.get('/search', discussionController.searchDiscussions);
router.get('/category/:category', discussionController.getDiscussionsByCategory);
router.get('/user/:userId', discussionController.getUserDiscussions);
router.post(
  '/attachments',
  authenticateToken,
  uploadDiscussionAttachment,
  handleUploadError,
  discussionController.uploadAttachment
);
router.get('/:id', discussionController.getDiscussionById);

// Protected routes (authentication required)
router.post('/', authenticateToken, validateDiscussion, discussionController.createDiscussion);
router.put('/:id', authenticateToken, validateDiscussionUpdate, discussionController.updateDiscussion);
router.delete('/:id', authenticateToken, discussionController.deleteDiscussion);
router.post('/:id/like', authenticateToken, discussionController.toggleLike);
router.get('/my', authenticateToken, discussionController.getMyDiscussions);

// Admin-only routes
router.post('/:id/pin', authenticateToken, requireAdmin, discussionController.togglePin);

module.exports = router;
