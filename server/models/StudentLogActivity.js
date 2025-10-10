const mongoose = require('mongoose');

const ACTIVITY_TYPES = ['module', 'assignment', 'quiz', 'achievement', 'video', 'document'];
const MATERIAL_TYPES = ['pdf', 'video', 'document', 'link'];

const studentLogActivitySchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      trim: true,
      maxlength: [120, 'Legacy ID cannot exceed 120 characters'],
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentLogStudent',
      required: [true, 'Student reference is required'],
      index: true
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: [true, 'Activity type is required']
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [200, 'Activity title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required']
    },
    material: {
      type: String,
      trim: true,
      maxlength: [200, 'Material name cannot exceed 200 characters']
    },
    materialType: {
      type: String,
      enum: MATERIAL_TYPES,
      default: 'document'
    },
    materialUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Material URL cannot exceed 500 characters']
    },
    completed: {
      type: Boolean,
      default: true
    },
    score: {
      type: String,
      trim: true,
      maxlength: [50, 'Score cannot exceed 50 characters']
    },
    duration: {
      type: String,
      trim: true,
      maxlength: [50, 'Duration cannot exceed 50 characters']
    },
    serverId: {
      type: String,
      trim: true,
      maxlength: [120, 'Server ID cannot exceed 120 characters']
    },
    category: {
      type: String,
      trim: true,
      maxlength: [120, 'Category cannot exceed 120 characters']
    },
    views: {
      type: Number,
      min: [0, 'Views cannot be negative'],
      default: 0
    },
    metadata: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

studentLogActivitySchema.index({ student: 1, date: -1 });
studentLogActivitySchema.index({ student: 1, type: 1, date: -1 });

studentLogActivitySchema.statics.ACTIVITY_TYPES = ACTIVITY_TYPES;
studentLogActivitySchema.statics.MATERIAL_TYPES = MATERIAL_TYPES;

module.exports = mongoose.model('StudentLogActivity', studentLogActivitySchema);
module.exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
module.exports.MATERIAL_TYPES = MATERIAL_TYPES;
