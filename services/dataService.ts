
import { supabase } from '../supabaseClient';
import { HydroData, FilterState, StationMetadata } from '../types';

export const fetchMetadata = async (): Promise<StationMetadata[]> => {
  const { data, error } = await supabase
    .from('so_lieu_thuy_van')
    .select('TenTram, TenDai');

  if (error) {
    console.error("Lỗi fetch metadata:", error);
    return [];
  }

  // Lọc unique trạm và đài
  const unique = Array.from(new Set((data || []).map((i: any) => JSON.stringify(i))))
    .map((s: string) => JSON.parse(s)) as StationMetadata[];
    
  return unique.sort((a, b) => a.TenTram.localeCompare(b.TenTram));
};

export const fetchHydroData = async (filters: FilterState): Promise<HydroData[]> => {
  if (!filters.stationName || !filters.from || !filters.to) return [];

  const { data, error } = await supabase
    .from('so_lieu_thuy_van')
    .select('*')
    .eq('TenTram', filters.stationName)
    .gte('Ngay', filters.from)
    .lte('Ngay', filters.to)
    .order('Ngay', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateHydroData = async (payload: any): Promise<boolean> => {
  const { data: existing } = await supabase
    .from('so_lieu_thuy_van')
    .select('id')
    .eq('TenTram', payload.TenTram)
    .eq('Ngay', payload.Ngay)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('so_lieu_thuy_van')
      .update(payload)
      .eq('id', existing.id);
    return !error;
  } else {
    const { error } = await supabase
      .from('so_lieu_thuy_van')
      .insert([payload]);
    return !error;
  }
};

/**
 * Hàm theo dõi lượt truy cập
 */
export const trackVisit = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('app_stats')
      .select('count')
      .eq('counter_name', 'total_visits')
      .maybeSingle();

    if (error) throw error;

    let newCount = (data?.count || 0) + 1;

    if (!data) {
      await supabase.from('app_stats').insert([{ counter_name: 'total_visits', count: 1 }]);
      return 1;
    } else {
      await supabase
        .from('app_stats')
        .update({ count: newCount })
        .eq('counter_name', 'total_visits');
      return newCount;
    }
  } catch (e) {
    console.warn("Visitor counter error:", e);
    return 0;
  }
};
