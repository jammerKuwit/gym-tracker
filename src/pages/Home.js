import { useCallback, useState } from 'react';
import ExerciseFormModal from '../components/ExerciseFormModal';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useExercises } from '../context/ExercisesContext';
import { createExerciseId } from '../utils/exercisesStorage';
import './Home.css';

function ExerciseCard({ exercise, onEdit, onDelete }) {
  return (
    <li className="exercise-card">
      <div className="exercise-card__body">
        <h2 className="exercise-card__name">{exercise.name}</h2>
        <p className="exercise-card__category">{exercise.category}</p>
      </div>
      <div className="exercise-card__actions">
        <button
          type="button"
          className="exercise-card__icon-btn"
          aria-label={`Edit ${exercise.name}`}
          onClick={() => onEdit(exercise)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="exercise-card__icon-btn exercise-card__icon-btn--danger"
          aria-label={`Delete ${exercise.name}`}
          onClick={() => onDelete(exercise.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default function Home() {
  const { exercises, addExercise, updateExercise, deleteExercise } =
    useExercises();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalCategory, setModalCategory] = useState(EXERCISE_CATEGORIES[0]);
  const [modalCategoryLocked, setModalCategoryLocked] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialName, setInitialName] = useState('');

  const openAdd = useCallback(() => {
    setModalMode('add');
    setEditingId(null);
    setModalCategory(EXERCISE_CATEGORIES[0]);
    setModalCategoryLocked(false);
    setInitialName('');
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((exercise) => {
    setModalMode('edit');
    setEditingId(exercise.id);
    setModalCategory(exercise.category);
    setModalCategoryLocked(false);
    setInitialName(exercise.name);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    ({ name, category }) => {
      if (modalMode === 'add') {
        addExercise({ id: createExerciseId(), name, category });
      } else if (editingId) {
        updateExercise(editingId, { name, category });
      }
    },
    [modalMode, editingId, addExercise, updateExercise]
  );

  return (
    <div className="home">
      <div className="home__section-head">
        <h1 className="home__title">My Exercises</h1>
        <button
          type="button"
          className="home__add-btn"
          aria-label="Add exercise"
          onClick={openAdd}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="home__scroll">
        {exercises.length === 0 ? (
          <p className="home__empty">
            No exercises yet. Tap + to add one, then log a workout from the green
            button below.
          </p>
        ) : (
          <ul className="home__list">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onEdit={openEdit}
                onDelete={deleteExercise}
              />
            ))}
          </ul>
        )}
      </div>

      <ExerciseFormModal
        open={modalOpen}
        mode={modalMode}
        initialName={initialName}
        initialCategory={modalCategory}
        categoryLocked={modalCategoryLocked}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
