import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackParamList, UserRole } from '../types';
import {
  validateEmail,
  validateIndianPhone,
  validatePassword,
  validatePasswordConfirm,
} from '../utils/validation';
import { isAdminRole, isCustomerRole, normalizeRole } from '../utils/roleUtils';

type SignUpScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavProp;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setGeneralError(null);
    const newErrors: Record<string, string> = {};

    if (!name || !name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    const emailRes = validateEmail(email);
    if (!emailRes.isValid && emailRes.error) {
      newErrors.email = emailRes.error;
    }

    const phoneRes = validateIndianPhone(phone);
    if (!phoneRes.isValid && phoneRes.error) {
      newErrors.phone = phoneRes.error;
    }

    const passRes = validatePassword(password);
    if (!passRes.isValid && passRes.error) {
      newErrors.password = passRes.error;
    }

    const confirmRes = validatePasswordConfirm(password, confirmPassword);
    if (!confirmRes.isValid && confirmRes.error) {
      newErrors.confirmPassword = confirmRes.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const targetRole = normalizeRole(role);
      const res = await signUp(name, email, phone, password, targetRole);
      if (res.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainDrawer' }],
        });
      } else {
        setGeneralError(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Error occurred while creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start tracking your finances in Indian Rupees (₹)</Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Register As:</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'customer' && styles.roleTabActive]}
                onPress={() => setRole('customer')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={18}
                  color={role === 'customer' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[styles.roleTabText, role === 'customer' && styles.roleTabTextActive]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'admin' && styles.roleTabActive]}
                onPress={() => setRole('admin')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color={role === 'admin' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[styles.roleTabText, role === 'admin' && styles.roleTabTextActive]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {generalError && (
            <View style={styles.generalErrorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.expense} />
              <Text style={styles.generalErrorText}>{generalError}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formContainer}>
            <AppInput
              label="Full Name"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              error={errors.name}
            />

            <AppInput
              label="Email Address"
              placeholder="e.g. rahul.verma@example.in"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />

            <AppInput
              label="Indian Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
              error={errors.phone}
              helperText="10-digit mobile number with or without +91 prefix"
            />

            <AppInput
              label="Password"
              placeholder="Create strong password (min 6 chars)"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            <AppInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              leftIcon="checkmark-done-outline"
              error={errors.confirmPassword}
            />

            <AppButton
              title={loading ? 'Creating Account...' : 'Complete Sign Up'}
              onPress={handleSignUp}
              loading={loading}
              size="lg"
              style={styles.signUpBtn}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  roleTabActive: {
    backgroundColor: colors.surface,
    ...shadows.subtle,
  },
  roleTabText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.expenseBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  generalErrorText: {
    ...typography.body2,
    color: colors.expense,
    fontWeight: '500',
    flex: 1,
  },
  formContainer: {
    marginTop: spacing.xs,
  },
  signUpBtn: {
    marginTop: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  signInLink: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '700',
  },
});
