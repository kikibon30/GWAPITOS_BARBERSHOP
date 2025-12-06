import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { barberService } from '../../services/barberService';
import { globalStyles, colors } from '../../styles';
import { formatDate } from '../../utils/dateTime';
import AppointmentCard from '../../components/AppointmentCard';

const BarberDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const barberId = user?.id;

      // Load profile
      const { data: profileData } = await barberService.getBarberProfile(barberId);
      setProfile(profileData);

      // Load statistics
      const { data: statsData } = await barberService.getBarberStatistics(barberId);
      setStatistics(statsData || statistics);

      // Load today's appointments
      const { data: appointmentsData } = await barberService.getTodayAppointments(barberId);
      setTodayAppointments(appointmentsData || []);

      // Find next appointment
      const now = new Date();
      const upcoming = (appointmentsData || [])
        .filter(apt => new Date(apt.appointment_time) > now)
        .sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time));
      
      setNextAppointment(upcoming[0] || null);

    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('AppointmentDetails', { appointment });
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { error } = await barberService.updateAppointmentStatus(appointmentId, status);
      if (error) throw error;
      Alert.alert('Success', 'Appointment status updated');
      loadDashboardData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{profile?.name || 'Barber'}</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('BarberProfile')}
        >
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.statNumber}>{statistics.total}</Text>
          <Text style={styles.statLabel}>Total This Week</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.success }]}>
          <Text style={styles.statNumber}>{statistics.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
          <Text style={styles.statNumber}>{statistics.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
          <Text style={styles.statNumber}>{statistics.cancelled}</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>

      {/* Next Appointment */}
      {nextAppointment && (
        <View style={styles.nextAppointment}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TodayAppointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <AppointmentCard 
            appointment={nextAppointment}
            onPress={handleAppointmentPress}
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleStatusUpdate(nextAppointment.id, 'confirmed')}
            >
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleStatusUpdate(nextAppointment.id, 'in_progress')}
            >
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusUpdate(nextAppointment.id, 'completed')}
            >
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('TodayAppointments')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Today's Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('ServiceManagement')}
          >
            <Text style={styles.actionIcon}>✂️</Text>
            <Text style={styles.actionLabel}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Earnings')}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionLabel}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Coming Soon', 'Calendar view will be available soon')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Appointments Preview */}
      {todayAppointments.length > 0 && (
        <View style={styles.appointmentsPreview}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <Text style={styles.appointmentCount}>{todayAppointments.length} total</Text>
          </View>
          {todayAppointments.slice(0, 3).map((appointment, index) => (
            <AppointmentCard
              key={appointment.id || index}
              appointment={appointment}
              onPress={handleAppointmentPress}
            />
          ))}
          {todayAppointments.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('TodayAppointments')}
            >
              <Text style={styles.viewAllText}>View All Appointments</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    borderRadius: 12,
    margin: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
  nextAppointment: {
    padding: 15,
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  startButton: {
    backgroundColor: colors.warning,
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  quickActions: {
    padding: 15,
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 15,
  },
  actionItem: {
    width: '45%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  appointmentsPreview: {
    padding: 15,
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  appointmentCount: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 10,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default BarberDashboard;