import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/currency';

interface BalanceCardProps {
  savingsProgress?: number; // 0 to 100
  revenueLastWeek: number;
  foodLastWeek: number;
  totalBalance?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  savingsProgress = 68,
  revenueLastWeek = 4000,
  foodLastWeek = 100,
}) => {
  // Circular progress calculations for SVG
  const circleSize = 82;
  const strokeWidth = 6;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validProgress = Math.min(Math.max(savingsProgress, 0), 100);
  const strokeDashoffset = circumference - (validProgress / 100) * circumference;

  return (
    <View style={styles.card}>
      {/* Left Column: Circular Progress with Car / Savings Icon & Label */}
      <View style={styles.leftColumn}>
        <View style={styles.circleContainer}>
          <Svg width={circleSize} height={circleSize}>
            {/* Background ring */}
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Active progress arc */}
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="#FFFFFF"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            />
          </Svg>

          {/* Center Content: Car Icon & Percent */}
          <View style={styles.circleCenterContent}>
            <Ionicons name="car-sport" size={22} color={colors.textWhite} />
            <Text style={styles.percentText}>{validProgress}%</Text>
          </View>
        </View>

        <Text style={styles.savingsLabel}>Savings On Goals</Text>
      </View>

      {/* Vertical Divider */}
      <View style={styles.verticalDivider} />

      {/* Right Column: Revenue Last Week & Food Last Week */}
      <View style={styles.rightColumn}>
        {/* Revenue Last Week */}
        <View style={styles.statSection}>
          <View style={styles.labelRow}>
            <Ionicons name="cash-outline" size={17} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.statLabel}>Revenue Last Week</Text>
          </View>
          <Text style={styles.statValueRevenue}>{formatCurrency(revenueLastWeek)}</Text>
        </View>

        {/* Thin Divider */}
        <View style={styles.horizontalDivider} />

        {/* Food Last Week */}
        <View style={styles.statSection}>
          <View style={styles.labelRow}>
            <Ionicons name="restaurant-outline" size={17} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.statLabel}>Food Last Week</Text>
          </View>
          <Text style={styles.statValueFood}>-{formatCurrency(foodLastWeek)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary, // Bright teal #00CDA0
    borderRadius: borderRadius.card, // 32px rounded corners
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#062D2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  leftColumn: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  circleContainer: {
    position: 'relative',
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 11,
    marginTop: 1,
  },
  savingsLabel: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 13,
  },
  verticalDivider: {
    width: 1,
    height: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: spacing.md,
  },
  rightColumn: {
    flex: 1.3,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingLeft: spacing.xs,
  },
  statSection: {
    paddingVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  statLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    fontSize: 12,
  },
  statValueRevenue: {
    ...typography.subtitle1,
    color: colors.textWhite,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  statValueFood: {
    ...typography.subtitle1,
    color: colors.textWhite,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: spacing.sm,
  },
});
