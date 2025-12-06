import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
  Alert
} from 'react-native';
import * as Location from 'expo-location'; // Add this import

// FIX: Import from specific service files
import { customerService } from '../../services/customerService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const CustomerDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState({
    upcomingAppointments: [],
    recentAppointments: [],
    favoriteBarbers: []
  });
  const [barbershops, setBarbershops] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBarbershop, setSelectedBarbershop] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.5995, // Default to Philippines coordinates
    longitude: 120.9842,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'map'
  const [userLocation, setUserLocation] = useState(null); // Store user location separately

  // Add this function to request location permission
  const requestLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');
      
      // First, check if permission is already granted
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Request permission if not granted
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }
      
      if (status === 'granted') {
        console.log('Location permission granted');
        
        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000, // 15 seconds timeout
        });
        
        console.log('Got location:', location.coords);
        
        // Set user location state
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // Update map region to user's location
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        
        return true;
      } else {
        console.log('Location permission denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to find nearby barbershops and get accurate directions.',
          [
            {
              text: 'OK',
              style: 'default',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Using default location.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

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

      // Load barbershops with location data
      const shops = await loadBarbershops();
      setBarbershops(shops);
      
      // Center map on user's location if available, otherwise first barbershop
      if (userLocation) {
        setMapRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else if (shops.length > 0) {
        setMapRegion({
          latitude: shops[0].location.latitude,
          longitude: shops[0].location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setSelectedBarbershop(shops[0]);
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  };

  const loadBarbershops = async () => {
    // Mock barbershops data with locations
    // Calculate distances if user location is available
    const mockShops = [
      {
        id: 1,
        name: "GWAPITOS Premium Barbershop",
        address: "123 Main Street, Makati City",
        rating: 4.8,
        openHours: "9:00 AM - 9:00 PM",
        phone: "(02) 8123-4567",
        services: ["Haircut", "Beard Trim", "Shave"],
        location: {
          latitude: 14.5547,
          longitude: 121.0244,
        },
        barbers: 5,
        distance: "0.5 km",
      },
      {
        id: 2,
        name: "Classic Cuts Barbershop",
        address: "456 Ayala Avenue, Makati",
        rating: 4.5,
        openHours: "8:00 AM - 8:00 PM",
        phone: "(02) 8765-4321",
        services: ["Haircut", "Coloring", "Styling"],
        location: {
          latitude: 14.5500,
          longitude: 121.0150,
        },
        barbers: 3,
        distance: "1.2 km",
      },
      {
        id: 3,
        name: "Modern Gents Salon",
        address: "789 BGC High Street, Taguig",
        rating: 4.9,
        openHours: "10:00 AM - 10:00 PM",
        phone: "(02) 8989-0000",
        services: ["Premium Cut", "Facial", "Massage"],
        location: {
          latitude: 14.5489,
          longitude: 121.0502,
        },
        barbers: 8,
        distance: "2.5 km",
      },
      {
        id: 4,
        name: "Traditional Barbershop",
        address: "101 Shaw Boulevard, Mandaluyong",
        rating: 4.3,
        openHours: "7:00 AM - 7:00 PM",
        phone: "(02) 8234-5678",
        services: ["Classic Cut", "Shave", "Beard Care"],
        location: {
          latitude: 14.5866,
          longitude: 121.0314,
        },
        barbers: 4,
        distance: "3.1 km",
      },
    ];

    // If user location is available, calculate actual distances
    if (userLocation) {
      return mockShops.map(shop => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          shop.location.latitude,
          shop.location.longitude
        );
        return {
          ...shop,
          distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
        };
      }).sort((a, b) => {
        // Sort by distance
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      });
    }

    return mockShops;
  };

  // Helper function to calculate distance between coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomerData();
    setRefreshing(false);
  };

  // Update the useEffect to include location permission request
  useEffect(() => {
    const initialize = async () => {
      await requestLocationPermission();
      await loadCustomerData();
    };
    initialize();
  }, []);

  // Update generateStaticMapUrl to use userLocation if available
  const generateStaticMapUrl = (latitude, longitude, shops = []) => {
    // Use your Google Static Maps API key here
    const API_KEY = 'AIzaSyBHilje9RsUWI-eJlr0Md9mBNGSgDPPWJ4'; // Replace with your actual key
    const center = `${latitude},${longitude}`;
    
    // Create markers for all barbershops
    let markers = '';
    if (shops.length > 0) {
      markers = shops.map(shop => 
        `color:red%7Clabel:B%7C${shop.location.latitude},${shop.location.longitude}`
      ).join('&markers=');
      markers = `&markers=${markers}`;
    }
    
    // Add user location marker if available
    let userMarker = '';
    if (userLocation) {
      userMarker = `&markers=color:blue%7Clabel:Y%7C${userLocation.latitude},${userLocation.longitude}`;
    }
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=13&size=600x300&maptype=roadmap&scale=2${markers}${userMarker}&key=${API_KEY}`;
  };

  const handleOpenGoogleMaps = (latitude, longitude, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
    Linking.openURL(url).catch(err => console.error('Failed to open maps:', err));
  };

  const handleOpenDirections = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url).catch(err => console.error('Failed to open directions:', err));
  };

  const handleBarbershopSelect = (shop) => {
    setSelectedBarbershop(shop);
    setMapRegion({
      latitude: shop.location.latitude,
      longitude: shop.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Add a function to refresh location
  const refreshLocation = async () => {
    const success = await requestLocationPermission();
    if (success) {
      await loadCustomerData();
    }
  };

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

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'quick' && styles.activeTab]}
          onPress={() => setActiveTab('quick')}
        >
          <Ionicons name="flash" size={20} color={activeTab === 'quick' ? colors.white : colors.primary} />
          <Text style={[styles.tabText, activeTab === 'quick' && styles.activeTabText]}>Quick Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Ionicons name="map" size={20} color={activeTab === 'map' ? colors.white : colors.primary} />
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>Find Barbershops</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {activeTab === 'map' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Find Nearby Barbershops</Text>
            <Text style={styles.sectionSubtitle}>
              {userLocation ? 'Using your current location' : 'Enable location for accurate distances'}
              {userLocation && (
                <TouchableOpacity onPress={refreshLocation} style={styles.locationRefreshButton}>
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                  <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>

          {/* Static Map Image */}
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: generateStaticMapUrl(mapRegion.latitude, mapRegion.longitude, barbershops) }}
              style={styles.staticMap}
              resizeMode="cover"
              onError={(error) => console.log('Failed to load map image:', error)}
            />
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>
                {userLocation ? 'Your location is marked in blue' : 'Enable location services to see your position'}
              </Text>
            </View>
          </View>

          {/* Location Status */}
          {!userLocation && (
            <TouchableOpacity 
              style={styles.enableLocationButton}
              onPress={requestLocationPermission}
            >
              <Ionicons name="location" size={20} color={colors.white} />
              <Text style={styles.enableLocationText}>Enable Location Services</Text>
            </TouchableOpacity>
          )}

          {/* Selected Barbershop Details */}
          {selectedBarbershop && (
            <View style={styles.barbershopCard}>
              <View style={styles.barbershopHeader}>
                <Text style={styles.barbershopName}>{selectedBarbershop.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text style={styles.ratingText}>{selectedBarbershop.rating}</Text>
                </View>
              </View>
              
              <View style={styles.barbershopDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>{selectedBarbershop.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>{selectedBarbershop.openHours}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>{selectedBarbershop.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>{selectedBarbershop.barbers} barbers available</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name={userLocation ? "walk" : "location-outline"} size={16} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {userLocation ? selectedBarbershop.distance + ' away' : 'Enable location for distance'}
                  </Text>
                </View>
              </View>

              <View style={styles.servicesSection}>
                <Text style={styles.servicesLabel}>Services:</Text>
                <View style={styles.servicesList}>
                  {selectedBarbershop.services.map((service, index) => (
                    <View key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Map Action Buttons */}
              <View style={styles.mapButtons}>
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={() => handleOpenGoogleMaps(
                    selectedBarbershop.location.latitude,
                    selectedBarbershop.location.longitude,
                    selectedBarbershop.name
                  )}
                >
                  <Ionicons name="map" size={20} color={colors.white} />
                  <Text style={styles.mapButtonText}>View on Maps</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.mapButton, styles.directionsButton]}
                  onPress={() => handleOpenDirections(
                    selectedBarbershop.location.latitude,
                    selectedBarbershop.location.longitude
                  )}
                >
                  <Ionicons name="navigate" size={20} color={colors.white} />
                  <Text style={styles.mapButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.viewBarbersButton}
                onPress={() => navigation.navigate('BarberList', { barbershopId: selectedBarbershop.id })}
              >
                <Ionicons name="people" size={20} color={colors.white} />
                <Text style={styles.viewBarbersText}>View Barbers</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* All Barbershops List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {userLocation ? 'Nearby Barbershops' : 'All Barbershops'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.barbershopsList}>
                {barbershops.map((shop) => (
                  <TouchableOpacity 
                    key={shop.id} 
                    style={[
                      styles.barbershopItem,
                      selectedBarbershop?.id === shop.id && styles.selectedBarbershopItem
                    ]}
                    onPress={() => handleBarbershopSelect(shop)}
                  >
                    <View style={styles.barbershopItemHeader}>
                      <View style={styles.barbershopAvatar}>
                        <Ionicons name="business" size={20} color={colors.white} />
                      </View>
                      <Text style={styles.barbershopItemName}>{shop.name}</Text>
                    </View>
                    <View style={styles.barbershopItemDetails}>
                      <View style={styles.barbershopItemDetail}>
                        <Ionicons name="star" size={12} color={colors.warning} />
                        <Text style={styles.barbershopItemText}>{shop.rating}</Text>
                      </View>
                      <View style={styles.barbershopItemDetail}>
                        <Ionicons name="walk" size={12} color={colors.textLight} />
                        <Text style={styles.barbershopItemText}>{shop.distance}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.quickMapButton}
                      onPress={() => handleOpenGoogleMaps(shop.location.latitude, shop.location.longitude, shop.name)}
                    >
                      <Ionicons name="open-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}

      {/* Quick Actions View */}
      {activeTab === 'quick' && (
        <>
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
                title="Find Shops"
                icon="map"
                onPress={() => setActiveTab('map')}
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
        </>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.small,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
    color: colors.text,
  },
  activeTabText: {
    color: colors.white,
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
  sectionSubtitle: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  refreshText: {
    ...typography.small,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  enableLocationButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableLocationText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  seeAllText: {
    ...typography.body,
    color: colors.primary,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  staticMap: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.sm,
  },
  mapOverlayText: {
    color: colors.white,
    textAlign: 'center',
    ...typography.small,
  },
  barbershopCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  barbershopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  barbershopName: {
    ...typography.title,
    fontWeight: 'bold',
    flex: 1,
    marginRight: spacing.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  ratingText: {
    ...typography.small,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  barbershopDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.small,
    marginLeft: spacing.sm,
    color: colors.text,
  },
  servicesSection: {
    marginBottom: spacing.lg,
  },
  servicesLabel: {
    ...typography.small,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  serviceTag: {
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  serviceText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  mapButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
  },
  directionsButton: {
    backgroundColor: colors.success,
  },
  mapButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  viewBarbersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.info,
    padding: spacing.md,
    borderRadius: 8,
  },
  viewBarbersText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  barbershopsList: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  barbershopItem: {
    width: 160,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedBarbershopItem: {
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary,
  },
  barbershopItemHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  barbershopAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  barbershopItemName: {
    ...typography.small,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  barbershopItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  barbershopItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barbershopItemText: {
    ...typography.small,
    marginLeft: spacing.xs,
    color: colors.textLight,
  },
  quickMapButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    padding: spacing.xs,
  },
  // Existing styles from original component
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