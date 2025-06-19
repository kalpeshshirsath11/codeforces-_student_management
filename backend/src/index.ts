import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import studentRoutes from './routes/studentRoutes';
import { CodeforcesService } from './services/codeforcesService';
import { EmailService } from './services/emailService';
import Student from './models/Student';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', studentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_progress')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Schedule daily Codeforces data sync
cron.schedule(process.env.CRON_SCHEDULE || '0 2 * * *', async () => {
  console.log('Running scheduled Codeforces data sync...');
  try {
    const students = await Student.find();
    for (const student of students) {
      await CodeforcesService.updateStudentData(student._id);
      
      // Check for inactivity and send email if needed
      const isInactive = await CodeforcesService.checkInactivity(student._id);
      if (isInactive) {
        await EmailService.sendInactivityReminder(student._id);
      }
    }
    console.log('Scheduled sync completed successfully');
  } catch (error) {
    console.error('Error during scheduled sync:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 