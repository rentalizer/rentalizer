const mongoose = require('mongoose');

const studentLogStudentSchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      trim: true,
      maxlength: [50, 'Legacy ID cannot exceed 50 characters'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [120, 'Student name cannot exceed 120 characters']
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email address']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'paused', 'completed'],
      default: 'active'
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
      default: 0
    },
    startDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

studentLogStudentSchema.virtual('activities', {
  ref: 'StudentLogActivity',
  localField: '_id',
  foreignField: 'student'
});

studentLogStudentSchema.index({ email: 1 }, { unique: true });
studentLogStudentSchema.index({ status: 1 });

module.exports = mongoose.model('StudentLogStudent', studentLogStudentSchema);
