'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { updateTimer, extendExamTime } from '@/app/actions/examAttemptActions'; // Assuming extendExamTime is a new action
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

  // State to track the actual exam end time (timestamp in milliseconds)
  // This will be updated when the server extends the time.
  const [currentExamEndTime, setCurrentExamEndTime] = useState<number | null>(() => {
    if (initialAttempt.examEndTime) {
      return new Date(initialAttempt.examEndTime).getTime();
    }
    // Fallback for older attempts or if examEndTime isn't set yet
    // This case should ideally be handled by the server setting examEndTime on attempt start
    return Date.now() + (initialAttempt.timeRemaining || examDuration * 60) * 1000;
  });

  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (currentExamEndTime) {
      return Math.max(0, Math.floor((currentExamEndTime - Date.now()) / 1000));
    }
    return initialAttempt.timeRemaining || examDuration * 60;
  });

  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') return navigator.onLine;
    return true;
  });
  const offlineStartTimeRef = useRef<number | null>(null);

  const [warningShown30, setWarningShown30] = useState(false);
  const [warningShown5, setWarningShown5] = useState(false);

  // Function to calculate time remaining based on currentExamEndTime
  const calculateTimeRemaining = useCallback(() => {
    if (currentExamEndTime) {
      return Math.max(0, Math.floor((currentExamEndTime - Date.now()) / 1000));
    }
    return 0; // Should not happen if currentExamEndTime is properly initialized
  }, [currentExamEndTime]);

  // Effect for handling online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      console.log('Went online');
      if (offlineStartTimeRef.current) {
        const offlineDurationMs = Date.now() - offlineStartTimeRef.current;
        const offlineDurationSeconds = Math.ceil(offlineDurationMs / 1000); // Round up to ensure enough time is added

        console.log(`Offline for ${offlineDurationSeconds} seconds. Extending exam time.`);

        try {
          // Call server action to extend examEndTime
          const res = await extendExamTime(attemptId, offlineDurationSeconds, sessionId);
          if (res && res.newExamEndTime) {
            const newEndTime = new Date(res.newExamEndTime).getTime();
            setCurrentExamEndTime(newEndTime); // Update local state with new end time
            console.log(`Exam time extended. New end time: ${new Date(newEndTime).toLocaleTimeString()}`);
          } else if (res && res.sessionConflict) {
            alert('🚨 Concurrent login detected! You have been logged in from another device. This session will now exit.');
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Failed to extend exam time:', error);
          // Optionally, handle error: maybe show a message or retry
        } finally {
          offlineStartTimeRef.current = null; // Reset offline start time
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      offlineStartTimeRef.current = Date.now(); // Record when we went offline
      console.log('Went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [attemptId, sessionId, router]); // Dependencies for the effect

  // Main timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnline) {
        // While offline, we DO NOT tick down - the examEndTime on the server
        // is being extended by the offline duration when reconnected.
        // So we just freeze the display by bailing out early.
        return;
      }

      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);

      // Warnings
      if (newTime <= 30 * 60 && newTime > 29 * 60 && !warningShown30) {
        alert('⏰ 30 minutes remaining!');
        setWarningShown30(true);
      }
      if (newTime <= 5 * 60 && newTime > 4 * 60 && !warningShown5) {
        alert('⚠️ Only 5 minutes left!');
        setWarningShown5(true);
      }

      // Auto-submit at 0
      if (newTime <= 0) {
        clearInterval(interval);
        onTimeExpired();
      }

      // Ping server every 20 seconds to update DB and check session lock
      // Only ping if online and time is still running
      if (isOnline && newTime > 0 && newTime % 20 === 0) {
        updateTimer(attemptId, newTime, sessionId).then((res: any) => {
          if (res && res.sessionConflict) {
            clearInterval(interval);
            alert('🚨 Concurrent login detected! You have been logged in from another device. This session will now exit.');
            router.push('/dashboard');
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    attemptId,
    sessionId,
    warningShown30,
    warningShown5,
    onTimeExpired,
    isOnline, // Re-run effect if online status changes
    currentExamEndTime, // Re-run effect if exam end time changes (e.g., after extension)
    calculateTimeRemaining,
    router
  ]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOnline) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 px-3 py-1 rounded-full">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          <span className="text-yellow-400 text-sm font-semibold">Offline — Timer Paused</span>
        </div>
        <span className="text-lg font-mono font-bold text-yellow-400">
          {formatTime(timeRemaining)}
        </span>
      </div>
    );
  }

  return (
    <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-green-400'}`}>
      ⏱️ {formatTime(timeRemaining)}
    </div>
  );
}
