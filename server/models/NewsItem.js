const mongoose = require('mongoose');

const newsItemSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true,
    enum: {
      values: [
        'AirDNA', 'Skift', 'VRM Intel', 'ShortTermRentalz', 'Rental Scale-Up',
        'Hospitable', 'PriceLabs', 'Guesty', 'Wheelhouse', 'Lodgify', 'Turno',
        'Hostaway', 'Beyond', 'Boostly', 'Get Paid For Your Pad', 'Robuilt',
        'BiggerPockets', 'Attom Transportation Noise', 'Manual Submission'
      ],
      message: 'Invalid news source'
    }
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP/HTTPS URL'
    }
  },
  summary: {
    type: String,
    default: null,
    trim: true,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  content: {
    type: String,
    default: null,
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  published_at: {
    type: Date,
    required: [true, 'Published date is required'],
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  featured_image_url: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/.+/.test(v);
      },
      message: 'Featured image URL must be a valid HTTP/HTTPS URL'
    }
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  view_count: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  click_count: {
    type: Number,
    default: 0,
    min: [0, 'Click count cannot be negative']
  },
  engagement_score: {
    type: Number,
    default: 0,
    min: [0, 'Engagement score cannot be negative']
  },
  admin_submitted: {
    type: Boolean,
    default: false
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['draft', 'published', 'archived'],
      message: 'Status must be one of: draft, published, archived'
    },
    default: 'published'
  },
  external_id: {
    type: String,
    default: null,
    sparse: true // Allows multiple null values but unique non-null values
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
newsItemSchema.index({ source: 1, published_at: -1 });
newsItemSchema.index({ status: 1, published_at: -1 });
newsItemSchema.index({ is_pinned: -1, is_featured: -1, published_at: -1 });
newsItemSchema.index({ engagement_score: -1, published_at: -1 });
newsItemSchema.index({ title: 'text', summary: 'text', content: 'text' }); // Text search
newsItemSchema.index({ external_id: 1 }, { unique: true, sparse: true }); // Prevent duplicate external articles

// Virtual for calculating engagement score
newsItemSchema.pre('save', function(next) {
  // Calculate engagement score based on views and clicks
  // Formula: (clicks * 10) + (views * 1)
  this.engagement_score = (this.click_count * 10) + (this.view_count * 1);
  next();
});

// Static method to get news items with pagination
newsItemSchema.statics.getNewsWithPagination = function(options = {}) {
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

  return this.find(query)
    .populate('submitted_by', 'firstName lastName email profilePicture role')
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get trending news (high engagement)
newsItemSchema.statics.getTrendingNews = function(limit = 10) {
  return this.find({ status: 'published' })
    .populate('submitted_by', 'firstName lastName email profilePicture role')
    .sort({ engagement_score: -1, published_at: -1 })
    .limit(limit);
};

// Static method to get news statistics
newsItemSchema.statics.getNewsStats = function() {
  return this.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: null,
        totalNews: { $sum: 1 },
        totalViews: { $sum: '$view_count' },
        totalClicks: { $sum: '$click_count' },
        totalEngagement: { $sum: '$engagement_score' },
        pinnedNews: { $sum: { $cond: ['$is_pinned', 1, 0] } },
        featuredNews: { $sum: { $cond: ['$is_featured', 1, 0] } },
        adminSubmittedNews: { $sum: { $cond: ['$admin_submitted', 1, 0] } }
      }
    }
  ]);
};

// Static method to get news by source statistics
newsItemSchema.statics.getNewsBySource = function() {
  return this.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
        totalViews: { $sum: '$view_count' },
        totalClicks: { $sum: '$click_count' },
        avgEngagement: { $avg: '$engagement_score' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('NewsItem', newsItemSchema);

