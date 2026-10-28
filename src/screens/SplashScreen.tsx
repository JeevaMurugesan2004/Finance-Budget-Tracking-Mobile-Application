import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RootStackParamList } from "../types";
import { markSplashComplete } from "../navigation/StackNavigator";

type SplashScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavProp>();
  const { isAuthenticated, isLoading } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;

  // Image and title animations
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [fadeAnim, scaleAnim, titleFadeAnim]);

  // Navigate after authentication loading is complete
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      markSplashComplete();
      navigation.replace(
        isAuthenticated ? "MainDrawer" : "SignIn"
      );
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Main Splash Content */}
        <View style={styles.content}>
          {/* Animated Finance Wallet Image */}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require("../../assets/splash_finance_wallet.png")}
              style={styles.splashImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Animated App Title */}
          <Animated.Text
            style={[
              styles.appName,
              {
                opacity: titleFadeAnim,
                transform: [
                  {
                    translateY: titleFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [15, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            Finance & Budget Tracker
          </Animated.Text>

          {/* Animated Tagline */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: titleFadeAnim,
              },
            ]}
          >
            Track Smart. Save Better.
          </Animated.Text>

          {/* Loading Indicator */}
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          YOUR MONEY. YOUR CONTROL.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  content: {
    alignItems: "center",
    width: "100%",
  },

  imageContainer: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  splashImage: {
    width: "100%",
    height: "100%",
  },

  appName: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },

  tagline: {
    ...typography.body2,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  loaderContainer: {
    marginTop: spacing.xl,
    height: 24,
    justifyContent: "center",
  },

  footerText: {
    position: "absolute",
    bottom: spacing.xl,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
});