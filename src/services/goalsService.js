import { supabase } from '../lib/supabase';

export const goalsService = {
  async getByWeek(weekId) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('week_id', weekId)
      .order('id', { ascending: true });
    if (error) throw error;
    return data;
  },

  async upsertAll(goals) {
    const { error } = await supabase
      .from('goals')
      .upsert(goals, { onConflict: 'id' });
    if (error) throw error;
  },

  async create(goalData) {
    const { data, error } = await supabase
      .from('goals')
      .insert(goalData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(goalId, fields) {
    const { data, error } = await supabase
      .from('goals')
      .update(fields)
      .eq('id', goalId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(goalId) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);
    if (error) throw error;
  },
};
