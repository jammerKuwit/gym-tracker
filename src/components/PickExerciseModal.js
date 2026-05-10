import { useCallback, useEffect, useId, useMemo } from 'react';
import '../styles/modal.css';
import './PickExerciseModal.css';

export default function PickExerciseModal({
  open,
  targetCategory,
  exercises,
  onClose,
  onAssign,
}) {
  const titleId = useId();

  const candidates = useMemo(() => {
    if (!targetCategory) return [];
    return exercises
      .filter((e) => e.category !== targetCategory)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [exercises, targetCategory]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  if (!open || !targetCategory) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <button
        type="button"
        className="modal-overlay__backdrop"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <div
        className="modal pick-exercise-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 className="modal__title" id={titleId}>
          Add to {targetCategory}
        </h2>
        <p className="pick-exercise-modal__hint">
          Choose an exercise from your library. New exercises must be created on
          the Add exercises screen.
        </p>
        {candidates.length === 0 ? (
          <p className="pick-exercise-modal__empty">
            All exercises are already in {targetCategory}, or your library is
            empty. Add exercises from the Add exercises tab first.
          </p>
        ) : (
          <ul className="pick-exercise-modal__list">
            {candidates.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  className="pick-exercise-modal__row"
                  onClick={() => {
                    onAssign(ex.id);
                    handleClose();
                  }}
                >
                  <span className="pick-exercise-modal__name">{ex.name}</span>
                  <span className="pick-exercise-modal__from">{ex.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="modal__btn modal__btn--secondary pick-exercise-modal__cancel"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
