'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { updateTimer, extendExamTime } from '@/app/actions/examAttemptActions';
import { useRouter } from 'next/navigation';

interface ExamTimerProps {
  attemptId: string;
  initialAttempt: any;
  examDuration: number;
  sessionId: string;
  onTimeExpired: () => void;
}

export default function ExamTimer({ attemptId, initialAttempt, examDuration, sessionId, onTimeExpired }: ExamTimerProps) {
  const router = useRouter();

  const [currentExamEndTime, setCurrentExamEndTime] = useState<number | null>(() => {
    if (initialAttempt.examEndTime) return new Date(initialAttempt.examEndTime).getTime();
    return Date.now() + (initialAttempt.timeRemaining || examDuration * 60) * 1000;
  });

  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (currentExamEndTime) return Math.max(0, Math.floor((currentExamEndTime - Date.now()) / 1000));
    return initialAttempt.timeRemaining || examDuration * 60;
  });

  const [isOnline, setIsOnline] = useState(() => typeof window !== 'undefined' ? navigator.onLine : true);
  const offlineStartTimeRef = useRef<number | null>(null);
  const [warningShown30, setWarningShown30] = useState(false);
  const [warningShown5, setWarningShown5] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (currentExamEndTime) return Math.max(0, Math.floor((currentExamEndTime - Date.now()) / 1000));
    return 0;
  }, [currentExamEndTime]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (offlineStartTimeRef.current) {
        const offlineDurationSeconds = Math.ceil((Date.now() - offlineStartTimeRef.current) / 1000);
        try {
          const res = await extendExamTime(attemptId, offlineDurationSeconds, sessionId);
          if (res && res.newExamEndTime) setCurrentExamEndTime(new Date(res.newExamEndTime).getTime());
          else if (res && res.sessionConflict) {
            alert('Multiple logins detected!');
            router.push('/dashboard');
          }
        } catch (error) { console.error('Extension failed', error); }
        finally { offlineStartTimeRef.current = null; }
      }
    };
    const handleOffline = () => { setIsOnline(false); offlineStartTimeRef.current = Date.now(); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [attemptId, sessionId, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnline) return;
      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);
      if (newTime <= 30 * 60 && newTime > 29 * 60 && !warningShown30) { alert('30 minutes left!'); setWarningShown30(true); }
      if (newTime <= 5 * 60 && newTime > 4 * 60 && !warningShown5) { alert('5 minutes left!'); setWarningShown5(true); }
      if (newTime <= 0) { clearInterval(interval); onTimeExpired(); }
      if (isOnline && newTime > 0 && newTime % 20 === 0) {
        updateTimer(attemptId, newTime, sessionId).then((res: any) => {
          if (res && res.sessionConflict) { clearInterval(interval); alert('Another device logged in!'); router.push('/dashboard'); }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptId, sessionId, warningShown30, warningShown5, onTimeExpired, isOnline, currentExamEndTime, calculateTimeRemaining, router]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOnline) {
    return (
      <div className="flex items-center gap-4 bg-rose-50 border border-rose-100 px-5 py-2 rounded-xl shadow-lg shadow-rose-100/50">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest italic leading-none">Offline...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 px-6 py-2 rounded-xl border-2 transition-all duration-500 ${timeRemaining < 300 
        ? 'bg-rose-500 text-white border-rose-600 shadow-xl shadow-rose-100' 
        : 'bg-white text-slate-900 border-slate-100 shadow-xl shadow-slate-200/50'}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest italic ${timeRemaining < 300 ? 'text-white' : 'text-slate-400'}`}>Time Left:</span>
      <span className="text-lg font-bold font-heading italic tracking-tighter leading-none">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
