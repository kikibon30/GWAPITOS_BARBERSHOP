import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const BarberDashboard = ({ navigation }) => {
  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={typography.heading}>Barber Dashboard</Text>
        <Text style={typography.subtitle}>Manage your appointments and services</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoon}>
          <Ionicons name="cut" size={64} color={colors.primary} />
          <Text style={styles.comingSoonText}>Barber Features Coming Soon</Text>
          <Text style={styles.comingSoonSubtext}>
            You can use customer features for now
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('CustomerDashboard')}
        >
          <Text style={styles.backButtonText}>Go to Customer Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  comingSoonText: {
    ...typography.title,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.white,
    ...typography.body,
    fontWeight: 'bold',
  },
});

export default BarberDashboard;