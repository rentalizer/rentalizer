const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

class MessagingService {
  /**
   * Send a direct message
   * @param {Object} messageData - Message data
   * @param {string} messageData.sender_id - Sender user ID
   * @param {string} messageData.recipient_id - Recipient user ID
   * @param {string} messageData.message - Message content
   * @param {string} messageData.sender_name - Sender display name
   * @param {string} messageData.message_type - Message type (default: 'text')
   * @param {string} messageData.support_category - Support category (optional)
   * @param {string} messageData.priority - Priority level (optional)
   * @returns {Promise<Object>} Created message
   */
  async sendMessage(messageData) {
    try {
      const {
        sender_id,
        recipient_id,
        message,
        sender_name,
        message_type = 'text',
        support_category = 'general',
        priority = 'medium'
      } = messageData;

      // Validate sender and recipient exist
      const [sender, recipient] = await Promise.all([
        User.findById(sender_id),
        User.findById(recipient_id)
      ]);

      if (!sender) {
        throw new Error('Sender not found');
      }

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      // Prevent self-messaging
      if (sender_id === recipient_id) {
        throw new Error('Cannot send message to yourself');
      }

      // Create message
      const directMessage = new DirectMessage({
        sender_id,
        recipient_id,
        message: message.trim(),
        sender_name: sender_name.trim(),
        message_type,
        support_category,
        priority
      });

      await directMessage.save();

      // Populate sender and recipient data
      await directMessage.populate([
        { path: 'sender_id', select: 'firstName lastName email profilePicture role' },
        { path: 'recipient_id', select: 'firstName lastName email profilePicture role' }
      ]);

      return directMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  /**
   * Get conversation between two users
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Conversation data
   */
  async getConversation(userId1, userId2, options = {}) {
    try {
      const {
        page = 1,
        limit = 200,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      // Validate users exist
      const [user1, user2] = await Promise.all([
        User.findById(userId1),
        User.findById(userId2)
      ]);

      if (!user1 || !user2) {
        throw new Error('One or both users not found');
      }

      const messages = await DirectMessage.getConversation(userId1, userId2, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      console.log('📋 Database returned messages in order:', {
        sortBy,
        sortOrder,
        messageCount: messages.length,
        messageOrder: messages.map(msg => ({
          id: msg._id,
          created_at: msg.created_at,
          message: msg.message.substring(0, 20) + '...'
        }))
      });

      // Get total count for pagination
      const totalCount = await DirectMessage.countDocuments({
        $or: [
          { sender_id: userId1, recipient_id: userId2 },
          { sender_id: userId2, recipient_id: userId1 }
        ],
        is_deleted: false
      });

      return {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getConversation:', error);
      throw error;
    }
  }

  /**
   * Get user's conversations list
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Conversations data
   */
  async getUserConversations(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20
      } = options;

      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const conversations = await DirectMessage.getUserConversations(userId, {
        page,
        limit
      });

      // Get total count for pagination
      const totalCount = await DirectMessage.aggregate([
        {
          $match: {
            $or: [
              { sender_id: userId },
              { recipient_id: userId }
            ],
            is_deleted: false
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$sender_id', userId] },
                '$recipient_id',
                '$sender_id'
              ]
            }
          }
        },
        {
          $count: 'total'
        }
      ]);

      const total = totalCount.length > 0 ? totalCount[0].total : 0;

      return {
        conversations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param {string} userId - User ID (recipient)
   * @param {string} conversationPartnerId - Conversation partner ID
   * @returns {Promise<Object>} Update result
   */
  async markConversationAsRead(userId, conversationPartnerId) {
    try {
      const result = await DirectMessage.markConversationAsRead(userId, conversationPartnerId);
      return result;
    } catch (error) {
      console.error('Error in markConversationAsRead:', error);
      throw error;
    }
  }

  /**
   * Get unread message count for user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount(userId) {
    try {
      const count = await DirectMessage.getUnreadCount(userId);
      return count;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      throw error;
    }
  }

  /**
   * Delete a message (soft delete)
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID (must be sender or admin)
   * @returns {Promise<Object>} Deletion result
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await DirectMessage.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is sender or admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isSender = message.sender_id.toString() === userId;
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';

      if (!isSender && !isAdmin) {
        throw new Error('Unauthorized: You can only delete your own messages');
      }

      if (message.is_deleted) {
        throw new Error('Message already deleted');
      }

      await message.softDelete();

      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      throw error;
    }
  }

  /**
   * Get admin users for support
   * @returns {Promise<Array>} List of admin users
   */
  async getAdminUsers() {
    try {
      const admins = await User.find({
        role: { $in: ['admin', 'superadmin'] },
        isActive: true
      }).select('_id firstName lastName email profilePicture role');

      return admins;
    } catch (error) {
      console.error('Error in getAdminUsers:', error);
      throw error;
    }
  }

  /**
   * Get first available admin for support
   * @returns {Promise<Object|null>} First admin user or null
   */
  async getFirstAdmin() {
    try {
      const admin = await User.findOne({
        role: { $in: ['admin', 'superadmin'] },
        isActive: true
      }).select('_id firstName lastName email profilePicture role');

      return admin;
    } catch (error) {
      console.error('Error in getFirstAdmin:', error);
      throw error;
    }
  }

  /**
   * Get messaging statistics
   * @param {string} userId - User ID (optional, for user-specific stats)
   * @returns {Promise<Object>} Messaging statistics
   */
  async getMessagingStats(userId = null) {
    try {
      const baseMatch = userId ? {
        $or: [
          { sender_id: userId },
          { recipient_id: userId }
        ]
      } : {};

      const stats = await DirectMessage.aggregate([
        { $match: { ...baseMatch, is_deleted: false } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            unreadMessages: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ['$read_at', null] },
                    userId ? { $eq: ['$recipient_id', userId] } : true
                  ]},
                  1,
                  0
                ]
              }
            },
            messagesByType: {
              $push: '$message_type'
            },
            messagesByCategory: {
              $push: '$support_category'
            }
          }
        },
        {
          $project: {
            totalMessages: 1,
            unreadMessages: 1,
            messageTypes: {
              $reduce: {
                input: '$messagesByType',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [
                        [{ k: '$$this', v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] } }]
                      ]
                    }
                  ]
                }
              }
            },
            supportCategories: {
              $reduce: {
                input: '$messagesByCategory',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [
                        [{ k: '$$this', v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] } }]
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      ]);

      return stats.length > 0 ? stats[0] : {
        totalMessages: 0,
        unreadMessages: 0,
        messageTypes: {},
        supportCategories: {}
      };
    } catch (error) {
      console.error('Error in getMessagingStats:', error);
      throw error;
    }
  }

  /**
   * Search messages
   * @param {string} userId - User ID
   * @param {string} searchTerm - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchMessages(userId, searchTerm, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        conversationPartnerId = null
      } = options;

      const matchQuery = {
        $or: [
          { sender_id: userId },
          { recipient_id: userId }
        ],
        is_deleted: false,
        message: { $regex: searchTerm, $options: 'i' }
      };

      if (conversationPartnerId) {
        matchQuery.$and = [
          {
            $or: [
              { sender_id: userId, recipient_id: conversationPartnerId },
              { sender_id: conversationPartnerId, recipient_id: userId }
            ]
          }
        ];
      }

      const messages = await DirectMessage.find(matchQuery)
        .populate('sender_id', 'firstName lastName email profilePicture role')
        .populate('recipient_id', 'firstName lastName email profilePicture role')
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalCount = await DirectMessage.countDocuments(matchQuery);

      return {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in searchMessages:', error);
      throw error;
    }
  }

  /**
   * Update message status (for admin support)
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID (must be admin)
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated message
   */
  async updateMessageStatus(messageId, userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        throw new Error('Unauthorized: Admin access required');
      }

      const message = await DirectMessage.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const allowedUpdates = ['status', 'priority', 'support_category'];
      const updates = {};

      for (const field of allowedUpdates) {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new Error('No valid updates provided');
      }

      const updatedMessage = await DirectMessage.findByIdAndUpdate(
        messageId,
        updates,
        { new: true, runValidators: true }
      ).populate([
        { path: 'sender_id', select: 'firstName lastName email profilePicture role' },
        { path: 'recipient_id', select: 'firstName lastName email profilePicture role' }
      ]);

      return updatedMessage;
    } catch (error) {
      console.error('Error in updateMessageStatus:', error);
      throw error;
    }
  }

  /**
   * Update message content (admin messages only)
   * @param {string} messageId - Message ID
   * @param {string} userId - Admin user ID performing the edit
   * @param {string} newContent - New message content
   * @returns {Promise<Object>} Updated message
   */
  async updateMessageContent(messageId, userId, newContent) {
    try {
      const user = await User.findById(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        throw new Error('Unauthorized: Admin access required');
      }

      const message = await DirectMessage.findById(messageId).populate([
        { path: 'sender_id', select: 'firstName lastName email profilePicture role' },
        { path: 'recipient_id', select: 'firstName lastName email profilePicture role' }
      ]);

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.is_deleted) {
        throw new Error('Cannot edit a deleted message');
      }

      const senderRole = message.sender_id?.role;
      if (senderRole !== 'admin' && senderRole !== 'superadmin') {
        throw new Error('Only admin messages can be edited');
      }

      const trimmedContent = (newContent || '').trim();
      if (!trimmedContent) {
        throw new Error('Message content is required');
      }

      if (trimmedContent.length > 2000) {
        throw new Error('Message cannot exceed 2000 characters');
      }

      message.message = trimmedContent;
      message.is_edited = true;
      message.edited_at = new Date();
      await message.save();

      return message;
    } catch (error) {
      console.error('Error in updateMessageContent:', error);
      throw error;
    }
  }

  /**
   * Get all users for admin messaging
   * @param {string} currentUserId - Current admin user ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users data with pagination
   */
  async getAllUsersForMessaging(currentUserId, options = {}) {
    try {
      const {
        page = 1,
        limit = 200,
        search
      } = options;

      // Build query
      const query = {
        _id: { $ne: currentUserId }, // Exclude current user
        isActive: true
      };

      // Add search filter if provided
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Get users with pagination
      const skip = (page - 1) * limit;
      const users = await User.find(query)
        .select('_id firstName lastName email profilePicture role lastLogin isActive')
        .sort({ firstName: 1, lastName: 1 })
        .skip(skip)
        .limit(limit);

      // Get total count
      const totalCount = await User.countDocuments(query);

      // Get conversation data for each user
      const usersWithConversationData = await Promise.all(
        users.map(async (user) => {
          // Get last message with this user
          const lastMessage = await DirectMessage.findOne({
            $or: [
              { sender_id: currentUserId, recipient_id: user._id },
              { sender_id: user._id, recipient_id: currentUserId }
            ],
            is_deleted: false
          })
            .sort({ created_at: -1 })
            .select('message created_at read_at sender_id');

          // Get unread count
          const unreadCount = await DirectMessage.countDocuments({
            sender_id: user._id,
            recipient_id: currentUserId,
            read_at: null,
            is_deleted: false
          });

          // Determine if user is online (last login within 5 minutes)
          const isOnline = user.lastLogin && 
            (new Date() - new Date(user.lastLogin)) < 5 * 60 * 1000;

          return {
            _id: user._id,
            participant_id: user._id,
            participant: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              profilePicture: user.profilePicture,
              role: user.role,
              isOnline,
              lastLoginAt: user.lastLogin
            },
            last_message: lastMessage ? {
              _id: lastMessage._id,
              message: lastMessage.message,
              created_at: lastMessage.created_at,
              read_at: lastMessage.read_at,
              sender_id: lastMessage.sender_id
            } : null,
            unread_count: unreadCount,
            last_activity: lastMessage ? lastMessage.created_at : user.lastLogin || user.createdAt,
            has_conversation: !!lastMessage
          };
        })
      );

      // Sort users: those with conversations first, then by last activity
      usersWithConversationData.sort((a, b) => {
        if (a.has_conversation && !b.has_conversation) return -1;
        if (!a.has_conversation && b.has_conversation) return 1;
        return new Date(b.last_activity) - new Date(a.last_activity);
      });

      return {
        users: usersWithConversationData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getAllUsersForMessaging:', error);
      throw error;
    }
  }
}

module.exports = new MessagingService();
