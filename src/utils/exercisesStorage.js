const STORAGE_KEY = 'gym-tracker-exercises';

function parseStored(raw) {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function isValidExercise(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    item.name.trim().length > 0 &&
    typeof item.category === 'string'
  );
}

export function loadExercises() {
  const raw = parseStored(localStorage.getItem(STORAGE_KEY));
  return raw.filter(isValidExercise).map((item) => ({
    id: item.id,
    name: item.name.trim(),
    category: item.category,
  }));
}

export function saveExercises(exercises) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
}

export function createExerciseId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
