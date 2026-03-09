'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import Student from '../models/Student';

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

  // For now, return basic stats - we'll populate with real data when exams are assigned
  const stats = {
    totalExams: 0,
    completedExams: 0,
    pendingExams: 0,
    inProgressExams: 0,
    averageScore: 0
  };

  return JSON.parse(JSON.stringify({
    student,
    attempts: [],
    results: [],
    stats,
    isAdmin: false
  }));
}
