import { supabase } from '../config/supabase';

export const barberService = {
  // Get barber profile
  async getBarberProfile(barberId) {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .eq('id', barberId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update barber profile
  async updateBarberProfile(barberId, updates) {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .update(updates)
        .eq('id', barberId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get today's appointments
  async getTodayAppointments(barberId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers:customer_id (name, phone),
          services:service_id (name, duration, price)
        `)
        .eq('barber_id', barberId)
        .gte('appointment_date', today.toISOString())
        .lt('appointment_date', tomorrow.toISOString())
        .order('appointment_time', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(barberId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers:customer_id (name, phone),
          services:service_id (name, duration, price)
        `)
        .eq('barber_id', barberId)
        .gte('appointment_date', today.toISOString())
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Add appointment notes
  async addAppointmentNotes(appointmentId, notes) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ notes })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get barber earnings
  async getBarberEarnings(barberId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('status, price')
        .eq('barber_id', barberId)
        .eq('status', 'completed')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);
      
      if (error) throw error;
      
      const totalEarnings = data.reduce((sum, appointment) => sum + (appointment.price || 0), 0);
      const completedCount = data.length;
      
      return { 
        data: { totalEarnings, completedCount, appointments: data }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get barber services
  async getBarberServices(barberId) {
    try {
      const { data, error } = await supabase
        .from('barber_services')
        .select(`
          *,
          services:service_id (*)
        `)
        .eq('barber_id', barberId);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update service availability
  async updateServiceAvailability(barberServiceId, isAvailable) {
    try {
      const { data, error } = await supabase
        .from('barber_services')
        .update({ is_available: isAvailable })
        .eq('id', barberServiceId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get barber schedule
  async getBarberSchedule(barberId) {
    try {
      const { data, error } = await supabase
        .from('barber_schedules')
        .select('*')
        .eq('barber_id', barberId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update barber schedule
  async updateBarberSchedule(barberId, schedule) {
    try {
      const { data, error } = await supabase
        .from('barber_schedules')
        .upsert({
          barber_id: barberId,
          ...schedule
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get barber statistics
  async getBarberStatistics(barberId) {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Get weekly appointments
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('appointments')
        .select('status, created_at')
        .eq('barber_id', barberId)
        .gte('appointment_date', weekAgo.toISOString());
      
      if (weeklyError) throw weeklyError;

      // Calculate statistics
      const weeklyStats = {
        total: weeklyData.length,
        completed: weeklyData.filter(a => a.status === 'completed').length,
        cancelled: weeklyData.filter(a => a.status === 'cancelled').length,
        pending: weeklyData.filter(a => a.status === 'pending').length,
      };

      return { data: weeklyStats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};