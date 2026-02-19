import React from 'react';
import { Wallet } from 'lucide-react';
import { calculateFine, getPercentage } from '../utils/calculations';
import { getColors } from '../utils/participantColors';

const SummaryCard = ({ participant, goals }) => {
  const pct = getPercentage(goals);
  const fine = calculateFine(pct);
  const isSafe = fine === 0;
  const isDanger = fine >= 50;
  const colors = getColors(participant.id);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
      {/* Barra de color superior */}
      <div
        className="absolute top-0 left-0 w-full h-1.5"
        style={{ backgroundColor: colors.hex }}
      />

      <div className="flex justify-between items-start mb-4 mt-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow-sm">{participant.avatar}</span>
          <div>
            <h2 className="font-bold text-lg" style={{ color: colors.text }}>{participant.name}</h2>
            <span className="text-xs text-slate-400 font-medium">Nivel Productividad</span>
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={
            isSafe
              ? { backgroundColor: '#dcfce7', color: '#15803d' }
              : isDanger
              ? { backgroundColor: '#fee2e2', color: '#b91c1c' }
              : { backgroundColor: '#fef3c7', color: '#b45309' }
          }
        >
          {pct}%
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Progreso</span>
            <span className="text-slate-400 font-medium">
              {goals.filter((g) => g.current === g.total).length}/{goals.length} metas
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%`, backgroundColor: colors.hex }}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-center justify-between border-2"
          style={
            fine === 0
              ? { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
              : { backgroundColor: '#fef2f2', borderColor: '#fecaca' }
          }
        >
          <div className="flex items-center gap-2">
            <Wallet size={18} className={fine > 0 ? 'text-red-500' : 'text-slate-400'} />
            <span className="text-sm font-medium text-slate-600">Multa actual</span>
          </div>
          <span className={`text-xl font-black ${fine > 0 ? 'text-red-600' : 'text-slate-300'}`}>
            {fine} Bs
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
