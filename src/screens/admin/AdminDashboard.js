import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet
} from 'react-native';
// FIX: Import from specific service files
import { adminService } from '../../services/adminService';
import { scheduleService } from '../../services/scheduleService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    revenue: 0
  });
  const [recentSchedules, setRecentSchedules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd fetch this from your API
      setStats({
        totalUsers: 150,
        totalAppointments: 45,
        pendingAppointments: 12,
        revenue: 1250
      });

      const schedules = await scheduleService.getAllSchedules();
      setRecentSchedules(schedules.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={typography.heading}>Admin Dashboard</Text>
        <Text style={typography.subtitle}>Welcome back, Administrator</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="people"
          color={colors.primary}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.totalAppointments}
          icon="calendar"
          color={colors.success}
        />
        <StatCard
          title="Pending"
          value={stats.pendingAppointments}
          icon="time"
          color={colors.warning}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue}`}
          icon="cash"
          color={colors.info}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('ScheduleManagement')}
          >
            <Ionicons name="calendar" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Manage Schedules</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Ionicons name="people" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('SystemSettings')}
          >
            <Ionicons name="settings" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Ionicons name="bar-chart" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Schedules */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ScheduleManagement')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentSchedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleItem}>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleCustomer}>
                {schedule.customers?.name || 'Unknown Customer'}
              </Text>
              <Text style={styles.scheduleService}>
                {schedule.services?.name} with {schedule.barbers?.name}
              </Text>
              <Text style={styles.scheduleTime}>
                {new Date(schedule.scheduled_date).toLocaleString()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: schedule.status === 'confirmed' ? colors.success : colors.warning }
            ]}>
              <Text style={styles.statusText}>
                {schedule.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.largeTitle,
    fontWeight: 'bold',
  },
  statTitle: {
    ...typography.body,
    color: colors.textLight,
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
  actionCard: {
    width: '48%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  scheduleItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleCustomer: {
    ...typography.body,
    fontWeight: 'bold',
  },
  scheduleService: {
    ...typography.small,
    color: colors.textLight,
    marginVertical: 2,
  },
  scheduleTime: {
    ...typography.small,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default AdminDashboard;