const path = require('path');
const videoService = require('../services/videoService');
const r2StorageService = require('../services/r2StorageService');

const parseJsonField = (value) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const determineAttachmentType = (mimetype = '', filename = '') => {
  const ext = path.extname(filename).toLowerCase();
  const normalizedMime = mimetype.toLowerCase();

  if (normalizedMime.includes('pdf') || ext === '.pdf') {
    return 'pdf';
  }

  if (
    normalizedMime.includes('spreadsheet') ||
    normalizedMime.includes('excel') ||
    ['.xls', '.xlsx', '.xlsm', '.csv', '.ods'].includes(ext)
  ) {
    return 'spreadsheet';
  }

  if (
    normalizedMime.includes('presentation') ||
    normalizedMime.includes('powerpoint') ||
    ['.ppt', '.pptx', '.ppsx', '.odp'].includes(ext)
  ) {
    return 'presentation';
  }

  if (normalizedMime.startsWith('text/') || ['.txt', '.md'].includes(ext)) {
    return 'text';
  }

  return 'document';
};

class VideoController {
  // GET /api/videos - Get all videos with filtering and pagination
  async getAllVideos(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        category = 'all',
        search = '',
        featured = null,
        sortBy = 'order',
        sortOrder = 'asc'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        search,
        featured: featured === 'true' ? true : featured === 'false' ? false : null,
        sortBy,
        sortOrder
      };

      const result = await videoService.getAllVideos(options);

