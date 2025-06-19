import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: Date;
  emailNotificationsEnabled: boolean;
  reminderEmailCount: number;
  lastReminderSent: Date;
}

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  codeforcesHandle: { type: String, required: true, unique: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  emailNotificationsEnabled: { type: Boolean, default: true },
  reminderEmailCount: { type: Number, default: 0 },
  lastReminderSent: { type: Date }
});

export default mongoose.model<IStudent>('Student', StudentSchema); 