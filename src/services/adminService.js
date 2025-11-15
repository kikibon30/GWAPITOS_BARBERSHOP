// src/services/adminService.js
import { supabase } from '../config/supabase';

export const adminService = {
  // Get all users
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  },

  // Get system statistics
  getSystemStats: async () => {
    const { data, error } = await supabase
      .from('system_stats')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  }
};