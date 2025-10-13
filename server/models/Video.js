const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Video description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Allow both file paths (uploaded files) and external URLs
        const isFilePath = /^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        const isUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
        return isFilePath || isUrl;
      },
      message: 'Thumbnail must be an uploaded image file or valid image URL'
    }
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Video category is required'],
    enum: {
      values: ['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Training Replays', 'Documents Library'],
      message: 'Category must be one of: Business Formation, Market Research, Property Acquisition, Operations, Training Replays, Documents Library'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isLive: {
    type: Boolean,
    default: false
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Validate Loom URL format
        return /^https:\/\/www\.loom\.com\/share\/[a-zA-Z0-9]+/.test(v);
      },
      message: 'Video URL must be a valid Loom share URL'
    }
  },
  attachment: {
    filename: {
      type: String,
      trim: true,
      maxlength: [255, 'Filename cannot exceed 255 characters']
    },
    storageKey: {
      type: String,
      trim: true,
      default: null
    },
    url: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: {
        values: ['pdf', 'excel', 'spreadsheet', 'document', 'presentation', 'text'],
        message: 'Attachment type must be one of: pdf, excel, spreadsheet, document, presentation, text'
      }
    },
    contentType: {
      type: String,
      trim: true
    },
    size: {
      type: Number,
      min: [0, 'File size cannot be negative'],
      max: [20 * 1024 * 1024, 'File size cannot exceed 20MB']
    }
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
videoSchema.index({ category: 1, isActive: 1 });
videoSchema.index({ featured: 1, isActive: 1 });
videoSchema.index({ order: 1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for embed URL
videoSchema.virtual('embedUrl').get(function() {
  if (this.videoUrl) {
    const videoId = this.videoUrl.split('/share/')[1]?.split('?')[0];
    return `https://www.loom.com/embed/${videoId}`;
  }
  return null;
});

// Method to increment views
videoSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to reorder videos
videoSchema.statics.reorderVideos = async function(videoOrders) {
  const bulkOps = videoOrders.map(({ videoId, order }) => ({
    updateOne: {
      filter: { _id: videoId },
      update: { order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Pre-save middleware to set order if not provided
videoSchema.pre('save', async function(next) {
  if (this.isNew && this.order === 0) {
    const maxOrder = await this.constructor.findOne({}, { order: 1 }).sort({ order: -1 });
    this.order = maxOrder ? maxOrder.order + 1 : 1;
  }
  next();
});

// Ensure virtual fields are serialized
videoSchema.set('toJSON', { virtuals: true });
videoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Video', videoSchema);
