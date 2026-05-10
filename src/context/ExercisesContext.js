import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EXERCISE_CATEGORIES } from '../constants/exerciseCategories';
import { loadExercises, saveExercises } from '../utils/exercisesStorage';

const ExercisesContext = createContext(null);

export function ExercisesProvider({ children }) {
  const [exercises, setExercises] = useState(() => loadExercises());

  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  const addExercise = useCallback((exercise) => {
    setExercises((prev) => [...prev, exercise]);
  }, []);

  const updateExercise = useCallback((id, updates) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  }, []);

  const deleteExercise = useCallback((id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  const exercisesByCategory = useMemo(() => {
    const map = Object.fromEntries(
      EXERCISE_CATEGORIES.map((c) => [c, []])
    );
    for (const ex of exercises) {
      if (map[ex.category]) {
        map[ex.category].push(ex);
      }
    }
    return map;
  }, [exercises]);

  const value = useMemo(
    () => ({
      exercises,
      exercisesByCategory,
      addExercise,
      updateExercise,
      deleteExercise,
    }),
    [
      exercises,
      exercisesByCategory,
      addExercise,
      updateExercise,
      deleteExercise,
    ]
  );

  return (
    <ExercisesContext.Provider value={value}>
      {children}
    </ExercisesContext.Provider>
  );
}

export function useExercises() {
  const ctx = useContext(ExercisesContext);
  if (!ctx) {
    throw new Error('useExercises must be used within ExercisesProvider');
  }
  return ctx;
}
