const NewsItem = require('../models/NewsItem');
const User = require('../models/User');

class NewsService {
  /**
   * Create a new news item (manual submission)
   * @param {Object} newsData - The news item data
   * @param {string} userId - The user ID creating the news item
   * @returns {Promise<Object>} The created news item
   */
  async createNewsItem(newsData, userId) {
    try {
      // Get user info to check if admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      const newsItem = new NewsItem({
        ...newsData,
        submitted_by: userId,
        admin_submitted: isAdmin,
        source: newsData.source || 'Manual Submission',
        status: isAdmin ? 'published' : 'draft' // Auto-publish for admins
      });

      const savedNewsItem = await newsItem.save();
      
      // Populate user data for response
      await savedNewsItem.populate('submitted_by', 'firstName lastName email profilePicture role');
      
      return savedNewsItem;
    } catch (error) {
      throw new Error(`Failed to create news item: ${error.message}`);
    }
  }

  /**
   * Get news items with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated news items with metadata
   */
  async getNewsItems(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        source = null,
        search = null,
        sortBy = 'published_at',
        sortOrder = 'desc',
        status = 'published'
      } = options;

      const query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (source && source !== 'All') {
        query.source = source;
      }
      
      if (search) {
        query.$text = { $search: search };
      }

      const sortOptions = {};
      // Always prioritize pinned and featured posts
      sortOptions.is_pinned = -1;
      sortOptions.is_featured = -1;
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const newsItems = await NewsItem.find(query)
        .populate('submitted_by', 'firstName lastName email profilePicture role')
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await NewsItem.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return {
        newsItems,
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
      throw new Error(`Failed to get news items: ${error.message}`);
    }
  }

  /**
   * Get a single news item by ID
   * @param {string} newsId - The news item ID
   * @returns {Promise<Object>} The news item
   */
  async getNewsItemById(newsId) {
    try {
      const newsItem = await NewsItem.findById(newsId)
        .populate('submitted_by', 'firstName lastName email profilePicture role');

      if (!newsItem) {
        throw new Error('News item not found');
      }

      // Increment view count
      newsItem.view_count += 1;
      await newsItem.save();

      return newsItem;
    } catch (error) {
      throw new Error(`Failed to get news item: ${error.message}`);
    }
  }

  /**
   * Update a news item
   * @param {string} newsId - The news item ID
   * @param {Object} updateData - The data to update
   * @param {string} userId - The user updating the news item
   * @returns {Promise<Object>} The updated news item
   */
  async updateNewsItem(newsId, updateData, userId) {
    try {
      const newsItem = await NewsItem.findById(newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      // Check if user owns the news item or is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isOwner = newsItem.submitted_by && newsItem.submitted_by.toString() === userId;
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only update your own news items');
      }

      // Update allowed fields
      const allowedUpdates = [
        'title', 'url', 'summary', 'content', 'source', 
        'tags', 'featured_image_url', 'published_at', 'status'
      ];
      
      // Only admins can update these fields
      const adminOnlyUpdates = ['is_pinned', 'is_featured', 'status'];
      
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          if (adminOnlyUpdates.includes(field) && !isAdmin) {
            return; // Skip admin-only fields for non-admins
          }
          updates[field] = updateData[field];
        }
      });

      const updatedNewsItem = await NewsItem.findByIdAndUpdate(
        newsId,
        updates,
        { new: true, runValidators: true }
      ).populate('submitted_by', 'firstName lastName email profilePicture role');

      return updatedNewsItem;
    } catch (error) {
      throw new Error(`Failed to update news item: ${error.message}`);
    }
  }

  /**
   * Delete a news item
   * @param {string} newsId - The news item ID
   * @param {string} userId - The user deleting the news item
   * @returns {Promise<Object>} Success message
   */
  async deleteNewsItem(newsId, userId) {
    try {
      const newsItem = await NewsItem.findById(newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      // Check if user owns the news item or is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isOwner = newsItem.submitted_by && newsItem.submitted_by.toString() === userId;
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only delete your own news items');
      }

      // Hard delete (or you can change to soft delete by setting status to 'archived')
      await NewsItem.findByIdAndDelete(newsId);

      return { message: 'News item deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete news item: ${error.message}`);
    }
  }

  /**
   * Increment click count for a news item
   * @param {string} newsId - The news item ID
   * @returns {Promise<Object>} Updated news item
   */
  async incrementClickCount(newsId) {
    try {
      const newsItem = await NewsItem.findById(newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      newsItem.click_count += 1;
      await newsItem.save();

      return newsItem;
    } catch (error) {
      throw new Error(`Failed to increment click count: ${error.message}`);
    }
  }

  /**
   * Toggle pin status for a news item (admin only)
   * @param {string} newsId - The news item ID
   * @param {string} userId - The admin user
   * @returns {Promise<Object>} Updated news item
   */
  async togglePin(newsId, userId) {
    try {
      const newsItem = await NewsItem.findById(newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      // Check if user is admin
      const user = await User.findById(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        throw new Error('Unauthorized: Only admins can pin/unpin news items');
      }

      newsItem.is_pinned = !newsItem.is_pinned;
      await newsItem.save();
      await newsItem.populate('submitted_by', 'firstName lastName email profilePicture role');

      return {
        newsItem,
        isPinned: newsItem.is_pinned
      };
    } catch (error) {
      throw new Error(`Failed to toggle pin: ${error.message}`);
    }
  }

  /**
   * Toggle featured status for a news item (admin only)
   * @param {string} newsId - The news item ID
   * @param {string} userId - The admin user
   * @returns {Promise<Object>} Updated news item
   */
  async toggleFeatured(newsId, userId) {
    try {
      const newsItem = await NewsItem.findById(newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      // Check if user is admin
      const user = await User.findById(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        throw new Error('Unauthorized: Only admins can feature/unfeature news items');
      }

      newsItem.is_featured = !newsItem.is_featured;
      await newsItem.save();
      await newsItem.populate('submitted_by', 'firstName lastName email profilePicture role');

      return {
        newsItem,
        isFeatured: newsItem.is_featured
      };
    } catch (error) {
      throw new Error(`Failed to toggle featured: ${error.message}`);
    }
  }

  /**
   * Get trending news (high engagement)
   * @param {number} limit - Number of news items to return
   * @returns {Promise<Array>} Trending news items
   */
  async getTrendingNews(limit = 10) {
    try {
      const newsItems = await NewsItem.getTrendingNews(limit);
      return newsItems;
    } catch (error) {
      throw new Error(`Failed to get trending news: ${error.message}`);
    }
  }

  /**
   * Get news statistics
   * @returns {Promise<Object>} News statistics
   */
  async getNewsStats() {
    try {
      const stats = await NewsItem.getNewsStats();
      return stats[0] || {
        totalNews: 0,
        totalViews: 0,
        totalClicks: 0,
        totalEngagement: 0,
        pinnedNews: 0,
        featuredNews: 0,
        adminSubmittedNews: 0
      };
    } catch (error) {
      throw new Error(`Failed to get news stats: ${error.message}`);
    }
  }

  /**
   * Get news by source statistics
   * @returns {Promise<Array>} News statistics by source
   */
  async getNewsBySource() {
    try {
      const stats = await NewsItem.getNewsBySource();
      return stats;
    } catch (error) {
      throw new Error(`Failed to get news by source: ${error.message}`);
    }
  }

  /**
   * Search news items
   * @param {string} searchTerm - The search term
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchNews(searchTerm, options = {}) {
    try {
      const searchOptions = {
        ...options,
        search: searchTerm
      };
      
      return await this.getNewsItems(searchOptions);
    } catch (error) {
      throw new Error(`Failed to search news: ${error.message}`);
    }
  }

  /**
   * Get news items by source
   * @param {string} source - The source name
   * @param {Object} options - Query options
   * @returns {Promise<Object>} News items from the source
   */
  async getNewsBySourceName(source, options = {}) {
    try {
      const sourceOptions = {
        ...options,
        source
      };
      
      return await this.getNewsItems(sourceOptions);
    } catch (error) {
      throw new Error(`Failed to get news by source: ${error.message}`);
    }
  }

  /**
   * Get featured news items
   * @param {number} limit - Number of news items to return
   * @returns {Promise<Array>} Featured news items
   */
  async getFeaturedNews(limit = 5) {
    try {
      const newsItems = await NewsItem.find({ 
        status: 'published', 
        is_featured: true 
      })
        .populate('submitted_by', 'firstName lastName email profilePicture role')
        .sort({ published_at: -1 })
        .limit(limit);

      return newsItems;
    } catch (error) {
      throw new Error(`Failed to get featured news: ${error.message}`);
    }
  }

  /**
   * Bulk create news items (used by aggregation service)
   * @param {Array} newsItemsData - Array of news item data
   * @returns {Promise<Object>} Created news items and stats
   */
  async bulkCreateNewsItems(newsItemsData) {
    try {
      const createdItems = [];
      const skippedItems = [];
      const errors = [];

      for (const itemData of newsItemsData) {
        try {
          // Check if item already exists by external_id or URL
          const existingItem = await NewsItem.findOne({
            $or: [
              { external_id: itemData.external_id },
              { url: itemData.url }
            ]
          });

          if (existingItem) {
            skippedItems.push({
              url: itemData.url,
              reason: 'Already exists'
            });
            continue;
          }

          const newsItem = new NewsItem({
            ...itemData,
            status: 'published'
          });

          const savedItem = await newsItem.save();
          createdItems.push(savedItem);
        } catch (error) {
          errors.push({
            item: itemData.title || itemData.url,
            error: error.message
          });
        }
      }

      return {
        created: createdItems.length,
        skipped: skippedItems.length,
        errors: errors.length,
        createdItems,
        skippedItems,
        errorDetails: errors
      };
    } catch (error) {
      throw new Error(`Failed to bulk create news items: ${error.message}`);
    }
  }
}

module.exports = new NewsService();

