import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalizedAlert } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface NotificationBannerProps {
  alert: PersonalizedAlert | null;
  onDismiss: () => void;
  autoHideDuration?: number;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  alert,
  onDismiss,
  autoHideDuration = 5000,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (alert) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);
    }
  }, [alert]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!alert) return null;

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'success':
        return {
          bg: colors.primaryUltraLight,
          border: colors.primary,
          icon: 'checkmark-circle' as const,
          iconColor: colors.primary,
          title: 'Success',
        };
      case 'warning':
        return {
          bg: colors.warningBg,
          border: colors.warning,
          icon: 'warning' as const,
          iconColor: colors.warning,
          title: 'Alert',
        };
      case 'danger':
        return {
          bg: colors.expenseBg,
          border: colors.expense,
          icon: 'alert-circle' as const,
          iconColor: colors.expense,
          title: 'Notice',
        };
      case 'info':
      default:
        return {
          bg: colors.infoBg,
          border: colors.info,
          icon: 'information-circle' as const,
          iconColor: colors.info,
          title: 'Notification',
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.contentCard,
          {
            backgroundColor: config.bg,
            borderLeftColor: config.border,
          },
        ]}
      >
        <Ionicons name={config.icon} size={24} color={config.iconColor} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[typography.caption, { color: config.iconColor, fontWeight: '700' }]}>
            {config.title}
          </Text>
          <Text style={[typography.body2, styles.message]} numberOfLines={2}>
            {alert.message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    ...shadows.card,
  },
  icon: {
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: colors.textPrimary,
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
