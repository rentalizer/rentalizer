const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const StudentLogStudent = require('../models/StudentLogStudent');
const StudentLogActivity = require('../models/StudentLogActivity');
const { students, defaultActivities, studentSpecificActivities } = require('../seed/studentLogData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentalizer';

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildActivityDocsForStudent = (student, baseActivities) => {
  return baseActivities.map((activity, index) => ({
    legacyId: `${activity.legacyId || `activity-${index + 1}`}-student-${student.legacyId || student.email}`,
    student: student._id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    date: normalizeDate(activity.date) || new Date(),
    material: activity.material,
    materialType: activity.materialType,
    materialUrl: activity.materialUrl || null,
    completed: activity.completed !== false,
    score: activity.score || null,
    duration: activity.duration || null,
    serverId: activity.serverId || null,
    category: activity.category || null,
    views: typeof activity.views === 'number' ? activity.views : 0,
    metadata: activity.metadata || {}
  }));
};

const seed = async () => {
  await mongoose.connect(MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000
  });

  console.log('📦 Connected to MongoDB. Seeding student log data...');

  try {
    const studentIdMap = new Map();

    for (const student of students) {
      const upserted = await StudentLogStudent.findOneAndUpdate(
        { email: student.email },
        {
          legacyId: student.legacyId,
          name: student.name,
          email: student.email,
          progress: student.progress ?? 0,
          status: student.status || 'active',
          startDate: normalizeDate(student.startDate),
          notes: student.notes || null
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      studentIdMap.set(student.legacyId || student.email, upserted);
    }

    console.log(`👥 Upserted ${studentIdMap.size} student records`);

    // Remove existing activities for seeded students to prevent duplicates
    const seededStudentIds = Array.from(studentIdMap.values()).map((student) => student._id);
    await StudentLogActivity.deleteMany({ student: { $in: seededStudentIds } });

    let activityInsertCount = 0;
    const activityDocs = [];

    for (const [legacyKey, studentDoc] of studentIdMap.entries()) {
      const specificActivities = studentSpecificActivities[legacyKey];
      if (specificActivities && specificActivities.length) {
        activityDocs.push(...buildActivityDocsForStudent(studentDoc, specificActivities));
      } else {
        activityDocs.push(
          ...buildActivityDocsForStudent(
            studentDoc,
            defaultActivities.map((activity) => ({
              ...activity,
              legacyId: activity.legacyId
                ? `${activity.legacyId}-${legacyKey}`
                : `default-${legacyKey}`
            }))
          )
        );
      }
    }

    if (activityDocs.length) {
      const inserted = await StudentLogActivity.insertMany(activityDocs, { ordered: false });
      activityInsertCount = inserted.length;
    }

    console.log(`✅ Inserted ${activityInsertCount} activity records`);
    console.log('🎉 Student learning log data seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed student log data:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
