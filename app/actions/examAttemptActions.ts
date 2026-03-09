'use server'

import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import ExamAttempt from '../models/ExamAttempt';
import Exam from '../models/Exam';

export async function startExamAttempt(examId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    // Check if already attempted
    const existing = await ExamAttempt.findOne({ examId, studentId: userId });
    if (existing && existing.submitted) {
      return { success: false, message: 'You have already submitted this exam' };
    }
    
    if (existing && !existing.submitted) {
      // Resume existing attempt
      return { success: true, attemptId: existing._id.toString() };
    }

    // Get exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }

    // Create new attempt
    const attempt = await ExamAttempt.create({
      examId,
      studentId: userId,
      timeRemaining: exam.totalDuration * 60, // convert to seconds
      questionStates: new Map()
    });

    return { success: true, attemptId: attempt._id.toString() };
  } catch (error: any) {
    console.error('Start Exam Error:', error);
    return { success: false, message: error.message };
  }
}

export async function getExamAttempt(attemptId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();
  const attempt = await ExamAttempt.findById(attemptId).lean();
  
  if (!attempt || attempt.studentId !== userId) return null;
  
  return JSON.parse(JSON.stringify(attempt));
}

export async function updateQuestionState(attemptId: string, questionNum: number, state: any) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await connectToDatabase();
    
    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt || attempt.studentId !== userId) {
      return { success: false, message: 'Invalid attempt' };
    }

    // Update question state
    attempt.questionStates.set(questionNum, state);
    attempt.lastActivityAt = new Date();
    await attempt.save();

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTimer(attemptId: string, timeRemaining: number) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  try {
    await connectToDatabase();
    await ExamAttempt.findByIdAndUpdate(attemptId, {
      timeRemaining,
      lastActivityAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function recordTabSwitch(attemptId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  try {
    await connectToDatabase();
    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt || attempt.studentId !== userId) {
      return { success: false };
    }

    attempt.tabSwitchCount += 1;
    attempt.tabSwitchTimestamps.push(new Date());
    attempt.warningsIssued += 1;
    
    // Auto-submit if too many violations
    if (attempt.tabSwitchCount >= 10) {
      attempt.submitted = true;
      attempt.submittedAt = new Date();
      attempt.autoSubmitted = true;
      attempt.autoSubmitReason = 'tabSwitchLimit';
    }
    
    await attempt.save();
    
    return { 
      success: true, 
      tabSwitchCount: attempt.tabSwitchCount,
      autoSubmitted: attempt.autoSubmitted
    };
  } catch (error) {
    return { success: false };
  }
}
