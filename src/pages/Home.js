import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { getGreetingText } from '../utils/greeting';
import {
  formatShortDate,
  formatVolume,
  getHomeStats,
  getWorkoutVolume,
} from '../utils/workoutStats';
import './Home.css';

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </div>
  );
}

export default function Home() {
  const { workouts } = useWorkoutHistory();
  const stats = useMemo(() => getHomeStats(workouts), [workouts]);

  return (
    <div className="home">
      <p className="home__greeting">{getGreetingText()}</p>

      {stats.totalWorkouts === 0 ? (
        <div className="home__empty">
          <p>No workouts logged yet.</p>
          <p>
            Tap <strong>Log workout</strong> below, finish a session, and hit
            Done to start tracking your progress.
          </p>
        </div>
      ) : (
        <div className="home__scroll">
          <div className="home__stats-grid">
            <StatCard
              label="Total workouts"
              value={stats.totalWorkouts}
              hint={`${stats.workoutsThisWeek} this week`}
            />
            <StatCard
              label="Day streak"
              value={stats.streakDays}
              hint={stats.streakDays === 1 ? 'day' : 'days'}
            />
            <StatCard
              label="All-time volume"
              value={formatVolume(stats.totalVolume)}
              hint="weight × reps"
            />
            {stats.lastWorkout ? (
              <StatCard
                label="Last session"
                value={stats.lastWorkout.category}
                hint={`${stats.lastWorkout.label} · ${formatVolume(stats.lastWorkout.volume)} vol`}
              />
            ) : (
              <StatCard label="Last session" value="—" />
            )}
          </div>

          <section className="home__section" aria-labelledby="home-split-heading">
            <h2 className="home__section-title" id="home-split-heading">
              Split breakdown
            </h2>
            <div className="home__split-row">
              {(['Push', 'Pull', 'Legs']).map((cat) => (
                <div key={cat} className="home__split-chip">
                  <span className="home__split-name">{cat}</span>
                  <span className="home__split-count">
                    {stats.byCategory[cat]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="home__section" aria-labelledby="home-recent-heading">
            <div className="home__section-head">
              <h2 className="home__section-title" id="home-recent-heading">
                Recent workouts
              </h2>
              <Link to="/progress" className="home__link">
                View charts →
              </Link>
            </div>
            <ul className="home__recent-list">
              {stats.recentWorkouts.map((w) => (
                <li key={w.id} className="home__recent-item">
                  <div>
                    <p className="home__recent-cat">{w.category}</p>
                    <p className="home__recent-date">
                      {formatShortDate(w.date)}
                    </p>
                  </div>
                  <span className="home__recent-vol">
                    {formatVolume(getWorkoutVolume(w))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
