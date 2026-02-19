import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { weeksService } from '../../services/weeksService';
import { goalsService } from '../../services/goalsService';
import { finesService } from '../../services/finesService';
import { participantsService } from '../../services/participantsService';
import { calculateFine, getPercentage } from '../../utils/calculations';

const Dashboard = () => {
  const [activeWeek, setActiveWeek] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [weekFines, setWeekFines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aw, ps, allWeeks] = await Promise.all([
          weeksService.getActive(),
          participantsService.getAll(),
          weeksService.getAll(),
        ]);
        setActiveWeek(aw);
        setParticipants(ps);
        setWeeks(allWeeks);

        if (aw) {
          const goals = await goalsService.getByWeek(aw.id);
          setActiveGoals(goals);
        }

        // Cargar multas de semanas cerradas
        const closedWeeks = allWeeks.filter((w) => !w.is_active);
        const finesMap = {};
        await Promise.all(
          closedWeeks.map(async (w) => {
            const f = await finesService.getByWeek(w.id);
            finesMap[w.id] = f;
          })
        );
        setWeekFines(finesMap);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-slate-400 flex items-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
        Cargando...
      </div>
    );
  }

  const getParticipantGoals = (participantId) =>
    activeGoals.filter((g) => g.participant_id === participantId);

  const getParticipantName = (id) =>
    participants.find((p) => p.id === id)?.name ?? `#${id}`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Vista general del progreso</p>
      </div>

      {/* Semana activa */}
      {activeWeek ? (
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" />
            Semana activa: {activeWeek.label || `Semana ${activeWeek.number}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {participants.map((p) => {
              const pGoals = getParticipantGoals(p.id);
              const pct = getPercentage(pGoals);
              const fine = calculateFine(pct);
              return (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Progreso</span>
                    <span className={`font-bold ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${p.bar_color} transition-all`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="text-sm flex justify-between text-slate-500">
                    <span>Multa estimada</span>
                    <span className={`font-bold ${fine > 0 ? 'text-red-600' : 'text-green-600'}`}>{fine} Bs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="mb-10 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-700">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">No hay semana activa. Ve a <a href="/admin/semanas" className="underline">Semanas</a> para activar una.</span>
        </div>
      )}

      {/* Historial */}
      {weeks.filter((w) => !w.is_active).length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-slate-500" />
            Historial de semanas
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Semana</th>
                  {participants.map((p) => (
                    <th key={p.id} className="text-center px-4 py-3 font-semibold text-slate-600">
                      {p.avatar} {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeks
                  .filter((w) => !w.is_active)
                  .map((w) => {
                    const fines = weekFines[w.id] ?? [];
                    return (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {w.label || `Semana ${w.number}`}
                        </td>
                        {participants.map((p) => {
                          const fine = fines.find((f) => f.participant_id === p.id);
                          return (
                            <td key={p.id} className="px-4 py-3 text-center">
                              {fine ? (
                                <div>
                                  <span className={`font-bold ${fine.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {fine.amount} Bs
                                  </span>
                                  {fine.paid && (
                                    <span className="ml-1 text-green-500" title="Pagado">
                                      <CheckCircle2 size={12} className="inline" />
                                    </span>
                                  )}
                                  <div className="text-xs text-slate-400">{fine.percentage}%</div>
                                </div>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
