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
import { scheduleService } from '../../services/scheduleService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
// Remove this import or use a different date picker
// import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    scheduled_date: new Date(),
    status: 'pending',
    notes: ''
  });

  const loadSchedules = async () => {
    try {
      const data = await scheduleService.getAllSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
      Alert.alert('Error', 'Failed to load schedules');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedules();
    setRefreshing(false);
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      scheduled_date: new Date(schedule.scheduled_date),
      status: schedule.status,
      notes: schedule.notes || ''
    });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await scheduleService.updateSchedule(editingSchedule.id, formData);
      await loadSchedules();
      setModalVisible(false);
      setEditingSchedule(null);
      Alert.alert('Success', 'Schedule updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update schedule');
    }
  };

  const handleDelete = (schedule) => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await scheduleService.deleteSchedule(schedule.id);
              await loadSchedules();
              Alert.alert('Success', 'Schedule deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete schedule');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.error;
      case 'completed': return colors.info;
      default: return colors.textLight;
    }
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={typography.heading}>Schedule Management</Text>
          <Text style={typography.subtitle}>
            Manage all appointments and schedules
          </Text>
        </View>

        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.customerName}>
                {schedule.customers?.name || 'Unknown Customer'}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => handleEdit(schedule)}
                  style={styles.actionButton}
                >
                  <Ionicons name="create" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDelete(schedule)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.scheduleDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="cut" size={16} color={colors.textLight} />
                <Text style={styles.detailText}>
                  {schedule.services?.name} (${schedule.services?.price})
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color={colors.textLight} />
                <Text style={styles.detailText}>
                  Barber: {schedule.barbers?.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time" size={16} color={colors.textLight} />
                <Text style={styles.detailText}>
                  {new Date(schedule.scheduled_date).toLocaleString()}
                </Text>
              </View>

              {schedule.notes && (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>{schedule.notes}</Text>
                </View>
              )}
            </View>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
              <Text style={styles.statusText}>
                {schedule.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Schedule</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date & Time</Text>
              <DateTimePicker
                value={formData.scheduled_date}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  if (date) {
                    setFormData({ ...formData, scheduled_date: date });
                  }
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusOptions}>
                {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      formData.status === status && { backgroundColor: getStatusColor(status) }
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      formData.status === status && { color: colors.white }
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.textInput}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Add notes..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  scheduleCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  customerName: {
    ...typography.title,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  scheduleDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.body,
    marginLeft: spacing.sm,
    color: colors.textLight,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.title,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusOptionText: {
    ...typography.small,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default ScheduleManagement;