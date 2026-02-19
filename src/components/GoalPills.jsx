import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getColors } from '../utils/participantColors';

const GoalPills = ({ goal, participant, onProgress }) => {
  const isComplete = goal.current === goal.total;
  const colors = getColors(participant.id);

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${isComplete ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {goal.text}
        </span>
        <span className="text-xs font-bold text-gray-500 ml-2 whitespace-nowrap">
          {goal.current}/{goal.total}
        </span>
      </div>
      {goal.note && <p className="text-xs text-gray-400 mb-2 italic">{goal.note}</p>}

      <div className="flex flex-wrap gap-1">
        {[...Array(goal.total)].map((_, index) => {
          const filled = index < goal.current;
          return (
            <button
              key={index}
              onClick={() => onProgress(goal.id, filled ? -1 : 1)}
              style={filled ? { backgroundColor: colors.hex, borderColor: 'transparent' } : {}}
              className={`h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 border-2 ${
                filled
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-300 border-gray-200 hover:border-gray-400'
              }`}
            >
              {filled && <CheckCircle size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalPills;
