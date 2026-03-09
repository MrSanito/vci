'use client'

import { useState, useEffect, useCallback } from 'react';
import { updateQuestionState, updateTimer, recordTabSwitch } from '@/app/actions/examAttemptActions';
import { useRouter } from 'next/navigation';

interface Question {
  questionText: string;
  questionType: 'single' | 'multiple' | 'numerical';
  options: string[];
  marks: number;
  negativeMarks: number;
}

interface Section {
  name: string;
  questions: Question[];
}

interface QuestionState {
  status: 'notVisited' | 'notAnswered' | 'answered' | 'markedForReview' | 'answeredAndMarked';
  selectedAnswer: any;
  timeSpent: number;
  visitCount: number;
}

interface ExamInterfaceProps {
  exam: any;
  attemptId: string;
  initialAttempt: any;
}

export default function ExamInterface({ exam, attemptId, initialAttempt }: ExamInterfaceProps) {
  const router = useRouter();
  
  // Flatten all questions with section info
  const [allQuestions, setAllQuestions] = useState<Array<Question & { sectionName: string, sectionIndex: number }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Map<number, QuestionState>>(new Map());
  
  // Timer
  const [timeRemaining, setTimeRemaining] = useState(initialAttempt.timeRemaining || exam.totalDuration * 60);
  const [warningShown30, setWarningShown30] = useState(false);
  const [warningShown5, setWarningShown5] = useState(false);
  
  // Proctoring
  const [tabSwitchCount, setTabSwitchCount] = useState(initialAttempt.tabSwitchCount || 0);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Initialize questions
  useEffect(() => {
    const questions: Array<Question & { sectionName: string, sectionIndex: number }> = [];
    exam.sections.forEach((section: Section, sIdx: number) => {
      section.questions.forEach((q: Question) => {
        questions.push({ ...q, sectionName: section.name, sectionIndex: sIdx });
      });
    });
    setAllQuestions(questions);

    // Initialize question states
    const states = new Map<number, QuestionState>();
    questions.forEach((_, idx) => {
      states.set(idx, {
        status: 'notVisited',
        selectedAnswer: null,
        timeSpent: 0,
        visitCount: 0
      });
    });
    setQuestionStates(states);
  }, [exam]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev: number) => {
        const newTime = prev - 1;
        
        // Warnings
        if (newTime === 30 * 60 && !warningShown30) {
          alert('⏰ 30 minutes remaining!');
          setWarningShown30(true);
        }
        if (newTime === 5 * 60 && !warningShown5) {
          alert('⚠️ Only 5 minutes left!');
          setWarningShown5(true);
        }
        
        // Auto-submit at 0
        if (newTime <= 0) {
          handleAutoSubmit('timeExpired');
          return 0;
        }
        
        // Save to server every 10 seconds
        if (newTime % 10 === 0) {
          updateTimer(attemptId, newTime);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptId, warningShown30, warningShown5]);

  // Fullscreen enforcement
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    };

    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        alert('⚠️ Please stay in fullscreen mode!');
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        const result = await recordTabSwitch(attemptId);
        if (result.success) {
          setTabSwitchCount(result.tabSwitchCount || 0);
          setShowWarning(true);
          
          if (result.autoSubmitted) {
            alert('Exam auto-submitted due to excessive tab switching!');
            router.push(`/results/${attemptId}`);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptId, router]);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Visit question (mark as visited)
  useEffect(() => {
    const state = questionStates.get(currentQuestionIndex);
    if (state && state.status === 'notVisited') {
      updateState(currentQuestionIndex, { status: 'notAnswered', visitCount: 1 });
    }
  }, [currentQuestionIndex]);

  const updateState = useCallback((qIndex: number, updates: Partial<QuestionState>) => {
    setQuestionStates(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(qIndex) || {
        status: 'notVisited',
        selectedAnswer: null,
        timeSpent: 0,
        visitCount: 0
      };
      newMap.set(qIndex, { ...current, ...updates });
      
      // Save to server
      updateQuestionState(attemptId, qIndex, { ...current, ...updates });
      
      return newMap;
    });
  }, [attemptId]);

  const handleAnswerSelect = (answer: any) => {
    const currentState = questionStates.get(currentQuestionIndex);
    const newStatus = currentState?.status === 'markedForReview' ? 'answeredAndMarked' : 'answered';
    
    updateState(currentQuestionIndex, {
      selectedAnswer: answer,
      status: newStatus
    });
  };

  const handleMarkForReview = () => {
    const currentState = questionStates.get(currentQuestionIndex);
    const hasAnswer = currentState?.selectedAnswer !== null && currentState?.selectedAnswer !== undefined;
    
    updateState(currentQuestionIndex, {
      status: hasAnswer ? 'answeredAndMarked' : 'markedForReview'
    });
  };

  const handleClearResponse = () => {
    const currentState = questionStates.get(currentQuestionIndex);
    const isMarked = currentState?.status === 'answeredAndMarked';
    
    updateState(currentQuestionIndex, {
      selectedAnswer: null,
      status: isMarked ? 'markedForReview' : 'notAnswered'
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAutoSubmit = (reason: string) => {
    // TODO: Calculate score and submit
    router.push(`/results/${attemptId}`);
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    const { submitExam } = await import('@/app/actions/examResultActions');
    const result = await submitExam(attemptId);
    if (result.success) {
      router.push(`/results/${result.resultId}`);
    } else {
      alert('Error submitting exam: ' + result.message);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'notVisited': return 'bg-gray-500';
      case 'notAnswered': return 'bg-red-500';
      case 'answered': return 'bg-green-500';
      case 'markedForReview': return 'bg-purple-500';
      case 'answeredAndMarked': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentState = questionStates.get(currentQuestionIndex);

  if (!currentQuestion) return <div>Loading...</div>;

  // Calculate summary
  const summary = {
    answered: Array.from(questionStates.values()).filter(s => s.status === 'answered').length,
    notAnswered: Array.from(questionStates.values()).filter(s => s.status === 'notAnswered').length,
    marked: Array.from(questionStates.values()).filter(s => s.status === 'markedForReview' || s.status === 'answeredAndMarked').length,
    notVisited: Array.from(questionStates.values()).filter(s => s.status === 'notVisited').length
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-white/10 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-white font-bold">{exam.title}</span>
          <span className="text-slate-400 text-sm">Section: {currentQuestion.sectionName}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-green-400'}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
          <button onClick={handleSubmitClick} className="btn btn-error btn-sm">Submit Test</button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">Submit Exam?</h3>
            <div className="space-y-2 mb-6 text-slate-300">
              <p>✅ Answered: <span className="text-green-400 font-bold">{summary.answered}</span></p>
              <p>🔖 Marked for Review: <span className="text-purple-400 font-bold">{summary.marked}</span></p>
              <p>❌ Not Answered: <span className="text-red-400 font-bold">{summary.notAnswered}</span></p>
              <p>⬜ Not Visited: <span className="text-gray-400 font-bold">{summary.notVisited}</span></p>
            </div>
            <p className="text-yellow-400 mb-6">⚠️ You cannot change answers after submission!</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className="btn btn-error flex-1"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md">
            <h3 className="text-2xl font-bold text-red-400 mb-4">⚠️ Warning!</h3>
            <p className="text-white mb-4">
              Tab switching detected! ({tabSwitchCount}/10)
            </p>
            <p className="text-slate-400 mb-6">
              After 10 warnings, your exam will be auto-submitted.
            </p>
            <button 
              onClick={() => setShowWarning(false)}
              className="btn btn-primary w-full"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area (70%) */}
        <div className="flex-[7] p-6 overflow-y-auto">
          <div className="max-w-3xl">
            <div className="mb-4">
              <span className="text-blue-400 font-semibold">Question {currentQuestionIndex + 1}</span>
              <span className="text-slate-400 ml-2">({currentQuestion.marks} marks, -{currentQuestion.negativeMarks} for wrong)</span>
            </div>

            <div className="text-white text-lg mb-6">
              {currentQuestion.questionText}
            </div>

            {/* Options */}
            {currentQuestion.questionType !== 'numerical' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <label 
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <input
                      type={currentQuestion.questionType === 'single' ? 'radio' : 'checkbox'}
                      name="answer"
                      checked={
                        currentQuestion.questionType === 'single'
                          ? currentState?.selectedAnswer === idx
                          : currentState?.selectedAnswer?.includes(idx)
                      }
                      onChange={() => {
                        if (currentQuestion.questionType === 'single') {
                          handleAnswerSelect(idx);
                        } else {
                          const current = currentState?.selectedAnswer || [];
                          const newAnswer = current.includes(idx)
                            ? current.filter((i: number) => i !== idx)
                            : [...current, idx];
                          handleAnswerSelect(newAnswer);
                        }
                      }}
                      className="radio radio-primary mt-1"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Numerical Input */}
            {currentQuestion.questionType === 'numerical' && (
              <input
                type="number"
                value={currentState?.selectedAnswer || ''}
                onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                className="input input-bordered w-full max-w-xs bg-slate-800 text-white"
                placeholder="Enter your answer"
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button onClick={handleMarkForReview} className="btn btn-outline btn-warning">
                🔖 Mark for Review
              </button>
              <button onClick={handleClearResponse} className="btn btn-outline btn-error">
                Clear Response
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn btn-primary"
              >
                ← Previous
              </button>
              <button 
                onClick={handleNext}
                className="btn btn-primary flex-1"
              >
                Save & Next →
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette (30%) */}
        <div className="flex-[3] bg-slate-800 border-l border-white/10 p-6 overflow-y-auto">
          <h3 className="text-white font-bold mb-4">Question Palette</h3>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            <div className="bg-green-500/20 p-2 rounded">
              <span className="text-green-400 font-bold">{summary.answered}</span>
              <span className="text-slate-400 ml-1">Answered</span>
            </div>
            <div className="bg-red-500/20 p-2 rounded">
              <span className="text-red-400 font-bold">{summary.notAnswered}</span>
              <span className="text-slate-400 ml-1">Not Answered</span>
            </div>
            <div className="bg-purple-500/20 p-2 rounded">
              <span className="text-purple-400 font-bold">{summary.marked}</span>
              <span className="text-slate-400 ml-1">Marked</span>
            </div>
            <div className="bg-gray-500/20 p-2 rounded">
              <span className="text-gray-400 font-bold">{summary.notVisited}</span>
              <span className="text-slate-400 ml-1">Not Visited</span>
            </div>
          </div>

          {/* Section-wise Questions */}
          {exam.sections.map((section: Section, sIdx: number) => {
            const sectionQuestions = allQuestions
              .map((q, idx) => ({ q, idx }))
              .filter(({ q }) => q.sectionIndex === sIdx);

            return (
              <div key={sIdx} className="mb-6">
                <h4 className="text-blue-400 font-semibold mb-3">{section.name}</h4>
                <div className="grid grid-cols-5 gap-2">
                  {sectionQuestions.map(({ idx }) => {
                    const state = questionStates.get(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`
                          w-10 h-10 rounded-lg font-bold text-white
                          ${getStatusColor(state?.status || 'notVisited')}
                          ${currentQuestionIndex === idx ? 'ring-2 ring-white' : ''}
                          hover:scale-110 transition-transform
                        `}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-slate-400">Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-slate-400">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-400">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-slate-400">Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-slate-400">Answered & Marked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
