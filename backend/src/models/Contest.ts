import mongoose, { Document, Schema } from 'mongoose';

export interface IContest extends Document {
  studentId: mongoose.Types.ObjectId;
  contestId: number;
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  solvedProblems: number;
  totalProblems: number;
  contestDate: Date;
}

const ContestSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  contestId: { type: Number, required: true },
  contestName: { type: String, required: true },
  rank: { type: Number, required: true },
  oldRating: { type: Number, required: true },
  newRating: { type: Number, required: true },
  solvedProblems: { type: Number, required: true },
  totalProblems: { type: Number, required: true },
  contestDate: { type: Date, required: true }
});

// Compound index to ensure unique contest entries per student
ContestSchema.index({ studentId: 1, contestId: 1 }, { unique: true });

export default mongoose.model<IContest>('Contest', ContestSchema); 