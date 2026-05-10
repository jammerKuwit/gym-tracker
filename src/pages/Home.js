import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import {
  createExerciseId,
  loadExercises,
  saveExercises,
} from '../utils/exercisesStorage';
import './Home.css';

function ExerciseCard({ exercise, onDelete }) {
  return (
    <li className="exercise-card">
      <div className="exercise-card__body">
        <h2 className="exercise-card__name">{exercise.name}</h2>
        <p className="exercise-card__category">{exercise.category}</p>
      </div>
      <button
        type="button"
        className="exercise-card__delete"
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
    </li>
  );
}

function AddExerciseModal({ open, onClose, onAdd }) {
  const titleId = useId();
  const nameInputRef = useRef(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(EXERCISE_CATEGORIES[0]);

  const reset = useCallback(() => {
    setName('');
    setCategory(EXERCISE_CATEGORIES[0]);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  if (!open) return null;

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({ id: createExerciseId(), name: trimmed, category });
    handleClose();
  };

  return (
    <div className="modal-overlay" role="presentation">
      <button
        type="button"
        className="modal-overlay__backdrop"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 className="modal__title" id={titleId}>
          Add exercise
        </h2>
        <form onSubmit={submit}>
          <div className="modal__field">
            <label className="modal__label" htmlFor="exercise-name">
              Exercise name
            </label>
            <input
              ref={nameInputRef}
              id="exercise-name"
              className="modal__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bench press"
              autoComplete="off"
            />
          </div>
          <div className="modal__field">
            <label className="modal__label" htmlFor="exercise-category">
              Category
            </label>
            <select
              id="exercise-category"
              className="modal__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXERCISE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primary"
              disabled={!canSubmit}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const [exercises, setExercises] = useState(() => loadExercises());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  const addExercise = useCallback((exercise) => {
    setExercises((prev) => [...prev, exercise]);
  }, []);

  const deleteExercise = useCallback((id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  return (
    <div className="home">
      <div className="home__section-head">
        <h1 className="home__title">My Exercises</h1>
        <button
          type="button"
          className="home__add-btn"
          aria-label="Add exercise"
          onClick={() => setModalOpen(true)}
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
            No exercises yet. Tap + to add your first one.
          </p>
        ) : (
          <ul className="home__list">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onDelete={deleteExercise}
              />
            ))}
          </ul>
        )}
      </div>

      <AddExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addExercise}
      />
    </div>
  );
}
