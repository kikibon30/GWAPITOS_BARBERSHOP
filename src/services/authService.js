// src/services/authService.js
import { supabase } from '../config/supabase';

export const authService = {
  // ... existing login/signup functions ...
  
  getAdminDashboard: async () => {
    const { data, error } = await supabase
      .from('admin_dashboard')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
};