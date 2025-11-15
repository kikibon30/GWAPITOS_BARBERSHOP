import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { customerService } from '../../services';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const CustomerDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState({
    upcomingAppointments: [],
    recentAppointments: [],
    favoriteBarbers: []
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadCustomerData = async () => {
    try {
      // Mock data - replace with actual API calls
      setUserData({
        upcomingAppointments: [
          {
            id: 1,
            barberName: 'John Barber',
            service: 'Haircut & Beard Trim',
            date: '2024-01-15T14:00:00',
            status: 'confirmed'
          }
        ],
        recentAppointments: [
          {
            id: 2,
            barberName: 'Mike Styles',
            service: 'Classic Haircut',
            date: '2024-01-10T10:00:00',
            status: 'completed'
          }
        ],
        favoriteBarbers: [
          { id: 1, name: 'John Barber', rating: 4.8 },
          { id: 2, name: 'Mike Styles', rating: 4.9 }
        ]
      });
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomerData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const QuickAction = ({ title, icon, onPress, color = colors.primary }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={typography.heading}>Welcome Back!</Text>
        <Text style={typography.subtitle}>Ready for your next haircut?</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            title="Book Appointment"
            icon="calendar"
            onPress={() => navigation.navigate('BookAppointment')}
            color={colors.primary}
          />
          <QuickAction
            title="My Appointments"
            icon="list"
            onPress={() => navigation.navigate('MyAppointments')}
            color={colors.success}
          />
          <QuickAction
            title="Find Barbers"
            icon="cut"
            onPress={() => navigation.navigate('BarberList')}
            color={colors.info}
          />
          <QuickAction
            title="Services"
            icon="sparkles"
            onPress={() => navigation.navigate('Services')}
            color={colors.warning}
          />
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyAppointments')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {userData.upcomingAppointments.length > 0 ? (
          userData.upcomingAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentService}>{appointment.service}</Text>
                <Text style={styles.appointmentBarber}>with {appointment.barberName}</Text>
                <Text style={styles.appointmentTime}>
                  {new Date(appointment.date).toLocaleString()}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: colors.success }
              ]}>
                <Text style={styles.statusText}>UPCOMING</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <TouchableOpacity 
              style={styles.bookNowButton}
              onPress={() => navigation.navigate('BookAppointment')}
            >
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Favorite Barbers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Barbers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.barbersList}>
            {userData.favoriteBarbers.map((barber) => (
              <TouchableOpacity key={barber.id} style={styles.barberCard}>
                <View style={styles.barberAvatar}>
                  <Text style={styles.barberInitial}>
                    {barber.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.barberName}>{barber.name}</Text>
                <View style={styles.rating}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text style={styles.ratingText}>{barber.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.addBarberCard}
              onPress={() => navigation.navigate('BarberList')}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
              <Text style={styles.addBarberText}>Find More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    fontWeight: 'bold',
  },
  seeAllText: {
    ...typography.body,
    color: colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    ...typography.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentService: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appointmentBarber: {
    ...typography.small,
    color: colors.textLight,
    marginBottom: 4,
  },
  appointmentTime: {
    ...typography.small,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  bookNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  bookNowText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  barbersList: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  barberCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    width: 120,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  barberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  barberInitial: {
    ...typography.title,
    color: colors.white,
    fontWeight: 'bold',
  },
  barberName: {
    ...typography.body,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.small,
    marginLeft: 4,
    color: colors.textLight,
  },
  addBarberCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
    padding: spacing.lg,
    borderRadius: 12,
    width: 120,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addBarberText: {
    ...typography.small,
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: 'bold',
  },
});

export default CustomerDashboard;