const STORAGE_KEY = 'gym-tracker-workout-history';

function parseStored(raw) {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function isValidSet(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.weight === 'string' &&
    typeof item.reps === 'string'
  );
}

function isValidExerciseEntry(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.exerciseId === 'string' &&
    typeof item.exerciseName === 'string' &&
    Array.isArray(item.sets) &&
    item.sets.every(isValidSet)
  );
}

function isValidWorkout(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.date === 'string' &&
    typeof item.category === 'string' &&
    Array.isArray(item.exercises) &&
    item.exercises.every(isValidExerciseEntry)
  );
}

export function loadWorkoutHistory() {
  const raw = parseStored(localStorage.getItem(STORAGE_KEY));
  return raw.filter(isValidWorkout).map((item) => ({
    id: item.id,
    date: item.date,
    category: item.category,
    exercises: item.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName.trim(),
      sets: ex.sets.map((s) => ({
        weight: s.weight,
        reps: s.reps,
      })),
    })),
  }));
}

export function saveWorkoutHistory(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function createWorkoutId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `workout-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildCompletedWorkout(category, exercises, byExercise) {
  return {
    id: createWorkoutId(),
    date: new Date().toISOString(),
    category,
    exercises: exercises.map((ex) => {
      const rows = byExercise[ex.id] ?? [];
      const sets = rows
        .map((row) => ({
          weight: String(row.weight ?? '').trim(),
          reps: String(row.reps ?? '').trim(),
        }))
        .filter((s) => s.weight !== '' || s.reps !== '');
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets,
      };
    }),
  };
}

export function appendCompletedWorkout(workout) {
  const history = loadWorkoutHistory();
  saveWorkoutHistory([...history, workout]);
}
