import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PeriodReport, PeriodType } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/currency';

interface ReportCardProps {
  report: PeriodReport;
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  activePeriod,
  onPeriodChange,
}) => {
  const isNetPositive = report.netChange >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Financial Period Report</Text>
          <Text style={styles.periodLabel}>{report.label}</Text>
        </View>

        {/* Period Selector Pills */}
        <View style={styles.periodPillContainer}>
          {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((period) => {
            const isActive = activePeriod === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => onPeriodChange(period)}
                style={[styles.pill, isActive && styles.pillActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      {/* 3 Metric Cards: Income, Expense, Net Change */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Income</Text>
          <Text style={styles.metricValueIncome}>+{formatCurrency(report.totalIncome)}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Expenses</Text>
          <Text style={styles.metricValueExpense}>-{formatCurrency(report.totalExpense)}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Net Change</Text>
          <View style={styles.netChangeBadge}>
            <Ionicons
              name={isNetPositive ? 'trending-up' : 'trending-down'}
              size={14}
              color={isNetPositive ? colors.incomeDark : colors.expenseDark}
            />
            <Text
              style={[
                styles.metricValueNet,
                { color: isNetPositive ? colors.incomeDark : colors.expenseDark },
              ]}
            >
              {formatCurrency(report.netChange)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Based on {report.transactionCount} transaction{report.transactionCount === 1 ? '' : 's'} in this period
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md + 2,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  periodLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  periodPillContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMint,
    borderRadius: borderRadius.card,
    padding: 3,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.card,
  },
  pillActive: {
    backgroundColor: colors.primary,
    ...shadows.subtle,
  },
  pillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textWhite,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValueIncome: {
    ...typography.body2,
    color: colors.incomeDark,
    fontWeight: '700',
  },
  metricValueExpense: {
    ...typography.body2,
    color: colors.expenseDark,
    fontWeight: '700',
  },
  netChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricValueNet: {
    ...typography.body2,
    fontWeight: '700',
  },
  footerRow: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
