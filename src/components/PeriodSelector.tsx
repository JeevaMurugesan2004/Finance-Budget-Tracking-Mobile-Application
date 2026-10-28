import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PeriodType } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PeriodSelectorProps {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  activePeriod,
  onPeriodChange,
}) => {
  const periods: { key: PeriodType; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <View style={styles.container}>
      {periods.map(({ key, label }) => {
        const isActive = activePeriod === key;
        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.8}
            onPress={() => onPeriodChange(key)}
            style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#DCF8E8', // Pale green background from reference
    borderRadius: borderRadius.xxl, // Rounded pill container
    padding: 4,
    marginVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  segmentBtnActive: {
    backgroundColor: colors.primary, // Bright teal #00CDA0 pill
    elevation: 2,
    shadowColor: '#00CDA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  segmentText: {
    ...typography.subtitle2,
    color: colors.textPrimary, // Dark teal/black
    fontWeight: '600',
    fontSize: 14,
  },
  segmentTextActive: {
    color: colors.textWhite,
    fontWeight: '700',
  },
});
