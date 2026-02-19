import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Zap, RefreshCw } from 'lucide-react';
import { weeksService } from '../../services/weeksService';
import { goalsService } from '../../services/goalsService';
import { finesService } from '../../services/finesService';
import { participantsService } from '../../services/participantsService';

const WeekManager = () => {
  const [weeks, setWeeks] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({ number: '', label: '', startDate: '', endDate: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allWeeks, ps] = await Promise.all([weeksService.getAll(), participantsService.getAll()]);
      setWeeks(allWeeks);
      setParticipants(ps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    try {
      await weeksService.create({
        number: parseInt(form.number),
        label: form.label,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      setForm({ number: '', label: '', startDate: '', endDate: '' });
      setShowForm(false);
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (weekId) => {
    setActionLoading(weekId);
    try {
      await weeksService.setActive(weekId);
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (week) => {
    const confirmed = window.confirm(
      `¿Cerrar "${week.label || `Semana ${week.number}`}"? Esto calculará las multas y desactivará la semana.`
    );
    if (!confirmed) return;

    setActionLoading(`close-${week.id}`);
    try {
      const goals = await goalsService.getByWeek(week.id);
      await finesService.saveWeekFines(week.id, participants, goals);
      await weeksService.closeWeek(week.id);
      await loadData();
    } catch (err) {
      alert('Error al cerrar semana: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-400 flex items-center gap-2">
        <RefreshCw size={16} className="animate-spin" />
        Cargando...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Semanas</h2>
          <p className="text-slate-500 text-sm mt-1">Gestionar semanas del programa</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nueva semana
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Crear nueva semana</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Número *</label>
              <input
                type="number"
                value={form.number}
                onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="7"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Sprint de productividad"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={actionLoading === 'create'}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Check size={14} />
              {actionLoading === 'create' ? 'Creando...' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <X size={14} />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Weeks list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {weeks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No hay semanas aún.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Label</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Fechas</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeks.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{w.number}</td>
                  <td className="px-4 py-3 text-slate-600">{w.label || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {w.start_date && w.end_date
                      ? `${w.start_date} → ${w.end_date}`
                      : w.start_date || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {w.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Activa
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                        Cerrada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!w.is_active && (
                        <button
                          onClick={() => handleActivate(w.id)}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <Zap size={12} />
                          {actionLoading === w.id ? 'Activando...' : 'Activar'}
                        </button>
                      )}
                      {w.is_active && (
                        <button
                          onClick={() => handleClose(w)}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <X size={12} />
                          {actionLoading === `close-${w.id}` ? 'Cerrando...' : 'Cerrar semana'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WeekManager;
