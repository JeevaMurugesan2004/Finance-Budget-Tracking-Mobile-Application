import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { borderRadius, spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RootStackParamList, UserRole } from "../types";
import { validateEmail, validatePassword } from "../utils/validation";
import { normalizeRole } from "../utils/roleUtils";

type SignInScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

interface SignInScreenProps {
  navigation: SignInScreenNavProp;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();

  const [role, setRole] = useState<"admin" | "customer">("customer");
  const [email, setEmail] = useState("customer@example.in");
  const [password, setPassword] = useState("customer123");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const setDemoRole = (newRole: UserRole) => {
    const normalized = normalizeRole(newRole);

    setRole(normalized);
    setErrors({});
    setGeneralError(null);

    if (normalized === "admin") {
      setEmail("admin@example.in");
      setPassword("admin123");
    } else {
      setEmail("customer@example.in");
      setPassword("customer123");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);

    const clean = text.trim().toLowerCase();

    if (clean === "admin@example.in") {
      setRole("admin");
    } else if (clean === "customer@example.in") {
      setRole("customer");
    }
  };

  const handleSignIn = async () => {
    setGeneralError(null);

    const newErrors: Record<string, string> = {};

    const emailRes = validateEmail(email);
    if (!emailRes.isValid && emailRes.error) {
      newErrors.email = emailRes.error;
    }

    const passRes = validatePassword(password);
    if (!passRes.isValid && passRes.error) {
      newErrors.password = passRes.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const targetRole =
        cleanEmail === "admin@example.in"
          ? "admin"
          : cleanEmail === "customer@example.in"
            ? "customer"
            : normalizeRole(role);

      const res = await signIn(email, password, targetRole);

      if (!res.success) {
        setGeneralError(res.error || "Authentication failed");
      }
    } catch (err: any) {
      setGeneralError(err?.message || "Login error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {navigation.canGoBack() && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={21} color={colors.textPrimary} />
            </TouchableOpacity>
          )}

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your finance dashboard.
            </Text>
          </View>

          <Text style={styles.label}>Continue as</Text>

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "customer" && styles.roleActive,
              ]}
              onPress={() => setDemoRole("customer")}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={role === "customer" ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.roleText,
                  role === "customer" && styles.roleTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === "admin" && styles.roleActive]}
              onPress={() => setDemoRole("admin")}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={role === "admin" ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.roleText,
                  role === "admin" && styles.roleTextActive,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          {generalError && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={colors.expense}
              />
              <Text style={styles.errorText}>{generalError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <AppInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            <AppButton
              title={
                loading
                  ? "Signing in..."
                  : `Sign In as ${role === "admin" ? "Admin" : "Customer"}`
              }
              onPress={handleSignIn}
              loading={loading}
              size="lg"
              style={styles.signInButton}
            />
          </View>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => setDemoRole(role)}
          >
            <Ionicons name="flash-outline" size={17} color={colors.primary} />
            <Text style={styles.demoText}>
              Fill {role === "admin" ? "Admin" : "Customer"} demo credentials
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  label: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  roleSelector: {
    flexDirection: "row",
    padding: 4,
    gap: spacing.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  roleButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: borderRadius.md,
  },
  roleActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  roleText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  roleTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.expenseBg,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body2,
    color: colors.expense,
    flex: 1,
  },
  form: {
    gap: spacing.md,
  },
  signInButton: {
    marginTop: spacing.xs,
  },
  demoButton: {
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  demoText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: spacing.xxl,
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  signUpText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: "700",
  },
});
