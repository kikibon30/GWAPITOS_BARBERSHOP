import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoadingScreen = ({ message = "Preparing your experience..." }) => {
  const spinValue = new Animated.Value(0);

  // Animation for spinning scissors icon
  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    
    spin();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Scissors Icon */}
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.iconWrapper, { transform: [{ rotate: spin }] }]}>
            <Ionicons name="cut" size={80} color={colors.primary} />
          </Animated.View>
        </View>
        
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Ionicons name="sparkles" size={24} color={colors.accent} />
          <Text style={styles.title}>GWAPITOS</Text>
          <Ionicons name="sparkles" size={24} color={colors.accent} />
        </View>
        
        {/* Loading Message */}
        <Text style={styles.message}>{message}</Text>
        
        {/* Enhanced Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
      
      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Premium Barbershop Experience</Text>
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
  animationContainer: {
    marginBottom: spacing.xxl,
  },
  iconWrapper: {
    padding: spacing.lg,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: '800',
    color: colors.primary,
    marginHorizontal: spacing.md,
    letterSpacing: 2,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.body.lineHeight,
    maxWidth: '80%',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xs,
  },
  dot1: {
    opacity: 0.6,
  },
  dot2: {
    opacity: 0.8,
  },
  dot3: {
    opacity: 1,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
});

export default LoadingScreen;