const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Document filename is required'],
    trim: true,
    maxlength: [255, 'Filename cannot exceed 255 characters']
  },
  url: {
    type: String,
    required: [true, 'Document URL is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Document type is required'],
    enum: {
      values: ['pdf', 'excel'],
      message: 'Document type must be either pdf or excel'
    }
  },
  size: {
    type: Number,
    required: [true, 'Document size is required'],
    min: [0, 'File size cannot be negative'],
    max: [3 * 1024 * 1024, 'File size cannot exceed 3MB']
  },
  category: {
    type: String,
    required: [true, 'Document category is required'],
    enum: {
      values: ['Business Formation', 'Market Research', 'Property Acquisition', 'Operations', 'Documents Library'],
      message: 'Category must be one of: Business Formation, Market Research, Property Acquisition, Operations, Documents Library'
    }
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: false // Optional - only set if document came from a video attachment
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Index for better query performance
documentSchema.index({ category: 1, createdAt: -1 });
documentSchema.index({ createdBy: 1 });
documentSchema.index({ videoId: 1 });

// Virtual for formatted file size
documentSchema.virtual('formattedSize').get(function() {
  if (this.size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(this.size) / Math.log(k));
  return parseFloat((this.size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Ensure virtual fields are serialized
documentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
