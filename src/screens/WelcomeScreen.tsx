import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../types';

type WelcomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Subtle Glow Background Accents */}
      <View style={styles.glowLavender} pointerEvents="none" />
      <View style={styles.glowPeach} pointerEvents="none" />
      <View style={styles.glowMint} pointerEvents="none" />
      <View style={styles.glowBlue} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 3D Finance Illustration Header */}
        <View style={styles.illustrationWrapper}>
          <View style={styles.illustrationBackdrop} />
          <Image
            source={require('../../assets/welcome_3d_finance.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* Hero Title & Subtitle */}
        <View style={styles.heroTextSection}>
          <Text style={styles.mainHeading}>Your Money Journey,{'\n'}Made Smarter</Text>
          <Text style={styles.subtitle}>
            Track spending, plan budgets, and grow your savings.
          </Text>
        </View>

        {/* 3 Separate Feature Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Smart Indian Budgeting */}
          <View style={styles.featureCard}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#DCF8E8' }]}>
              <Ionicons name="cash-outline" size={26} color="#00A680" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Smart Indian Budgeting</Text>
              <Text style={styles.cardDesc}>
                Manage INR, Lakhs and Crores with ease.
              </Text>
            </View>
          </View>

          {/* Card 2: Daily, Weekly & Monthly Insights */}
          <View style={styles.featureCard}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="pie-chart-outline" size={26} color="#0284C7" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Daily, Weekly & Monthly Insights</Text>
              <Text style={styles.cardDesc}>
                Understand income, expenses and savings.
              </Text>
            </View>
          </View>

          {/* Card 3: Secure Role-Based Access */}
          <View style={styles.featureCard}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-checkmark-outline" size={26} color="#D97706" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Secure Role-Based Access</Text>
              <Text style={styles.cardDesc}>
                Designed for Admin and Customer accounts.
              </Text>
            </View>
          </View>
        </View>

        {/* Demo Credentials Box */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Ionicons name="information-circle" size={16} color={colors.accentNavy} />
            <Text style={styles.demoTitle}>Demo Login Credentials</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.demoRole}>Admin:</Text>
            <Text style={styles.demoCreds}>admin@example.in (admin123)</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.demoRole}>Customer:</Text>
            <Text style={styles.demoCreds}>customer@example.in (customer123)</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.textWhite} style={styles.btnIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.secondaryBtnText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3FCF6', // Soft mint-white background
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },

  // Glow Accents
  glowLavender: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EDE9FE',
    opacity: 0.75,
  },
  glowPeach: {
    position: 'absolute',
    top: 60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFEDD5',
    opacity: 0.65,
  },
  glowMint: {
    position: 'absolute',
    top: 240,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#D1FAE5',
    opacity: 0.7,
  },
  glowBlue: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0F2FE',
    opacity: 0.5,
  },

  // 3D Illustration
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    position: 'relative',
  },
  illustrationBackdrop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 205, 160, 0.12)',
  },
  illustrationImage: {
    width: 250,
    height: 250,
  },

  // Hero Text
  heroTextSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  mainHeading: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },

  // 3 Separate Feature Cards
  cardsContainer: {
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md + 2,
    borderWidth: 1,
    borderColor: '#E6F8EE',
    ...shadows.card,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
    fontSize: 12,
  },

  // Demo Box
  demoBox: {
    backgroundColor: '#EBF9F2',
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#D4F3E4',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  demoTitle: {
    ...typography.caption,
    color: colors.accentNavy,
    fontWeight: '700',
    fontSize: 11,
  },
  demoRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  demoRole: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    width: 75,
    fontSize: 11,
  },
  demoCreds: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },

  // Action Buttons
  actionSection: {
    gap: spacing.sm + 4,
    marginTop: spacing.xs,
  },
  primaryBtn: {
    backgroundColor: colors.primary, // Vibrant teal #00CDA0
    borderRadius: borderRadius.card,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  primaryBtnText: {
    ...typography.subtitle1,
    color: colors.textWhite,
    fontWeight: '700',
  },
  btnIcon: {
    marginLeft: 6,
  },
  secondaryBtn: {
    backgroundColor: '#EAF9F1',
    borderRadius: borderRadius.card,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryBtnText: {
    ...typography.subtitle1,
    color: colors.primary,
    fontWeight: '700',
  },
});
