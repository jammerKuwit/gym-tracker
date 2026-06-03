import { useCallback, useEffect, useState } from 'react';
import { loadWorkoutHistory } from '../utils/workoutHistoryStorage';

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useState(() => loadWorkoutHistory());

  const refresh = useCallback(() => {
    setWorkouts(loadWorkoutHistory());
  }, []);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener('gym-tracker-history-updated', onUpdate);
    window.addEventListener('focus', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('gym-tracker-history-updated', onUpdate);
      window.removeEventListener('focus', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  return { workouts, refresh };
}
