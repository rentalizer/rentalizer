const Discussion = require('../models/Discussion');
const User = require('../models/User');

class DiscussionService {
  /**
   * Create a new discussion post
   * @param {Object} discussionData - The discussion data
   * @param {string} userId - The user ID creating the discussion
   * @returns {Promise<Object>} The created discussion
   */
  async createDiscussion(discussionData, userId) {
    try {
      // Get user info to set author details
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Set author information from user data
      const authorName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email.split('@')[0];

      const discussion = new Discussion({
        ...discussionData,
        user_id: userId,
        author_name: discussionData.author_name || authorName,
        author_avatar: discussionData.author_avatar || user.profilePicture,
        is_admin_post: user.role === 'admin' || user.role === 'superadmin',
        category: discussionData.category || 'General'
      });

      const savedDiscussion = await discussion.save();
      
      // Populate user data for response
      await savedDiscussion.populate('user_id', 'firstName lastName email profilePicture role');
      
      return savedDiscussion;
    } catch (error) {
      throw new Error(`Failed to create discussion: ${error.message}`);
    }
  }

  /**
   * Get discussions with pagination and filtering
   * @param {Object} options - Query options
   * @param {string} requestingUserId - The user requesting the discussions
   * @returns {Promise<Object>} Paginated discussions with metadata
   */
  async getDiscussions(options = {}, requestingUserId = null) {
    try {
      const {
        page = 1,
        limit = 10,
        category = null,
        search = null,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        userId = null
      } = options;

      const query = { is_active: true };
      
      if (category && category !== 'All') {
        query.category = category;
      }
      
      if (search) {
        query.$text = { $search: search };
      }
      
      if (userId) {
        query.user_id = userId;
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      // Always prioritize pinned posts
      if (sortBy === 'createdAt') {
        sortOptions.is_pinned = -1;
      }

      const discussions = await Discussion.find(query)
        .populate('user_id', 'firstName lastName email profilePicture role')
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

      // Update author_avatar with current user profile picture and add like status
      discussions.forEach(discussion => {
        // Use current user's profile picture instead of stored author_avatar
        if (discussion.user_id && discussion.user_id.profilePicture) {
          discussion.author_avatar = discussion.user_id.profilePicture;
        }
        
        // Add like status for requesting user
        if (requestingUserId) {
          discussion._isLiked = discussion.liked_by.includes(requestingUserId);
        }
      });

      const total = await Discussion.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return {
        discussions,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to get discussions: ${error.message}`);
    }
  }

  /**
   * Get a single discussion by ID
   * @param {string} discussionId - The discussion ID
   * @param {string} requestingUserId - The user requesting the discussion
   * @returns {Promise<Object>} The discussion
   */
  async getDiscussionById(discussionId, requestingUserId = null) {
    try {
      const discussion = await Discussion.findOne({ 
        _id: discussionId, 
        is_active: true 
      }).populate('user_id', 'firstName lastName email profilePicture role');

      if (!discussion) {
        throw new Error('Discussion not found');
      }

      // Use current user's profile picture instead of stored author_avatar
      if (discussion.user_id && discussion.user_id.profilePicture) {
        discussion.author_avatar = discussion.user_id.profilePicture;
      }

      // Increment view count
      discussion.views_count += 1;
      await discussion.save();

      // Add like status for requesting user
      if (requestingUserId) {
        discussion._isLiked = discussion.liked_by.includes(requestingUserId);
      }

      return discussion;
    } catch (error) {
      throw new Error(`Failed to get discussion: ${error.message}`);
    }
  }

  /**
   * Update a discussion
   * @param {string} discussionId - The discussion ID
   * @param {Object} updateData - The data to update
   * @param {string} userId - The user updating the discussion
   * @returns {Promise<Object>} The updated discussion
   */
  async updateDiscussion(discussionId, updateData, userId) {
    try {
      const discussion = await Discussion.findOne({ 
        _id: discussionId, 
        is_active: true 
      });

      if (!discussion) {
        throw new Error('Discussion not found');
      }

      // Check if user owns the discussion or is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isOwner = discussion.user_id.toString() === userId;
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only update your own discussions');
      }

      // Update allowed fields
      const allowedUpdates = ['title', 'content', 'category', 'tags'];
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const updatedDiscussion = await Discussion.findByIdAndUpdate(
        discussionId,
        updates,
        { new: true, runValidators: true }
      ).populate('user_id', 'firstName lastName email profilePicture role');

      return updatedDiscussion;
    } catch (error) {
      throw new Error(`Failed to update discussion: ${error.message}`);
    }
  }

  /**
   * Delete a discussion (soft delete)
   * @param {string} discussionId - The discussion ID
   * @param {string} userId - The user deleting the discussion
   * @returns {Promise<Object>} Success message
   */
  async deleteDiscussion(discussionId, userId) {
    try {
      const discussion = await Discussion.findOne({ 
        _id: discussionId, 
        is_active: true 
      });

      if (!discussion) {
        throw new Error('Discussion not found');
      }

      // Check if user owns the discussion or is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isOwner = discussion.user_id.toString() === userId;
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only delete your own discussions');
      }

      // Soft delete
      discussion.is_active = false;
      await discussion.save();

      return { message: 'Discussion deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete discussion: ${error.message}`);
    }
  }

  /**
   * Like or unlike a discussion
   * @param {string} discussionId - The discussion ID
   * @param {string} userId - The user liking/unliking
   * @returns {Promise<Object>} Updated discussion with like status
   */
  async toggleLike(discussionId, userId) {
    try {
      const discussion = await Discussion.findOne({ 
        _id: discussionId, 
        is_active: true 
      });

      if (!discussion) {
        throw new Error('Discussion not found');
      }

      const userObjectId = userId;
      const isLiked = discussion.liked_by.includes(userObjectId);

      if (isLiked) {
        // Unlike
        discussion.liked_by = discussion.liked_by.filter(
          id => id.toString() !== userObjectId
        );
        discussion.likes = Math.max(0, discussion.likes - 1);
      } else {
        // Like
        discussion.liked_by.push(userObjectId);
        discussion.likes += 1;
      }

      await discussion.save();
      await discussion.populate('user_id', 'firstName lastName email profilePicture role');

      return {
        discussion,
        isLiked: !isLiked,
        likesCount: discussion.likes
      };
    } catch (error) {
      throw new Error(`Failed to toggle like: ${error.message}`);
    }
  }

  /**
   * Pin or unpin a discussion (admin only)
   * @param {string} discussionId - The discussion ID
   * @param {string} userId - The admin user
   * @returns {Promise<Object>} Updated discussion
   */
  async togglePin(discussionId, userId) {
    try {
      const discussion = await Discussion.findOne({ 
        _id: discussionId, 
        is_active: true 
      });

      if (!discussion) {
        throw new Error('Discussion not found');
      }

      // Check if user is admin
      const user = await User.findById(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        throw new Error('Unauthorized: Only admins can pin/unpin discussions');
      }

      discussion.is_pinned = !discussion.is_pinned;
      await discussion.save();
      await discussion.populate('user_id', 'firstName lastName email profilePicture role');

      return {
        discussion,
        isPinned: discussion.is_pinned
      };
    } catch (error) {
      throw new Error(`Failed to toggle pin: ${error.message}`);
    }
  }

  /**
   * Get discussion statistics
   * @returns {Promise<Object>} Discussion statistics
   */
  async getDiscussionStats() {
    try {
      const stats = await Discussion.getDiscussionStats();
      return stats[0] || {
        totalDiscussions: 0,
        totalLikes: 0,
        totalComments: 0,
        totalViews: 0,
        pinnedDiscussions: 0,
        adminDiscussions: 0
      };
    } catch (error) {
      throw new Error(`Failed to get discussion stats: ${error.message}`);
    }
  }

  /**
   * Get popular discussions (most liked)
   * @param {number} limit - Number of discussions to return
   * @returns {Promise<Array>} Popular discussions
   */
  async getPopularDiscussions(limit = 5) {
    try {
      const discussions = await Discussion.find({ is_active: true })
        .populate('user_id', 'firstName lastName email profilePicture role')
        .sort({ likes: -1, createdAt: -1 })
        .limit(limit);

      return discussions;
    } catch (error) {
      throw new Error(`Failed to get popular discussions: ${error.message}`);
    }
  }

  /**
   * Search discussions
   * @param {string} searchTerm - The search term
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchDiscussions(searchTerm, options = {}) {
    try {
      const searchOptions = {
        ...options,
        search: searchTerm
      };
      
      return await this.getDiscussions(searchOptions);
    } catch (error) {
      throw new Error(`Failed to search discussions: ${error.message}`);
    }
  }

  /**
   * Get discussions by category
   * @param {string} category - The category
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Discussions in the category
   */
  async getDiscussionsByCategory(category, options = {}) {
    try {
      const categoryOptions = {
        ...options,
        category
      };
      
      return await this.getDiscussions(categoryOptions);
    } catch (error) {
      throw new Error(`Failed to get discussions by category: ${error.message}`);
    }
  }

  /**
   * Get user's discussions
   * @param {string} userId - The user ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User's discussions
   */
  async getUserDiscussions(userId, options = {}) {
    try {
      const userOptions = {
        ...options,
        userId
      };
      
      return await this.getDiscussions(userOptions);
    } catch (error) {
      throw new Error(`Failed to get user discussions: ${error.message}`);
    }
  }
}

module.exports = new DiscussionService();
