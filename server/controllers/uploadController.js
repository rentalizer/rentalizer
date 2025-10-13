const r2StorageService = require('../services/r2StorageService');

// Upload thumbnail image
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { key, url } = await r2StorageService.uploadThumbnailImage(req.file);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        key,
        url,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
};

// Delete uploaded image
const deleteThumbnail = async (req, res) => {
  try {
    const { filename } = req.params || {};
    const { key: bodyKey, url: bodyUrl } = req.body || {};
    const keyFromQuery = req.query.key || bodyKey;
    const urlFromQuery = req.query.url || bodyUrl;

    const objectKey =
      keyFromQuery ||
      r2StorageService.extractKeyFromUrl(urlFromQuery) ||
      null;

    if (!objectKey) {
      return res.status(400).json({
        success: false,
        message: 'No thumbnail identifier provided'
      });
    }

    const deleted = await r2StorageService.deleteObject(objectKey);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

// Upload general photo
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the file path relative to the server
    const filePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
    
    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: filePath,
        url: fullUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo'
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const userId = req.user?._id?.toString();
    const { key, url } = await r2StorageService.uploadAvatar(req.file, userId);

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        key,
        url
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

const uploadPublicAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const { key, url } = await r2StorageService.uploadAvatar(req.file, 'public');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        key,
        url
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

module.exports = {
  uploadThumbnail,
  uploadPhoto,
  deleteThumbnail,
  uploadAvatar,
  uploadPublicAvatar
};
