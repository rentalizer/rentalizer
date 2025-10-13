const express = require('express');
const router = express.Router();
const { uploadThumbnail, uploadPhoto, deleteThumbnail, uploadAvatar, uploadPublicAvatar } = require('../controllers/uploadController');
const { uploadThumbnail: uploadMiddleware, uploadPhoto: uploadPhotoMiddleware, uploadAvatar: uploadAvatarMiddleware, handleUploadError } = require('../middleware/upload');
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

// Upload avatar (Authenticated users)
router.post(
  '/avatar',
  authenticateToken,
  uploadAvatarMiddleware,
  handleUploadError,
  uploadAvatar
);

// Upload avatar without authentication (used during signup)
router.post(
  '/avatar/public',
  uploadAvatarMiddleware,
  handleUploadError,
  uploadPublicAvatar
);

// Delete thumbnail image (Admin only)
router.delete('/thumbnail/:filename', 
  authenticateToken, 
  requireAdmin, 
  deleteThumbnail
);

module.exports = router;
