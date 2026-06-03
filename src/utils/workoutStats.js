export function parseNumber(value) {
  const n = parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function getSetVolume(set) {
  const weight = parseNumber(set.weight);
  const reps = parseNumber(set.reps);
  if (weight == null || reps == null) return 0;
  return weight * reps;
}

export function getExerciseBestWeight(exerciseEntry) {
  let best = 0;
  for (const set of exerciseEntry.sets) {
    const w = parseNumber(set.weight);
    if (w != null && w > best) best = w;
  }
  return best;
}

export function getExerciseVolume(exerciseEntry) {
  return exerciseEntry.sets.reduce((sum, set) => sum + getSetVolume(set), 0);
}

export function getWorkoutVolume(workout) {
  return workout.exercises.reduce(
    (sum, ex) => sum + getExerciseVolume(ex),
    0
  );
}

function dayKey(isoDate) {
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sortWorkoutsChronologically(workouts) {
  return [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getWorkoutStreak(workouts) {
  if (workouts.length === 0) return 0;

  const dayKeys = new Set(workouts.map((w) => dayKey(w.date)));
  const sorted = [...dayKeys].sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dayKey(today.toISOString());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dayKey(yesterday.toISOString());

  const mostRecent = sorted[0];
  if (mostRecent !== todayKey && mostRecent !== yesterdayKey) return 0;

  let streak = 0;
  const cursor = new Date(`${mostRecent}T12:00:00`);

  while (true) {
    const key = dayKey(cursor.toISOString());
    if (!dayKeys.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getWorkoutsThisWeek(workouts) {
  const weekStart = startOfWeek(new Date()).getTime();
  return workouts.filter((w) => new Date(w.date).getTime() >= weekStart)
    .length;
}

export function countByCategory(workouts) {
  const counts = { Push: 0, Pull: 0, Legs: 0 };
  for (const w of workouts) {
    if (w.category in counts) counts[w.category] += 1;
  }
  return counts;
}

export function formatVolume(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value));
}

export function formatShortDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeWorkoutDate(isoDate) {
  const d = new Date(isoDate);
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startThat = new Date(d);
  startThat.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (startToday.getTime() - startThat.getTime()) / 86400000
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return formatShortDate(isoDate);
}

export function getHomeStats(workouts) {
  const sorted = sortWorkoutsChronologically(workouts);
  const totalVolume = sorted.reduce((sum, w) => sum + getWorkoutVolume(w), 0);
  const last = sorted[sorted.length - 1] ?? null;

  return {
    totalWorkouts: sorted.length,
    workoutsThisWeek: getWorkoutsThisWeek(sorted),
    streakDays: getWorkoutStreak(sorted),
    totalVolume,
    byCategory: countByCategory(sorted),
    lastWorkout: last
      ? {
          category: last.category,
          date: last.date,
          volume: getWorkoutVolume(last),
          label: formatRelativeWorkoutDate(last.date),
        }
      : null,
    recentWorkouts: [...sorted].reverse().slice(0, 5),
  };
}

export function getSessionVolumeSeries(workouts, categoryFilter = null) {
  const sorted = sortWorkoutsChronologically(workouts).filter((w) => {
    if (!categoryFilter) return true;
    return w.category === categoryFilter;
  });

  return sorted.map((w) => ({
    date: w.date,
    label: formatShortDate(w.date),
    value: getWorkoutVolume(w),
    category: w.category,
  }));
}

export function getUniqueExercises(workouts) {
  const map = new Map();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (!map.has(ex.exerciseId)) {
        map.set(ex.exerciseId, ex.exerciseName);
      }
    }
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getExerciseBestWeightSeries(workouts, exerciseId) {
  const points = [];

  for (const w of sortWorkoutsChronologically(workouts)) {
    const entry = w.exercises.find((ex) => ex.exerciseId === exerciseId);
    if (!entry || entry.sets.length === 0) continue;
    const best = getExerciseBestWeight(entry);
    if (best <= 0) continue;
    points.push({
      date: w.date,
      label: formatShortDate(w.date),
      value: best,
    });
  }

  return points;
}

export function getImprovementPercent(series) {
  if (series.length < 2) return null;
  const first = series[0].value;
  const last = series[series.length - 1].value;
  if (first <= 0) return null;
  return Math.round(((last - first) / first) * 100);
}
