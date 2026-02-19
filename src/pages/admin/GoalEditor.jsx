import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Check, X, Pencil } from 'lucide-react';
import { weeksService } from '../../services/weeksService';
import { goalsService } from '../../services/goalsService';
import { participantsService } from '../../services/participantsService';

const GOAL_TYPES = [
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'task', label: 'Tarea' },
];

const DEFAULT_TOTAL = { daily: 7, weekly: 3, task: 1 };

const EMPTY_FORM = { text: '', total: 7, type: 'daily', note: '' };

const GoalEditor = () => {
  const [weeks, setWeeks] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [loading, setLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(false);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Edit inline
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editSaving, setEditSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    Promise.all([weeksService.getAll(), participantsService.getAll()])
      .then(([ws, ps]) => {
        setWeeks(ws);
        setParticipants(ps);
        const active = ws.find((w) => w.is_active);
        if (active) setSelectedWeek(String(active.id));
        if (ps.length > 0) setSelectedParticipant(String(ps[0].id));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedWeek || !selectedParticipant) return;
    setGoalsLoading(true);
    setEditingId(null);
    goalsService.getByWeek(Number(selectedWeek))
      .then((all) => setGoals(all.filter((g) => g.participant_id === Number(selectedParticipant))))
      .finally(() => setGoalsLoading(false));
  }, [selectedWeek, selectedParticipant]);

  // ── Create ──────────────────────────────────────
  const handleTypeChange = (type) =>
    setForm((f) => ({ ...f, type, total: DEFAULT_TOTAL[type] }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newGoal = await goalsService.create({
        week_id: Number(selectedWeek),
        participant_id: Number(selectedParticipant),
        text: form.text,
        total: Number(form.total),
        current: 0,
        type: form.type,
        note: form.note || null,
      });
      setGoals((prev) => [...prev, newGoal]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ─────────────────────────────────────────
  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditForm({
      text: goal.text,
      total: goal.total,
      type: goal.type,
      note: goal.note ?? '',
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleEditTypeChange = (type) =>
    setEditForm((f) => ({ ...f, type, total: DEFAULT_TOTAL[type] }));

  const handleSaveEdit = async (goalId) => {
    setEditSaving(true);
    try {
      const updated = await goalsService.update(goalId, {
        text: editForm.text,
        total: Number(editForm.total),
        type: editForm.type,
        note: editForm.note || null,
      });
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
      setEditingId(null);
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────
  const handleDelete = async (goalId) => {
    if (!window.confirm('¿Eliminar esta meta?')) return;
    setDeletingId(goalId);
    try {
      await goalsService.delete(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      if (editingId === goalId) setEditingId(null);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-400 flex items-center gap-2">
        <RefreshCw size={16} className="animate-spin" /> Cargando...
      </div>
    );
  }

  const selectedParticipantData = participants.find((p) => p.id === Number(selectedParticipant));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Metas</h2>
        <p className="text-slate-500 text-sm mt-1">Editar metas por semana y participante</p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Semana</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Seleccionar...</option>
            {weeks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.is_active ? '🟢 ' : ''}{w.label || `Semana ${w.number}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Participante</label>
          <select
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Seleccionar...</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.avatar} {p.name}
              </option>
            ))}
          </select>
        </div>

        {selectedWeek && selectedParticipant && (
          <div className="self-end">
            <button
              onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Agregar meta
            </button>
          </div>
        )}
      </div>

      {/* ── Create form ── */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-indigo-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Nueva meta — {selectedParticipantData?.avatar} {selectedParticipantData?.name}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción *</label>
              <input
                type="text"
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Leer 10 páginas diarias"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {GOAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Total requerido</label>
                <input
                  type="number" min="1"
                  value={form.total}
                  onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nota (opcional)</label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Dividido en 2 bloques de 4h"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Check size={14} />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button" onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ── Goals list ── */}
      {selectedWeek && selectedParticipant && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {goalsLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <RefreshCw size={14} className="animate-spin" /> Cargando metas...
            </div>
          ) : goals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Sin metas para esta combinación. Agrega una arriba.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Meta</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">Tipo</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">Progreso</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goals.map((g) =>
                  editingId === g.id ? (
                    /* ── Edit row ── */
                    <tr key={g.id} className="bg-indigo-50">
                      <td className="px-4 py-3" colSpan={3}>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.text}
                            onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
                            className="w-full px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex gap-2">
                            <select
                              value={editForm.type}
                              onChange={(e) => handleEditTypeChange(e.target.value)}
                              className="flex-1 px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                              {GOAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                            <input
                              type="number" min="1"
                              value={editForm.total}
                              onChange={(e) => setEditForm((f) => ({ ...f, total: e.target.value }))}
                              className="w-20 px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Total"
                            />
                          </div>
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))}
                            className="w-full px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nota (opcional)"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${g.current === g.total ? 'text-green-600' : 'text-slate-600'}`}>
                          {g.current}/{editForm.total}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveEdit(g.id)}
                            disabled={editSaving}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <Check size={12} />
                            {editSaving ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                          >
                            <X size={12} /> Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* ── Normal row ── */
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{g.text}</div>
                        {g.note && <div className="text-xs text-slate-400 italic mt-0.5">{g.note}</div>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">{g.type}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{g.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${g.current === g.total ? 'text-green-600' : 'text-slate-600'}`}>
                          {g.current}/{g.total}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { startEdit(g); setShowForm(false); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Pencil size={12} /> Editar
                          </button>
                          <button
                            onClick={() => handleDelete(g.id)}
                            disabled={deletingId === g.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                            {deletingId === g.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {(!selectedWeek || !selectedParticipant) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          Selecciona una semana y un participante para ver o editar las metas.
        </div>
      )}
    </div>
  );
};

export default GoalEditor;
