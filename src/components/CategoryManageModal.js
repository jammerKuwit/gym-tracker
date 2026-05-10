import { useCallback, useEffect, useId } from 'react';
import '../styles/modal.css';
import './CategoryManageModal.css';

export default function CategoryManageModal({
  category,
  exercises,
  open,
  onClose,
  onAdd,
  onEditExercise,
  onDeleteExercise,
}) {
  const titleId = useId();

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

  if (!open || !category) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <button
        type="button"
        className="modal-overlay__backdrop"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <div
        className="modal manage-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 className="modal__title" id={titleId}>
          Manage {category}
        </h2>
        <p className="manage-modal__hint">
          Add or remove exercises for this day type.
        </p>
        <ul className="manage-modal__list">
          {exercises.length === 0 ? (
            <li className="manage-modal__empty">No exercises yet</li>
          ) : (
            exercises.map((ex) => (
              <li key={ex.id} className="manage-modal__row">
                <span className="manage-modal__name">{ex.name}</span>
                <div className="manage-modal__actions">
                  <button
                    type="button"
                    className="manage-modal__icon-btn"
                    aria-label={`Edit ${ex.name}`}
                    onClick={() => onEditExercise(ex)}
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
                    className="manage-modal__icon-btn manage-modal__icon-btn--danger"
                    aria-label={`Delete ${ex.name}`}
                    onClick={() => onDeleteExercise(ex.id)}
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
            ))
          )}
        </ul>
        <button type="button" className="manage-modal__add" onClick={onAdd}>
          + Add exercise
        </button>
        <button
          type="button"
          className="modal__btn modal__btn--secondary manage-modal__done"
          onClick={handleClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
