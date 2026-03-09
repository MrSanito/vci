import mongoose, { Schema, Document, Model } from 'mongoose';

// Question subdocument
interface IQuestion {
  questionText: string;
  questionType: 'single' | 'multiple' | 'numerical' | 'caseStudy';
  options: string[];
  correctAnswers: number[]; // indices for MCQ, or [numerical value]
  marks: number;
  negativeMarks: number;
  caseStudyId?: string;
  explanation?: string;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  questionType: { 
    type: String, 
    enum: ['single', 'multiple', 'numerical', 'caseStudy'],
    required: true 
  },
  options: [String],
  correctAnswers: [Number],
  marks: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },
  caseStudyId: String,
  explanation: String
});

// Section subdocument
interface ISection {
  name: string;
  questionCount: number;
  questions: IQuestion[];
}

const SectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  questionCount: { type: Number, required: true },
  questions: [QuestionSchema]
});

// Main Exam interface
export interface IExam extends Document {
  title: string;
  description: string;
  totalDuration: number; // minutes
  sections: ISection[];
  totalMarks: number;
  passingMarks: number;
  assignmentType: 'manual' | 'course' | 'all';
  assignedCourses: string[];
  assignedTo: string[];
  startDate: Date;
  endDate: Date;
  instructions: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  createdBy: string;
  createdAt: Date;
}

const ExamSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalDuration: { type: Number, required: true },
  sections: [SectionSchema],
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  assignmentType: { type: String, enum: ['manual', 'course', 'all'], default: 'all' },
  assignedCourses: [String],
  assignedTo: [String],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  instructions: { type: String, default: '' },
  shuffleQuestions: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: false },
  showResultsImmediately: { type: Boolean, default: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Exam: Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);

export default Exam;
