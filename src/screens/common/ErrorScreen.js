import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ErrorScreen = ({ onRetry }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={80} color={colors.error} />
        </View>
        
        <Text style={styles.title}>Oops! Something went wrong</Text>
        
        <Text style={styles.subtitle}>
          We encountered an unexpected error. Please check your connection and try again.
        </Text>

        <View style={styles.suggestions}>
          <View style={styles.suggestionItem}>
            <Ionicons name="wifi" size={20} color={colors.text.secondary} />
            <Text style={styles.suggestionText}>Check your internet connection</Text>
          </View>
          <View style={styles.suggestionItem}>
            <Ionicons name="refresh" size={20} color={colors.text.secondary} />
            <Text style={styles.suggestionText}>Restart the application</Text>
          </View>
          <View style={styles.suggestionItem}>
            <Ionicons name="time" size={20} color={colors.text.secondary} />
            <Text style={styles.suggestionText}>Try again in a few moments</Text>
          </View>
        </View>

        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Ionicons name="refresh" size={20} color={colors.white} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.xxl,
  },
  suggestions: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  suggestionText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginLeft: spacing.md,
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    minWidth: 160,
    justifyContent: 'center',
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default ErrorScreen;