      res.json({
        success: true,
        message: 'Videos retrieved successfully',
        data: result.videos,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get all videos error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving videos'
      });
    }
  }

  // GET /api/videos/:id - Get video by ID
  async getVideoById(req, res) {
    try {
      const { id } = req.params;
      const video = await videoService.getVideoById(id);

      res.json({
        success: true,
        message: 'Video retrieved successfully',
        data: video
      });

    } catch (error) {
      console.error('Get video by ID error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving video'
      });
    }
  }

  // POST /api/videos - Create new video (Admin only)
  async createVideo(req, res) {
    try {
      const createdBy = req.user._id;
      const videoData = req.body;

      if (videoData.tags) {
        const parsedTags = parseJsonField(videoData.tags);
        if (Array.isArray(parsedTags)) {
          videoData.tags = parsedTags;
        }
      }

      if (videoData.featured !== undefined) {
        videoData.featured = videoData.featured === 'true' || videoData.featured === true;
      }

      if (videoData.isLive !== undefined) {
        videoData.isLive = videoData.isLive === 'true' || videoData.isLive === true;
      }

      if (videoData.attachment) {
        videoData.attachment = parseJsonField(videoData.attachment);
      }

      // Handle file upload for attachment if present
      if (req.file) {
        const categoryForStorage = videoData.category || 'Training Replays';
        const uploadResult = await r2StorageService.uploadDocument(req.file, categoryForStorage);

        videoData.attachment = {
          filename: req.file.originalname,
          storageKey: uploadResult.key,
          url: uploadResult.url,
          type: determineAttachmentType(req.file.mimetype, req.file.originalname),
          size: req.file.size,
          contentType: req.file.mimetype
        };
      }

      const video = await videoService.createVideo(videoData, createdBy);

      res.status(201).json({
        success: true,
        message: 'Video created successfully',
        data: video
      });

    } catch (error) {
      console.error('Create video error:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while creating video'
      });
    }
  }

  // PUT /api/videos/:id - Update video (Admin only)
  async updateVideo(req, res) {
    try {
      const { id } = req.params;
      const modifiedBy = req.user._id;
      const updateData = req.body;

      if (updateData.tags) {
        const parsedTags = parseJsonField(updateData.tags);
        if (Array.isArray(parsedTags)) {
          updateData.tags = parsedTags;
        }
      }

      if (updateData.featured !== undefined) {
        updateData.featured = updateData.featured === 'true' || updateData.featured === true;
      }

      if (updateData.isLive !== undefined) {
        updateData.isLive = updateData.isLive === 'true' || updateData.isLive === true;
      }

      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
      }

      if (updateData.attachment) {
        updateData.attachment = parseJsonField(updateData.attachment);
      }

      if (updateData.attachment === 'null') {
        updateData.attachment = null;
      }

      if (req.file) {
        const categoryForStorage = updateData.category || 'Training Replays';
        const uploadResult = await r2StorageService.uploadDocument(req.file, categoryForStorage);
        updateData.attachment = {
          filename: req.file.originalname,
          storageKey: uploadResult.key,
          url: uploadResult.url,
          type: determineAttachmentType(req.file.mimetype, req.file.originalname),
          size: req.file.size,
          contentType: req.file.mimetype
        };
      }

      const video = await videoService.updateVideo(id, updateData, modifiedBy);

      res.json({
        success: true,
        message: 'Video updated successfully',
        data: video
      });

    } catch (error) {
      console.error('Update video error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating video'
      });
    }
  }

  // DELETE /api/videos/:id - Delete video (Admin only)
  async deleteVideo(req, res) {
    try {
      const { id } = req.params;
      await videoService.deleteVideo(id);

      res.json({
        success: true,
        message: 'Video deleted successfully'
      });

    } catch (error) {
      console.error('Delete video error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting video'
      });
    }
  }

  // PATCH /api/videos/:id/featured - Toggle featured status (Admin only)
  async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const modifiedBy = req.user._id;

      const video = await videoService.toggleFeatured(id, modifiedBy);

      res.json({
        success: true,
        message: `Video ${video.featured ? 'featured' : 'unfeatured'} successfully`,
        data: video
      });

    } catch (error) {
      console.error('Toggle featured error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating featured status'
      });
    }
  }

  // POST /api/videos/:id/view - Increment video views
  async incrementViews(req, res) {
    try {
      const { id } = req.params;
      const video = await videoService.incrementViews(id);

      res.json({
        success: true,
        message: 'View count updated',
        data: { views: video.views }
      });

    } catch (error) {
      console.error('Increment views error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating view count'
      });
    }
  }

  // PUT /api/videos/reorder - Reorder videos (Admin only)
  async reorderVideos(req, res) {
    try {
      const { videoOrders } = req.body;
      const modifiedBy = req.user._id;

      if (!Array.isArray(videoOrders) || videoOrders.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Video orders array is required'
        });
      }

      const result = await videoService.reorderVideos(videoOrders, modifiedBy);

      res.json({
        success: true,
        message: 'Videos reordered successfully',
        data: result.videos
      });

    } catch (error) {
      console.error('Reorder videos error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while reordering videos'
      });
    }
  }

  // GET /api/videos/stats - Get video statistics (Admin only)
  async getVideoStats(req, res) {
    try {
      const stats = await videoService.getVideoStats();

      res.json({
        success: true,
        message: 'Video statistics retrieved successfully',
        data: stats
      });

    } catch (error) {
      console.error('Get video stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving video statistics'
      });
    }
  }

  // GET /api/videos/featured - Get featured videos
  async getFeaturedVideos(req, res) {
    try {
      const { limit = 5 } = req.query;
      const videos = await videoService.getFeaturedVideos(parseInt(limit));

      res.json({
        success: true,
        message: 'Featured videos retrieved successfully',
        data: videos
      });

    } catch (error) {
      console.error('Get featured videos error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving featured videos'
      });
    }
  }

  // GET /api/videos/category/:category - Get videos by category
  async getVideosByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 10 } = req.query;
      
      const videos = await videoService.getVideosByCategory(category, parseInt(limit));

      res.json({
        success: true,
        message: `Videos in ${category} category retrieved successfully`,
        data: videos
      });

    } catch (error) {
      console.error('Get videos by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving videos by category'
      });
    }
  }

  // GET /api/videos/search - Search videos
  async searchVideos(req, res) {
    try {
      const { q: searchTerm, page = 1, limit = 20, category = 'all' } = req.query;

      if (!searchTerm || searchTerm.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category
      };

      const result = await videoService.searchVideos(searchTerm.trim(), options);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: result.videos,
        pagination: result.pagination,
        searchTerm: searchTerm.trim()
      });

    } catch (error) {
      console.error('Search videos error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while searching videos'
      });
    }
  }

  // GET /api/videos/categories - Get all video categories
  async getVideoCategories(req, res) {
    try {
      const categories = await videoService.getVideoCategories();

      res.json({
        success: true,
        message: 'Video categories retrieved successfully',
        data: categories
      });

    } catch (error) {
      console.error('Get video categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving video categories'
      });
    }
  }

  // PUT /api/videos/bulk - Bulk update videos (Admin only)
  async bulkUpdateVideos(req, res) {
    try {
      const { videoIds, updateData } = req.body;
      const modifiedBy = req.user._id;

      if (!Array.isArray(videoIds) || videoIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Video IDs array is required'
        });
      }

      const result = await videoService.bulkUpdateVideos(videoIds, updateData, modifiedBy);

      res.json({
        success: true,
        message: `${result.modifiedCount} videos updated successfully`,
        data: { modifiedCount: result.modifiedCount }
      });

    } catch (error) {
      console.error('Bulk update videos error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while bulk updating videos'
      });
    }
  }
}

module.exports = new VideoController();
