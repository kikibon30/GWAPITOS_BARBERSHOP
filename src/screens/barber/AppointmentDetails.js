import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { globalStyles, colors } from '../../styles';
import { barberService } from '../../services/barberService';
import { APPOINTMENT_STATUS, STATUS_LABELS, STATUS_COLORS } from '../../constants/appointmentStatus';
import { formatDate, formatTime } from '../../utils/dateTime';

const AppointmentDetails = ({ route, navigation }) => {
  const { appointment } = route.params;
  const [currentAppointment, setCurrentAppointment] = useState(appointment);
  const [notes, setNotes] = useState(appointment.notes || '');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      const { data, error } = await barberService.updateAppointmentStatus(
        currentAppointment.id,
        newStatus
      );
      
      if (error) throw error;
      
      setCurrentAppointment(prev => ({ ...prev, status: newStatus }));
      Alert.alert('Success', `Appointment marked as ${STATUS_LABELS[newStatus]}`);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await barberService.addAppointmentNotes(
        currentAppointment.id,
        notes
      );
      
      if (error) throw error;
      
      setCurrentAppointment(prev => ({ ...prev, notes }));
      setShowNotesModal(false);
      Alert.alert('Success', 'Notes saved successfully');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save notes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || colors.gray;
  };

  const renderStatusButton = (status, label, color) => {
    const isCurrent = currentAppointment.status === status;
    return (
      <TouchableOpacity
        style={[
          styles.statusButton,
          { backgroundColor: color },
          isCurrent && styles.currentStatus,
        ]}
        onPress={() => handleStatusUpdate(status)}
        disabled={loading || isCurrent}
      >
        <Text style={styles.statusButtonText}>
          {isCurrent ? '✓ ' : ''}{label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Appointment Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.customerName}>
            {currentAppointment.customer_name || 'Customer'}
          </Text>
          <Text style={styles.appointmentId}>
            Appointment #{currentAppointment.id?.slice(-8) || 'N/A'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(currentAppointment.status) }
        ]}>
          <Text style={styles.statusText}>
            {STATUS_LABELS[currentAppointment.status]}
          </Text>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {formatDate(currentAppointment.appointment_date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>
            {formatTime(currentAppointment.appointment_time)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service:</Text>
          <Text style={styles.detailValue}>
            {currentAppointment.service_name || 'Haircut'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {currentAppointment.duration || '30'} minutes
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={[styles.detailValue, styles.price]}>
            ${currentAppointment.price || '25'}
          </Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>
            {currentAppointment.customer_name || 'Not specified'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>
            {currentAppointment.customer_phone || 'Not specified'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>
            {currentAppointment.customer_email || 'Not specified'}
          </Text>
        </View>
      </View>

      {/* Appointment Notes */}
      <View style={styles.detailsCard}>
        <View style={styles.notesHeader}>
          <Text style={styles.sectionTitle}>Appointment Notes</Text>
          <TouchableOpacity onPress={() => setShowNotesModal(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        {currentAppointment.notes ? (
          <Text style={styles.notesText}>{currentAppointment.notes}</Text>
        ) : (
          <Text style={styles.noNotesText}>No notes added yet</Text>
        )}
      </View>

      {/* Status Update Buttons */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusGrid}>
          {renderStatusButton('confirmed', 'Confirm', colors.success)}
          {renderStatusButton('in_progress', 'Start', colors.warning)}
          {renderStatusButton('completed', 'Complete', colors.primary)}
          {renderStatusButton('cancelled', 'Cancel', colors.danger)}
          {renderStatusButton('no_show', 'No Show', colors.purple)}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            // Call customer functionality
            Alert.alert('Call Customer', `Would you like to call ${currentAppointment.customer_phone}?`);
          }}
        >
          <Text style={styles.secondaryButtonText}>Call Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Appointment Notes</Text>
            
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={6}
              placeholder="Add notes about this appointment..."
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveNotes}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save Notes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  appointmentId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  price: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  notesText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  noNotesText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  statusSection: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
  },
  currentStatus: {
    opacity: 0.7,
  },
  statusButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    padding: 20,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default AppointmentDetails;