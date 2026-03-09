'use server'

import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import ExamAttempt from '../models/ExamAttempt';
import Exam from '../models/Exam';
import ExamResult from '../models/ExamResult';
import Student from '../models/Student';

export async function startExamAttempt(examId: string, isAdminPreview: boolean = false) {
  console.log(`[startExamAttempt] Called with examId: ${examId}, isAdminPreview: ${isAdminPreview}`);
  
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    console.log('[startExamAttempt] Error: Unauthorized (no userId)');
    return { success: false, message: 'Unauthorized' };
  }

  const role = (sessionClaims as any)?.metadata?.role;
  const isAdmin = role === 'admin';
  console.log(`[startExamAttempt] userId: ${userId}, role: ${role}, isAdmin: ${isAdmin}`);

  try {
    await connectToDatabase();
    
    console.log(`[startExamAttempt] Fetching exam details for ${examId}`);
    const exam = await Exam.findById(examId);
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }

    // Comprehensive validation for students
    if (!isAdminPreview) {
      console.log(`[startExamAttempt] Validating student identity and assignments`);
      
      // 1. Fetch user detail from DB
      const student = await Student.findOne({ clerkId: userId });
      if (!student) {
        return { success: false, message: 'Student profile not found. Please contact administration.' };
      }

      // 2. Validate Assignment rules
      if (exam.assignmentType === 'course' && (!exam.assignedCourses || !exam.assignedCourses.includes(student.course))) {
         return { success: false, message: 'You are not assigned to this exam. Your course does not match.' };
      }
      if (exam.assignmentType === 'manual' && (!exam.assignedTo || !exam.assignedTo.includes(userId))) {
         return { success: false, message: 'You are not explicitly assigned to this exam.' };
      }

      // 3. Time Validation
      const now = new Date();
      if (exam.startDate && now < new Date(exam.startDate)) {
         return { success: false, message: 'This exam has not started yet.' };
      }
      if (exam.endDate && now > new Date(exam.endDate)) {
         return { success: false, message: 'This exam has already ended.' };
      }

      // 4. Strict Single Attempt Check (ExamResult)
      console.log(`[startExamAttempt] Checking if result already exists`);
      const existingResult = await ExamResult.findOne({ examId, studentId: userId });
      if (existingResult) {
        return { success: false, message: 'You have already submitted and completed this exam. Retakes are not allowed.' };
      }

      console.log(`[startExamAttempt] Checking for existing student attempt`);
      const existingAttempt = await ExamAttempt.findOne({ examId, studentId: userId });
      
      if (existingAttempt && existingAttempt.submitted) {
        console.log(`[startExamAttempt] Student already submitted attempt`);
        return { success: false, message: 'You have already submitted this exam.' };
      }
      
      if (existingAttempt && !existingAttempt.submitted) {
        console.log(`[startExamAttempt] Resuming existing student attempt`);
        
        // If they resume, we generate a NEW session lock to block the old device
        const overrideSessionId = crypto.randomUUID();
        existingAttempt.activeSessionId = overrideSessionId;
        await existingAttempt.save();
        
        return { success: true, attemptId: existingAttempt._id.toString(), sessionId: overrideSessionId };
      }
    } else {
       console.log(`[startExamAttempt] Admin preview flow activated`);
       // If admin, we can either resume their previous preview attempt or create a fresh one
       const existingAdminAttempt = await ExamAttempt.findOne({ examId, studentId: userId, isPreview: true });
       if (existingAdminAttempt && !existingAdminAttempt.submitted) {
           console.log(`[startExamAttempt] Resuming existing admin preview attempt`);
           
           const overrideSessionId = crypto.randomUUID();
           existingAdminAttempt.activeSessionId = overrideSessionId;
           await existingAdminAttempt.save();
           
           return { success: true, attemptId: existingAdminAttempt._id.toString(), sessionId: overrideSessionId };
       }
       console.log(`[startExamAttempt] No active existing admin preview found, creating new one`);
    }

    console.log(`[startExamAttempt] Creating new attempt document`);
    const newSessionId = crypto.randomUUID();
    const examEndTime = new Date(Date.now() + exam.totalDuration * 60 * 1000);

    // Create new attempt
    const attempt = await ExamAttempt.create({
      examId,
      studentId: userId,
      timeRemaining: exam.totalDuration * 60, // convert to seconds
      questionStates: new Map(),
      isPreview: isAdminPreview,
      activeSessionId: newSessionId,
      examEndTime
    });

    console.log(`[startExamAttempt] Successfully created attempt: ${attempt._id}`);
    return { success: true, attemptId: attempt._id.toString(), sessionId: newSessionId };
  } catch (error: any) {
    console.error('[startExamAttempt] Start Exam Error:', error);
    return { success: false, message: error.message };
  }
}

export async function getExamAttempt(attemptId: string) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const role = (sessionClaims as any)?.metadata?.role;
  const isAdmin = role === 'admin';

  await connectToDatabase();
  const attempt = await ExamAttempt.findById(attemptId).lean();
  
  // Allow if it's the student's attempt, or if it's an admin previewing their own attempt
  if (!attempt || (attempt.studentId !== userId && !isAdmin)) return null;
  
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

export async function updateTimer(attemptId: string, timeRemaining: number, sessionId?: string): Promise<{ success: boolean, sessionConflict?: boolean }> {
  const { userId } = await auth();
  if (!userId) return { success: false };

  try {
    await connectToDatabase();
    
    // Check for session lock conflict
    if (sessionId) {
       const attempt = await ExamAttempt.findById(attemptId).select('activeSessionId').lean();
       if (attempt && (attempt as any).activeSessionId && (attempt as any).activeSessionId !== sessionId) {
         return { success: false, sessionConflict: true };
       }
    }
    
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

/**
 * Called when a student's network reconnects after being offline.
 * Extends the exam end time by exactly how long they were offline,
 * so they are not penalised for a connection loss outside their control.
 * Max offline compensation is capped at 10 minutes to prevent abuse.
 */
export async function extendExamTime(
  attemptId: string,
  offlineDurationSeconds: number,
  sessionId?: string
): Promise<{ success: boolean; newExamEndTime?: string; sessionConflict?: boolean }> {
  const { userId } = await auth();
  if (!userId) return { success: false };

  // Hard cap: won't compensate more than 10 minutes per reconnect to prevent abuse
  const cappedSeconds = Math.min(offlineDurationSeconds, 10 * 60);

  try {
    await connectToDatabase();

    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt || attempt.studentId !== userId) {
      return { success: false };
    }

    // Session lock check
    if (sessionId && attempt.activeSessionId && attempt.activeSessionId !== sessionId) {
      return { success: false, sessionConflict: true };
    }

    if (!attempt.examEndTime) {
      return { success: false };
    }

    // Extend examEndTime by the offline duration
    const newEndTime = new Date(attempt.examEndTime.getTime() + cappedSeconds * 1000);
    attempt.examEndTime = newEndTime;
    attempt.lastActivityAt = new Date();
    await attempt.save();

    console.log(`[extendExamTime] Extended attempt ${attemptId} by ${cappedSeconds}s → new end: ${newEndTime.toISOString()}`);

    return { success: true, newExamEndTime: newEndTime.toISOString() };
  } catch (error) {
    console.error('[extendExamTime] Error:', error);
    return { success: false };
  }
}
