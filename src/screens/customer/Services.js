import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { customerService } from '../../services/customerService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const Services = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // Mock data
      const servicesData = [
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
        },
        {
          id: 4,
          name: 'Beard Trim & Shape',
          category: 'beard',
          duration: 20,
          price: 15,
          description: 'Professional beard trimming and shaping',
          popular: false
        },
        {
          id: 5,
          name: 'Hair Coloring',
          category: 'color',
          duration: 60,
          price: 50,
          description: 'Professional hair coloring service',
          popular: false
        },
        {
          id: 6,
          name: 'Kids Haircut',
          category: 'hair',
          duration: 25,
          price: 18,
          description: 'Special haircut service for children',
          popular: false
        },
        {
          id: 7,
          name: 'Premium Package',
          category: 'combo',
          duration: 90,
          price: 65,
          description: 'Complete grooming experience with haircut, shave, and facial massage',
          popular: true
        },
        {
          id: 8,
          name: 'Mustache Trim',
          category: 'beard',
          duration: 15,
          price: 10,
          description: 'Professional mustache grooming and styling',
          popular: false
        }
      ];
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Services', icon: 'apps' },
    { id: 'hair', name: 'Hair', icon: 'cut' },
    { id: 'beard', name: 'Beard', icon: 'accessibility' },
    { id: 'shave', name: 'Shave', icon: 'water' },
    { id: 'color', name: 'Color', icon: 'color-palette' },
    { id: 'combo', name: 'Combos', icon: 'git-merge' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.activeCategory
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? colors.white : colors.primary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.activeCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const ServiceCard = ({ service }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => navigation.navigate('BookAppointment', { selectedService: service })}
    >
      {service.popular && (
        <View style={styles.popularBadge}>
          <Ionicons name="flash" size={12} color={colors.white} />
          <Text style={styles.popularText}>POPULAR</Text>
        </View>
      )}
      
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>
        <View style={styles.servicePrice}>
          <Text style={styles.priceText}>${service.price}</Text>
          <Text style={styles.durationText}>{service.duration} min</Text>
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>
            {categories.find(cat => cat.id === service.category)?.name}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.bookServiceButton}
          onPress={() => navigation.navigate('BookAppointment', { selectedService: service })}
        >
          <Text style={styles.bookServiceText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={typography.heading}>Our Services</Text>
        <Text style={typography.subtitle}>Professional grooming services</Text>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView style={styles.servicesList}>
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 25,
    backgroundColor: colors.lightGray,
    marginRight: spacing.sm,
  },
  activeCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.small,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
    color: colors.text,
  },
  activeCategoryText: {
    color: colors.white,
  },
  servicesList: {
    flex: 1,
    padding: spacing.md,
  },
  serviceCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 10,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  serviceName: {
    ...typography.title,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  serviceDescription: {
    ...typography.small,
    color: colors.textLight,
    lineHeight: 18,
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    ...typography.largeTitle,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationText: {
    ...typography.small,
    color: colors.textLight,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  categoryTagText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  bookServiceButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  bookServiceText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default Services;