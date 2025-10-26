const discussionService = require('../services/discussionService');

class DiscussionController {
  /**
   * Create a new discussion post
   * POST /api/discussions
   */
  async createDiscussion(req, res) {
    try {
      const userId = req.user.id;
      const discussionData = req.body;

      const discussion = await discussionService.createDiscussion(discussionData, userId);

      res.status(201).json({
        success: true,
        message: 'Discussion created successfully',
        data: discussion
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create discussion'
      });
    }
  }

  /**
   * Upload an attachment for discussions
   * POST /api/discussions/attachments
   */
  async uploadAttachment(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No attachment file provided'
        });
      }

      const userId = req.user?.id;
      const attachment = await discussionService.uploadAttachment(req.file, userId);

      res.status(200).json({
        success: true,
        message: 'Attachment uploaded successfully',
        data: attachment
      });
    } catch (error) {
      console.error('Error uploading discussion attachment:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload attachment'
      });
    }
  }

  /**
   * Get all discussions with pagination and filtering
   * GET /api/discussions
   */
  async getDiscussions(req, res) {
    try {
      const userId = req.user?.id;
      const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        search,
        sortBy,
        sortOrder
      };

      const result = await discussionService.getDiscussions(options, userId);

      res.status(200).json({
        success: true,
        message: 'Discussions retrieved successfully',
        data: result.discussions,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting discussions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve discussions'
      });
    }
  }

  /**
   * Get a single discussion by ID
   * GET /api/discussions/:id
   */
  async getDiscussionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const discussion = await discussionService.getDiscussionById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Discussion retrieved successfully',
        data: discussion
      });
    } catch (error) {
      console.error('Error getting discussion:', error);
      const statusCode = error.message === 'Discussion not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to retrieve discussion'
      });
    }
  }

  /**
   * Update a discussion
   * PUT /api/discussions/:id
   */
  async updateDiscussion(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const discussion = await discussionService.updateDiscussion(id, updateData, userId);

      res.status(200).json({
        success: true,
        message: 'Discussion updated successfully',
        data: discussion
      });
    } catch (error) {
      console.error('Error updating discussion:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update discussion'
      });
    }
  }

  /**
   * Delete a discussion
   * DELETE /api/discussions/:id
   */
  async deleteDiscussion(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await discussionService.deleteDiscussion(id, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error deleting discussion:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete discussion'
      });
    }
  }

  /**
   * Like or unlike a discussion
   * POST /api/discussions/:id/like
   */
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await discussionService.toggleLike(id, userId);

      res.status(200).json({
        success: true,
        message: result.isLiked ? 'Discussion liked' : 'Discussion unliked',
        data: {
          discussion: result.discussion,
          isLiked: result.isLiked,
          likesCount: result.likesCount
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle like'
      });
    }
  }

  /**
   * Pin or unpin a discussion (admin only)
   * POST /api/discussions/:id/pin
   */
  async togglePin(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await discussionService.togglePin(id, userId);

      res.status(200).json({
        success: true,
        message: result.isPinned ? 'Discussion pinned' : 'Discussion unpinned',
        data: {
          discussion: result.discussion,
          isPinned: result.isPinned
        }
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle pin'
      });
    }
  }

  /**
   * Get discussion statistics
   * GET /api/discussions/stats
   */
  async getDiscussionStats(req, res) {
    try {
      const stats = await discussionService.getDiscussionStats();

      res.status(200).json({
        success: true,
        message: 'Discussion statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting discussion stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve discussion statistics'
      });
    }
  }

  /**
   * Get popular discussions
   * GET /api/discussions/popular
   */
  async getPopularDiscussions(req, res) {
    try {
      const { limit = 5 } = req.query;
      const discussions = await discussionService.getPopularDiscussions(parseInt(limit));

      res.status(200).json({
        success: true,
        message: 'Popular discussions retrieved successfully',
        data: discussions
      });
    } catch (error) {
      console.error('Error getting popular discussions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve popular discussions'
      });
    }
  }

  /**
   * Search discussions
   * GET /api/discussions/search
   */
  async searchDiscussions(req, res) {
    try {
      const { q: searchTerm, ...options } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await discussionService.searchDiscussions(searchTerm, options);

      res.status(200).json({
        success: true,
        message: 'Search results retrieved successfully',
        data: result.discussions,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error searching discussions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search discussions'
      });
    }
  }

  /**
   * Get discussions by category
   * GET /api/discussions/category/:category
   */
  async getDiscussionsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const userId = req.user?.id;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await discussionService.getDiscussionsByCategory(category, options);

      res.status(200).json({
        success: true,
        message: `Discussions in category '${category}' retrieved successfully`,
        data: result.discussions,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting discussions by category:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve discussions by category'
      });
    }
  }

  /**
   * Get user's discussions
   * GET /api/discussions/user/:userId
   */
  async getUserDiscussions(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const requestingUserId = req.user?.id;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await discussionService.getUserDiscussions(userId, options);

      res.status(200).json({
        success: true,
        message: `User discussions retrieved successfully`,
        data: result.discussions,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting user discussions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve user discussions'
      });
    }
  }

  /**
   * Get current user's discussions
   * GET /api/discussions/my
   */
  async getMyDiscussions(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await discussionService.getUserDiscussions(userId, options);

      res.status(200).json({
        success: true,
        message: 'Your discussions retrieved successfully',
        data: result.discussions,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting user discussions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve your discussions'
      });
    }
  }
}

module.exports = new DiscussionController();
