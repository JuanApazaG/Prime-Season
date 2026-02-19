import { supabase } from '../lib/supabase';

export const participantsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return data;
  },
};
