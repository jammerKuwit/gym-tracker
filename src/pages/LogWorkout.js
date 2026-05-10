import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryManageModal from '../components/CategoryManageModal';
import ExerciseFormModal from '../components/ExerciseFormModal';
import PickExerciseModal from '../components/PickExerciseModal';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useExercises } from '../context/ExercisesContext';
import { slugFromCategory } from '../utils/categorySlug';
import './LogWorkout.css';

export default function LogWorkout() {
  const navigate = useNavigate();
  const { exercises, exercisesByCategory, updateExercise, deleteExercise } =
    useExercises();

  const [manageCategory, setManageCategory] = useState(null);
  const [pickOpen, setPickOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formCategory, setFormCategory] = useState(EXERCISE_CATEGORIES[0]);
  const [editingId, setEditingId] = useState(null);
  const [initialName, setInitialName] = useState('');

  const openManage = (category) => {
    setManageCategory(category);
  };

  const closeManage = () => {
    setManageCategory(null);
  };

  const openPickFromManage = () => {
    if (!manageCategory) return;
    setPickOpen(true);
  };

  const closePick = () => {
    setPickOpen(false);
  };

  const handleAssign = (exerciseId) => {
    if (!manageCategory) return;
    updateExercise(exerciseId, { category: manageCategory });
  };

  const openEditFromManage = (exercise) => {
    setEditingId(exercise.id);
    setFormCategory(exercise.category);
    setInitialName(exercise.name);
    setFormOpen(true);
  };

  const handleFormSave = ({ name, category }) => {
    if (editingId) {
      updateExercise(editingId, { name, category });
    }
    setFormOpen(false);
  };

  const managingExercises = manageCategory
    ? exercisesByCategory[manageCategory]
    : [];

  return (
    <div className="log-page log-page--hub">
      <h1 className="log-page__heading">Log workout</h1>
      <p className="log-page__sub">Choose a day to start tracking sets and reps.</p>
      <div className="log-page__scroll log-page__scroll--hub">
        <div className="log-day-list">
          {EXERCISE_CATEGORIES.map((cat) => (
            <div key={cat} className="log-day-card">
              <button
                type="button"
                className="log-day-card__main"
                onClick={() => navigate(`/log/${slugFromCategory(cat)}`)}
              >
                <span className="log-day-card__label">{cat}</span>
                <span className="log-day-card__meta">
                  {exercisesByCategory[cat].length} exercise
                  {exercisesByCategory[cat].length !== 1 ? 's' : ''}
                </span>
              </button>
              <button
                type="button"
                className="log-day-card__edit"
                aria-label={`Edit ${cat} exercises`}
                onClick={() => openManage(cat)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <CategoryManageModal
        category={manageCategory}
        exercises={managingExercises}
        open={Boolean(manageCategory)}
        onClose={closeManage}
        onAdd={openPickFromManage}
        onEditExercise={openEditFromManage}
        onDeleteExercise={deleteExercise}
      />

      <PickExerciseModal
        open={pickOpen}
        targetCategory={manageCategory}
        exercises={exercises}
        onClose={closePick}
        onAssign={handleAssign}
      />

      <ExerciseFormModal
        open={formOpen}
        mode="edit"
        initialName={initialName}
        initialCategory={formCategory}
        categoryLocked={false}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
      />
    </div>
  );
}
