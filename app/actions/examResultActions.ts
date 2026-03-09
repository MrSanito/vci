'use server'

import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import ExamAttempt from '../models/ExamAttempt';
import ExamResult from '../models/ExamResult';
import Exam from '../models/Exam';

export async function submitExam(attemptId: string) {
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

    if (attempt.submitted) {
      return { success: false, message: 'Already submitted' };
    }

    const exam = await Exam.findById(attempt.examId);
    if (!exam) {
      return { success: false, message: 'Exam not found' };
    }

    // Calculate score
    let totalScore = 0;
    const questionResults: any[] = [];
    const sectionScores: Map<string, any> = new Map();

    // Flatten all questions with section info
    let questionIndex = 0;
    exam.sections.forEach((section: any) => {
      const sectionData = {
        sectionName: section.name,
        score: 0,
        totalMarks: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        accuracy: 0
      };

      section.questions.forEach((question: any) => {
        const state = attempt.questionStates.get(questionIndex);
        const studentAnswer = state?.selectedAnswer;
        const correctAnswers = question.correctAnswers;
        
        let isCorrect = false;
        let marksAwarded = 0;

        if (studentAnswer !== null && studentAnswer !== undefined) {
          sectionData.attempted++;
          
          // Check if answer is correct
          if (question.questionType === 'single') {
            isCorrect = studentAnswer === correctAnswers[0];
          } else if (question.questionType === 'multiple') {
            const sorted1 = [...studentAnswer].sort();
            const sorted2 = [...correctAnswers].sort();
            isCorrect = JSON.stringify(sorted1) === JSON.stringify(sorted2);
          } else if (question.questionType === 'numerical') {
            isCorrect = Math.abs(studentAnswer - correctAnswers[0]) < 0.01;
          }

          if (isCorrect) {
            marksAwarded = question.marks;
            sectionData.correct++;
          } else {
            marksAwarded = -question.negativeMarks;
            sectionData.incorrect++;
          }
        } else {
          sectionData.unattempted++;
        }

        totalScore += marksAwarded;
        sectionData.score += marksAwarded;
        sectionData.totalMarks += question.marks;

        questionResults.push({
          questionNum: questionIndex,
          section: section.name,
          isCorrect,
          marksAwarded,
          studentAnswer,
          correctAnswer: correctAnswers,
          timeSpent: state?.timeSpent || 0
        });

        questionIndex++;
      });

      sectionData.accuracy = sectionData.attempted > 0 
        ? (sectionData.correct / sectionData.attempted) * 100 
        : 0;
      
      sectionScores.set(section.name, sectionData);
    });

    const percentage = (totalScore / exam.totalMarks) * 100;
    const passed = totalScore >= exam.passingMarks;

    // Create result
    const result = await ExamResult.create({
      examId: exam._id,
      studentId: userId,
      attemptId: attempt._id,
      totalScore,
      totalMarks: exam.totalMarks,
      percentage,
      passed,
      sectionScores: Array.from(sectionScores.values()),
      questionResults,
      totalTimeTaken: (exam.totalDuration * 60) - attempt.timeRemaining,
      submittedAt: new Date(),
      tabSwitchCount: attempt.tabSwitchCount,
      warningsIssued: attempt.warningsIssued,
      autoSubmitted: attempt.autoSubmitted
    });

    // Mark attempt as submitted
    attempt.submitted = true;
    attempt.submittedAt = new Date();
    await attempt.save();

    // Calculate rank
    const allResults = await ExamResult.find({ examId: exam._id }).sort({ totalScore: -1 });
    const rank = allResults.findIndex(r => r._id.toString() === result._id.toString()) + 1;
    result.rank = rank;
    await result.save();

    return { 
      success: true, 
      message: 'Exam submitted successfully!',
      resultId: result._id.toString()
    };
  } catch (error: any) {
    console.error('Submit Exam Error:', error);
    return { success: false, message: error.message };
  }
}

export async function getExamResult(resultId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();
  const result = await ExamResult.findById(resultId).lean();
  
  if (!result || result.studentId !== userId) return null;
  
  return JSON.parse(JSON.stringify(result));
}
