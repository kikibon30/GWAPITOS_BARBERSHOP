import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Button from '../../components/Button'; // CHANGED: from '../' to '../../'
import RoleSelector from '../../components/RoleSelector'; // CHANGED: from '../' to '../../'
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { globalStyles } from '../../styles/globalStyles';

// ... rest of the code remains the same

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Signup', { role: selectedRole });
    }
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you'll be using GWAPITOS
          </Text>
        </View>

        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleSelect={setSelectedRole} 
        />

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Why Choose GWAPITOS?</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <Text style={styles.featureText}>No more waiting in line</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✂️</Text>
            <Text style={styles.featureText}>Choose your preferred barber</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Easy booking from your phone</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          variant="primary"
        />
        <Button
          title="Back to Welcome"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  features: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});

export default RoleSelectionScreen;