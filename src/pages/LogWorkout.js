import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryManageModal from '../components/CategoryManageModal';
import ExerciseFormModal from '../components/ExerciseFormModal';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useExercises } from '../context/ExercisesContext';
import { slugFromCategory } from '../utils/categorySlug';
import { createExerciseId } from '../utils/exercisesStorage';
import './LogWorkout.css';

export default function LogWorkout() {
  const navigate = useNavigate();
  const { exercisesByCategory, addExercise, updateExercise, deleteExercise } =
    useExercises();

  const [manageCategory, setManageCategory] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formCategory, setFormCategory] = useState(EXERCISE_CATEGORIES[0]);
  const [formCategoryLocked, setFormCategoryLocked] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [initialName, setInitialName] = useState('');

  const openManage = (category) => {
    setManageCategory(category);
  };

  const closeManage = () => {
    setManageCategory(null);
  };

  const openAddFromManage = () => {
    if (!manageCategory) return;
    setFormMode('add');
    setEditingId(null);
    setFormCategory(manageCategory);
    setFormCategoryLocked(true);
    setInitialName('');
    setFormOpen(true);
  };

  const openEditFromManage = (exercise) => {
    setFormMode('edit');
    setEditingId(exercise.id);
    setFormCategory(exercise.category);
    setFormCategoryLocked(false);
    setInitialName(exercise.name);
    setFormOpen(true);
  };

  const handleFormSave = ({ name, category }) => {
    if (formMode === 'add') {
      addExercise({ id: createExerciseId(), name, category });
    } else if (editingId) {
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
        onAdd={openAddFromManage}
        onEditExercise={openEditFromManage}
        onDeleteExercise={deleteExercise}
      />

      <ExerciseFormModal
        open={formOpen}
        mode={formMode}
        initialName={initialName}
        initialCategory={formCategory}
        categoryLocked={formCategoryLocked}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
      />
    </div>
  );
}
