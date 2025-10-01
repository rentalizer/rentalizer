const express = require('express');
const router = express.Router();
const { uploadThumbnail, uploadPhoto, deleteThumbnail } = require('../controllers/uploadController');
const { uploadThumbnail: uploadMiddleware, uploadPhoto: uploadPhotoMiddleware, handleUploadError } = require('../middleware/upload');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Upload thumbnail image (Admin only)
router.post('/thumbnail', 
  authenticateToken, 
  requireAdmin, 
  uploadMiddleware, 
  handleUploadError, 
  uploadThumbnail
);

// Upload general photo (Authenticated users)
router.post('/photo', 
  authenticateToken,
  uploadPhotoMiddleware, 
  handleUploadError, 
  uploadPhoto
);

// Delete thumbnail image (Admin only)
router.delete('/thumbnail/:filename', 
  authenticateToken, 
  requireAdmin, 
  deleteThumbnail
);

module.exports = router;
