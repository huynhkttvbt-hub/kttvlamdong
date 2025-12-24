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
  // Tìm record cũ để lấy ID hoặc Upsert dựa trên Unique Constraint (nếu có)
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