'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import Student from '../models/Student';
import Exam from '../models/Exam';
import ExamAttempt from '../models/ExamAttempt';
import ExamResult from '../models/ExamResult';

export async function getStudentProfile() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  await connectToDatabase();
  const student = await Student.findOne({ clerkId: userId }).lean();
  
  return JSON.parse(JSON.stringify(student));
}

export async function getStudentDashboardData() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  await connectToDatabase();
  
  // Check if user is admin
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  // @ts-ignore
  const userRole = user.publicMetadata?.role;
  
  // If admin, return demo data
  if (userRole === 'admin') {
    return {
      student: {
        name: user.firstName + ' ' + (user.lastName || ''),
        email: user.emailAddresses[0].emailAddress,
        rollNumber: 'ADMIN',
        course: 'Administrator',
        role: 'admin',
        batch: 'N/A'
      },
      attempts: [],
      results: [],
      stats: {
        totalExams: 0,
        completedExams: 0,
        pendingExams: 0,
        inProgressExams: 0,
        averageScore: 0
      },
      isAdmin: true
    };
  }
  
  // Get student profile
  const student = await Student.findOne({ clerkId: userId }).lean();
  
  if (!student) {
    return null;
  }

  // Get all exams assigned to this student
  const now = new Date();
  const assignedExams = await Exam.find({
    $or: [
      { assignmentType: 'all' },
      { assignmentType: 'course', assignedCourses: student.course },
      { assignmentType: 'manual', assignedTo: userId }
    ]
  }).lean();

  // Get attempts
  const allAttempts = await ExamAttempt.find({ studentId: userId }).lean();
  
  // Get results
  const allResults = await ExamResult.find({ studentId: userId })
    .populate('examId', 'title totalMarks')
    .sort({ submittedAt: -1 })
    .lean();

  // Map to the shape expected by the frontend
  const attemptMap = new Map();
  allAttempts.forEach(a => attemptMap.set(a.examId.toString(), a));
  const resultMap = new Map();
  allResults.forEach(r => resultMap.set(r.examId._id.toString(), r));

  const attemptsData = assignedExams.filter(exam => !resultMap.has(exam._id.toString())).map(exam => {
    const attempt = attemptMap.get(exam._id.toString());
    let status = 'pending';
    if (attempt) {
      status = attempt.submitted ? 'completed' : 'in-progress';
    }
    return {
      _id: attempt ? attempt.examId.toString() : exam._id.toString(), // The link points to /exam/[id], which expects examId
      examId: {
        title: exam.title,
        description: exam.description,
        duration: exam.totalDuration,
        totalMarks: exam.totalMarks
      },
      status
    };
  });

  const resultsData = allResults.map(r => ({
    _id: r._id.toString(),
    attemptId: r.attemptId.toString(),
    examId: {
      title: (r.examId as any).title,
      totalMarks: (r.examId as any).totalMarks
    },
    passed: r.passed,
    score: r.totalScore,
    percentage: r.percentage,
    timeTaken: Math.floor(r.totalTimeTaken / 60)
  }));

  const stats = {
    totalExams: assignedExams.length,
    completedExams: allResults.length,
    pendingExams: attemptsData.filter(a => a.status === 'pending').length,
    inProgressExams: attemptsData.filter(a => a.status === 'in-progress').length,
    averageScore: allResults.length > 0 
      ? Math.round(allResults.reduce((acc, r) => acc + r.percentage, 0) / allResults.length) 
      : 0
  };

  return JSON.parse(JSON.stringify({
    student,
    attempts: attemptsData,
    results: resultsData,
    stats,
    isAdmin: false
  }));
}
