'use client';

import { useState } from 'react';
import { generateWorkout } from '@/lib/workout-engine';
import { WorkoutSession, Exercise } from '@/types/workout';
import { WorkoutPlayer } from '@/components/WorkoutPlayer';
import { storage } from '@/lib/storage';
import { warmUpExercises, workoutExercises, coolDownExercises } from '@/data/exercises';
import Link from 'next/link';

export default function Home() {
  const [session, setSession] = useState<WorkoutSession | null>(null);

  const handleStartWorkout = () => {
    const saved = storage.getExercises();

    // Helper to merge latest exercise data (like images) with saved lists
    const mergeLatest = (latest: Exercise[], savedItems: Exercise[] | null) => {
      if (!savedItems) return latest;
      // We want to keep the "pool" of exercises up to date with new fields (like images)
      // but only include exercises that are in our master lists.
      return latest.map(l => {
        const s = savedItems.find(item => item.id === l.id);
        return s ? { ...l, ...s, image: l.image } : l;
      });
    };

    const wu = mergeLatest(warmUpExercises, saved?.filter(e => e.type === 'warmup') || null);
    const wo = mergeLatest(workoutExercises, saved?.filter(e => e.type === 'workout') || null);
    const cd = mergeLatest(coolDownExercises, saved?.filter(e => e.type === 'cooldown') || null);

    const newSession = generateWorkout(wu, wo, cd);
    setSession(newSession);
  };
  const handleExit = () => {
    setSession(null);
  };

  if (session) {
    return (
      <main>
        <WorkoutPlayer session={session} onExit={handleExit} />
      </main>
    );
  }

  return (
    <main>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', letterSpacing: '-0.02em' }}>Workout.Next</h1>
          <p>Your personal 25-minute trainer.</p>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', border: '1px solid var(--card-bg)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧘</span>
            <div>
              <p style={{ fontWeight: '700', color: 'var(--foreground)' }}>5 Warm-up Stretches</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Get your body ready.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div>
              <p style={{ fontWeight: '700', color: 'var(--foreground)' }}>High Intensity Blocks</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Recurring exercises with rest.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>❄️</span>
            <div>
              <p style={{ fontWeight: '700', color: 'var(--foreground)' }}>5 Cool-down Stretches</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Recover and relax.</p>
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={handleStartWorkout} style={{ width: '100%', height: '4rem', fontSize: '1.2rem', marginBottom: '1rem' }}>
        Start Workout
      </button>

      <Link href="/exercises" style={{ textAlign: 'center', color: 'var(--secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
        Manage Exercises
      </Link>
    </main>
  );
}
