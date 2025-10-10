const mongoose = require('mongoose');
const StudentLogStudent = require('../models/StudentLogStudent');
const StudentLogActivity = require('../models/StudentLogActivity');

class StudentLogService {
  static async getStudents(filters = {}) {
    const { status, search, sort = 'name', order = 'asc' } = filters;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const sortDirection = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sort] = sortDirection;

    return StudentLogStudent.find(query).sort(sortOptions).lean();
  }

  static async getStudentById(studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const student = await StudentLogStudent.findById(studentId).lean();

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  static async createStudent(studentData) {
    const student = new StudentLogStudent(studentData);
    return student.save();
  }

  static async updateStudent(studentId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const updatedStudent = await StudentLogStudent.findByIdAndUpdate(
      studentId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      throw new Error('Student not found');
    }

    return updatedStudent;
  }

  static async deleteStudent(studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const student = await StudentLogStudent.findByIdAndDelete(studentId).session(session);

      if (!student) {
        throw new Error('Student not found');
      }

      await StudentLogActivity.deleteMany({ student: studentId }).session(session);

      await session.commitTransaction();
      session.endSession();

      return { message: 'Student and related activities deleted successfully' };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async getStudentActivities(studentId, filters = {}) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const studentExists = await StudentLogStudent.exists({ _id: studentId });
    if (!studentExists) {
      throw new Error('Student not found');
    }

    const { type, limit = 100, skip = 0 } = filters;

    const query = { student: studentId };

    if (type) {
      query.type = type;
    }

    return StudentLogActivity.find(query)
      .sort({ date: -1 })
      .skip(parseInt(skip, 10))
      .limit(parseInt(limit, 10))
      .lean();
  }

  static async createActivity(studentId, activityData) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const studentExists = await StudentLogStudent.exists({ _id: studentId });
    if (!studentExists) {
      throw new Error('Student not found');
    }

    const activity = new StudentLogActivity({
      ...activityData,
      student: studentId
    });

    return activity.save();
  }

  static async updateActivity(activityId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      throw new Error('Invalid activity ID');
    }

    const activity = await StudentLogActivity.findByIdAndUpdate(
      activityId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!activity) {
      throw new Error('Activity not found');
    }

    return activity;
  }

  static async deleteActivity(activityId) {
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      throw new Error('Invalid activity ID');
    }

    const activity = await StudentLogActivity.findByIdAndDelete(activityId);

    if (!activity) {
      throw new Error('Activity not found');
    }

    return { message: 'Activity deleted successfully' };
  }
}

module.exports = StudentLogService;
