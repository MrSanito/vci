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
  
  const [allQuestions, setAllQuestions] = useState<Array<Question & { sectionName: string, sectionIndex: number }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Map<number, QuestionState>>(new Map());
  
  const [sessionId] = useState(initialAttempt.activeSessionId);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineSyncPending, setOfflineSyncPending] = useState(false);
  
  const [tabSwitchCount, setTabSwitchCount] = useState(initialAttempt.tabSwitchCount || 0);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isOffline, setIsOffline] = useState(() => typeof window !== 'undefined' ? !navigator.onLine : false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  useEffect(() => {
    const questions: Array<Question & { sectionName: string, sectionIndex: number }> = [];
    exam.sections.forEach((section: Section, sIdx: number) => {
      section.questions.forEach((q: Question) => {
        questions.push({ ...q, sectionName: section.name, sectionIndex: sIdx });
      });
    });
    setAllQuestions(questions);

    const states = new Map<number, QuestionState>();
    questions.forEach((_, idx) => {
      states.set(idx, {
        status: 'notVisited',
        selectedAnswer: null,
        timeSpent: 0,
        visitCount: 0
      });
    });
    
    if (initialAttempt && initialAttempt.questionStates) {
      Object.keys(initialAttempt.questionStates).forEach((key) => {
         const numKey = parseInt(key);
         if (!isNaN(numKey)) states.set(numKey, initialAttempt.questionStates[key]);
      });
    } else {
       try {
         const localSaved = localStorage.getItem(`exam_attempt_${attemptId}`);
         if (localSaved) {
            const parsed = JSON.parse(localSaved);
            Object.keys(parsed).forEach((key) => states.set(parseInt(key), parsed[key]));
         }
       } catch (e) {
         console.warn("Could not read local backup", e);
       }
    }
    setQuestionStates(states);
  }, [exam, attemptId, initialAttempt]);

  useEffect(() => {
    const handleOnline = async () => {
       if (offlineSyncPending) { await executeSubmission(); return; }
       try {
         const localSaved = localStorage.getItem(`exam_attempt_${attemptId}`);
         if (localSaved) {
            const parsed = JSON.parse(localSaved);
            for (const [key, val] of Object.entries(parsed)) {
                await updateQuestionState(attemptId, parseInt(key), val as QuestionState);
            }
         }
       } catch (e) { console.error("Sync failed", e); }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [attemptId, offlineSyncPending]);

  const handleTimeExpired = useCallback(() => { setIsTimeExpired(true); executeSubmission(); }, [attemptId]);

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
      if (docEl.requestFullscreen) await docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) await docEl.webkitRequestFullscreen();
      // No need to set state, the listener handles it
    } catch (err) { console.error("Fullscreen failed", err); }
  };

  useEffect(() => {
    let focusTimeout: NodeJS.Timeout;
    const handleViolation = async (reason: string) => {
      const result = await recordTabSwitch(attemptId);
      if (result.success) {
        setTabSwitchCount(result.tabSwitchCount || 0);
        setShowWarning(true);
        if (result.autoSubmitted) { router.push(`/results/${attemptId}`); }
      }
    };
    const handleVisibilityChange = () => { if (document.hidden) handleViolation('visibility'); };
    const handleBlur = () => { focusTimeout = setTimeout(() => { if (!document.hasFocus()) handleViolation('blur'); }, 500); };
    const handleFocus = () => clearTimeout(focusTimeout);
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

  useEffect(() => {
    const state = questionStates.get(currentQuestionIndex);
    if (state && state.status === 'notVisited') {
      updateState(currentQuestionIndex, { status: 'notAnswered', visitCount: 1 });
    }
  }, [currentQuestionIndex, allQuestions.length]);

  const updateState = useCallback((qIndex: number, updates: Partial<QuestionState>) => {
    setQuestionStates(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(qIndex) || { status: 'notVisited', selectedAnswer: null, timeSpent: 0, visitCount: 0 };
      const newState = { ...current, ...updates };
      newMap.set(qIndex, newState);
      try {
        const localBackup = localStorage.getItem(`exam_attempt_${attemptId}`);
        const parsedBackup = localBackup ? JSON.parse(localBackup) : {};
        parsedBackup[qIndex] = newState;
        localStorage.setItem(`exam_attempt_${attemptId}`, JSON.stringify(parsedBackup));
      } catch (e) { console.warn("Caching failed", e); }
      updateQuestionState(attemptId, qIndex, newState).catch(err => console.warn("Server save failed", err));
      return newMap;
    });
  }, [attemptId]);

  const handleAnswerSelect = (answer: any) => {
    const currentState = questionStates.get(currentQuestionIndex);
    const newStatus = currentState?.status === 'markedForReview' ? 'answeredAndMarked' : 'answered';
    updateState(currentQuestionIndex, { selectedAnswer: answer, status: newStatus });
  };

  const handleMarkForReview = () => {
    const currentState = questionStates.get(currentQuestionIndex);
    const hasAnswer = currentState?.selectedAnswer !== null && currentState?.selectedAnswer !== undefined;
    updateState(currentQuestionIndex, { status: hasAnswer ? 'answeredAndMarked' : 'markedForReview' });
  };

  const handleClearResponse = () => {
    const currentState = questionStates.get(currentQuestionIndex);
    const isMarked = currentState?.status === 'answeredAndMarked';
    updateState(currentQuestionIndex, { selectedAnswer: null, status: isMarked ? 'markedForReview' : 'notAnswered' });
  };

  const handleNext = () => { if (currentQuestionIndex < allQuestions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const { submitExam } = await import('@/app/actions/examResultActions');
      const result = await submitExam(attemptId);
      if (result.success) {
        localStorage.removeItem(`exam_attempt_${attemptId}`);
        router.push(`/results/${result.resultId}`);
      } else { alert('Submission failed: ' + result.message); setIsSubmitting(false); }
    } catch (e) { setOfflineSyncPending(true); }
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentState = questionStates.get(currentQuestionIndex);

  if (!currentQuestion) return <div className="min-h-screen bg-black flex items-center justify-center font-bold text-white animate-pulse">Loading Questions...</div>;

  const summary = {
    answered: Array.from(questionStates.values()).filter(s => s.status === 'answered').length,
    notAnswered: Array.from(questionStates.values()).filter(s => s.status === 'notAnswered').length,
    marked: Array.from(questionStates.values()).filter(s => s.status === 'markedForReview' || s.status === 'answeredAndMarked').length,
    notVisited: Array.from(questionStates.values()).filter(s => s.status === 'notVisited').length
  };

  return (
    <div className="h-screen flex flex-col bg-black font-sans selection:bg-[#FF007F]/30 selection:text-white">
      {/* Network Alert (Keep it simple) */}
      {isOffline && (
        <div className="bg-rose-600 text-white px-6 py-2 flex items-center justify-center gap-4 z-[100] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            Offline Mode
          </span>
          <div className="h-px w-8 bg-white/20 hidden md:block"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Auto-saving to device storage</p>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-black/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-4 flex justify-between items-center z-90 sticky top-0 shadow-2xl">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="lg:hidden w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 hover:bg-[#FF007F] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-white uppercase tracking-tighter leading-tight italic truncate max-w-[150px] sm:max-w-xs">{exam.title}</h1>
            <div className="flex gap-3 mt-1 text-[9px] items-center font-bold tracking-widest uppercase">
               <span className="text-[#FF007F] italic">{currentQuestion.sectionName}</span>
               <div className="w-1 h-1 bg-white/10 rounded-full"></div>
               <span className="text-zinc-600 italic">Q {currentQuestionIndex + 1} / {allQuestions.length}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <ExamTimer attemptId={attemptId} initialAttempt={initialAttempt} examDuration={exam.totalDuration} sessionId={sessionId} onTimeExpired={handleTimeExpired} />
          <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
          <button 
            onClick={() => setShowSubmitModal(true)} 
            className="px-6 sm:px-8 h-11 bg-[#FF007F] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:text-black shadow-[0_0_15px_-5px_#FF007F] active:scale-95 whitespace-nowrap italic"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Workspace */}
        <div className="flex-1 lg:flex-8 overflow-y-auto bg-black custom-scrollbar scroll-smooth">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 pb-40">
                <div className="bg-[#0A0A0A] border border-white/5 min-h-[500px] flex flex-col p-6 sm:p-12 rounded-[3rem] shadow-xl">
                    {/* Marks Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-[#FF007F] text-white rounded-xl flex items-center justify-center font-bold text-lg italic shadow-[0_0_15px_-5px_#FF007F]">V</div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic leading-none">Question {currentQuestionIndex + 1}</span>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <span className="flex-1 sm:flex-none px-5 py-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-xl text-[10px] font-bold tracking-widest uppercase text-center italic">+{currentQuestion.marks} Marks</span>
                            <span className="flex-1 sm:flex-none px-5 py-2 bg-red-600/10 text-red-400 border border-red-600/20 rounded-xl text-[10px] font-bold tracking-widest uppercase text-center italic">-{currentQuestion.negativeMarks} Negative</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-heading tracking-tight mb-12 whitespace-pre-wrap">
                            {currentQuestion.questionText}
                        </p>

                        <div className="space-y-4">
                            {currentQuestion.questionType !== 'numerical' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleAnswerSelect(idx)}
                                            className={`flex items-start gap-5 p-5 sm:p-7 rounded-2xl border-2 transition-all text-left group
                                                ${currentState?.selectedAnswer === idx 
                                                    ? 'bg-[#FF007F] border-[#FF007F] text-white shadow-[0_0_30px_-10px_#FF007F] -translate-y-1' 
                                                    : 'bg-black border-white/5 text-zinc-300 hover:border-[#FF007F]/40 hover:bg-[#0A0A0A]'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all italic
                                                ${currentState?.selectedAnswer === idx ? 'bg-white text-[#FF007F] rotate-3' : 'bg-white/5 text-zinc-600 group-hover:bg-[#FF007F] group-hover:text-white'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold tracking-wide leading-relaxed uppercase pt-1">{option}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center py-10">
                                    <div className="relative w-full max-w-sm group">
                                        <input
                                            type="number"
                                            value={currentState?.selectedAnswer || ''}
                                            onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                                            className="w-full h-24 bg-black border-2 border-white/10 rounded-4xl text-center text-5xl font-bold font-heading italic focus:outline-none focus:border-[#FF007F] transition-all text-white placeholder:text-zinc-800"
                                            placeholder="0"
                                        />
                                        <div className="absolute -bottom-10 left-0 right-0 text-center text-[10px] font-bold text-[#FF007F] uppercase tracking-[0.3em] opacity-0 group-focus-within:opacity-100 transition-opacity italic">Type your answer above</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row items-center justify-between">
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}
                            className="flex-1 sm:flex-none h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black rounded-2xl transition-all disabled:opacity-20 disabled:pointer-events-none uppercase text-[10px] font-bold tracking-widest italic">
                            ← Back
                        </button>
                        <button onClick={handleNext}
                            className="flex-1 sm:flex-none h-14 px-12 bg-[#FF007F] text-white rounded-2xl shadow-[0_0_20px_-5px_#FF007F] hover:bg-white hover:text-black transition-all uppercase text-[10px] font-bold tracking-widest active:scale-95 italic">
                            Save & Next →
                        </button>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={handleMarkForReview}
                            className={`flex-1 sm:flex-none h-14 px-6 border-2 rounded-2xl transition-all uppercase text-[10px] font-bold tracking-widest italic
                                ${currentState?.status === 'markedForReview' || currentState?.status === 'answeredAndMarked'
                                    ? 'bg-yellow-500 text-black border-yellow-500 shadow-xl' 
                                    : 'bg-black border-yellow-500/20 text-yellow-500 hover:border-yellow-500 hover:bg-yellow-500/10'}`}>
                            Mark for Review
                        </button>
                        <button onClick={handleClearResponse}
                            className="flex-1 sm:flex-none h-14 px-6 text-zinc-600 hover:text-red-500 uppercase text-[10px] font-bold tracking-widest transition-colors italic border border-transparent hover:border-red-500/20 rounded-2xl">
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {showMobileSidebar && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setShowMobileSidebar(false)}></div>
        )}

        {/* Questions Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 right-0 w-72 sm:w-80 lg:w-auto lg:flex-3 bg-[#0A0A0A] border-l border-white/5 text-white p-6 sm:p-8 overflow-y-auto z-110 lg:z-auto transition-transform duration-300
          ${showMobileSidebar ? 'translate-x-0 shadow-2xl shadow-black' : 'translate-x-full lg:translate-x-0'}
        `}>
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                <div className="flex flex-col">
                    <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.3em] mb-1 italic">All Questions</h3>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Your Progress</p>
                </div>
                <div className="w-1.5 h-10 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F]"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-10">
                <div className="p-4 bg-black border border-white/5 rounded-2xl flex flex-col gap-1">
                    <span className="text-green-400 font-bold text-2xl font-heading">{summary.answered}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Answered</span>
                </div>
                <div className="p-4 bg-black border border-white/5 rounded-2xl flex flex-col gap-1">
                    <span className="text-red-400 font-bold text-2xl font-heading">{summary.notAnswered}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Skipped</span>
                </div>
                <div className="p-4 bg-black border border-white/5 rounded-2xl flex flex-col gap-1">
                    <span className="text-yellow-400 font-bold text-2xl font-heading">{summary.marked}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">For Review</span>
                </div>
                <div className="p-4 bg-black border border-white/5 rounded-2xl flex flex-col gap-1">
                    <span className="text-zinc-400 font-bold text-2xl font-heading">{summary.notVisited}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Not Visited</span>
                </div>
            </div>

            <nav className="space-y-8">
                {exam.sections.map((section: Section, sIdx: number) => (
                    <div key={sIdx}>
                        <div className="flex items-center gap-3 mb-5">
                            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest italic">{section.name}</h4>
                            <div className="flex-1 h-px bg-white/5"></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {allQuestions.map((q, idx) => q.sectionIndex === sIdx ? (
                                <button key={idx} onClick={() => { setCurrentQuestionIndex(idx); setShowMobileSidebar(false); }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] border-2 transition-all hover:-translate-y-0.5 active:scale-90 italic
                                        ${idx === currentQuestionIndex ? 'border-[#FF007F] ring-2 ring-[#FF007F]/30 scale-110 z-10' : 'border-transparent'}
                                        ${questionStates.get(idx)?.status === 'answered' ? 'bg-green-600 text-white' :
                                          questionStates.get(idx)?.status === 'markedForReview' || questionStates.get(idx)?.status === 'answeredAndMarked' ? 'bg-yellow-500 text-black' :
                                          questionStates.get(idx)?.status === 'notAnswered' ? 'bg-red-600 text-white' :
                                          'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}>
                                    {idx + 1}
                                </button>
                            ) : null)}
                        </div>
                    </div>
                ))}
            </nav>
            
            <div className="mt-12 pt-8 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                   <div className="w-3 h-3 bg-white/10 rounded-sm"></div>
                   <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                   <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                   <span>Answered</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                   <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                   <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                   <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                   <span>Skipped</span>
                </div>
            </div>
        </aside>
      </div>

      {/* Submit Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-150 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A0A0A] border border-white/10 max-w-sm w-full p-10 text-center rounded-[3rem] shadow-2xl">
                <div className="w-16 h-16 bg-[#FF007F] text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-2xl font-bold italic rotate-6 shadow-[0_0_30px_-5px_#FF007F]">?</div>
                <h3 className="text-2xl font-bold font-heading tracking-tight mb-3 italic text-white">Submit Exam?</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed italic px-4">Once submitted, you cannot change any answers. Are you sure?</p>
                <div className="flex flex-col gap-4">
                   <button onClick={executeSubmission} className="w-full h-14 bg-[#FF007F] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black shadow-[0_0_20px_-5px_#FF007F] transition-all active:scale-95 italic">Submit Now</button>
                   <button onClick={() => setShowSubmitModal(false)} className="w-full py-4 text-zinc-600 text-[10px] font-bold hover:text-white uppercase tracking-[0.2em] rounded-xl transition-all italic">Go Back</button>
                </div>
          </div>
        </div>
      )}

      {/* Tab Switch Warning */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-200 flex items-center justify-center p-6">
          <div className="bg-[#0A0A0A] border-2 border-red-600/30 max-w-sm w-full p-10 text-center rounded-[3rem] shadow-2xl shadow-red-900/20">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-2xl font-bold italic rotate-12">!</div>
            <h3 className="text-2xl font-bold font-heading tracking-tight mb-3 italic text-red-500 uppercase">Warning!</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-5 italic">You switched away from the exam tab.</p>
            <div className="inline-block px-6 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl text-[11px] font-bold tracking-widest mb-10 uppercase italic">Tab Switches: {tabSwitchCount} / 10</div>
            <button onClick={() => setShowWarning(false)} className="w-full h-14 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 italic">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}
