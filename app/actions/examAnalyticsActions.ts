'use server'

import { checkRole } from '../utils/roles';
import connectToDatabase from '../lib/db';
import Exam from '../models/Exam';
import ExamAttempt from '../models/ExamAttempt';
import ExamResult from '../models/ExamResult';

export async function getExamAnalytics(examId: string) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return null;

  await connectToDatabase();

  const exam = await Exam.findById(examId).lean();
  const attempts = await ExamAttempt.find({ examId }).lean();
  const results = await ExamResult.find({ examId }).sort({ totalScore: -1 }).lean();

  const assignedCount = exam?.assignedTo?.length || 0;
  const completedCount = results.length;
  const inProgressCount = attempts.filter((a: any) => !a.submitted).length;
  const notStartedCount = assignedCount - completedCount - inProgressCount;

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
    results: JSON.parse(JSON.stringify(results)),
    attempts: JSON.parse(JSON.stringify(attempts))
  };
}
