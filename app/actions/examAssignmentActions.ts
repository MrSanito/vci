'use server'

import { checkRole } from '../utils/roles';
import connectToDatabase from '../lib/db';
import Exam from '../models/Exam';
import { revalidatePath } from 'next/cache';

export async function assignExamToStudents(examId: string, studentIds: string[]) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }

    // Add new students to assignedTo array (avoid duplicates)
    const currentAssigned = new Set(exam.assignedTo);
    studentIds.forEach(id => currentAssigned.add(id));
    
    exam.assignedTo = Array.from(currentAssigned);
    await exam.save();

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, message: `Exam assigned to ${studentIds.length} student(s)` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function assignExamToBatch(examId: string, batchName: string) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    // Import Student model
    const Student = (await import('../models/Student')).default;
    
    // Get all students in the batch
    const students = await Student.find({ batch: batchName }).lean();
    const studentIds = students.map((s: any) => s.clerkId);
    
    if (studentIds.length === 0) {
      return { success: false, message: 'No students found in this batch' };
    }

    // Assign to all students in batch
    const result = await assignExamToStudents(examId, studentIds);
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getStudentExams(studentId: string) {
  await connectToDatabase();
  
  const exams = await Exam.find({
    assignedTo: studentId,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  }).lean();

  return JSON.parse(JSON.stringify(exams));
}
