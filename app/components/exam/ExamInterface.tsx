'use client'

import { useState, useEffect, useCallback } from 'react';
import { updateQuestionState, updateTimer, recordTabSwitch } from '@/app/actions/examAttemptActions';
import { useRouter } from 'next/navigation';
import ExamTimer from './ExamTimer';

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
  
  const [sessionId] = useState(initialAttempt.activeSessionId);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineSyncPending, setOfflineSyncPending] = useState(false);
  
  // Proctoring
  const [tabSwitchCount, setTabSwitchCount] = useState(initialAttempt.tabSwitchCount || 0);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isOffline, setIsOffline] = useState(() => typeof window !== 'undefined' ? !navigator.onLine : false);

  // Track network connectivity for offline banner
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Initialize questions
  useEffect(() => {
    const questions: Array<Question & { sectionName: string, sectionIndex: number }> = [];
    exam.sections.forEach((section: Section, sIdx: number) => {
      section.questions.forEach((q: Question) => {
        questions.push({ ...q, sectionName: section.name, sectionIndex: sIdx });
      });
    });
    setAllQuestions(questions);

    // Initialize question states (from server, fallback to local storage, fallback to empty)
    const states = new Map<number, QuestionState>();
    questions.forEach((_, idx) => {
      states.set(idx, {
        status: 'notVisited',
        selectedAnswer: null,
        timeSpent: 0,
        visitCount: 0
      });
    });
    
    // Attempt hydration from server or local storage
    if (initialAttempt && initialAttempt.questionStates) {
      Object.keys(initialAttempt.questionStates).forEach((key) => {
         const numKey = parseInt(key);
         if (!isNaN(numKey)) {
             states.set(numKey, initialAttempt.questionStates[key]);
         }
      });
    } else {
       // Attempt offline recovery from localStorage if server state is blank
       try {
         const localSaved = localStorage.getItem(`exam_attempt_${attemptId}`);
         if (localSaved) {
            const parsed = JSON.parse(localSaved);
            Object.keys(parsed).forEach((key) => {
               states.set(parseInt(key), parsed[key]);
            });
         }
       } catch (e) {
         console.warn("Could not read local attempt backup", e);
       }
    }
    
    setQuestionStates(states);
  }, [exam, attemptId, initialAttempt]);

  // Offline Sync Recovery
  useEffect(() => {
    const handleOnline = async () => {
       console.log("Network restored! Syncing offline saved answers...");
       
       if (offlineSyncPending) {
          // If they were stuck on the submission screen, immediately push the submit execution
          await executeSubmission();
          return;
       }
       
       try {
         const localSaved = localStorage.getItem(`exam_attempt_${attemptId}`);
         if (localSaved) {
            const parsed = JSON.parse(localSaved);
            // In a production app, we would batch this. For now we loop.
            for (const [key, val] of Object.entries(parsed)) {
                await updateQuestionState(attemptId, parseInt(key), val);
            }
         }
       } catch (e) {
         console.error("Sync failed", e);
       }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [attemptId]);

  const handleTimeExpired = useCallback(() => {
    setIsTimeExpired(true);
    handleAutoSubmit('timeExpired');
  }, []);

  // Fullscreen enforcement
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleEnterFullscreen = async () => {
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error('Fullscreen error:', err);
      // In development or iframes, fullscreen might be blocked by browser policies.
      // We will allow the user to proceed anyway to avoid being soft-locked.
      setIsFullscreen(true);
    }
  };

  // Tab switch & Dual Monitor detection
  useEffect(() => {
    let focusTimeout: NodeJS.Timeout;

    const handleViolation = async (reason: string) => {
      console.log(`[Proctoring] Violation detected: ${reason}`);
      const result = await recordTabSwitch(attemptId);
      if (result.success) {
        setTabSwitchCount(result.tabSwitchCount || 0);
        setShowWarning(true);
        
        if (result.autoSubmitted) {
          alert('Exam auto-submitted due to excessive tab switching or focus loss!');
          router.push(`/results/${attemptId}`);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('document_hidden');
      }
    };

    const handleBlur = () => {
      // In some browsers, clicking an iframe/alert fires blur. We use a small timeout to verify 
      // they actually left the window (e.g., clicked a second monitor).
      focusTimeout = setTimeout(() => {
        if (!document.hasFocus()) {
          handleViolation('window_blur');
        }
      }, 500);
    };

    const handleFocus = () => {
      clearTimeout(focusTimeout);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearTimeout(focusTimeout);
    };
  }, [attemptId, router]);

  // Restrict Keyboard Shortcuts & Context Menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Optional: alert('Right-click is restricted during exams.');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        const forbiddenKeys = ['c', 'v', 'p', 'i', 'u', 's', 'r']; 
        // c=copy, v=paste, p=print, i=inspect, u=view source, s=save, r=reload
        if (forbiddenKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
        
        // Block Ctrl+Shift+I / J / C (DevTools alternatives)
        if (e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      }
      
      // Block Alt+Tab explicitly if browser allows intercepting (mostly impossible, but we try)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
      }
    };

    // Global drag/drop prevention
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
    };
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
      
      const newState = { ...current, ...updates };
      newMap.set(qIndex, newState);
      
      // Save locally to localStorage FIRST (Offline Resilience)
      try {
        const localBackup = localStorage.getItem(`exam_attempt_${attemptId}`);
        const parsedBackup = localBackup ? JSON.parse(localBackup) : {};
        parsedBackup[qIndex] = newState;
        localStorage.setItem(`exam_attempt_${attemptId}`, JSON.stringify(parsedBackup));
      } catch (e) {
        console.warn("Failed caching to local storage", e);
      }
      
      // Save to server
      updateQuestionState(attemptId, qIndex, newState).catch(err => {
         console.warn("Server save failed, answer relies strictly on local storage", err);
      });
      
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

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const { submitExam } = await import('@/app/actions/examResultActions');
      const result = await submitExam(attemptId);
      if (result.success) {
        // Clear local storage upon successful completion
        localStorage.removeItem(`exam_attempt_${attemptId}`);
        router.push(`/results/${result.resultId}`);
      } else {
        alert('Error submitting exam: ' + result.message);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error("Submission failed due to network error", e);
      setOfflineSyncPending(true);
      // We do NOT set isSubmitting(false) here because we want the UI locked while offline
    }
  };

  const handleConfirmSubmit = async () => {
    await executeSubmission();
  };

  const handleAutoSubmit = useCallback(async (reason: string) => {
    await executeSubmission();
  }, [attemptId, router]);

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

  if (!isFullscreen) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-50 fixed inset-0">
        <div className="glass-panel p-10 rounded-3xl max-w-xl">
          <div className="text-6xl mb-6">🖥️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Fullscreen Required</h2>
          <p className="text-slate-300 text-lg mb-8">
            To maintain exam integrity, this assessment must be completed in fullscreen mode. Switching tabs or exiting fullscreen will be recorded as a violation and may result in auto-submission.
          </p>
          <button 
            onClick={handleEnterFullscreen}
            className="btn btn-primary btn-lg w-full text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform"
          >
            Enter Fullscreen to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/40 px-6 py-2 flex items-center justify-center gap-3 z-20">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-ping shrink-0" />
          <p className="text-yellow-300 text-sm font-semibold">
            📡 Connection lost — <strong>Timer is paused.</strong> Your answers are saved locally and will sync when you reconnect.
          </p>
        </div>
      )}
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-white font-bold text-xl">{exam.title}</h1>
            <div className="text-slate-400 text-sm flex gap-4">
               <span>Course ID: {exam.assignedCourses?.[0] || 'General'}</span>
               <span>Section: <strong className="text-blue-400">{currentQuestion.sectionName}</strong></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <ExamTimer 
             attemptId={attemptId}
             initialAttempt={initialAttempt}
             examDuration={exam.totalDuration}
             sessionId={sessionId}
             onTimeExpired={handleTimeExpired}
          />
          <button onClick={handleSubmitClick} className="btn btn-error btn-sm">Submit Test</button>
        </div>
      </div>

      {/* Submit Confirmation Modal / Loading State */}
      {(showSubmitModal || isSubmitting) && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center">
            {isSubmitting ? (
               offlineSyncPending ? (
                  <div className="py-8">
                     <div className="text-4xl mb-4">📡</div>
                     <h3 className="text-2xl font-bold text-yellow-500 mb-2">Network Disconnected</h3>
                     <p className="text-slate-300">Your exam is securely saved locally. Waiting for network connection to restore to sync final submission...</p>
                     <p className="text-red-400 font-bold mt-4 text-sm uppercase tracking-wide">Do not close this window</p>
                  </div>
               ) : (
                  <div className="py-8">
                     <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                     <h3 className="text-xl font-bold text-white">Submitting exam safely...</h3>
                  </div>
               )
            ) : (
               <>
                <h3 className="text-2xl font-bold text-white mb-4">Submit Exam?</h3>
                <div className="space-y-2 mb-6 text-slate-300 text-left">
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
               </>
            )}
          </div>
        </div>
      )}

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md">
            <h3 className="text-2xl font-bold text-red-400 mb-4">⚠️ Proctoring Warning!</h3>
            <p className="text-white mb-4">
              Focus loss or Tab switching detected! ({tabSwitchCount}/10)
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
        <div className="flex-[7] p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* Question Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <span className="text-xl font-bold text-white">
                Question {currentQuestionIndex + 1} <span className="text-slate-400 text-lg font-normal">of {allQuestions.length}</span>
              </span>
              <span className="badge badge-lg badge-outline text-slate-300">
                Correct: <span className="text-green-400 ml-1 font-bold">+{currentQuestion.marks}</span> | 
                Incorrect: <span className="text-red-400 ml-1 font-bold">-{currentQuestion.negativeMarks}</span>
              </span>
            </div>

            {/* Question Content */}
            <div className="bg-slate-800/80 rounded-2xl p-8 border border-white/5 shadow-xl mb-8">
              <div className="text-white text-xl leading-relaxed mb-8 whitespace-pre-wrap font-medium">
                {currentQuestion.questionText}
              </div>

              {/* Options display (just text with A, B, C, D) */}
              {currentQuestion.questionType !== 'numerical' && (
                <div className="space-y-4 ml-2">
                  {currentQuestion.options.map((option, idx) => {
                    const label = String.fromCharCode(65 + idx); // A, B, C, D
                    return (
                      <div key={idx} className="flex gap-4 text-slate-200 text-lg items-start">
                        <span className="font-bold text-blue-400 shrink-0 w-6">{label}.</span>
                        <span>{option}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="divider before:bg-white/5 after:bg-white/5 my-8">Select your answer</div>

            {/* Answer Selection area */}
            {currentQuestion.questionType !== 'numerical' && (
              <div className="flex flex-wrap gap-6 mb-12 justify-center">
                {currentQuestion.options.map((_, idx) => {
                  const label = String.fromCharCode(65 + idx);
                  return (
                    <label 
                      key={idx}
                      className={`
                        flex items-center gap-4 px-8 py-4 rounded-full cursor-pointer
                        border-2 transition-all duration-300
                        ${(currentQuestion.questionType === 'single'
                            ? currentState?.selectedAnswer === idx
                            : currentState?.selectedAnswer?.includes(idx)) 
                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-105' 
                            : 'bg-slate-800 border-white/10 hover:border-slate-500 hover:bg-slate-700'}
                      `}
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
                        className="radio radio-primary radio-md"
                      />
                      <span className="text-white font-bold text-xl">{label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Numerical Input */}
            {currentQuestion.questionType === 'numerical' && (
              <div className="flex justify-center mb-12">
                <input
                  type="number"
                  value={currentState?.selectedAnswer || ''}
                  onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                  className="input input-lg input-bordered w-full max-w-md bg-slate-800 text-white text-center text-xl font-bold"
                  placeholder="Type your numerical answer here"
                />
              </div>
            )}

            <div className="divider before:bg-white/10 after:bg-white/10 my-8"></div>

            {/* Action Buttons & Navigation */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1">
                <button 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary px-8 text-white text-base"
                >
                  ← Previous
                </button>
                <button 
                  onClick={handleNext}
                  className="btn btn-primary px-8 text-white text-base shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                >
                  Save & Next →
                </button>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleMarkForReview} className="btn btn-outline btn-warning gap-2">
                  <span className="text-xl">★</span> Mark for Review
                </button>
                <button onClick={handleClearResponse} className="btn btn-ghost text-slate-400 hover:text-white">
                  Clear Response
                </button>
              </div>
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
