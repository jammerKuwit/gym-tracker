import { useNavigate } from 'react-router-dom';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useExercises } from '../context/ExercisesContext';
import { slugFromCategory } from '../utils/categorySlug';
import './LogWorkout.css';

export default function LogWorkout() {
  const navigate = useNavigate();
  const { exercisesByCategory } = useExercises();

  return (
    <div className="log-page log-page--hub">
      <h1 className="log-page__heading">Log workout</h1>
      <p className="log-page__sub">
        Choose a day to start tracking sets and reps. Add or remove exercises in
        Add exercises.
      </p>
      <div className="log-page__scroll log-page__scroll--hub">
        <div className="log-day-list">
          {EXERCISE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="log-day-card"
              onClick={() => navigate(`/log/${slugFromCategory(cat)}`)}
            >
              <span className="log-day-card__label">{cat}</span>
              <span className="log-day-card__meta">
                {exercisesByCategory[cat].length} exercise
                {exercisesByCategory[cat].length !== 1 ? 's' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
