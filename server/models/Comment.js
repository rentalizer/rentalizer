const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'angry', 'sad'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  discussion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  reactions: [reactionSchema],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for better performance
commentSchema.index({ discussion: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ isDeleted: 1, isModerated: 1 });

// Virtual for reaction counts
commentSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
  });
  return counts;
});

// Virtual for total reactions
commentSchema.virtual('totalReactions').get(function() {
  return this.reactions.length;
});

// Method to get public JSON representation
commentSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    discussion: this.discussion,
    user: this.user,
    content: this.content,
    reactions: this.reactions,
    reactionCounts: this.reactionCounts,
    totalReactions: this.totalReactions,
    isEdited: this.isEdited,
    editedAt: this.editedAt,
    isDeleted: this.isDeleted,
    isModerated: this.isModerated,
    moderationReason: this.moderationReason,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to get comments by discussion with pagination
commentSchema.statics.getCommentsByDiscussion = async function(discussionId, options = {}) {
  const {
    page = 1,
    limit = 50,
    sortBy = 'createdAt',
    sortOrder = 'asc'
  } = options;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const comments = await this.find({
    discussion: discussionId,
    isDeleted: false
  })
  .populate('user', 'firstName lastName email profilePicture role')
  .populate('reactions.user', 'firstName lastName profilePicture')
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .lean();

  // Transform the lean results to include id field and virtual fields
  return comments.map(comment => ({
    ...comment,
    id: comment._id,
    reactionCounts: comment.reactions ? comment.reactions.reduce((counts, reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
      return counts;
    }, {}) : {},
    totalReactions: comment.reactions ? comment.reactions.length : 0
  }));
};

// Static method to get comment statistics
commentSchema.statics.getCommentStats = async function(discussionId) {
  const totalComments = await this.countDocuments({
    discussion: discussionId,
    isDeleted: false
  });

  const reactionStats = await this.aggregate([
    { $match: { discussion: mongoose.Types.ObjectId(discussionId), isDeleted: false } },
    { $unwind: '$reactions' },
    { $group: { _id: '$reactions.type', count: { $sum: 1 } } }
  ]);

  const stats = reactionStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return {
    totalComments,
    reactionStats: stats
  };
};

// Pre-save middleware to update editedAt when content changes
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
