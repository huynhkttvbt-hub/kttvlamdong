
import { createClient } from '@supabase/supabase-js';

// THAY THẾ THÔNG TIN DƯỚI ĐÂY ĐỂ CHẠY TRỰC TIẾP
const supabaseUrl = 'https://spwahrmekpickgkeqtbd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwd2Focm1la3BpY2tna2VxdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTk1NDUsImV4cCI6MjA4MDc3NTU0NX0.mj2CA8G6L9NsqW786yzMhQx2_CbxRkIU1xnGRq6lkCc';

export const isConfigured = () => {
  return !supabaseUrl.includes('YOUR_PROJECT_URL') && !supabaseAnonKey.includes('YOUR_ANON_KEY');
};

// Khởi tạo client (sử dụng placeholder nếu chưa cấu hình để tránh crash app)
export const supabase = createClient(
  isConfigured() ? supabaseUrl : 'https://placeholder.supabase.co', 
  isConfigured() ? supabaseAnonKey : 'placeholder'
);
