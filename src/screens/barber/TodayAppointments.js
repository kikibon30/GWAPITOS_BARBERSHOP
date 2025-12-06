import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SectionList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { barberService } from '../../services/barberService';
import { globalStyles, colors } from '../../styles';
import { APPOINTMENT_STATUS, STATUS_LABELS } from '../../constants/appointmentStatus';
import AppointmentCard from '../../components/AppointmentCard';
import { formatDate, formatTime } from '../../utils/dateTime';

const TodayAppointments = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const barberId = user?.id;
      const { data, error } = await barberService.getTodayAppointments(barberId);
      
      if (error) throw error;
      
      setAppointments(data || []);
      groupAppointmentsByTime(data || []);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
      console.error('Load appointments error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const groupAppointmentsByTime = (appointmentsList) => {
    // Group by hour
    const groups = {};
    appointmentsList.forEach(apt => {
      const time = new Date(apt.appointment_time);
      const hour = time.getHours();
      const hourKey = `${hour}:00 - ${hour + 1}:00`;
      
      if (!groups[hourKey]) {
        groups[hourKey] = [];
      }
      groups[hourKey].push(apt);
    });

    // Convert to section list format
    const sections = Object.keys(groups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => ({
        title: key,
        data: groups[key].sort((a, b) => 
          new Date(a.appointment_time) - new Date(b.appointment_time)
        )
      }));

    setGroupedAppointments(sections);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('AppointmentDetails', { appointment });
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { error } = await barberService.updateAppointmentStatus(appointmentId, status);
      if (error) throw error;
      Alert.alert('Success', `Appointment marked as ${STATUS_LABELS[status]}`);
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <AppointmentCard 
      appointment={item}
      onPress={handleAppointmentPress}
    />
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} appointments</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {Object.values(APPOINTMENT_STATUS).map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              appointments.some(a => a.status === status) && styles.filterButtonActive
            ]}
            onPress={() => {
              // Filter logic can be implemented here
            }}
          >
            <Text style={styles.filterButtonText}>
              {STATUS_LABELS[status]}
            </Text>
            <Text style={styles.filterCount}>
              {appointments.filter(a => a.status === status).length}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Appointments List */}
      {groupedAppointments.length > 0 ? (
        <SectionList
          sections={groupedAppointments}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderAppointmentItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyText}>No appointments for today</Text>
          <Text style={styles.emptySubtext}>
            Take this time to prepare for upcoming appointments or manage your services.
          </Text>
        </ScrollView>
      )}

      {/* Quick Actions Bar */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BarberDashboard')}
        >
          <Text style={styles.actionButtonIcon}>🏠</Text>
          <Text style={styles.actionButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ServiceManagement')}
        >
          <Text style={styles.actionButtonIcon}>✂️</Text>
          <Text style={styles.actionButtonText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Calendar', 'Calendar view coming soon')}
        >
          <Text style={styles.actionButtonIcon}>📅</Text>
          <Text style={styles.actionButtonText}>Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    minWidth: 120,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  filterButtonText: {
    color: colors.textPrimary,
    fontWeight: '500',
    marginRight: 8,
  },
  filterCount: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
});

export default TodayAppointments;