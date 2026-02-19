import { supabase } from '../lib/supabase';

export const weeksService = {
  async getActive() {
    const { data, error } = await supabase
      .from('weeks')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data ?? null;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('weeks')
      .select('*')
      .order('number', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create({ number, label, startDate, endDate }) {
    const { data, error } = await supabase
      .from('weeks')
      .insert({ number, label, start_date: startDate, end_date: endDate, is_active: false })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async setActive(weekId) {
    // Desactivar todas
    const { error: e1 } = await supabase
      .from('weeks')
      .update({ is_active: false })
      .neq('id', 0); // afecta todas las filas
    if (e1) throw e1;

    // Activar la elegida
    const { data, error: e2 } = await supabase
      .from('weeks')
      .update({ is_active: true })
      .eq('id', weekId)
      .select()
      .single();
    if (e2) throw e2;
    return data;
  },

  async closeWeek(weekId) {
    const { error } = await supabase
      .from('weeks')
      .update({ is_active: false })
      .eq('id', weekId);
    if (error) throw error;
  },
};
