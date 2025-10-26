const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  author_name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  author_avatar: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        // Allow null, URLs, or base64 data URLs
        return v === null || 
               /^https?:\/\/.+/.test(v) || 
               /^data:image\/[a-zA-Z]*;base64,/.test(v);
      },
      message: 'Author avatar must be a valid URL or base64 data URL'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['General', 'Market Analysis', 'Property Management', 'Investment Strategies', 'Legal & Compliance', 'Technology', 'Networking', 'Success Stories', 'Q&A'],
      message: 'Category must be one of: General, Market Analysis, Property Management, Investment Strategies, Legal & Compliance, Technology, Networking, Success Stories, Q&A'
    },
    default: 'General'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  is_admin_post: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  comments_count: {
    type: Number,
    default: 0,
    min: [0, 'Comments count cannot be negative']
  },
  views_count: {
    type: Number,
    default: 0,
    min: [0, 'Views count cannot be negative']
  },
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    storageKey: {
      type: String,
      default: null
    }
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
discussionSchema.index({ user_id: 1, createdAt: -1 });
discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ is_pinned: -1, createdAt: -1 });
discussionSchema.index({ likes: -1, createdAt: -1 });
discussionSchema.index({ title: 'text', content: 'text' }); // Text search

// Virtual for time ago calculation
discussionSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
});

// Virtual for checking if user liked the post
discussionSchema.virtual('isLiked').get(function() {
  // This will be set by the service layer based on the requesting user
  return this._isLiked || false;
});

// Pre-save middleware to update last_activity
discussionSchema.pre('save', function(next) {
  this.last_activity = new Date();
  next();
});

// Static method to get discussions with pagination
discussionSchema.statics.getDiscussionsWithPagination = function(options = {}) {
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

  return this.find(query)
    .populate('user_id', 'firstName lastName email profilePicture role')
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get discussion statistics
discussionSchema.statics.getDiscussionStats = function() {
  return this.aggregate([
    { $match: { is_active: true } },
    {
      $group: {
        _id: null,
        totalDiscussions: { $sum: 1 },
        totalLikes: { $sum: '$likes' },
        totalComments: { $sum: '$comments_count' },
        totalViews: { $sum: '$views_count' },
        pinnedDiscussions: { $sum: { $cond: ['$is_pinned', 1, 0] } },
        adminDiscussions: { $sum: { $cond: ['$is_admin_post', 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Discussion', discussionSchema);
