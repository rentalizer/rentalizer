const express = require('express');
const router = express.Router();
const { uploadThumbnail, deleteThumbnail } = require('../controllers/uploadController');
const { uploadThumbnail: uploadMiddleware, handleUploadError } = require('../middleware/upload');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Upload thumbnail image (Admin only)
router.post('/thumbnail', 
  authenticateToken, 
  requireAdmin, 
  uploadMiddleware, 
  handleUploadError, 
  uploadThumbnail
);

// Delete thumbnail image (Admin only)
router.delete('/thumbnail/:filename', 
  authenticateToken, 
  requireAdmin, 
  deleteThumbnail
);

module.exports = router;
