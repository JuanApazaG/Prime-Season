import { useState, useEffect, useCallback } from 'react';
import { weeksService } from '../services/weeksService';
import { goalsService } from '../services/goalsService';

export const useActiveWeek = () => {
  const [week, setWeek] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeWeek = await weeksService.getActive();
      setWeek(activeWeek);
      if (activeWeek) {
        const weekGoals = await goalsService.getByWeek(activeWeek.id);
        setGoals(weekGoals);
      } else {
        setGoals([]);
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reload = useCallback(async (force = false) => {
    if (!force && hasUnsavedChanges) {
      const confirm = window.confirm(
        '⚠️ Tienes cambios sin guardar. ¿Estás seguro de recargar? Se perderán los cambios.'
      );
      if (!confirm) return;
    }
    await fetchData();
  }, [hasUnsavedChanges, fetchData]);

  const handleProgress = useCallback((goalId, increment) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const newCurrent = Math.min(Math.max(goal.current + increment, 0), goal.total);
        return { ...goal, current: newCurrent };
      })
    );
    setHasUnsavedChanges(true);
  }, []);

  const saveProgress = useCallback(async () => {
    setSaving(true);
    try {
      await goalsService.upsertAll(goals);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (err) {
      alert('❌ Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, [goals]);

  return {
    week,
    goals,
    loading,
    saving,
    hasUnsavedChanges,
    lastSaved,
    error,
    handleProgress,
    saveProgress,
    reload,
  };
};
