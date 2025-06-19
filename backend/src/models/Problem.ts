import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  studentId: mongoose.Types.ObjectId;
  problemId: string;
  problemName: string;
  rating: number;
  tags: string[];
  solvedDate: Date;
  submissionId: number;
  verdict: string;
}

const ProblemSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  problemId: { type: String, required: true },
  problemName: { type: String, required: true },
  rating: { type: Number, required: true },
  tags: [{ type: String }],
  solvedDate: { type: Date, required: true },
  submissionId: { type: Number, required: true },
  verdict: { type: String, required: true }
});

// Compound index to ensure unique problem entries per student
ProblemSchema.index({ studentId: 1, problemId: 1 }, { unique: true });

export default mongoose.model<IProblem>('Problem', ProblemSchema); 