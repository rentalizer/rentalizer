const messagingService = require('../services/messagingService');
const User = require('../models/User');

class DirectMessageController {
  /**
   * Send a direct message
   * POST /api/messages
   */
  async sendMessage(req, res) {
    try {
      const userId = req.user.id;
      const { recipient_id, message, message_type, support_category, priority } = req.body;

      // Get sender profile for display name
      const sender = await User.findById(userId);
      if (!sender) {
        return res.status(404).json({
          success: false,
          message: 'Sender not found'
        });
      }

      const senderName = sender.firstName && sender.lastName 
        ? `${sender.firstName} ${sender.lastName}`.trim()
        : (sender.email ? sender.email.split('@')[0] : 'User');

      const messageData = {
        sender_id: userId,
        recipient_id,
        message,
        sender_name: senderName,
        message_type,
        support_category,
        priority
      };

      const newMessage = await messagingService.sendMessage(messageData);

      // Emit real-time event
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${recipient_id}`).emit('new_direct_message', {
          message: newMessage,
          sender: {
            id: sender._id,
            name: senderName,
            avatar: sender.profilePicture,
            role: sender.role
          }
        });

        // Also emit to sender for confirmation
        io.to(`user_${userId}`).emit('message_sent', {
          message: newMessage
        });
      }

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: newMessage
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to send message'
      });
    }
  }

  /**
   * Get conversation between two users
   * GET /api/messages/conversation/:userId
   */
  async getConversation(req, res) {
    try {
      const currentUserId = req.user.id;
      const { userId: otherUserId } = req.params;
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await messagingService.getConversation(currentUserId, otherUserId, options);

      res.status(200).json({
        success: true,
        message: 'Conversation retrieved successfully',
        data: result.messages,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting conversation:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to retrieve conversation'
      });
    }
  }

  /**
   * Get user's conversations list
   * GET /api/messages/conversations
   */
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await messagingService.getUserConversations(userId, options);

      res.status(200).json({
        success: true,
        message: 'Conversations retrieved successfully',
        data: result.conversations,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve conversations'
      });
    }
  }

  /**
   * Mark conversation as read
   * PUT /api/messages/conversation/:userId/read
   */
  async markConversationAsRead(req, res) {
    try {
      const currentUserId = req.user.id;
      const { userId: conversationPartnerId } = req.params;

      const result = await messagingService.markConversationAsRead(currentUserId, conversationPartnerId);

      // Emit real-time event
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${conversationPartnerId}`).emit('messages_read', {
          userId: currentUserId,
          conversationPartnerId
        });
      }

