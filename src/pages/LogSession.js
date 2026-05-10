import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useExercises } from '../context/ExercisesContext';
import { categoryFromSlug } from '../utils/categorySlug';
import {
  clearSessionDraft,
  loadSessionDraft,
  saveSessionDraft,
} from '../utils/sessionDraftStorage';
import './LogSession.css';

function createSetRowId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeRows(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ id: createSetRowId(), weight: '', reps: '' }];
  }
  return raw.map((r) => ({
    id: r.id || createSetRowId(),
    weight: String(r.weight ?? ''),
    reps: String(r.reps ?? ''),
  }));
}

export default function LogSession() {
  const { categorySlug } = useParams();
  const category = categoryFromSlug(categorySlug);
  const { exercisesByCategory } = useExercises();
  const exercises = useMemo(() => {
    if (!category) return [];
    return exercisesByCategory[category] ?? [];
  }, [category, exercisesByCategory]);

  const idKey = useMemo(
    () => exercises.map((e) => e.id).join('|'),
    [exercises]
  );

  const [byExercise, setByExercise] = useState({});

  useEffect(() => {
    if (!category) return;

    const draft = loadSessionDraft();

    setByExercise((prev) => {
      const next = {};
      const useDraft = draft?.category === category;

      for (const ex of exercises) {
        const id = ex.id;
        if (id in prev) {
          next[id] = prev[id];
          continue;
        }
        const raw = useDraft ? draft.byExercise[id] : null;
        next[id] = normalizeRows(raw);
      }
      return next;
    });
  }, [category, idKey, exercises]);

  useEffect(() => {
    if (!category) return;
    if (Object.keys(byExercise).length === 0) return;
    saveSessionDraft({ category, byExercise });
  }, [category, byExercise]);

  const updateSet = useCallback((exerciseId, setId, field, value) => {
    setByExercise((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((row) =>
        row.id === setId ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const addSet = useCallback((exerciseId) => {
    setByExercise((prev) => ({
      ...prev,
      [exerciseId]: [
        ...prev[exerciseId],
        { id: createSetRowId(), weight: '', reps: '' },
      ],
    }));
  }, []);

  const removeSet = useCallback((exerciseId, setId) => {
    setByExercise((prev) => {
      const rows = prev[exerciseId].filter((r) => r.id !== setId);
      return {
        ...prev,
        [exerciseId]:
          rows.length > 0 ? rows : [{ id: createSetRowId(), weight: '', reps: '' }],
      };
    });
  }, []);

  const handleDone = useCallback(() => {
    clearSessionDraft();
  }, []);

  if (!category) {
    return <Navigate to="/log" replace />;
  }

  return (
    <div className="session-page">
      <header className="session-page__header">
        <Link to="/log" className="session-page__back">
          ← Back
        </Link>
        <h1 className="session-page__title">{category} day</h1>
      </header>

      <div className="session-page__scroll">
        {exercises.length === 0 ? (
          <p className="session-page__empty">
            No {category.toLowerCase()} exercises yet. Add some on the Home
            screen.
          </p>
        ) : (
          exercises.map((exercise) => {
            const rows = byExercise[exercise.id] ?? [
              { id: createSetRowId(), weight: '', reps: '' },
            ];
            return (
              <section
                key={exercise.id}
                className="session-block"
                aria-labelledby={`ex-${exercise.id}`}
              >
                <h2 className="session-block__name" id={`ex-${exercise.id}`}>
                  {exercise.name}
                </h2>
                <div className="session-block__sets" role="table">
                  <div className="session-block__row session-block__row--head" role="row">
                    <span role="columnheader">Set</span>
                    <span role="columnheader">Weight</span>
                    <span role="columnheader">Reps</span>
                    <span className="session-block__col-actions" role="columnheader">
                      {/* header spacer */}
                    </span>
                  </div>
                  {rows.map((row, index) => (
                    <div key={row.id} className="session-block__row" role="row">
                      <span className="session-block__set-num" role="cell">
                        {index + 1}
                      </span>
                      <input
                        role="cell"
                        className="session-block__input"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        aria-label={`Set ${index + 1} weight for ${exercise.name}`}
                        value={row.weight}
                        onChange={(e) =>
                          updateSet(exercise.id, row.id, 'weight', e.target.value)
                        }
                      />
                      <input
                        role="cell"
                        className="session-block__input"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        aria-label={`Set ${index + 1} reps for ${exercise.name}`}
                        value={row.reps}
                        onChange={(e) =>
                          updateSet(exercise.id, row.id, 'reps', e.target.value)
                        }
                      />
                      <div className="session-block__col-actions" role="cell">
                        <button
                          type="button"
                          className="session-block__remove-set"
                          aria-label={`Remove set ${index + 1} for ${exercise.name}`}
                          onClick={() => removeSet(exercise.id, row.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="session-block__add-set"
                  onClick={() => addSet(exercise.id)}
                >
                  + Add set
                </button>
              </section>
            );
          })
        )}
      </div>

      {exercises.length > 0 && (
        <div className="session-page__footer">
          <Link
            to="/log"
            className="session-page__done"
            onClick={handleDone}
          >
            Done
          </Link>
        </div>
      )}
    </div>
  );
}
