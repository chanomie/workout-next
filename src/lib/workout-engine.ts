import { Exercise, WorkoutSession, WorkoutStep, MoveType } from '@/types/workout';
import { warmUpExercises, workoutExercises, coolDownExercises } from '@/data/exercises';

const STEP_DURATION = 30;
const WARMUP_COUNT = 5;
const COOLDOWN_COUNT = 5;
const WORKOUT_TARGET_MINUTES = 22;

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateWorkout(
  warmups: Exercise[] = warmUpExercises,
  workouts: Exercise[] = workoutExercises,
  cooldowns: Exercise[] = coolDownExercises
): WorkoutSession {
  const steps: WorkoutStep[] = [];

  // 1. Warm-up
  const selectedWarmups = getRandomItems(warmups, WARMUP_COUNT);
  selectedWarmups.forEach((exercise) => {
    steps.push({ exercise, durationSeconds: STEP_DURATION });
  });

  // 2. Workout Blocks
  let currentTotalSeconds = steps.reduce((sum, step) => sum + step.durationSeconds, 0);
  const targetWorkoutSeconds = WORKOUT_TARGET_MINUTES * 60;
  let availableWorkouts = [...workouts];

  while (currentTotalSeconds < targetWorkoutSeconds && availableWorkouts.length > 0) {
    // Decide block size (3 or 4 exercises)
    const blockSize = Math.min(Math.random() > 0.5 ? 4 : 3, availableWorkouts.length);
    const blockExercises = getRandomItems(availableWorkouts, blockSize);

    // Remove selected exercises from available pool for subsequent blocks
    const selectedIds = new Set(blockExercises.map(ex => ex.id));
    availableWorkouts = availableWorkouts.filter(ex => !selectedIds.has(ex.id));

    // Round 1 of the block
    blockExercises.forEach((exercise) => {
      steps.push({ exercise, durationSeconds: STEP_DURATION });
    });
    // Rest
    steps.push({ exercise: { name: 'Rest', type: 'rest', id: 'rest' }, durationSeconds: STEP_DURATION });

    // Round 2 of the block (same exercises)
    blockExercises.forEach((exercise) => {
      steps.push({ exercise, durationSeconds: STEP_DURATION });
    });

    currentTotalSeconds = steps.reduce((sum, step) => sum + step.durationSeconds, 0);

    // Only add a rest if we haven't reached the target and are likely to add another block
    if (currentTotalSeconds < targetWorkoutSeconds && availableWorkouts.length > 0) {
      steps.push({ exercise: { name: 'Rest', type: 'rest', id: 'rest' }, durationSeconds: STEP_DURATION });
      currentTotalSeconds += STEP_DURATION;
    }

    // The current loop will stop as soon as we hit or pass 22 minutes.
    if (currentTotalSeconds >= targetWorkoutSeconds) break;
  }

  // 3. Cool-down
  const selectedCooldowns = getRandomItems(cooldowns, COOLDOWN_COUNT);
  selectedCooldowns.forEach((exercise) => {
    steps.push({ exercise, durationSeconds: STEP_DURATION });
  });

  return {
    id: crypto.randomUUID(),
    startTime: new Date().toISOString(),
    steps,
  };
}
