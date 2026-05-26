import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutSession } from '@/types/workout';
import { Timer } from './Timer';

interface WorkoutPlayerProps {
  session: WorkoutSession;
  onExit: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ session, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPrepPhase, setIsPrepPhase] = useState(session.steps[0].exercise.id !== 'rest');
  const [remainingTime, setRemainingTime] = useState(
    session.steps[0].exercise.id !== 'rest' ? 5 : session.steps[0].durationSeconds
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const currentStep = session.steps[currentStepIndex];
  const nextStep = session.steps[currentStepIndex + 1];

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Initialize audio context on first user interaction or mount
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playDing = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error('Audio playback failed:', e);
    }
  }, [getAudioContext]);

  // Handle all speech announcements
  useEffect(() => {
    if (isComplete) return;
    
    if (isPrepPhase) {
      speak(currentStep.exercise.name);
    } else {
      if (currentStep.exercise.id === 'rest') {
        speak('Rest');
      } else {
        speak('Go');
      }
    }
  }, [currentStepIndex, isPrepPhase, isComplete, speak, currentStep.exercise.name, currentStep.exercise.id]);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 1) {
          const nextTime = prev - 1;
          
          // Ding at 5, 4, 3, 2, 1 for the main exercise
          if (!isPrepPhase && nextTime <= 5) {
            playDing();
          }
          return nextTime;
        }

        // Timer reached 1 and is about to reach 0
        if (isPrepPhase) {
          setIsPrepPhase(false);
          return session.steps[currentStepIndex].durationSeconds;
        } else {
          if (currentStepIndex < session.steps.length - 1) {
            const nextIdx = currentStepIndex + 1;
            const nextStepData = session.steps[nextIdx];
            
            setCurrentStepIndex(nextIdx);
            const isNextPrep = nextStepData.exercise.id !== 'rest';
            setIsPrepPhase(isNextPrep);
            
            return isNextPrep ? 5 : nextStepData.durationSeconds;
          } else {
            setIsComplete(true);
            return 0;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStepIndex, isPaused, isComplete, session.steps, isPrepPhase, playDing]);

  // Try to resume audio context on any click within the player
  const handleInteraction = () => {
    getAudioContext();
  };

  const progress = ((currentStepIndex + (isComplete ? 1 : 0)) / session.steps.length) * 100;

  if (isComplete) {
    return (
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>Workout Complete!</h1>
        <p style={{ marginTop: '1rem' }}>Great job on finishing your 25-minute session.</p>
        <button onClick={onExit} style={{ marginTop: '3rem' }}>Done</button>
      </div>
    );
  }

  return (
    <div onClick={handleInteraction} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => { handleInteraction(); onExit(); }} style={{ padding: '0.5rem 0', background: 'none', color: 'var(--secondary)', fontSize: '0.9rem' }}>✕ Exit</button>
        <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '500' }}>
          {currentStepIndex + 1} / {session.steps.length}
        </div>
      </div>

      <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, marginBottom: '2.5rem', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--foreground)', transition: 'width 0.3s ease-out' }} />
      </div>

      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            fontSize: '0.75rem', 
            fontWeight: '700',
            color: isPrepPhase ? 'var(--accent)' : 'var(--secondary)',
            marginBottom: '0.5rem'
          }}>
            {isPrepPhase ? 'Prepare' : currentStep.exercise.type}
          </p>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2', color: 'var(--foreground)' }}>{currentStep.exercise.name}</h2>
        </div>

        <Timer 
          duration={isPrepPhase ? 5 : currentStep.durationSeconds} 
          remainingTime={remainingTime} 
          backgroundImage={'image' in currentStep.exercise ? currentStep.exercise.image : undefined}
        />

        {nextStep && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'var(--card-bg)', 
            borderRadius: '16px',
            border: '1px solid var(--card-bg)'
          }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>NEXT UP</p>
            <p style={{ fontWeight: '600', color: 'var(--foreground)' }}>{nextStep.exercise.name}</p>
          </div>
        )}
      </div>

          <button 
          onClick={() => { handleInteraction(); setIsPaused(!isPaused); }}
          style={{ 
          marginTop: '2rem', 
          background: isPaused ? 'var(--accent)' : 'var(--foreground)',
          color: isPaused ? 'white' : 'var(--background)'
          }}
          >
          {isPaused ? 'Resume' : 'Pause'}
          </button>
    </div>
  );
};
