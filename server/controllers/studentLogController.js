const StudentLogService = require('../services/studentLogService');

class StudentLogController {
  static async listStudents(req, res) {
    try {
      const students = await StudentLogService.getStudents(req.query);
      res.json({
        success: true,
        message: 'Students fetched successfully',
        data: students
      });
    } catch (error) {
      console.error('List students error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getStudent(req, res) {
    try {
      const student = await StudentLogService.getStudentById(req.params.studentId);
      res.json({
        success: true,
        message: 'Student fetched successfully',
        data: student
      });
    } catch (error) {
      console.error('Get student error:', error);
      const status = error.message === 'Student not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createStudent(req, res) {
    try {
      const student = await StudentLogService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStudent(req, res) {
    try {
      const student = await StudentLogService.updateStudent(req.params.studentId, req.body);
      res.json({
        success: true,
        message: 'Student updated successfully',
        data: student
      });
    } catch (error) {
      console.error('Update student error:', error);
      const status = error.message === 'Student not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const result = await StudentLogService.deleteStudent(req.params.studentId);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Delete student error:', error);
      const status = error.message === 'Student not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async listStudentActivities(req, res) {
    try {
      const activities = await StudentLogService.getStudentActivities(req.params.studentId, req.query);
      res.json({
        success: true,
        message: 'Student activities fetched successfully',
        data: activities
      });
    } catch (error) {
      console.error('List student activities error:', error);
      const status = error.message === 'Student not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createStudentActivity(req, res) {
    try {
      const activity = await StudentLogService.createActivity(req.params.studentId, req.body);
      res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        data: activity
      });
    } catch (error) {
      console.error('Create student activity error:', error);
      const status = error.message === 'Student not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStudentActivity(req, res) {
    try {
      const activity = await StudentLogService.updateActivity(req.params.activityId, req.body);
      res.json({
        success: true,
        message: 'Activity updated successfully',
        data: activity
      });
    } catch (error) {
      console.error('Update student activity error:', error);
      const status = error.message === 'Activity not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteStudentActivity(req, res) {
    try {
      const result = await StudentLogService.deleteActivity(req.params.activityId);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Delete student activity error:', error);
      const status = error.message === 'Activity not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = StudentLogController;
