import React, { useState, useEffect } from 'react';
import { WorkoutSession } from '@/types/workout';
import { Timer } from './Timer';

interface WorkoutPlayerProps {
  session: WorkoutSession;
  onExit: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ session, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(session.steps[0].durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentStep = session.steps[currentStepIndex];
  const nextStep = session.steps[currentStepIndex + 1];

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          if (currentStepIndex < session.steps.length - 1) {
            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);
            return session.steps[nextIndex].durationSeconds;
          } else {
            setIsComplete(true);
            clearInterval(interval);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStepIndex, isPaused, isComplete, session.steps]);

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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={onExit} style={{ padding: '0.5rem 0', background: 'none', color: 'var(--secondary)', fontSize: '0.9rem' }}>✕ Exit</button>
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
            color: 'var(--secondary)',
            marginBottom: '0.5rem'
          }}>
            {currentStep.exercise.type}
          </p>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2' }}>{currentStep.exercise.name}</h2>
        </div>

        <Timer 
          duration={currentStep.durationSeconds} 
          remainingTime={remainingTime} 
        />

        {nextStep && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#fafafa', 
            borderRadius: '16px',
            border: '1px solid #eee'
          }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>NEXT UP</p>
            <p style={{ fontWeight: '600', color: 'var(--foreground)' }}>{nextStep.exercise.name}</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsPaused(!isPaused)}
        style={{ 
          marginTop: '2rem', 
          background: isPaused ? 'var(--accent)' : 'var(--foreground)',
          color: 'white'
        }}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};
