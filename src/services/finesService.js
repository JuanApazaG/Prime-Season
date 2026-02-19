import { supabase } from '../lib/supabase';
import { calculateFine, getPercentage } from '../utils/calculations';

export const finesService = {
  async getByWeek(weekId) {
    const { data, error } = await supabase
      .from('fines')
      .select('*')
      .eq('week_id', weekId);
    if (error) throw error;
    return data;
  },

  /**
   * Calcula y hace upsert de las multas para una semana.
   * @param {number} weekId
   * @param {Array} participants - lista de participantes
   * @param {Array} goals - todos los goals de esa semana
   */
  async saveWeekFines(weekId, participants, goals) {
    const finesData = participants.map((p) => {
      const participantGoals = goals.filter((g) => g.participant_id === p.id);
      const pct = getPercentage(participantGoals);
      const amount = calculateFine(pct);
      return {
        week_id: weekId,
        participant_id: p.id,
        amount,
        percentage: pct,
        paid: false,
      };
    });

    const { error } = await supabase
      .from('fines')
      .upsert(finesData, { onConflict: 'week_id,participant_id' });
    if (error) throw error;
    return finesData;
  },

  async markPaid(fineId) {
    const { error } = await supabase
      .from('fines')
      .update({ paid: true })
      .eq('id', fineId);
    if (error) throw error;
  },
};
