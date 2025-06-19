import { Router } from 'express';
import { StudentController } from '../controllers/studentController';

const router = Router();

// Student CRUD routes
router.get('/students', StudentController.getAllStudents);
router.get('/students/:id', StudentController.getStudentById);
router.post('/students', StudentController.createStudent);
router.put('/students/:id', StudentController.updateStudent);
router.delete('/students/:id', StudentController.deleteStudent);

// Student statistics routes
router.get('/students/:id/contests', StudentController.getContestHistory);
router.get('/students/:id/problems', StudentController.getProblemStats);
router.put('/students/:id/notifications', StudentController.toggleEmailNotifications);

export default router; 