import React from 'react';
import { Trophy, Calendar, BarChart3, Save, RefreshCw } from 'lucide-react';
import { useActiveWeek } from '../hooks/useActiveWeek';
import { useParticipants } from '../hooks/useParticipants';
import SummaryCard from '../components/SummaryCard';
import GoalPills from '../components/GoalPills';
import PenaltiesTable from '../components/PenaltiesTable';
import { getColors } from '../utils/participantColors';

const Home = () => {
  const { participants } = useParticipants();
  const {
    week,
    goals,
    loading,
    saving,
    hasUnsavedChanges,
    lastSaved,
    handleProgress,
    saveProgress,
    reload,
  } = useActiveWeek();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw size={20} className="animate-spin" />
          <span className="font-medium">Cargando datos...</span>
        </div>
      </div>
    );
  }

  const getParticipantGoals = (participantId) =>
    goals.filter((g) => g.participant_id === participantId);

  const weekLabel = week ? `Semana ${week.number}${week.label ? ` • ${week.label}` : ''}` : 'Sin semana activa';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Prime Season</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                {weekLabel} • Guarda tus cambios manualmente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-amber-700 font-medium">Cambios sin guardar</span>
              </div>
            )}

            {lastSaved && !hasUnsavedChanges && (
              <span className="text-xs text-slate-400">
                Guardado: {lastSaved.toLocaleTimeString('es-ES')}
              </span>
            )}

            <button
              onClick={() => reload()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Recargar datos desde Supabase"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">Recargar</span>
            </button>

            <button
              onClick={saveProgress}
              disabled={saving || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                hasUnsavedChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              } disabled:opacity-50`}
              title={hasUnsavedChanges ? 'Guardar cambios en Supabase' : 'No hay cambios para guardar'}
            >
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!week ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">No hay semana activa.</p>
            <p className="text-sm mt-1">Ve al <a href="/admin" className="text-indigo-500 underline">panel de administración</a> para crear y activar una semana.</p>
          </div>
        ) : (
          <>
            {/* Resumen General */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              {participants.map((participant) => (
                <SummaryCard
                  key={participant.id}
                  participant={participant}
                  goals={getParticipantGoals(participant.id)}
                />
              ))}
            </div>

            {/* Detalle de Metas */}
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" />
              Seguimiento de Metas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {participants.map((participant) => {
                const pGoals = getParticipantGoals(participant.id);
                const colors = getColors(participant.id);
                return (
                  <div key={participant.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                    <div
                      className="p-4 border-b rounded-t-xl flex items-center justify-between"
                      style={{ backgroundColor: colors.light, borderColor: colors.border }}
                    >
                      <h4 className="font-bold" style={{ color: colors.text }}>{participant.name}'s Goals</h4>
                      <BarChart3 size={16} style={{ color: colors.hex, opacity: 0.7 }} />
                    </div>

                    <div className="p-5 flex-1">
                      {pGoals.map((goal) => (
                        <GoalPills
                          key={goal.id}
                          goal={goal}
                          participant={participant}
                          onProgress={handleProgress}
                        />
                      ))}
                      {pGoals.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">Sin metas esta semana</p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100 text-center">
                      <p className="text-xs text-slate-400">
                        {pGoals.filter((g) => g.current === g.total).length} de {pGoals.length} metas completadas
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <PenaltiesTable />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
