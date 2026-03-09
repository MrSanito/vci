import mongoose, { Schema, Document, Model } from 'mongoose';

// Question state for tracking
interface IQuestionState {
  status: 'notVisited' | 'notAnswered' | 'answered' | 'markedForReview' | 'answeredAndMarked';
  selectedAnswer: any; // number, number[], or numerical value
  timeSpent: number; // seconds
  visitCount: number;
}

const QuestionStateSchema = new Schema<IQuestionState>({
  status: { 
    type: String, 
    enum: ['notVisited', 'notAnswered', 'answered', 'markedForReview', 'answeredAndMarked'],
    default: 'notVisited'
  },
  selectedAnswer: Schema.Types.Mixed,
  timeSpent: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 }
});

// Main ExamAttempt interface
export interface IExamAttempt extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: string;
  startedAt: Date;
  lastActivityAt: Date;
  timeRemaining: number; // seconds
  currentSection: number;
  currentQuestion: number;
  
  // Question states (Map of question number to state)
  questionStates: Map<number, IQuestionState>;
  
  // Security tracking
  tabSwitchCount: number;
  tabSwitchTimestamps: Date[];
  warningsIssued: number;
  
  // Submission
  submitted: boolean;
  submittedAt?: Date;
  autoSubmitted: boolean;
  autoSubmitReason?: string;
  isPreview: boolean;
  activeSessionId?: string;
  examEndTime?: Date;
}

const ExamAttemptSchema: Schema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  timeRemaining: { type: Number, required: true }, // in seconds
  currentSection: { type: Number, default: 0 },
  currentQuestion: { type: Number, default: 0 },
  
  questionStates: {
    type: Map,
    of: QuestionStateSchema,
    default: new Map()
  },
  
  tabSwitchCount: { type: Number, default: 0 },
  tabSwitchTimestamps: [Date],
  warningsIssued: { type: Number, default: 0 },
  
  submitted: { type: Boolean, default: false },
  submittedAt: Date,
  autoSubmitted: { type: Boolean, default: false },
  autoSubmitReason: { type: String },
  isPreview: { type: Boolean, default: false },
  activeSessionId: { type: String },
  examEndTime: { type: Date }
}, {
  timestamps: true
});

// Index for quick lookups
ExamAttemptSchema.index({ examId: 1, studentId: 1 });

const ExamAttempt: Model<IExamAttempt> = mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>('ExamAttempt', ExamAttemptSchema);

export default ExamAttempt;
