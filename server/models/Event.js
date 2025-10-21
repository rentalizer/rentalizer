const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  event_date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  event_time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: {
      values: ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours'],
      message: 'Duration must be one of: 30 minutes, 1 hour, 1.5 hours, 2 hours, 3 hours'
    },
    default: '1 hour'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: {
      values: ['Zoom', 'Google Meet', 'Microsoft Teams', 'In Person'],
      message: 'Location must be one of: Zoom, Google Meet, Microsoft Teams, In Person'
    },
    default: 'Zoom'
  },
  zoom_link: {
    type: String,
    required: [true, 'Zoom link is required'],
    trim: true,
    maxlength: [500, 'Zoom link cannot exceed 500 characters']
    // Removed URL validation for development flexibility
    // Users can enter meeting IDs, room names, or full URLs
  },
  attendees: {
    type: String,
    required: [true, 'Attendees setting is required'],
    enum: {
      values: ['All members', 'Premium members', 'Invited only'],
      message: 'Attendees must be one of: All members, Premium members, Invited only'
    },
    default: 'All members'
  },
  is_recurring: {
    type: Boolean,
    default: false
  },
  remind_members: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  cover_image: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/.+/.test(v) || /^data:image\/[a-zA-Z]*;base64,/.test(v);
      },
      message: 'Cover image must be a valid URL or base64 data URL'
    }
  },
  max_attendees: {
    type: Number,
    min: [1, 'Max attendees must be at least 1'],
    max: [1000, 'Max attendees cannot exceed 1000']
  },
  series_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Event' // Reference to the parent event in a recurring series
  },
  is_active: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
eventSchema.index({ event_date: 1, event_time: 1 });
eventSchema.index({ created_by: 1, createdAt: -1 });
eventSchema.index({ series_id: 1 });
eventSchema.index({ is_active: 1, event_date: 1 });

// Virtual for full datetime
eventSchema.virtual('full_datetime').get(function() {
  const [hours, minutes] = this.event_time.split(':');
  const eventDateTime = new Date(this.event_date);
  eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return eventDateTime;
});

// Virtual for end datetime
eventSchema.virtual('end_datetime').get(function() {
  const startDateTime = this.full_datetime;
  const durationMinutes = this.getDurationInMinutes();
  const endDateTime = new Date(startDateTime.getTime() + (durationMinutes * 60000));
  return endDateTime;
});

// Method to get duration in minutes
eventSchema.methods.getDurationInMinutes = function() {
  const durationMap = {
    '30 minutes': 30,
    '1 hour': 60,
    '1.5 hours': 90,
    '2 hours': 120,
    '3 hours': 180
  };
  return durationMap[this.duration] || 60;
};

// Method to check if event is in the past
eventSchema.methods.isPast = function() {
  return this.full_datetime < new Date();
};

// Method to check if event is today
eventSchema.methods.isToday = function() {
  const today = new Date();
  const eventDate = new Date(this.event_date);
  return today.toDateString() === eventDate.toDateString();
};

// Static method to get events for a specific date range
eventSchema.statics.getEventsInRange = function(startDate, endDate) {
  return this.find({
    event_date: {
      $gte: startDate,
      $lte: endDate
    },
    is_active: true
  }).populate('created_by', 'firstName lastName email');
};

// Static method to get events for a specific month
eventSchema.statics.getEventsForMonth = function(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // This gives last day of previous month, need to fix
  // Fix: Get the last day of the current month
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const correctedEndDate = new Date(year, month - 1, lastDayOfMonth, 23, 59, 59, 999);
  
  console.log(`📅 getEventsForMonth: Looking for events between ${startDate.toISOString()} and ${correctedEndDate.toISOString()}`);
  
  return this.find({
    event_date: {
      $gte: startDate,
      $lte: correctedEndDate
    },
    is_active: true
  }).populate('created_by', 'firstName lastName email profilePicture');
};

// Pre-save middleware to validate zoom_link when location is Zoom
eventSchema.pre('save', function(next) {
  if (this.location === 'Zoom' && !this.zoom_link) {
    this.zoom_link = null; // Allow null zoom_link for Zoom events
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
