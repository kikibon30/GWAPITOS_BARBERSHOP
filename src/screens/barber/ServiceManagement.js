import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { barberService } from '../../services/barberService';
import { globalStyles, colors } from '../../styles';

const ServiceManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const barberId = user?.id;
      const { data, error } = await barberService.getBarberServices(barberId);
      
      if (error) throw error;
      setServices(data || []);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load services');
      console.error('Load services error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  const handleToggleService = async (serviceId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await barberService.updateServiceAvailability(serviceId, newStatus);
      
      if (error) throw error;
      
      // Update local state
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, is_available: newStatus }
          : service
      ));
      
      Alert.alert(
        'Success',
        `Service ${newStatus ? 'enabled' : 'disabled'} successfully`
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const calculateTotalRevenue = () => {
    return services.reduce((total, service) => {
      if (service.is_available && service.services?.price) {
        return total + service.services.price;
      }
      return total;
    }, 0);
  };

  const calculateAverageDuration = () => {
    const availableServices = services.filter(s => s.is_available);
    if (availableServices.length === 0) return 0;
    
    const totalDuration = availableServices.reduce((total, service) => {
      return total + (service.services?.duration || 0);
    }, 0);
    
    return Math.round(totalDuration / availableServices.length);
  };

  if (loading && !refreshing) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading services...</Text>
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
      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{services.length}</Text>
          <Text style={styles.statLabel}>Total Services</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {services.filter(s => s.is_available).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>${calculateTotalRevenue()}</Text>
          <Text style={styles.statLabel}>Total Price</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{calculateAverageDuration()}</Text>
          <Text style={styles.statLabel}>Avg. Minutes</Text>
        </View>
      </View>

      {/* Services List */}
      <View style={styles.servicesList}>
        <Text style={styles.sectionTitle}>My Services</Text>
        
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No services assigned yet</Text>
            <Text style={styles.emptySubtext}>
              Contact the admin to get services assigned to your profile.
            </Text>
          </View>
        ) : (
          services.map((service, index) => (
            <View key={service.id || index} style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>
                  {service.services?.name || 'Service'}
                </Text>
                <Text style={styles.serviceDescription}>
                  {service.services?.description || 'No description available'}
                </Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>
                      {service.services?.duration || '30'} mins
                    </Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>
                      ${service.services?.price || '25'}
                    </Text>
                  </View>
                  <View style={[
                    styles.detailBadge,
                    { backgroundColor: service.is_available ? colors.successLight : colors.dangerLight }
                  ]}>
                    <Text style={[
                      styles.detailText,
                      { color: service.is_available ? colors.success : colors.danger }
                    ]}>
                      {service.is_available ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.serviceActions}>
                <Switch
                  value={service.is_available}
                  onValueChange={() => handleToggleService(service.id, service.is_available)}
                  trackColor={{ false: colors.lightGray, true: colors.success }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          ))
        )}
      </View>

      {/* Service Statistics */}
      <View style={styles.statisticsCard}>
        <Text style={styles.sectionTitle}>Service Statistics</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Most Popular Service:</Text>
          <Text style={styles.statValue}>
            {services.length > 0 ? services[0]?.services?.name : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Highest Price:</Text>
          <Text style={styles.statValue}>
            ${Math.max(...services.map(s => s.services?.price || 0)) || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Longest Duration:</Text>
          <Text style={styles.statValue}>
            {Math.max(...services.map(s => s.services?.duration || 0)) || 'N/A'} mins
          </Text>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Tips for Service Management</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Keep your most popular services always available
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Disable services when you need a break or are fully booked
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Consider offering package deals for multiple services
          </Text>
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
  statsOverview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  servicesList: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    ...globalStyles.shadow,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  serviceActions: {
    justifyContent: 'center',
  },
  statisticsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipBullet: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default ServiceManagement;