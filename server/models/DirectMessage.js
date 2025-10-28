const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient ID is required']
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  sender_name: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
    maxlength: [100, 'Sender name cannot exceed 100 characters']
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  read_at: {
    type: Date,
    default: null
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date,
    default: null
  },
  // For future features like message reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'love', 'laugh', 'angry', 'sad'],
      default: 'like'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  // For message threading/replies
  reply_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectMessage',
    default: null
  },
  // For admin support categorization
  support_category: {
    type: String,
    enum: ['general', 'technical', 'billing', 'account', 'other'],
    default: 'general'
  },
  // For admin support priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // For admin support status
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  is_edited: {
    type: Boolean,
    default: false
  },
  edited_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better query performance
directMessageSchema.index({ sender_id: 1, recipient_id: 1, created_at: -1 });
directMessageSchema.index({ recipient_id: 1, read_at: 1 });
directMessageSchema.index({ sender_id: 1, created_at: -1 });
directMessageSchema.index({ recipient_id: 1, created_at: -1 });

// Compound index for conversation queries
directMessageSchema.index({ 
  $or: [
    { sender_id: 1, recipient_id: 1 },
    { sender_id: 1, recipient_id: 1 }
  ],
  created_at: -1 
});

// Virtual for conversation ID (consistent ordering of participants)
directMessageSchema.virtual('conversation_id').get(function() {
  const participants = [this.sender_id.toString(), this.recipient_id.toString()].sort();
  return participants.join('_');
});

// Method to get conversation participants
directMessageSchema.methods.getParticipants = function() {
  return [this.sender_id, this.recipient_id];
};

// Method to check if user is participant
directMessageSchema.methods.isParticipant = function(userId) {
  return this.sender_id.toString() === userId.toString() || 
         this.recipient_id.toString() === userId.toString();
};

// Method to get the other participant
directMessageSchema.methods.getOtherParticipant = function(userId) {
  if (this.sender_id.toString() === userId.toString()) {
    return this.recipient_id;
  }
  return this.sender_id;
};

// Method to mark as read
directMessageSchema.methods.markAsRead = function() {
  if (!this.read_at) {
    this.read_at = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to soft delete
directMessageSchema.methods.softDelete = function() {
  this.is_deleted = true;
  this.deleted_at = new Date();
  return this.save();
};

// Static method to get conversation between two users
directMessageSchema.statics.getConversation = async function(userId1, userId2, options = {}) {
  const {
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'asc'
  } = options;

  const query = {
    $or: [
      { sender_id: userId1, recipient_id: userId2 },
      { sender_id: userId2, recipient_id: userId1 }
    ],
    is_deleted: false
  };

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  console.log('🔍 Database query details:', {
    sortBy,
    sortOrder,
    sortObject: sort,
    query: query
  });

  const result = await this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  console.log('🔍 Database query result:', {
    resultCount: result.length,
    resultOrder: result.map(msg => ({
      id: msg._id,
      created_at: msg.created_at,
      message: msg.message.substring(0, 20) + '...'
    }))
  });

  return result;
};

// Static method to get user's conversations
directMessageSchema.statics.getUserConversations = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    sortBy = 'last_message_at',
    sortOrder = 'desc'
  } = options;

  return this.aggregate([
    {
      $match: {
        $or: [
          { sender_id: new mongoose.Types.ObjectId(userId) },
          { recipient_id: new mongoose.Types.ObjectId(userId) }
        ],
        is_deleted: false
      }
    },
    {
      $sort: { created_at: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender_id', new mongoose.Types.ObjectId(userId)] },
            '$recipient_id',
            '$sender_id'
          ]
        },
        last_message: { $first: '$$ROOT' },
        unread_count: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient_id', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$read_at', null] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'participant'
      }
    },
    {
      $unwind: '$participant'
    },
    {
      $project: {
        participant_id: '$_id',
        participant: {
          _id: '$participant._id',
          firstName: '$participant.firstName',
          lastName: '$participant.lastName',
          email: '$participant.email',
          profilePicture: '$participant.profilePicture',
          role: '$participant.role'
        },
        last_message: {
          _id: '$last_message._id',
          message: '$last_message.message',
          sender_id: '$last_message.sender_id',
          recipient_id: '$last_message.recipient_id',
          sender_name: '$last_message.sender_name',
          created_at: '$last_message.created_at',
          read_at: '$last_message.read_at',
          message_type: '$last_message.message_type'
        },
        unread_count: 1
      }
    },
    {
      $sort: { 'last_message.created_at': -1 }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ]);
};

// Static method to get unread count for user
directMessageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient_id: userId,
    read_at: null,
    is_deleted: false
  });
};

// Static method to mark conversation as read
directMessageSchema.statics.markConversationAsRead = function(userId1, userId2) {
  return this.updateMany(
    {
      $or: [
        { sender_id: userId1, recipient_id: userId2 },
        { sender_id: userId2, recipient_id: userId1 }
      ],
      recipient_id: userId1,
      read_at: null,
      is_deleted: false
    },
    {
      $set: { read_at: new Date() }
    }
  );
};

// Transform JSON output
directMessageSchema.methods.toJSON = function() {
  const messageObject = this.toObject();
  
  // Remove sensitive fields
  delete messageObject.__v;
  
  return messageObject;
};

// Ensure virtual fields are serialized
directMessageSchema.set('toJSON', { virtuals: true });
directMessageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DirectMessage', directMessageSchema);
