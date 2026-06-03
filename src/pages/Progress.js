import { useMemo, useState } from 'react';
import LineChart from '../components/LineChart';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import {
  formatVolume,
  getExerciseBestWeightSeries,
  getImprovementPercent,
  getSessionVolumeSeries,
  getUniqueExercises,
} from '../utils/workoutStats';
import './Progress.css';

const CATEGORY_FILTERS = ['All', ...EXERCISE_CATEGORIES];

export default function Progress() {
  const { workouts } = useWorkoutHistory();
  const exercises = useMemo(() => getUniqueExercises(workouts), [workouts]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  const activeExerciseId =
    selectedExerciseId && exercises.some((e) => e.id === selectedExerciseId)
      ? selectedExerciseId
      : exercises[0]?.id ?? '';

  const volumeSeries = useMemo(() => {
    const filter =
      categoryFilter === 'All' ? null : categoryFilter;
    return getSessionVolumeSeries(workouts, filter);
  }, [workouts, categoryFilter]);

  const weightSeries = useMemo(() => {
    if (!activeExerciseId) return [];
    return getExerciseBestWeightSeries(workouts, activeExerciseId);
  }, [workouts, activeExerciseId]);

  const volumeImprovement = useMemo(
    () => getImprovementPercent(volumeSeries),
    [volumeSeries]
  );
  const weightImprovement = useMemo(
    () => getImprovementPercent(weightSeries),
    [weightSeries]
  );

  const selectedExerciseName =
    exercises.find((e) => e.id === activeExerciseId)?.name ?? '';

  if (workouts.length === 0) {
    return (
      <div className="progress-page">
        <h1 className="page-heading">Progress</h1>
        <p className="progress-page__empty">
          Complete at least one workout and tap Done to see your trends here.
        </p>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <h1 className="page-heading">Progress</h1>

      <div className="progress-page__scroll">
        <section className="progress-page__block">
          <div className="progress-page__filters" role="tablist" aria-label="Category filter">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={categoryFilter === cat}
                className={
                  categoryFilter === cat
                    ? 'progress-page__filter progress-page__filter--active'
                    : 'progress-page__filter'
                }
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <LineChart
            title="Session volume"
            subtitle={
              volumeImprovement != null
                ? `${volumeImprovement >= 0 ? '+' : ''}${volumeImprovement}% since first session`
                : 'Total weight × reps per workout'
            }
            data={volumeSeries}
            emptyMessage="Log more workouts in this split to see volume trends."
          />
        </section>

        <section className="progress-page__block">
          <label className="progress-page__label" htmlFor="progress-exercise">
            Exercise progress
          </label>
          {exercises.length === 0 ? (
            <p className="progress-page__hint">
              Add sets with weight on your next workout to chart strength gains.
            </p>
          ) : (
            <>
              <select
                id="progress-exercise"
                className="progress-page__select"
                value={activeExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              <LineChart
                title={`Top set weight — ${selectedExerciseName}`}
                subtitle={
                  weightImprovement != null
                    ? `${weightImprovement >= 0 ? '+' : ''}${weightImprovement}% since first log`
                    : 'Heaviest weight logged each session'
                }
                data={weightSeries}
                valueSuffix=""
                emptyMessage="Log weight for this exercise to track improvement."
              />
            </>
          )}
        </section>

        <section className="progress-page__insights" aria-label="Summary">
          <h2 className="progress-page__insights-title">At a glance</h2>
          <ul className="progress-page__insights-list">
            <li>
              <span className="progress-page__insight-label">Workouts logged</span>
              <span className="progress-page__insight-value">{workouts.length}</span>
            </li>
            {volumeSeries.length > 0 ? (
              <li>
                <span className="progress-page__insight-label">Latest session volume</span>
                <span className="progress-page__insight-value">
                  {formatVolume(volumeSeries[volumeSeries.length - 1].value)}
                </span>
              </li>
            ) : null}
            {weightSeries.length > 0 ? (
              <li>
                <span className="progress-page__insight-label">
                  Latest top set — {selectedExerciseName}
                </span>
                <span className="progress-page__insight-value">
                  {weightSeries[weightSeries.length - 1].value}
                </span>
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
