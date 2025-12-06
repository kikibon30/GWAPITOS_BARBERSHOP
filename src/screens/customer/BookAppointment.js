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

const BookAppointment = () => {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Mock data
      setBarbers([
        { id: 1, name: 'John Barber', specialization: 'Classic Cuts', rating: 4.8 },
        { id: 2, name: 'Mike Styles', specialization: 'Modern Styles', rating: 4.9 },
        { id: 3, name: 'David Clipper', specialization: 'Beard Grooming', rating: 4.7 },
      ]);
      
      setServices([
        { id: 1, name: 'Classic Haircut', duration: 30, price: 25 },
        { id: 2, name: 'Haircut & Beard Trim', duration: 45, price: 35 },
        { id: 3, name: 'Royal Shave', duration: 30, price: 20 },
        { id: 4, name: 'Hair Coloring', duration: 60, price: 50 },
      ]);

      setAvailableSlots([
        '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedBarber || !selectedService || !selectedSlot) {
      Alert.alert('Error', 'Please select barber, service, and time slot');
      return;
    }

    try {
      const appointmentData = {
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedSlot,
        status: 'pending'
      };

      // await customerService.bookAppointment(appointmentData);
      Alert.alert(
        'Success',
        `Appointment booked with ${selectedBarber.name} for ${selectedService.name} at ${selectedSlot}`,
        [{ text: 'OK', onPress: () => console.log('Appointment booked') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  const BarberCard = ({ barber }) => (
    <TouchableOpacity
      style={[
        styles.barberCard,
        selectedBarber?.id === barber.id && styles.selectedCard
      ]}
      onPress={() => setSelectedBarber(barber)}
    >
      <View style={styles.barberInfo}>
        <View style={styles.barberAvatar}>
          <Text style={styles.barberInitial}>{barber.name.charAt(0)}</Text>
        </View>
        <View style={styles.barberDetails}>
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.barberSpecialty}>{barber.specialization}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{barber.rating}</Text>
          </View>
        </View>
      </View>
      {selectedBarber?.id === barber.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      )}
    </TouchableOpacity>
  );

  const ServiceCard = ({ service }) => (
    <TouchableOpacity
      style={[
        styles.serviceCard,
        selectedService?.id === service.id && styles.selectedCard
      ]}
      onPress={() => setSelectedService(service)}
    >
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDuration}>{service.duration} min</Text>
      </View>
      <View style={styles.servicePrice}>
        <Text style={styles.priceText}>${service.price}</Text>
        {selectedService?.id === service.id && (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={typography.heading}>Book Appointment</Text>
        <Text style={typography.subtitle}>Choose your barber and service</Text>
      </View>

      {/* Select Barber */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Barber</Text>
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </View>

      {/* Select Service */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </View>

      {/* Select Date */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
      </View>

      {/* Available Time Slots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.slotsGrid}>
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotButton,
                selectedSlot === slot && styles.selectedSlot
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[
                styles.slotText,
                selectedSlot === slot && styles.selectedSlotText
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Book Button */}
      <View style={styles.bookSection}>
        <TouchableOpacity 
          style={[
            styles.bookButton,
            (!selectedBarber || !selectedService || !selectedSlot) && styles.disabledButton
          ]}
          onPress={handleBookAppointment}
          disabled={!selectedBarber || !selectedService || !selectedSlot}
        >
          <Ionicons name="calendar" size={20} color={colors.white} />
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    ...typography.title,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  barberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary,
  },
  barberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  barberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  barberInitial: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  barberDetails: {
    flex: 1,
  },
  barberName: {
    ...typography.body,
    fontWeight: 'bold',
  },
  barberSpecialty: {
    ...typography.small,
    color: colors.textLight,
    marginVertical: 2,
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
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.body,
    fontWeight: 'bold',
  },
  serviceDuration: {
    ...typography.small,
    color: colors.textLight,
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  dateButtonText: {
    ...typography.body,
    marginLeft: spacing.md,
    fontWeight: 'bold',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slotButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedSlot: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  slotText: {
    ...typography.body,
    fontWeight: 'bold',
  },
  selectedSlotText: {
    color: colors.white,
  },
  bookSection: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  bookButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default BookAppointment;