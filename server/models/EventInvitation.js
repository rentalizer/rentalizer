const mongoose = require('mongoose');

const eventInvitationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'declined', 'maybe'],
      message: 'Status must be one of: pending, accepted, declined, maybe'
    },
    default: 'pending'
  },
  invited_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Invited by user is required']
  },
  invited_at: {
    type: Date,
    default: Date.now
  },
  responded_at: {
    type: Date,
    default: null
  },
  reminder_sent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one invitation per user per event
eventInvitationSchema.index({ event: 1, user: 1 }, { unique: true });

// Indexes for better performance
eventInvitationSchema.index({ user: 1, status: 1 });
eventInvitationSchema.index({ event: 1, status: 1 });
eventInvitationSchema.index({ invited_by: 1, invited_at: -1 });
eventInvitationSchema.index({ reminder_sent: 1, event: 1 });

// Virtual for response time
eventInvitationSchema.virtual('response_time').get(function() {
  if (this.responded_at && this.invited_at) {
    return this.responded_at.getTime() - this.invited_at.getTime();
  }
  return null;
});

// Method to update status
eventInvitationSchema.methods.updateStatus = function(newStatus, notes = null) {
  this.status = newStatus;
  this.responded_at = new Date();
  if (notes) {
    this.notes = notes;
  }
  return this.save();
};

// Method to mark reminder as sent
eventInvitationSchema.methods.markReminderSent = function() {
  this.reminder_sent = true;
  return this.save();
};

// Static method to get invitations for an event
eventInvitationSchema.statics.getEventInvitations = function(eventId) {
  return this.find({ event: eventId })
    .populate('user', 'firstName lastName email profilePicture')
    .populate('invited_by', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to get user's event invitations
eventInvitationSchema.statics.getUserInvitations = function(userId, status = null) {
  const query = { user: userId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('event')
    .populate('invited_by', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to get pending invitations for reminders
eventInvitationSchema.statics.getPendingInvitations = function(eventId) {
  return this.find({
    event: eventId,
    status: 'pending',
    reminder_sent: false
  }).populate('user', 'firstName lastName email');
};

// Static method to get event attendance statistics
eventInvitationSchema.statics.getEventStats = function(eventId) {
  return this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Pre-save middleware to validate user is not inviting themselves
eventInvitationSchema.pre('save', function(next) {
  if (this.user.toString() === this.invited_by.toString()) {
    const error = new Error('User cannot invite themselves to an event');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

// Pre-save middleware to update responded_at when status changes
eventInvitationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.responded_at = new Date();
  }
  next();
});

module.exports = mongoose.model('EventInvitation', eventInvitationSchema);
