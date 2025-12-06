import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { barberService } from '../../services/barberService';
import { globalStyles, colors } from '../../styles';
import { formatDate } from '../../utils/dateTime';

const { width } = Dimensions.get('window');

const Earnings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    completedCount: 0,
    appointments: [],
  });
  const [statistics, setStatistics] = useState({
    averageEarnings: 0,
    highestEarning: 0,
    totalTips: 0,
  });

  useEffect(() => {
    loadEarnings();
  }, [timeRange]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const barberId = user?.id;
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Load earnings data
      const { data, error } = await barberService.getBarberEarnings(
        barberId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      if (error) throw error;
      
      setEarnings(data || { totalEarnings: 0, completedCount: 0, appointments: [] });
      
      // Calculate statistics
      if (data?.appointments) {
        const totalEarnings = data.totalEarnings;
        const appointmentCount = data.completedCount;
        const averageEarnings = appointmentCount > 0 ? totalEarnings / appointmentCount : 0;
        const highestEarning = Math.max(...data.appointments.map(a => a.price || 0));
        
        setStatistics({
          averageEarnings,
          highestEarning,
          totalTips: totalEarnings * 0.15, // Assuming 15% tips
        });
      }
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load earnings data');
      console.error('Load earnings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Last Year';
      default: return 'Last 7 Days';
    }
  };

  const renderStatCard = (title, value, subtitle, color = colors.primary) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>${value.toFixed(2)}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderAppointmentRow = (appointment, index) => (
    <View key={index} style={styles.appointmentRow}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentDate}>
          {formatDate(appointment.appointment_date)}
        </Text>
        <Text style={styles.appointmentService}>
          {appointment.service_name || 'Service'}
        </Text>
      </View>
      <Text style={styles.appointmentAmount}>${appointment.price || 0}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading earnings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        <Text style={styles.timeRangeLabel}>{getTimeRangeLabel()}</Text>
        <View style={styles.timeRangeButtons}>
          {['week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeButtonText,
                  timeRange === range && styles.timeRangeButtonTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Earnings Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Total Earnings</Text>
        <Text style={styles.overviewAmount}>${earnings.totalEarnings.toFixed(2)}</Text>
        <Text style={styles.overviewSubtitle}>
          From {earnings.completedCount} completed appointments
        </Text>
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        {renderStatCard(
          'Average per Appointment',
          statistics.averageEarnings,
          `Based on ${earnings.completedCount} appointments`,
          colors.success
        )}
        {renderStatCard(
          'Highest Earning',
          statistics.highestEarning,
          'Single appointment',
          colors.warning
        )}
        {renderStatCard(
          'Estimated Tips',
          statistics.totalTips,
          'Approx. 15% of total',
          colors.info
        )}
        {renderStatCard(
          'Net Income',
          earnings.totalEarnings * 0.7, // Assuming 30% commission
          'After commission',
          colors.purple
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {earnings.appointments.length > 0 ? (
          earnings.appointments.slice(0, 5).map((appointment, index) =>
            renderAppointmentRow(appointment, index)
          )
        ) : (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No transactions in this period</Text>
            <Text style={styles.emptySubtext}>
              Completed appointments will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsCard}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Appointment Completion Rate:</Text>
          <Text style={styles.metricValue}>95%</Text>
        </View>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Customer Satisfaction:</Text>
          <Text style={styles.metricValue}>4.8/5</Text>
        </View>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Repeat Customers:</Text>
          <Text style={styles.metricValue}>65%</Text>
        </View>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Average Service Time:</Text>
          <Text style={styles.metricValue}>42 mins</Text>
        </View>
      </View>

      {/* Tips for Increasing Earnings */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💰 Tips to Increase Earnings</Text>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🎯</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipHeading}>Upsell Services</Text>
            <Text style={styles.tipText}>
              Suggest add-ons like beard grooming or hair treatments
            </Text>
          </View>
        </View>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>👥</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipHeading}>Build Loyalty</Text>
            <Text style={styles.tipText}>
              Loyal customers bring 65% more revenue through repeat business
            </Text>
          </View>
        </View>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>⭐</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipHeading}>Maintain High Ratings</Text>
            <Text style={styles.tipText}>
              Higher ratings lead to more bookings and premium pricing
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timeRangeSelector: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 10,
  },
  timeRangeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  timeRangeButtonTextActive: {
    color: colors.white,
  },
  overviewCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  overviewTitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 10,
  },
  overviewAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 5,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
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
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    margin: 5,
    ...globalStyles.shadow,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 3,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  transactionsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
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
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  appointmentAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metricsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  tipsCard: {
    backgroundColor: colors.infoLight,
    marginHorizontal: 15,
    marginVertical: 10,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.info,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default Earnings;