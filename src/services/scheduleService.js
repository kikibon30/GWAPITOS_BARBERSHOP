// src/services/scheduleService.js
import { supabase } from '../config/supabase';

export const scheduleService = {
  // Get all schedules
  getAllSchedules: async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        barbers:barber_id (name, email),
        customers:customer_id (name, email),
        services:service_id (name, price, duration)
      `)
      .order('scheduled_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get schedule by ID
  getScheduleById: async (id) => {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        barbers:barber_id (*),
        customers:customer_id (*),
        services:service_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update schedule
  updateSchedule: async (id, updates) => {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },

  // Delete schedule
  deleteSchedule: async (id) => {
    const { data, error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },

  // Create new schedule
  createSchedule: async (scheduleData) => {
    const { data, error } = await supabase
      .from('schedules')
      .insert([scheduleData])
      .select();
    
    if (error) throw error;
    return data;
  }
};