const STORAGE_KEY = 'gym-tracker-session-draft';

function parse(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (typeof data.category !== 'string') return null;
    if (!data.byExercise || typeof data.byExercise !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

export function loadSessionDraft() {
  return parse(localStorage.getItem(STORAGE_KEY));
}

export function saveSessionDraft(draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearSessionDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