      res.status(200).json({
        success: true,
        message: 'Conversation marked as read',
        data: result
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to mark conversation as read'
      });
    }
  }

  /**
   * Get unread message count
   * GET /api/messages/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await messagingService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        message: 'Unread count retrieved successfully',
        data: { unreadCount: count }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve unread count'
      });
    }
  }

  /**
   * Delete a message
   * DELETE /api/messages/:messageId
   */
  async deleteMessage(req, res) {
    try {
      const userId = req.user.id;
      const { messageId } = req.params;

      const result = await messagingService.deleteMessage(messageId, userId);

      // Emit real-time event
      const io = req.app.get('io');
      if (io) {
        // Get the message to find participants
        const DirectMessage = require('../models/DirectMessage');
        const message = await DirectMessage.findById(messageId);
        if (message) {
          const participants = [message.sender_id.toString(), message.recipient_id.toString()];
          participants.forEach(participantId => {
            io.to(`user_${participantId}`).emit('message_deleted', {
              messageId,
              deletedBy: userId
            });
          });
        }
      }

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete message'
      });
    }
  }

  /**
   * Get admin users for support
   * GET /api/messages/admins
   */
  async getAdminUsers(req, res) {
    try {
      const admins = await messagingService.getAdminUsers();

      res.status(200).json({
        success: true,
        message: 'Admin users retrieved successfully',
        data: admins
      });
    } catch (error) {
      console.error('Error getting admin users:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve admin users'
      });
    }
  }

  /**
   * Get first available admin for support
   * GET /api/messages/admin/first
   */
  async getFirstAdmin(req, res) {
    try {
      const admin = await messagingService.getFirstAdmin();

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'No admin users available'
        });
      }

      res.status(200).json({
        success: true,
        message: 'First admin retrieved successfully',
        data: admin
      });
    } catch (error) {
      console.error('Error getting first admin:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve admin'
      });
    }
  }

  /**
   * Get messaging statistics
   * GET /api/messages/stats
   */
  async getMessagingStats(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Only allow users to see their own stats, or admins to see all stats
      const statsUserId = (userRole === 'admin' || userRole === 'superadmin') ? null : userId;
      const stats = await messagingService.getMessagingStats(statsUserId);

      res.status(200).json({
        success: true,
        message: 'Messaging statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting messaging stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve messaging statistics'
      });
    }
  }

  /**
   * Search messages
   * GET /api/messages/search
   */
  async searchMessages(req, res) {
    try {
      const userId = req.user.id;
      const { q: searchTerm, conversationPartnerId, page = 1, limit = 20 } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        conversationPartnerId
      };

      const result = await messagingService.searchMessages(userId, searchTerm, options);

      res.status(200).json({
        success: true,
        message: 'Search results retrieved successfully',
        data: result.messages,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search messages'
      });
    }
  }

  /**
   * Update message status (admin only)
   * PUT /api/messages/:messageId/status
   */
  async updateMessageStatus(req, res) {
    try {
      const userId = req.user.id;
      const { messageId } = req.params;
      const updateData = req.body;

      const updatedMessage = await messagingService.updateMessageStatus(messageId, userId, updateData);

      // Emit real-time event
      const io = req.app.get('io');
      if (io) {
        const participants = [updatedMessage.sender_id.toString(), updatedMessage.recipient_id.toString()];
        participants.forEach(participantId => {
          io.to(`user_${participantId}`).emit('message_status_updated', {
            messageId,
            message: updatedMessage,
            updatedBy: userId
          });
        });
      }

      res.status(200).json({
        success: true,
        message: 'Message status updated successfully',
        data: updatedMessage
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update message status'
      });
    }
  }

  /**
   * Get support categories
   * GET /api/messages/support-categories
   */
  async getSupportCategories(req, res) {
    try {
      const categories = [
        { value: 'general', label: 'General Support' },
        { value: 'technical', label: 'Technical Issues' },
        { value: 'billing', label: 'Billing & Payments' },
        { value: 'account', label: 'Account Issues' },
        { value: 'other', label: 'Other' }
      ];

      res.status(200).json({
        success: true,
        message: 'Support categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      console.error('Error getting support categories:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve support categories'
      });
    }
  }

  /**
   * Get priority levels
   * GET /api/messages/priority-levels
   */
  async getPriorityLevels(req, res) {
    try {
      const priorities = [
        { value: 'low', label: 'Low', color: 'green' },
        { value: 'medium', label: 'Medium', color: 'yellow' },
        { value: 'high', label: 'High', color: 'orange' },
        { value: 'urgent', label: 'Urgent', color: 'red' }
      ];

      res.status(200).json({
        success: true,
        message: 'Priority levels retrieved successfully',
        data: priorities
      });
    } catch (error) {
      console.error('Error getting priority levels:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve priority levels'
      });
    }
  }

  /**
   * Get message statuses
   * GET /api/messages/statuses
   */
  async getMessageStatuses(req, res) {
    try {
      const statuses = [
        { value: 'open', label: 'Open', color: 'blue' },
        { value: 'in_progress', label: 'In Progress', color: 'yellow' },
        { value: 'resolved', label: 'Resolved', color: 'green' },
        { value: 'closed', label: 'Closed', color: 'gray' }
      ];

      res.status(200).json({
        success: true,
        message: 'Message statuses retrieved successfully',
        data: statuses
      });
    } catch (error) {
      console.error('Error getting message statuses:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve message statuses'
      });
    }
  }

  /**
   * Get all users for admin messaging
   * GET /api/messages/users
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 50, search } = req.query;
      const currentUserId = req.user.id;

      const result = await messagingService.getAllUsersForMessaging(currentUserId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve users'
      });
    }
  }
}

module.exports = new DirectMessageController();
