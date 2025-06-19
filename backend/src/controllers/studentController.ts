import { Request, Response } from 'express';
import Student from '../models/Student';
import Contest from '../models/Contest';
import Problem from '../models/Problem';
import { CodeforcesService } from '../services/codeforcesService';

export class StudentController {
  // Get all students
  public static async getAllStudents(req: Request, res: Response) {
    try {
      const students = await Student.find().select('-__v');
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error });
    }
  }

  // Get student by ID
  public static async getStudentById(req: Request, res: Response) {
    try {
      const student = await Student.findById(req.params.id).select('-__v');
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student', error });
    }
  }

  // Create new student
  public static async createStudent(req: Request, res: Response) {
    try {
      const student = new Student(req.body);
      await student.save();
      
      // Fetch initial Codeforces data
      await CodeforcesService.updateStudentData(student._id);
      
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error creating student', error });
    }
  }

  // Update student
  public static async updateStudent(req: Request, res: Response) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).select('-__v');

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // If Codeforces handle was updated, fetch new data
      if (req.body.codeforcesHandle) {
        await CodeforcesService.updateStudentData(student._id);
      }

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error updating student', error });
    }
  }

  // Delete student
  public static async deleteStudent(req: Request, res: Response) {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Delete associated data
      await Contest.deleteMany({ studentId: req.params.id });
      await Problem.deleteMany({ studentId: req.params.id });
      
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  }

  // Get student's contest history
  public static async getContestHistory(req: Request, res: Response) {
    try {
      const { days } = req.query;
      const dateFilter = days ? new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000) : new Date(0);

      const contests = await Contest.find({
        studentId: req.params.id,
        contestDate: { $gte: dateFilter }
      }).sort({ contestDate: -1 });

      res.json(contests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contest history', error });
    }
  }

  // Get student's problem-solving statistics
  public static async getProblemStats(req: Request, res: Response) {
    try {
      const { days } = req.query;
      const dateFilter = days ? new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000) : new Date(0);

      const problems = await Problem.find({
        studentId: req.params.id,
        solvedDate: { $gte: dateFilter }
      });

      const stats = {
        totalProblems: problems.length,
        averageRating: problems.reduce((acc, p) => acc + p.rating, 0) / problems.length || 0,
        problemsPerDay: problems.length / (Number(days) || 1),
        hardestProblem: problems.reduce((max, p) => p.rating > max.rating ? p : max, problems[0] || { rating: 0 }),
        ratingDistribution: problems.reduce((acc, p) => {
          const bucket = Math.floor(p.rating / 100) * 100;
          acc[bucket] = (acc[bucket] || 0) + 1;
          return acc;
        }, {})
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching problem statistics', error });
    }
  }

  // Toggle email notifications
  public static async toggleEmailNotifications(req: Request, res: Response) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { emailNotificationsEnabled: req.body.enabled },
        { new: true }
      ).select('-__v');

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error updating email notifications', error });
    }
  }
} 