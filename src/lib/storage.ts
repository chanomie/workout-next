import { Exercise, WorkoutSession } from '@/types/workout';

const EXERCISES_KEY = 'workout_next_exercises';
const HISTORY_KEY = 'workout_next_history';

export const storage = {
  saveExercises: (exercises: Exercise[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  },
  
  getExercises: (): Exercise[] | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveWorkout: (session: WorkoutSession) => {
    if (typeof window === 'undefined') return;
    const history = storage.getHistory();
    history.push(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  getHistory: (): WorkoutSession[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearHistory: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_KEY);
  }
};
