const mongoose = require('mongoose');

const usageEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 6,
    maxlength: 24
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
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
  usageCount: {
    type: Number,
    default: 0
  },
  usageHistory: {
    type: [usageEntrySchema],
    default: []
  },
  lastUsedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

promoCodeSchema.index({ code: 1 });

module.exports = mongoose.model('PromoCode', promoCodeSchema);
