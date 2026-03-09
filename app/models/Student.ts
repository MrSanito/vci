import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
  clerkId: string;
  name: string;
  email: string;
  rollNumber: string;
  course: string;
  batch?: string;
  enrollmentDate: Date;
  role: 'student';
}

const StudentSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  batch: { type: String },
  enrollmentDate: { type: Date, default: Date.now },
  role: { type: String, default: 'student' }
}, {
  timestamps: true
});

// Prevent model overwrite during hot reload
const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
