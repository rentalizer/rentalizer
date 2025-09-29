const path = require('path');
const fs = require('fs');

// Upload thumbnail image
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the file path relative to the server
    const filePath = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: filePath,
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
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    
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

module.exports = {
  uploadThumbnail,
  deleteThumbnail
};
