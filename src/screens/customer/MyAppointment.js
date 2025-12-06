import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { customerService } from '../../services/customerService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Mock data
      setAppointments([
        {
          id: 1,
          barberName: 'John Barber',
          service: 'Haircut & Beard Trim',
          date: '2024-01-15T14:00:00',
          status: 'confirmed',
          price: 35
        },
        {
          id: 2,
          barberName: 'Mike Styles',
          service: 'Classic Haircut',
          date: '2024-01-10T10:00:00',
          status: 'completed',
          price: 25
        },
        {
          id: 3,
          barberName: 'David Clipper',
          service: 'Royal Shave',
          date: '2024-01-20T16:00:00',
          status: 'pending',
          price: 20
        }
      ]);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointment) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${appointment.barberName}?`,
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            try {
              // await customerService.cancelAppointment(appointment.id);
              await loadAppointments();
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'completed': return colors.info;
      case 'cancelled': return colors.error;
      default: return colors.textLight;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'CONFIRMED';
      case 'pending': return 'PENDING';
      case 'completed': return 'COMPLETED';
      case 'cancelled': return 'CANCELLED';
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const FilterButton = ({ status, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === status && styles.activeFilter
      ]}
      onPress={() => setFilter(status)}
    >
      <Text style={[
        styles.filterText,
        filter === status && styles.activeFilterText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={typography.heading}>My Appointments</Text>
        <Text style={typography.subtitle}>Manage your bookings</Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <FilterButton status="all" label="All" />
        <FilterButton status="upcoming" label="Upcoming" />
        <FilterButton status="pending" label="Pending" />
        <FilterButton status="completed" label="Completed" />
        <FilterButton status="cancelled" label="Cancelled" />
      </ScrollView>

      {/* Appointments List */}
      <ScrollView
        style={styles.appointmentsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.serviceName}>{appointment.service}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="person" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>{appointment.barberName}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>
                    {new Date(appointment.date).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>${appointment.price}</Text>
                </View>
              </View>

              {appointment.status === 'confirmed' || appointment.status === 'pending' ? (
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(appointment)}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.rescheduleText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              ) : appointment.status === 'completed' && (
                <TouchableOpacity style={styles.rebookButton}>
                  <Ionicons name="refresh" size={20} color={colors.success} />
                  <Text style={styles.rebookText}>Book Again</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyStateTitle}>No appointments found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all' 
                ? "You haven't made any appointments yet"
                : `No ${filter} appointments found`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    marginRight: spacing.sm,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  activeFilterText: {
    color: colors.white,
  },
  appointmentsList: {
    flex: 1,
    padding: spacing.md,
  },
  appointmentCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  serviceName: {
    ...typography.title,
    fontWeight: 'bold',
    flex: 1,
    marginRight: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.body,
    marginLeft: spacing.sm,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 8,
  },
  cancelText: {
    ...typography.small,
    color: colors.error,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  rescheduleText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  rebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.success,
    borderRadius: 8,
  },
  rebookText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.title,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default MyAppointments;