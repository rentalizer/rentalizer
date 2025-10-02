const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DirectMessage = require('../models/DirectMessage');
const messagingService = require('../services/messagingService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Direct Message WebSocket Handler
class DirectMessageHandler {
  constructor(io, roomManager) {
    this.io = io;
    this.roomManager = roomManager;
  }

  // Handle new direct message
  async handleNewDirectMessage(socket, data) {
    try {
      const { recipient_id, message, message_type, support_category, priority } = data;
      const sender_id = socket.userId;

      // Validate recipient exists
      const recipient = await User.findById(recipient_id);
      if (!recipient) {
        socket.emit('error', { message: 'Recipient not found' });
        return;
      }

      // Prevent self-messaging
      if (sender_id === recipient_id) {
        socket.emit('error', { message: 'Cannot send message to yourself' });
        return;
      }

      // Get sender profile for display name
      const sender = await User.findById(sender_id);
      const senderName = sender.firstName && sender.lastName 
        ? `${sender.firstName} ${sender.lastName}`.trim()
        : (sender.email ? sender.email.split('@')[0] : 'User');

      // Create message using service
      const messageData = {
        sender_id,
        recipient_id,
        message: message.trim(),
        sender_name: senderName,
        message_type: message_type || 'text',
        support_category: support_category || 'general',
        priority: priority || 'medium'
      };

      const newMessage = await messagingService.sendMessage(messageData);

      console.log('📤 Sending message via WebSocket:', {
        messageId: newMessage._id,
        sender_id: newMessage.sender_id,
        sender_idType: typeof newMessage.sender_id,
        sender_idIsObject: typeof newMessage.sender_id === 'object',
        created_at: newMessage.created_at,
        updated_at: newMessage.updated_at,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        fullMessage: newMessage.toObject()
      });

      // Create normalized message object with string IDs (consistent with API)
      const normalizedMessage = {
        _id: newMessage._id,
        sender_id: newMessage.sender_id._id || newMessage.sender_id, // Ensure string ID
        recipient_id: newMessage.recipient_id._id || newMessage.recipient_id, // Ensure string ID
        message: newMessage.message,
        sender_name: newMessage.sender_name,
        message_type: newMessage.message_type,
        support_category: newMessage.support_category,
        priority: newMessage.priority,
        status: newMessage.status,
        read_at: newMessage.read_at,
        created_at: newMessage.created_at,
        updated_at: newMessage.updated_at
      };

      console.log('📤 Normalized message for WebSocket:', {
        messageId: normalizedMessage._id,
        sender_id: normalizedMessage.sender_id,
        sender_idType: typeof normalizedMessage.sender_id,
        recipient_id: normalizedMessage.recipient_id,
        recipient_idType: typeof normalizedMessage.recipient_id
      });

      // Emit to recipient
      this.io.to(`user_${recipient_id}`).emit('new_direct_message', {
        message: normalizedMessage,
        sender: {
          id: sender._id,
          name: senderName,
          avatar: sender.profilePicture,
          role: sender.role
        }
      });

      // Emit confirmation to sender
      socket.emit('message_sent', {
        success: true,
        message: normalizedMessage
      });

      // Update online status for both users
      this.updateUserOnlineStatus(sender_id, recipient_id);

    } catch (error) {
      console.error('Error handling new direct message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  // Handle typing indicators for direct messages
  handleTypingStart(socket, data) {
    const { recipient_id } = data;
    const sender_id = socket.userId;

    // Emit typing indicator to recipient
    this.io.to(`user_${recipient_id}`).emit('user_typing_dm', {
      sender_id,
      sender: socket.user,
      recipient_id
    });
  }

  handleTypingStop(socket, data) {
    const { recipient_id } = data;
    const sender_id = socket.userId;

    // Emit stop typing indicator to recipient
    this.io.to(`user_${recipient_id}`).emit('user_stopped_typing_dm', {
      sender_id,
      recipient_id
    });
  }

  // Handle marking messages as read
  async handleMarkAsRead(socket, data) {
    try {
      const { conversation_partner_id } = data;
      const currentUserId = socket.userId;

      const result = await messagingService.markConversationAsRead(currentUserId, conversation_partner_id);

      // Emit to conversation partner
      this.io.to(`user_${conversation_partner_id}`).emit('messages_read', {
        userId: currentUserId,
        conversationPartnerId: conversation_partner_id,
        readCount: result.modifiedCount
      });

      // Emit confirmation to sender
      socket.emit('messages_marked_read', {
        success: true,
        conversationPartnerId: conversation_partner_id,
        readCount: result.modifiedCount
      });

    } catch (error) {
      console.error('Error handling mark as read:', error);
      socket.emit('error', { message: 'Failed to mark messages as read' });
    }
  }

  // Handle message deletion
  async handleDeleteMessage(socket, data) {
    try {
      const { message_id } = data;
      const userId = socket.userId;

      const result = await messagingService.deleteMessage(message_id, userId);

      if (result.success) {
        // Get the message to find participants
        const message = await DirectMessage.findById(message_id);
        if (message) {
          const participants = [message.sender_id.toString(), message.recipient_id.toString()];
          
          // Emit to all participants
          participants.forEach(participantId => {
            this.io.to(`user_${participantId}`).emit('message_deleted', {
              messageId: message_id,
              deletedBy: userId
            });
          });
        }

        // Emit confirmation to sender
        socket.emit('message_deleted_confirmation', {
          success: true,
          messageId: message_id
        });
      }

    } catch (error) {
      console.error('Error handling message deletion:', error);
      socket.emit('error', { message: error.message || 'Failed to delete message' });
    }
  }

  // Handle message status update (admin only)
  async handleUpdateMessageStatus(socket, data) {
    try {
      const { message_id, status, priority, support_category } = data;
      const userId = socket.userId;

      // Check if user is admin
      if (socket.userRole !== 'admin' && socket.userRole !== 'superadmin') {
        socket.emit('error', { message: 'Unauthorized: Admin access required' });
        return;
      }

      const updateData = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (support_category) updateData.support_category = support_category;

      const updatedMessage = await messagingService.updateMessageStatus(message_id, userId, updateData);

      // Emit to all participants
      const participants = [updatedMessage.sender_id.toString(), updatedMessage.recipient_id.toString()];
      participants.forEach(participantId => {
        this.io.to(`user_${participantId}`).emit('message_status_updated', {
          messageId: message_id,
          message: updatedMessage,
          updatedBy: userId
        });
      });

      // Emit confirmation to admin
      socket.emit('message_status_updated_confirmation', {
        success: true,
        message: updatedMessage
      });

    } catch (error) {
      console.error('Error handling message status update:', error);
      socket.emit('error', { message: error.message || 'Failed to update message status' });
    }
  }

  // Handle joining user room for direct messages
  handleJoinUserRoom(socket) {
    const userId = socket.userId;
    socket.join(`user_${userId}`);
    console.log(`User ${socket.userDisplayName} joined their user room for direct messages`);
  }

  // Handle leaving user room
  handleLeaveUserRoom(socket) {
    const userId = socket.userId;
    socket.leave(`user_${userId}`);
    console.log(`User ${socket.userDisplayName} left their user room for direct messages`);
  }

  // Update online status for users
  updateUserOnlineStatus(senderId, recipientId) {
    const senderOnline = this.roomManager.isUserOnline(senderId);
    const recipientOnline = this.roomManager.isUserOnline(recipientId);

    // Emit online status updates
    this.io.to(`user_${senderId}`).emit('user_online_status', {
      userId: recipientId,
      isOnline: recipientOnline
    });

    this.io.to(`user_${recipientId}`).emit('user_online_status', {
      userId: senderId,
      isOnline: senderOnline
    });
  }

  // Handle getting online users for messaging
  handleGetOnlineUsers(socket) {
    const onlineUsers = this.roomManager.getOnlineUsers();
    const onlineCount = this.roomManager.getOnlineCount();
    
    console.log(`📊 Sending online users to ${socket.userDisplayName}:`, { users: onlineUsers, count: onlineCount });
    
    socket.emit('online_users_for_messaging', {
      users: onlineUsers,
      count: onlineCount
    });
  }

  // Handle getting conversation status
  async handleGetConversationStatus(socket, data) {
    try {
      const { conversation_partner_id } = data;
      const currentUserId = socket.userId;

      const unreadCount = await messagingService.getUnreadCount(currentUserId);
      
      // Get last message in conversation
      const lastMessage = await DirectMessage.findOne({
        $or: [
          { sender_id: currentUserId, recipient_id: conversation_partner_id },
          { sender_id: conversation_partner_id, recipient_id: currentUserId }
        ],
        is_deleted: false
      }).sort({ created_at: -1 });

      socket.emit('conversation_status', {
        conversationPartnerId: conversation_partner_id,
        unreadCount,
        lastMessage: lastMessage ? {
          id: lastMessage._id,
          message: lastMessage.message,
          sender_id: lastMessage.sender_id,
          created_at: lastMessage.created_at,
          read_at: lastMessage.read_at
        } : null
      });

    } catch (error) {
      console.error('Error getting conversation status:', error);
      socket.emit('error', { message: 'Failed to get conversation status' });
    }
  }
}

// Setup Direct Message WebSocket handlers
const setupDirectMessageWebSocket = (io, roomManager) => {
  const directMessageHandler = new DirectMessageHandler(io, roomManager);

  io.on('connection', (socket) => {
    // Direct message events
    socket.on('join_user_room', () => {
      directMessageHandler.handleJoinUserRoom(socket);
    });

    socket.on('leave_user_room', () => {
      directMessageHandler.handleLeaveUserRoom(socket);
    });

    socket.on('new_direct_message', (data) => {
      directMessageHandler.handleNewDirectMessage(socket, data);
    });

    socket.on('typing_start_dm', (data) => {
      directMessageHandler.handleTypingStart(socket, data);
    });

    socket.on('typing_stop_dm', (data) => {
      directMessageHandler.handleTypingStop(socket, data);
    });

    socket.on('mark_messages_read', (data) => {
      directMessageHandler.handleMarkAsRead(socket, data);
    });

    socket.on('delete_direct_message', (data) => {
      directMessageHandler.handleDeleteMessage(socket, data);
    });

    socket.on('update_message_status', (data) => {
      directMessageHandler.handleUpdateMessageStatus(socket, data);
    });

    socket.on('get_online_users_messaging', () => {
      directMessageHandler.handleGetOnlineUsers(socket);
    });

    socket.on('get_conversation_status', (data) => {
      directMessageHandler.handleGetConversationStatus(socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      directMessageHandler.handleLeaveUserRoom(socket);
    });
  });

  return directMessageHandler;
};

module.exports = { setupDirectMessageWebSocket, DirectMessageHandler };
