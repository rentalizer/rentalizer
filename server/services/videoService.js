const Video = require('../models/Video');

class VideoService {
  // Create a new video
  async createVideo(videoData, createdBy) {
    try {
      const video = new Video({
        ...videoData,
        createdBy,
        lastModifiedBy: createdBy
      });

      await video.save();
      return await this.getVideoById(video._id);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.errors = errors;
        throw validationError;
      }
      throw error;
    }
  }

  // Get video by ID
  async getVideoById(videoId) {
    const video = await Video.findById(videoId)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return video;
  }

  // Get all videos with filtering, sorting, and pagination
  async getAllVideos(options = {}) {
    const {
      page = 1,
      limit = 20,
      category = 'all',
      search = '',
      featured = null,
      isActive = true,
      sortBy = 'order',
      sortOrder = 'asc'
    } = options;

    const skip = (page - 1) * limit;
    const query = {};

    // Filter by category
    if (category !== 'all') {
      query.category = category;
    }

    // Filter by featured status
    if (featured !== null) {
      query.featured = featured;
    }

    // Filter by active status
    if (isActive !== null) {
      query.isActive = isActive;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort configuration - prioritize featured videos
    const sortConfig = {};
    
    // Always sort by featured first (featured videos go to top)
    sortConfig.featured = -1; // -1 means descending (true comes before false)
    
    // Then sort by the requested field
    if (sortBy !== 'featured') {
      sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const videos = await Video.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments(query);

    return {
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Update video
  async updateVideo(videoId, updateData, modifiedBy) {
    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        {
          ...updateData,
          lastModifiedBy: modifiedBy
        },
        { new: true, runValidators: true }
      )
        .populate('createdBy', 'firstName lastName email')
        .populate('lastModifiedBy', 'firstName lastName email');

      if (!video) {
        const error = new Error('Video not found');
        error.name = 'NotFoundError';
        throw error;
      }

      return video;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.errors = errors;
        throw validationError;
      }
      throw error;
    }
  }

  // Delete video
  async deleteVideo(videoId) {
    const video = await Video.findByIdAndDelete(videoId);
    
    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return video;
  }

  // Toggle featured status
  async toggleFeatured(videoId, modifiedBy) {
    const video = await Video.findById(videoId);
    
    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }

    video.featured = !video.featured;
    video.lastModifiedBy = modifiedBy;
    await video.save();

    return await this.getVideoById(videoId);
  }

  // Increment video views
  async incrementViews(videoId) {
    const video = await Video.findById(videoId);
    
    if (!video) {
      const error = new Error('Video not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return await video.incrementViews();
  }

  // Reorder videos
  async reorderVideos(videoOrders, modifiedBy) {
    try {
      // Validate that all video IDs exist
      const videoIds = videoOrders.map(item => item.videoId);
      const existingVideos = await Video.find({ _id: { $in: videoIds } });
      
      if (existingVideos.length !== videoIds.length) {
        const error = new Error('One or more videos not found');
        error.name = 'NotFoundError';
        throw error;
      }

      // Update lastModifiedBy for all videos
      await Video.updateMany(
        { _id: { $in: videoIds } },
        { lastModifiedBy: modifiedBy }
      );

      // Reorder videos
      await Video.reorderVideos(videoOrders);
      
      return await this.getAllVideos({ sortBy: 'order', sortOrder: 'asc' });
    } catch (error) {
      throw error;
    }
  }

  // Get video statistics
  async getVideoStats() {
    const totalVideos = await Video.countDocuments();
    const activeVideos = await Video.countDocuments({ isActive: true });
    const featuredVideos = await Video.countDocuments({ featured: true });
    const totalViews = await Video.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Category breakdown
    const categoryStats = await Video.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent videos (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentVideos = await Video.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      totalVideos,
      activeVideos,
      featuredVideos,
      totalViews: totalViews[0]?.totalViews || 0,
      recentVideos,
      categoryStats
    };
  }

  // Get featured videos
  async getFeaturedVideos(limit = 5) {
    return await Video.find({ featured: true, isActive: true })
      .populate('createdBy', 'firstName lastName email')
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit);
  }

  // Get videos by category
  async getVideosByCategory(category, limit = 10) {
    return await Video.find({ category, isActive: true })
      .populate('createdBy', 'firstName lastName email')
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit);
  }

  // Search videos
  async searchVideos(searchTerm, options = {}) {
    const {
      page = 1,
      limit = 20,
      category = 'all'
    } = options;

    const skip = (page - 1) * limit;
    const query = {
      isActive: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };

    if (category !== 'all') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments(query);

    return {
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Bulk operations
  async bulkUpdateVideos(videoIds, updateData, modifiedBy) {
    try {
      const result = await Video.updateMany(
        { _id: { $in: videoIds } },
        {
          ...updateData,
          lastModifiedBy: modifiedBy
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get video categories
  async getVideoCategories() {
    // Get categories from existing videos
    const existingCategories = await Video.distinct('category', { isActive: true });
    
    // Define the allowed categories
    const allowedCategories = ['Category 1', 'Category 2', 'Category 3'];
    
    // Combine existing categories with allowed categories and remove duplicates
    const allCategories = [...new Set([...existingCategories, ...allowedCategories])];
    
    return allCategories.sort();
  }
}

module.exports = new VideoService();
