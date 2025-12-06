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
import { customerService } from '../../services/customerService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const BarberList = ({ navigation }) => {
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    filterBarbers();
  }, [searchQuery, selectedSpecialty, barbers]);

  const loadBarbers = async () => {
    try {
      // Mock data
      const barberData = [
        {
          id: 1,
          name: 'John Barber',
          specialty: 'Classic Cuts',
          rating: 4.8,
          reviewCount: 127,
          experience: '5 years',
          image: null,
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
          image: null,
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
          image: null,
          services: ['Beard Trim', 'Royal Shave', 'Mustache'],
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        {
          id: 4,
          name: 'Alex Razor',
          specialty: 'Premium Services',
          rating: 4.9,
          reviewCount: 156,
          experience: '8 years',
          image: null,
          services: ['Hair Treatment', 'Facial', 'Massage'],
          availability: ['Wed', 'Thu', 'Sat']
        }
      ];
      setBarbers(barberData);
      setFilteredBarbers(barberData);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
  };

  const filterBarbers = () => {
    let filtered = barbers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(barber =>
        barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        barber.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(barber => barber.specialty === selectedSpecialty);
    }

    setFilteredBarbers(filtered);
  };

  const specialties = ['all', 'Classic Cuts', 'Modern Styles', 'Beard Grooming', 'Premium Services'];

  const SpecialtyFilter = ({ specialty }) => (
    <TouchableOpacity
      style={[
        styles.specialtyButton,
        selectedSpecialty === specialty && styles.activeSpecialty
      ]}
      onPress={() => setSelectedSpecialty(specialty)}
    >
      <Text style={[
        styles.specialtyText,
        selectedSpecialty === specialty && styles.activeSpecialtyText
      ]}>
        {specialty === 'all' ? 'All' : specialty}
      </Text>
    </TouchableOpacity>
  );

  const BarberCard = ({ barber }) => (
    <TouchableOpacity 
      style={styles.barberCard}
      onPress={() => navigation.navigate('BookAppointment', { selectedBarber: barber })}
    >
      <View style={styles.barberHeader}>
        <View style={styles.barberAvatar}>
          <Text style={styles.barberInitial}>{barber.name.charAt(0)}</Text>
        </View>
        <View style={styles.barberInfo}>
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{barber.rating}</Text>
            <Text style={styles.reviewCount}>({barber.reviewCount} reviews)</Text>
          </View>
        </View>
        <View style={styles.experienceBadge}>
          <Text style={styles.experienceText}>{barber.experience}</Text>
        </View>
      </View>

      <View style={styles.servicesSection}>
        <Text style={styles.sectionLabel}>Services</Text>
        <View style={styles.servicesList}>
          {barber.services.slice(0, 3).map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
          {barber.services.length > 3 && (
            <View style={styles.moreTag}>
              <Text style={styles.moreText}>+{barber.services.length - 3} more</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.availabilitySection}>
        <Text style={styles.sectionLabel}>Available</Text>
        <View style={styles.availabilityList}>
          {barber.availability.map((day, index) => (
            <View key={index} style={styles.dayTag}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookAppointment', { selectedBarber: barber })}
      >
        <Ionicons name="calendar" size={16} color={colors.white} />
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={typography.heading}>Our Barbers</Text>
        <Text style={typography.subtitle}>Choose your preferred professional</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search barbers by name or specialty..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Specialty Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {specialties.map((specialty) => (
          <SpecialtyFilter key={specialty} specialty={specialty} />
        ))}
      </ScrollView>

      {/* Barbers List */}
      <ScrollView style={styles.barbersList}>
        {filteredBarbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
        
        {filteredBarbers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyStateTitle}>No barbers found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    ...typography.body,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  specialtyButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    marginRight: spacing.sm,
  },
  activeSpecialty: {
    backgroundColor: colors.primary,
  },
  specialtyText: {
    ...typography.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  activeSpecialtyText: {
    color: colors.white,
  },
  barbersList: {
    flex: 1,
    padding: spacing.md,
  },
  barberCard: {
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
  barberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  barberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  barberInitial: {
    ...typography.title,
    color: colors.white,
    fontWeight: 'bold',
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    ...typography.title,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  barberSpecialty: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.small,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  reviewCount: {
    ...typography.small,
    color: colors.textLight,
  },
  experienceBadge: {
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  experienceText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  servicesSection: {
    marginBottom: spacing.lg,
  },
  availabilitySection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
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
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  serviceText: {
    ...typography.small,
    color: colors.text,
  },
  moreTag: {
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  moreText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  availabilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dayTag: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  dayText: {
    ...typography.small,
    color: colors.success,
    fontWeight: 'bold',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
  },
  bookButtonText: {
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

export default BarberList;