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
  const isAdmin = userRole === 'admin';

  let student: any;
  let assignedExams: any[];

  if (isAdmin) {
    // Construct a virtual student profile for the admin so they can use the dashboard
    student = {
      name: user.firstName + ' ' + (user.lastName || ''),
      email: user.emailAddresses[0].emailAddress,
      rollNumber: 'ADMIN-PRO',
      course: 'Internal Management',
      role: 'admin',
      batch: 'GLOBAL'
    };

    // Admins see ALL exams assigned to them (and they can take any exam)
    assignedExams = await Exam.find({}).lean();
  } else {
    // Get student profile
    student = await Student.findOne({ clerkId: userId }).lean();
    
    if (!student) {
      return null;
    }

    // Get all exams assigned to this student
    assignedExams = await Exam.find({
      $or: [
        { assignmentType: 'all' },
        { assignmentType: 'course', assignedCourses: student.course },
        { assignmentType: 'manual', assignedTo: userId }
      ]
    }).lean();
  }

  // Get attempts (both students and admins have attempts stored by clerkId)
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
      _id: exam._id.toString(), // Always route via Exam ID for the instructions page
      examId: {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.totalDuration,
      },
      status
    };
  });

  const resultsData = allResults.map(r => ({
    _id: r._id.toString(),
    attemptId: r.attemptId ? r.attemptId.toString() : null,
    examId: {
      title: (r.examId as any)?.title || 'Unknown Exam',
      totalMarks: (r.examId as any)?.totalMarks || 0
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
    isAdmin: isAdmin
  }));
}
