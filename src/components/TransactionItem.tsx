import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/currency';
import { formatDateWithTime } from '../utils/dateUtils';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const isIncome = transaction.type === 'income';

  const getCategoryTheme = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('salary') || lower.includes('income')) {
      return { icon: 'cash-outline' as const, color: '#00CDA0', bg: '#E2F8EB' };
    }
    if (lower.includes('food') || lower.includes('dining')) {
      return { icon: 'restaurant-outline' as const, color: '#FF7043', bg: '#FFEDE6' };
    }
    if (lower.includes('grocer')) {
      return { icon: 'cart-outline' as const, color: '#26A69A', bg: '#E0F2F1' };
    }
    if (lower.includes('shopping')) {
      return { icon: 'bag-handle-outline' as const, color: '#7E57C2', bg: '#EDE7F6' };
    }
    if (lower.includes('transport') || lower.includes('car')) {
      return { icon: 'car-outline' as const, color: '#42A5F5', bg: '#E3F2FD' };
    }
    if (lower.includes('bill') || lower.includes('util')) {
      return { icon: 'flash-outline' as const, color: '#FFA726', bg: '#FFF3E0' };
    }
    if (lower.includes('health')) {
      return { icon: 'medkit-outline' as const, color: '#EF5350', bg: '#FFEBEE' };
    }
    if (lower.includes('travel')) {
      return { icon: 'airplane-outline' as const, color: '#26C6DA', bg: '#E0F7FA' };
    }
    if (lower.includes('educat')) {
      return { icon: 'school-outline' as const, color: '#5C6BC0', bg: '#E8EAF6' };
    }
    if (lower.includes('entertain')) {
      return { icon: 'film-outline' as const, color: '#AB47BC', bg: '#F3E5F5' };
    }
    return { icon: 'receipt-outline' as const, color: '#78909C', bg: '#ECEFF1' };
  };

  const theme = getCategoryTheme(transaction.categoryName);

  // Frequency or category label
  const frequencyLabel =
    transaction.notes?.toLowerCase().includes('monthly') || transaction.title.toLowerCase().includes('monthly')
      ? 'Monthly'
      : transaction.notes?.toLowerCase().includes('weekly')
      ? 'Weekly'
      : transaction.categoryName;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.cardRow}
    >
      {/* 1. Rounded colored square with category icon */}
      <View style={[styles.iconSquare, { backgroundColor: theme.bg }]}>
        <Ionicons name={theme.icon} size={22} color={theme.color} />
      </View>

      {/* 2. Transaction Title and Date/Time in blue */}
      <View style={styles.titleDateCol}>
        <Text style={styles.titleText} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.dateBlueText} numberOfLines={1}>
          {formatDateWithTime(transaction.date, transaction.createdAt)}
        </Text>
      </View>

      {/* 3. Thin vertical teal separator 1 */}
      <View style={styles.verticalSeparator} />

      {/* 4. Category / Frequency in the middle */}
      <View style={styles.middleCol}>
        <Text style={styles.middleText} numberOfLines={1}>
          {frequencyLabel}
        </Text>
      </View>

      {/* 5. Thin vertical teal separator 2 */}
      <View style={styles.verticalSeparator} />

      {/* 6. Transaction Amount aligned to right */}
      <View style={styles.amountCol}>
        <Text style={styles.amountText}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>

        {showActions && (
          <View style={styles.actionsMiniRow}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="pencil-outline" size={15} color={colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={15} color={colors.expenseRed} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2F7EB',
    elevation: 1,
    shadowColor: '#062D2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleDateCol: {
    flex: 1.5,
    justifyContent: 'center',
  },
  titleText: {
    ...typography.subtitle2,
    color: colors.textPrimary, // Dark teal/black
    fontWeight: '700',
    fontSize: 14,
  },
  dateBlueText: {
    ...typography.caption,
    color: colors.textBlue, // Blue text from reference
    fontWeight: '600',
    fontSize: 11,
    marginTop: 2,
  },
  verticalSeparator: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(0, 205, 160, 0.3)', // Thin teal separator
    marginHorizontal: 8,
  },
  middleCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  middleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
    textAlign: 'center',
  },
  amountCol: {
    flex: 1.3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    ...typography.subtitle2,
    color: colors.textBlue, // Blue for consistency with reference
    fontWeight: '800',
    fontSize: 14,
  },
  actionsMiniRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 3,
  },
});
