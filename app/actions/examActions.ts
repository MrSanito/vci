'use server'

import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import Exam from '../models/Exam';
import ExamAttempt from '../models/ExamAttempt';
import ExamResult from '../models/ExamResult';
import { checkRole } from '../utils/roles';
import { revalidatePath } from 'next/cache';

export async function createExam(formData: any) {
  const { userId } = await auth();
  const isAdmin = await checkRole('admin');
  
  if (!isAdmin || !userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    const exam = await Exam.create({
      ...formData,
      createdBy: userId
    });

    revalidatePath('/admin/exams');
    return { success: true, message: 'Exam created successfully!', examId: exam._id };
  } catch (error: any) {
    console.error('Create Exam Error:', error);
    return { success: false, message: error.message || 'Failed to create exam' };
  }
}

export async function getExams() {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return [];

  await connectToDatabase();
  const exams = await Exam.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(exams));
}

export async function getExamById(examId: string) {
  await connectToDatabase();
  const exam = await Exam.findById(examId).lean();
  return JSON.parse(JSON.stringify(exam));
}

export async function deleteExam(examId: string) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    await Exam.findByIdAndDelete(examId);
    revalidatePath('/admin/exams');
    return { success: true, message: 'Exam deleted successfully!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateExamQuestions(examId: string, sections: any[]) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    // Calculate new total marks based on questions
    let newTotalMarks = 0;
    sections.forEach(sec => {
      sec.questions.forEach((q: any) => {
        newTotalMarks += (q.marks || 1);
      });
    });

    await Exam.findByIdAndUpdate(examId, {
      sections: sections,
      totalMarks: newTotalMarks,
      passingMarks: Math.floor(newTotalMarks * 0.4) // Update passing marks automatically
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, message: 'Questions updated successfully!' };
  } catch (error: any) {
    console.error('Update Questions Error:', error);
    return { success: false, message: error.message || 'Failed to update questions' };
  }
}
