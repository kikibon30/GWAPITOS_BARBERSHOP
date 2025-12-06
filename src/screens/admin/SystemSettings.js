import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  StyleSheet
} from 'react-native';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Business Settings
    businessName: 'Barbershop Pro',
    businessHours: {
      open: '09:00',
      close: '20:00'
    },
    slotDuration: 30,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    reminderNotifications: true,
    
    // System Settings
    autoConfirmAppointments: false,
    allowCancellations: true,
    cancellationNotice: 2, // hours
    maxDailyAppointments: 20
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you'd save to your backend
    Alert.alert('Success', 'Settings saved successfully');
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ToggleSetting = ({ label, value, onValueChange, description }) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && (
          <Text style={styles.toggleDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.lightGray, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );

  const InputSetting = ({ label, value, onChangeText, keyboardType = 'default', unit }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={value.toString()}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        {unit && <Text style={styles.inputUnit}>{unit}</Text>}
      </View>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={typography.heading}>System Settings</Text>
        <Text style={typography.subtitle}>
          Configure your barbershop system
        </Text>
      </View>

      {/* Business Settings */}
      <SettingSection title="Business Settings">
        <InputSetting
          label="Business Name"
          value={settings.businessName}
          onChangeText={(text) => updateSetting('businessName', text)}
        />

        <View style={styles.timeContainer}>
          <Text style={styles.inputLabel}>Business Hours</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Open</Text>
              <TextInput
                style={styles.textInput}
                value={settings.businessHours.open}
                onChangeText={(text) => updateSetting('businessHours', {
                  ...settings.businessHours,
                  open: text
                })}
              />
            </View>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Close</Text>
              <TextInput
                style={styles.textInput}
                value={settings.businessHours.close}
                onChangeText={(text) => updateSetting('businessHours', {
                  ...settings.businessHours,
                  close: text
                })}
              />
            </View>
          </View>
        </View>

        <InputSetting
          label="Appointment Slot Duration"
          value={settings.slotDuration}
          onChangeText={(text) => updateSetting('slotDuration', parseInt(text) || 30)}
          keyboardType="numeric"
          unit="minutes"
        />

        <InputSetting
          label="Max Daily Appointments"
          value={settings.maxDailyAppointments}
          onChangeText={(text) => updateSetting('maxDailyAppointments', parseInt(text) || 20)}
          keyboardType="numeric"
          unit="appointments"
        />
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection title="Notification Settings">
        <ToggleSetting
          label="Email Notifications"
          value={settings.emailNotifications}
          onValueChange={(value) => updateSetting('emailNotifications', value)}
          description="Send email notifications for appointments"
        />

        <ToggleSetting
          label="SMS Notifications"
          value={settings.smsNotifications}
          onValueChange={(value) => updateSetting('smsNotifications', value)}
          description="Send SMS notifications for appointments"
        />

        <ToggleSetting
          label="Reminder Notifications"
          value={settings.reminderNotifications}
          onValueChange={(value) => updateSetting('reminderNotifications', value)}
          description="Send reminder notifications before appointments"
        />
      </SettingSection>

      {/* System Settings */}
      <SettingSection title="System Settings">
        <ToggleSetting
          label="Auto-Confirm Appointments"
          value={settings.autoConfirmAppointments}
          onValueChange={(value) => updateSetting('autoConfirmAppointments', value)}
          description="Automatically confirm new appointments"
        />

        <ToggleSetting
          label="Allow Cancellations"
          value={settings.allowCancellations}
          onValueChange={(value) => updateSetting('allowCancellations', value)}
          description="Allow customers to cancel appointments"
        />

        <InputSetting
          label="Cancellation Notice"
          value={settings.cancellationNotice}
          onChangeText={(text) => updateSetting('cancellationNotice', parseInt(text) || 2)}
          keyboardType="numeric"
          unit="hours"
        />
      </SettingSection>

      {/* Save Button */}
      <View style={styles.saveSection}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save" size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
  sectionTitle: {
    ...typography.title,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleLabel: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    ...typography.small,
    color: colors.textLight,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body,
  },
  inputUnit: {
    ...typography.body,
    marginLeft: spacing.md,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  timeContainer: {
    marginBottom: spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    ...typography.small,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  saveSection: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  saveButton: {
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
  saveButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default SystemSettings;