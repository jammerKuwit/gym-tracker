import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseFormModal from '../components/ExerciseFormModal';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { useExercises } from '../context/ExercisesContext';
import { slugFromCategory } from '../utils/categorySlug';
import { createExerciseId } from '../utils/exercisesStorage';
import './LogWorkout.css';

function PanelExerciseRow({ exercise, onEdit, onDelete }) {
  return (
    <li className="log-panel__row">
      <span className="log-panel__row-name">{exercise.name}</span>
      <div className="log-panel__row-actions">
        <button
          type="button"
          className="log-panel__icon-btn"
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
          className="log-panel__icon-btn log-panel__icon-btn--danger"
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

function CategoryPanel({ category, exercises, onAdd, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <section className="log-panel" aria-labelledby={`panel-${category}`}>
      <div className="log-panel__head">
        <h2 className="log-panel__title" id={`panel-${category}`}>
          {category}
        </h2>
        <span className="log-panel__count">{exercises.length}</span>
      </div>
      <button
        type="button"
        className="log-panel__start"
        onClick={() => navigate(`/log/${slugFromCategory(category)}`)}
      >
        Start {category} day
      </button>
      <ul className="log-panel__list">
        {exercises.length === 0 ? (
          <li className="log-panel__empty">No exercises yet</li>
        ) : (
          exercises.map((ex) => (
            <PanelExerciseRow
              key={ex.id}
              exercise={ex}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </ul>
      <button type="button" className="log-panel__add" onClick={() => onAdd(category)}>
        + Add exercise
      </button>
    </section>
  );
}

export default function LogWorkout() {
  const { exercisesByCategory, addExercise, updateExercise, deleteExercise } =
    useExercises();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalCategory, setModalCategory] = useState(EXERCISE_CATEGORIES[0]);
  const [modalCategoryLocked, setModalCategoryLocked] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialName, setInitialName] = useState('');

  const openAdd = (category) => {
    setModalMode('add');
    setEditingId(null);
    setModalCategory(category);
    setModalCategoryLocked(true);
    setInitialName('');
    setModalOpen(true);
  };

  const openEdit = (exercise) => {
    setModalMode('edit');
    setEditingId(exercise.id);
    setModalCategory(exercise.category);
    setModalCategoryLocked(false);
    setInitialName(exercise.name);
    setModalOpen(true);
  };

  const handleSave = ({ name, category }) => {
    if (modalMode === 'add') {
      addExercise({ id: createExerciseId(), name, category });
    } else if (editingId) {
      updateExercise(editingId, { name, category });
    }
  };

  return (
    <div className="log-page">
      <h1 className="log-page__heading">Log workout</h1>
      <p className="log-page__sub">
        Pick a day to track lifts, or manage exercises below.
      </p>
      <div className="log-page__scroll">
        {EXERCISE_CATEGORIES.map((cat) => (
          <CategoryPanel
            key={cat}
            category={cat}
            exercises={exercisesByCategory[cat]}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={deleteExercise}
          />
        ))}
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
