import {
  getExerciseBestWeightSeries,
  getHomeStats,
  getImprovementPercent,
  getSessionVolumeSeries,
  getSetVolume,
  getWorkoutStreak,
} from './workoutStats';

const sampleWorkouts = [
  {
    id: '1',
    date: '2026-06-01T18:00:00.000Z',
    category: 'Push',
    exercises: [
      {
        exerciseId: 'bench',
        exerciseName: 'Bench press',
        sets: [
          { weight: '135', reps: '10' },
          { weight: '145', reps: '8' },
        ],
      },
    ],
  },
  {
    id: '2',
    date: '2026-06-03T18:00:00.000Z',
    category: 'Push',
    exercises: [
      {
        exerciseId: 'bench',
        exerciseName: 'Bench press',
        sets: [{ weight: '155', reps: '6' }],
      },
    ],
  },
];

test('getSetVolume multiplies weight and reps', () => {
  expect(getSetVolume({ weight: '100', reps: '5' })).toBe(500);
  expect(getSetVolume({ weight: '', reps: '5' })).toBe(0);
});

test('getHomeStats aggregates workouts', () => {
  const stats = getHomeStats(sampleWorkouts);
  expect(stats.totalWorkouts).toBe(2);
  expect(stats.byCategory.Push).toBe(2);
  expect(stats.totalVolume).toBeGreaterThan(0);
  expect(stats.lastWorkout.category).toBe('Push');
});

test('getSessionVolumeSeries returns chronological points', () => {
  const series = getSessionVolumeSeries(sampleWorkouts);
  expect(series).toHaveLength(2);
  expect(series[1].value).toBeGreaterThan(0);
});

test('getExerciseBestWeightSeries tracks max weight per session', () => {
  const series = getExerciseBestWeightSeries(sampleWorkouts, 'bench');
  expect(series).toHaveLength(2);
  expect(series[0].value).toBe(145);
  expect(series[1].value).toBe(155);
});

test('getImprovementPercent compares first and last', () => {
  const series = getExerciseBestWeightSeries(sampleWorkouts, 'bench');
  expect(getImprovementPercent(series)).toBe(7);
});

test('getWorkoutStreak returns zero with no workouts', () => {
  expect(getWorkoutStreak([])).toBe(0);
});
