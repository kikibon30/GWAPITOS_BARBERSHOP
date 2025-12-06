// src/services/customerService.js
import { supabase } from '../config/supabase';

export const customerService = {
  // Book appointment
  bookAppointment: async (appointmentData) => {
    try {
      console.log('Booking appointment:', appointmentData);
      // In a real app, you'd insert into appointments table
      // For now, simulate API call and return success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return { success: true, appointmentId: Date.now() };
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  // Get user appointments
  getUserAppointments: async (userId) => {
    try {
      // Mock data for demonstration
      const mockAppointments = [
        {
          id: 1,
          barberName: 'John Barber',
          service: 'Haircut & Beard Trim',
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'confirmed',
          price: 35
        },
        {
          id: 2,
          barberName: 'Mike Styles',
          service: 'Classic Haircut',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          status: 'completed',
          price: 25
        },
        {
          id: 3,
          barberName: 'David Clipper',
          service: 'Royal Shave',
          date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          status: 'pending',
          price: 20
        }
      ];
      
      return mockAppointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      console.log(`Cancelling appointment ${appointmentId}`);
      // In a real app, you'd update the appointment status
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return { success: true };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  // Get available barbers
  getBarbers: async () => {
    try {
      // Mock data
      const mockBarbers = [
        {
          id: 1,
          name: 'John Barber',
          specialty: 'Classic Cuts',
          rating: 4.8,
          reviewCount: 127,
          experience: '5 years',
          services: ['Haircut', 'Beard Trim', 'Shave'],
          availability: ['Mon', 'Wed', 'Fri']
        },
        {
          id: 2,
          name: 'Mike Styles',
          specialty: 'Modern Styles',
          rating: 4.9,
          reviewCount: 89,
          experience: '3 years',
          services: ['Fade', 'Design', 'Coloring'],
          availability: ['Tue', 'Thu', 'Sat']
        },
        {
          id: 3,
          name: 'David Clipper',
          specialty: 'Beard Grooming',
          rating: 4.7,
          reviewCount: 64,
          experience: '7 years',
          services: ['Beard Trim', 'Royal Shave', 'Mustache'],
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        }
      ];
      
      return mockBarbers;
    } catch (error) {
      console.error('Error fetching barbers:', error);
      return [];
    }
  },

  // Get services
  getServices: async () => {
    try {
      // Mock data
      const mockServices = [
        {
          id: 1,
          name: 'Classic Haircut',
          category: 'hair',
          duration: 30,
          price: 25,
          description: 'Traditional haircut with scissor and clipper work',
          popular: true
        },
        {
          id: 2,
          name: 'Haircut & Beard Trim',
          category: 'combo',
          duration: 45,
          price: 35,
          description: 'Complete grooming package including haircut and beard styling',
          popular: true
        },
        {
          id: 3,
          name: 'Royal Shave',
          category: 'shave',
          duration: 30,
          price: 20,
          description: 'Traditional straight razor shave with hot towels',
          popular: false
        }
      ];
      
      return mockServices;
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }
};