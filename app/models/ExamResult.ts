import mongoose, { Schema, Document, Model } from 'mongoose';

// Section score breakdown
interface ISectionScore {
  sectionName: string;
  score: number;
  totalMarks: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
}

const SectionScoreSchema = new Schema<ISectionScore>({
  sectionName: { type: String, required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  attempted: { type: Number, required: true },
  correct: { type: Number, required: true },
  incorrect: { type: Number, required: true },
  unattempted: { type: Number, required: true },
  accuracy: { type: Number, required: true }
});

// Question-wise result
interface IQuestionResult {
  questionNum: number;
  section: string;
  isCorrect: boolean;
  marksAwarded: number;
  studentAnswer: any;
  correctAnswer: any;
  timeSpent: number;
}

const QuestionResultSchema = new Schema<IQuestionResult>({
  questionNum: { type: Number, required: true },
  section: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  marksAwarded: { type: Number, required: true },
  studentAnswer: Schema.Types.Mixed,
  correctAnswer: Schema.Types.Mixed,
  timeSpent: { type: Number, required: true }
});

// Main ExamResult interface
export interface IExamResult extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: string;
  attemptId: mongoose.Types.ObjectId;
  
  // Overall scores
  totalScore: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  rank?: number;
  
  // Section-wise breakdown
  sectionScores: ISectionScore[];
  
  // Question-wise details
  questionResults: IQuestionResult[];
  
  // Timing
  totalTimeTaken: number; // seconds
  submittedAt: Date;
  
  // Proctoring
  tabSwitchCount: number;
  warningsIssued: number;
  autoSubmitted: boolean;
}

const ExamResultSchema: Schema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: String, required: true },
  attemptId: { type: Schema.Types.ObjectId, ref: 'ExamAttempt', required: true },
  
  totalScore: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  rank: Number,
  
  sectionScores: [SectionScoreSchema],
  questionResults: [QuestionResultSchema],
  
  totalTimeTaken: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
  
  tabSwitchCount: { type: Number, default: 0 },
  warningsIssued: { type: Number, default: 0 },
  autoSubmitted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for analytics
ExamResultSchema.index({ examId: 1 });
ExamResultSchema.index({ studentId: 1 });
ExamResultSchema.index({ examId: 1, totalScore: -1 }); // for ranking

const ExamResult: Model<IExamResult> = mongoose.models.ExamResult || mongoose.model<IExamResult>('ExamResult', ExamResultSchema);

export default ExamResult;
