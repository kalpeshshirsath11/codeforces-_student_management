import nodemailer from 'nodemailer';
import Student from '../models/Student';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  public static async sendInactivityReminder(studentId: string) {
    const student = await Student.findById(studentId);
    if (!student || !student.emailNotificationsEnabled) return;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Reminder: Continue Your Codeforces Journey!',
      html: `
        <h1>Hello ${student.name},</h1>
        <p>We noticed that you haven't made any submissions on Codeforces in the last 7 days.</p>
        <p>Remember, consistent practice is key to improving your programming skills!</p>
        <p>Your current Codeforces rating: ${student.currentRating}</p>
        <p>Your maximum rating: ${student.maxRating}</p>
        <p>Keep up the great work and continue solving problems!</p>
        <p>Best regards,<br>Student Progress Management System</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      
      student.reminderEmailCount += 1;
      student.lastReminderSent = new Date();
      await student.save();
    } catch (error) {
      console.error(`Error sending email to ${student.email}:`, error);
      throw error;
    }
  }
} 