export type MoveType = 'warmup' | 'workout' | 'cooldown' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  type: Exclude<MoveType, 'rest'>;
  image?: string;
}

export interface WorkoutStep {
  exercise: Exercise | { name: 'Rest'; type: 'rest'; id: 'rest' };
  durationSeconds: number;
}

export interface WorkoutSession {
  id: string;
  startTime: string;
  steps: WorkoutStep[];
}
