import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';
import { CategorySpending, PeriodType, Transaction } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency, formatCurrencyCompact } from '../utils/currency';
import { formatDateShort } from '../utils/dateUtils';

interface IncomeVsExpenseBarProps {
  income: number;
  expense: number;
  periodLabel: string;
}

export const IncomeVsExpenseChart: React.FC<IncomeVsExpenseBarProps> = ({
  income,
  expense,
  periodLabel,
}) => {
  const maxVal = Math.max(income, expense, 1);
  const chartHeight = 160;
  const incomeHeight = Math.max(12, (income / maxVal) * (chartHeight - 30));
  const expenseHeight = Math.max(12, (expense / maxVal) * (chartHeight - 30));

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Income vs Expenses</Text>
        <Text style={styles.chartSubtitle}>{periodLabel}</Text>
      </View>

      <View style={styles.barsContainer}>
        {/* Y Axis Guide Lines */}
        <View style={styles.guideLineContainer}>
          <View style={styles.guideLine}>
            <Text style={styles.guideText}>{formatCurrencyCompact(maxVal)}</Text>
            <View style={styles.guideDashed} />
          </View>
          <View style={styles.guideLine}>
            <Text style={styles.guideText}>{formatCurrencyCompact(maxVal / 2)}</Text>
            <View style={styles.guideDashed} />
          </View>
          <View style={styles.guideLine}>
            <Text style={styles.guideText}>₹0</Text>
            <View style={styles.guideDashed} />
          </View>
        </View>

        {/* Bars Column */}
        <View style={styles.barsArea}>
          {/* Income Bar */}
          <View style={styles.singleBarColumn}>
            <Text style={styles.barValueText}>{formatCurrencyCompact(income)}</Text>
            <View
              style={[
                styles.barFill,
                {
                  height: incomeHeight,
                  backgroundColor: colors.primary,
                },
              ]}
            />
            <Text style={styles.barLabel}>Income</Text>
          </View>

          {/* Expense Bar */}
          <View style={styles.singleBarColumn}>
            <Text style={styles.barValueText}>{formatCurrencyCompact(expense)}</Text>
            <View
              style={[
                styles.barFill,
                {
                  height: expenseHeight,
                  backgroundColor: colors.expense,
                },
              ]}
            />
            <Text style={styles.barLabel}>Expense</Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Total Income: {formatCurrency(income)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
          <Text style={styles.legendText}>Total Expenses: {formatCurrency(expense)}</Text>
        </View>
      </View>
    </View>
  );
};

interface CategoryDonutChartProps {
  categories: CategorySpending[];
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ categories }) => {
  const topCategories = categories.filter((c) => c.totalAmount > 0).slice(0, 5);
  const totalAmount = topCategories.reduce((sum, c) => sum + c.totalAmount, 0);

  if (topCategories.length === 0 || totalAmount === 0) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Category Spending Distribution</Text>
        <Text style={styles.emptyChartText}>No expense data recorded for this period</Text>
      </View>
    );
  }

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Category Spending Distribution</Text>
      <Text style={styles.chartSubtitle}>Top expense categories</Text>

      <View style={styles.donutContainer}>
        <View style={styles.svgWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background ring */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={colors.surfaceVariant}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Slices */}
              {topCategories.map((cat, idx) => {
                const percent = (cat.totalAmount / totalAmount);
                const strokeDashoffset = circumference - percent * circumference;
                const rotation = accumulatedPercent * 360;
                accumulatedPercent += percent;

                return (
                  <Circle
                    key={cat.categoryId || idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={cat.color || colors.primary}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                  />
                );
              })}
            </G>
          </Svg>

          {/* Center Text */}
          <View style={styles.donutCenterText}>
            <Text style={styles.donutCenterLabel}>Expenses</Text>
            <Text style={styles.donutCenterValue}>{formatCurrencyCompact(totalAmount)}</Text>
          </View>
        </View>

        {/* Category List with Colors & Percentages */}
        <View style={styles.donutLegendContainer}>
          {topCategories.map((cat) => (
            <View key={cat.categoryId} style={styles.donutLegendItem}>
              <View style={[styles.donutLegendDot, { backgroundColor: cat.color }]} />
              <View style={styles.donutLegendDetails}>
                <Text style={styles.donutLegendName} numberOfLines={1}>
                  {cat.categoryName}
                </Text>
                <Text style={styles.donutLegendAmt}>{formatCurrency(cat.totalAmount)}</Text>
              </View>
              <Text style={styles.donutLegendPercent}>{cat.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

interface SpendingTrendChartProps {
  transactions: Transaction[];
  period: PeriodType;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions, period }) => {
  // Aggregate recent expenses by date
  const expenseTxs = transactions.filter((t) => t.type === 'expense');

  // Group by date (up to last 6 distinct transaction dates)
  const dateMap = new Map<string, number>();
  for (const tx of expenseTxs) {
    const prev = dateMap.get(tx.date) || 0;
    dateMap.set(tx.date, prev + tx.amount);
  }

  const sortedDates = Array.from(dateMap.keys()).sort().slice(-6);
  const dataPoints = sortedDates.map((date) => ({
    date,
    amount: dateMap.get(date) || 0,
    label: formatDateShort(date),
  }));

  if (dataPoints.length === 0) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Spending Trends</Text>
        <Text style={styles.emptyChartText}>No spending transactions recorded to show trend</Text>
      </View>
    );
  }

  const maxAmount = Math.max(...dataPoints.map((d) => d.amount), 1);
  const chartHeight = 120;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Spending Trends</Text>
      <Text style={styles.chartSubtitle}>Recent expense transactions across timeline</Text>

      <View style={styles.trendContainer}>
        {dataPoints.map((dp, idx) => {
          const barH = Math.max(8, (dp.amount / maxAmount) * (chartHeight - 30));
          return (
            <View key={dp.date + idx} style={styles.trendColumn}>
              <Text style={styles.trendValText}>{formatCurrencyCompact(dp.amount)}</Text>
              <View
                style={[
                  styles.trendBarFill,
                  {
                    height: barH,
                    backgroundColor: idx === dataPoints.length - 1 ? colors.primary : colors.accentNavy,
                  },
                ]}
              />
              <Text style={styles.trendDateText}>{dp.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md + 2,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  chartHeader: {
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chartSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyChartText: {
    ...typography.body2,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  barsContainer: {
    flexDirection: 'row',
    height: 160,
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  guideLineContainer: {
    width: 65,
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  guideLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideText: {
    ...typography.caption,
    color: colors.textMuted,
    width: 50,
    fontSize: 10,
  },
  guideDashed: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  singleBarColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
  },
  barValueText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    fontSize: 11,
  },
  barFill: {
    width: 38,
    borderRadius: borderRadius.sm,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 6,
  },
  legendRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  svgWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  donutCenterValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  donutLegendContainer: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  donutLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs + 2,
  },
  donutLegendDetails: {
    flex: 1,
  },
  donutLegendName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  donutLegendAmt: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  donutLegendPercent: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  trendColumn: {
    alignItems: 'center',
    flex: 1,
  },
  trendValText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 9,
    marginBottom: 4,
  },
  trendBarFill: {
    width: 24,
    borderRadius: borderRadius.xs,
  },
  trendDateText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 6,
  },
});
