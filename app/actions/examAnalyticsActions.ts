'use server'

import { checkRole } from '../utils/roles';
import connectToDatabase from '../lib/db';
import Exam from '../models/Exam';
import ExamAttempt from '../models/ExamAttempt';
import ExamResult from '../models/ExamResult';
import Student from '../models/Student';

export async function getExamAnalytics(examId: string) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return null;

  await connectToDatabase();

  const exam = await Exam.findById(examId).lean();
  if (!exam) return null;

  const attempts = await ExamAttempt.find({ examId }).lean();
  const results = await ExamResult.find({ examId }).sort({ totalScore: -1 }).lean();

  let assignedStudentIds: string[] = [];
  if (exam.assignmentType === 'all') {
    const students = await Student.find({}, 'clerkId').lean();
    assignedStudentIds = students.map((s: any) => s.clerkId);
  } else if (exam.assignmentType === 'course') {
    const students = await Student.find({ course: { $in: exam.assignedCourses } }, 'clerkId').lean();
    assignedStudentIds = students.map((s: any) => s.clerkId);
  } else {
    assignedStudentIds = exam.assignedTo || [];
  }

  const assignedCount = assignedStudentIds.length;
  const completedCount = results.length;
  const inProgressCount = attempts.filter((a: any) => !a.submitted).length;
  const notStartedCount = Math.max(0, assignedCount - completedCount - inProgressCount);

  const avgScore = results.length > 0
    ? results.reduce((sum: number, r: any) => sum + r.totalScore, 0) / results.length
    : 0;

  const passCount = results.filter((r: any) => r.passed).length;
  const failCount = results.filter((r: any) => !r.passed).length;

  return {
    exam,
    assignedCount,
    completedCount,
    inProgressCount,
    notStartedCount,
    avgScore,
    passCount,
    failCount,
    assignedStudentIds,
    results: JSON.parse(JSON.stringify(results)),
    attempts: JSON.parse(JSON.stringify(attempts))
  };
}
