import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategorySpending } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/currency';

interface CategoryCardProps {
  category: CategorySpending;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const isBudgetExceeded =
    category.budget && category.budget > 0 && category.totalAmount > category.budget;
  const progressPercent = Math.min(Math.round((category.budgetProgress || 0) * 100), 100);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: category.bgColor }]}>
          <Ionicons
            name={category.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={category.color}
          />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {category.categoryName}
          </Text>
          <Text style={styles.txCount}>
            {category.transactionCount} transaction{category.transactionCount === 1 ? '' : 's'}
          </Text>
        </View>

        <View style={styles.amountWrapper}>
          <Text style={styles.amount}>{formatCurrency(category.totalAmount)}</Text>
          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>{category.percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Budget Progress Bar */}
      {category.budget && category.budget > 0 ? (
        <View style={styles.progressSection}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: isBudgetExceeded ? colors.expense : category.color,
                },
              ]}
            />
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetText}>
              Budget: {formatCurrency(category.budget)}
            </Text>
            <Text
              style={[
                styles.budgetUsageText,
                { color: isBudgetExceeded ? colors.expense : colors.textSecondary },
              ]}
            >
              {isBudgetExceeded ? 'Exceeded' : `${progressPercent}% used`}
            </Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleWrapper: {
    flex: 1,
  },
  categoryName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  txCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  amountWrapper: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.subtitle1,
    color: colors.textBlue,
    fontWeight: '700',
  },
  percentBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    marginTop: 2,
  },
  percentText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: spacing.md - 2,
    paddingTop: spacing.xs,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  budgetText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  budgetUsageText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
