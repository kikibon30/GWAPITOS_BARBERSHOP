import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { STATUS_COLORS, STATUS_LABELS } from '../constants/appointmentStatus';
import { formatTime } from '../utils/dateTime';
import { globalStyles, colors } from '../styles';

const AppointmentCard = ({ appointment, onPress }) => {
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || colors.gray;
  };

  return (
    <TouchableOpacity 
      style={[globalStyles.card, styles.card]} 
      onPress={() => onPress(appointment)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.customerName}>
          {appointment.customer_name || 'Customer'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {STATUS_LABELS[appointment.status] || appointment.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {formatTime(appointment.appointment_time)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Service:</Text>
          <Text style={styles.value}>
            {appointment.service_name || 'Haircut'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>
            {appointment.duration || '30'} mins
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={[styles.value, styles.price]}>
            ${appointment.price || '25'}
          </Text>
        </View>
      </View>
      
      {appointment.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{appointment.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
});

export default AppointmentCard;