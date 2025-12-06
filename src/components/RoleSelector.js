import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

const RoleSelector = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    { id: 'customer', title: 'Customer', description: 'Book appointments' },
    { id: 'barber', title: 'Barber', description: 'Manage appointments' },
    { id: 'admin', title: 'Admin', description: 'Manage barbershop' },
  ];

  return (
    <View style={styles.container}>
      {roles.map((role) => (
        <TouchableOpacity
          key={role.id}
          style={[
            styles.roleCard,
            selectedRole === role.id && styles.selectedRoleCard,
          ]}
          onPress={() => onRoleSelect(role.id)}
        >
          <View style={styles.roleContent}>
            <Text style={[
              styles.roleTitle,
              selectedRole === role.id && styles.selectedRoleTitle
            ]}>
              {role.title}
            </Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </View>
          <View style={[
            styles.radioOuter,
            selectedRole === role.id && styles.radioOuterSelected
          ]}>
            {selectedRole === role.id && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    borderColor: colors.secondary,
    backgroundColor: '#fffbf0',
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  selectedRoleTitle: {
    color: colors.secondary,
  },
  roleDescription: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.secondary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
  },
});

export default RoleSelector;