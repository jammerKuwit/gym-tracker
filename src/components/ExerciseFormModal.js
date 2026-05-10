import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import '../styles/modal.css';

export default function ExerciseFormModal({
  open,
  mode,
  initialName = '',
  initialCategory = EXERCISE_CATEGORIES[0],
  categoryLocked = false,
  onClose,
  onSave,
}) {
  const titleId = useId();
  const nameInputRef = useRef(null);
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);

  const reset = useCallback(() => {
    setName(initialName);
    setCategory(initialCategory);
  }, [initialName, initialCategory]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setCategory(initialCategory);
  }, [open, initialName, initialCategory]);

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
    onSave({ name: trimmed, category });
    handleClose();
  };

  const title = mode === 'edit' ? 'Edit exercise' : 'Add exercise';

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
          {title}
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
            <span className="modal__label" id="exercise-type-label">
              Category
            </span>
            <div
              className="modal__type-row"
              role="group"
              aria-labelledby="exercise-type-label"
            >
              {EXERCISE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={
                    category === c
                      ? 'modal__type-btn modal__type-btn--selected'
                      : 'modal__type-btn'
                  }
                  disabled={categoryLocked}
                  onClick={() => {
                    setCategory(c);
                    nameInputRef.current?.focus();
                  }}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
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
              {mode === 'edit' ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
