import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { globalStyles } from '../../styles/globalStyles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/image/gwapitos.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.appNameContainer}>
              <Ionicons name="cut" size={28} color={colors.primary} style={styles.icon} />
              <Text style={styles.appName}>GWAPITOS</Text>
            </View>
            <Text style={styles.tagline}>Premium Barbershop Experience</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.title}>Welcome to GWAPITOS</Text>
            <Text style={styles.subtitle}>
              Book your perfect haircut with ease. Skip the wait, get the style you deserve.
            </Text>
            
            {/* Feature Icons */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="calendar" size={24} color={colors.accent} />
                <Text style={styles.featureText}>Easy Booking</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="time" size={24} color={colors.accent} />
                <Text style={styles.featureText}>Save Time</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="star" size={24} color={colors.accent} />
                <Text style={styles.featureText}>Quality Service</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('RoleSelection')}
          variant="primary"
          style={styles.primaryButton}
        />
        <Button
          title="I have an account"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          style={styles.secondaryButton}
        />
      </View>
    </SafeAreaView>
  );
};

// ... keep your existing styles the same
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: spacing.lg,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  appName: {
    fontSize: typography.h1.fontSize,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  heroSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.h1.fontSize + 4,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.h1.lineHeight,
  },
  subtitle: {
    fontSize: typography.body.fontSize + 2,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.lineHeight + 4,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    padding: spacing.sm,
  },
  featureText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  primaryButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginBottom: spacing.xs,
  },
});

export default WelcomeScreen;