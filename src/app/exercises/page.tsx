'use client';

import { useState, useEffect } from 'react';
import { Exercise, MoveType } from '@/types/workout';
import { storage } from '@/lib/storage';
import { allExercises as initialExercises } from '@/data/exercises';
import Link from 'next/link';

export default function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Exclude<MoveType, 'rest'>>('workout');

  useEffect(() => {
    const saved = storage.getExercises();
    if (saved) {
      setExercises(saved);
    } else {
      setExercises(initialExercises);
      storage.saveExercises(initialExercises);
    }
  }, []);

  const handleAdd = () => {
    if (!newName) return;
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: newName,
      type: newType
    };
    const updated = [...exercises, newExercise];
    setExercises(updated);
    storage.saveExercises(updated);
    setNewName('');
  };

  const handleReset = () => {
    if (confirm('Reset to initial exercise list? This will remove all custom exercises.')) {
      setExercises(initialExercises);
      storage.saveExercises(initialExercises);
    }
  };

  return (
    <main>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 'bold' }}>✕</Link>
        <h1 style={{ fontSize: '1.5rem' }}>Manage Exercises</h1>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Add New Move</h3>
        <input 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Exercise name (e.g. Jumping Jacks)"
          style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem', fontSize: '1rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['warmup', 'workout', 'cooldown'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setNewType(type)}
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                fontSize: '0.75rem', 
                background: newType === type ? 'var(--foreground)' : '#fff',
                color: newType === type ? 'var(--background)' : 'var(--foreground)',
                border: '1px solid #ddd'
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <button onClick={handleAdd} style={{ width: '100%', background: 'var(--accent)', color: 'white' }}>Add to List</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {(['warmup', 'workout', 'cooldown'] as const).map((type) => (
          <div key={type} style={{ marginBottom: '2rem' }}>
            <h2 style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem', color: 'var(--secondary)' }}>
              {type}s ({exercises.filter(e => e.type === type).length})
            </h2>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {exercises.filter(e => e.type === type).map(e => (
                <div key={e.id} style={{ padding: '1rem', background: '#fff', border: '1px solid #eee', borderRadius: '12px', fontSize: '0.9rem' }}>
                  {e.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleReset}
        style={{ marginTop: '2rem', background: 'none', color: '#ff4444', border: '1px solid #ff4444', fontSize: '0.8rem', padding: '0.5rem' }}
      >
        Reset to Defaults
      </button>
    </main>
  );
}
