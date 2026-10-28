import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { TransactionItem } from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../types';
import { formatCurrency } from '../utils/currency';
import { isInMonthAndYear, MONTH_NAMES } from '../utils/dateUtils';

type CategoryDetailsScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'CategoryDetails'>;
type CategoryDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetails'>;

interface CategoryDetailsScreenProps {
  navigation: CategoryDetailsScreenNavProp;
  route: CategoryDetailsScreenRouteProp;
}

export const CategoryDetailsScreen: React.FC<CategoryDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { categoryId } = route.params;
  const { getCategoryById, transactions } = useFinance();

  const category = getCategoryById(categoryId);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [filterAllTime, setFilterAllTime] = useState(false);

  // Filter transactions for this category
  const categoryTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.categoryId !== categoryId) return false;
      if (filterAllTime) return true;
      return isInMonthAndYear(tx.date, selectedMonth, selectedYear);
    });
  }, [transactions, categoryId, selectedMonth, selectedYear, filterAllTime]);

  // Total spent in this category
  const totalSpent = useMemo(() => {
    return categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [categoryTransactions]);

  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const budget = category.budget || 0;
  const remainingBudget = Math.max(0, budget - totalSpent);
  const isBudgetExceeded = budget > 0 && totalSpent > budget;
  const budgetProgressRatio = budget > 0 ? Math.min(totalSpent / budget, 1) : 0;
  const budgetProgressPercent = Math.round(budgetProgressRatio * 100);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {category.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Overview Card */}
        <View style={styles.heroCard}>
          <View style={[styles.heroIconWrapper, { backgroundColor: category.bgColor }]}>
            <Ionicons
              name={category.icon as keyof typeof Ionicons.glyphMap}
              size={36}
              color={category.color}
            />
          </View>
          <Text style={styles.heroTitle}>{category.name}</Text>
          <Text style={styles.heroSub}>
            {filterAllTime ? 'All Time Spending' : `Spending in ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          </Text>
          <Text style={styles.heroAmount}>{formatCurrency(totalSpent)}</Text>

          {/* Budget progress bar */}
          {budget > 0 && (
            <View style={styles.budgetCardInner}>
              <View style={styles.budgetStatsRow}>
                <View>
                  <Text style={styles.budgetStatLabel}>Monthly Budget</Text>
                  <Text style={styles.budgetStatVal}>{formatCurrency(budget)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.budgetStatLabel}>Remaining</Text>
                  <Text
                    style={[
                      styles.budgetStatVal,
                      { color: isBudgetExceeded ? colors.expense : colors.incomeDark },
                    ]}
                  >
                    {isBudgetExceeded
                      ? `Exceeded by ${formatCurrency(totalSpent - budget)}`
                      : formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetTrack}>
                <View
                  style={[
                    styles.budgetFill,
                    {
                      width: `${budgetProgressPercent}%`,
                      backgroundColor: isBudgetExceeded ? colors.expense : category.color,
                    },
                  ]}
                />
              </View>

              <Text style={styles.budgetPercentText}>
                {isBudgetExceeded
                  ? 'Budget Limit Exceeded'
                  : `${budgetProgressPercent}% of monthly budget utilized`}
              </Text>
            </View>
          )}
        </View>

        {/* Month Filter Selector */}
        <View style={styles.filterSection}>
          <View style={styles.filterToggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, !filterAllTime && styles.toggleBtnActive]}
              onPress={() => setFilterAllTime(false)}
            >
              <Text style={[styles.toggleText, !filterAllTime && styles.toggleTextActive]}>
                By Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, filterAllTime && styles.toggleBtnActive]}
              onPress={() => setFilterAllTime(true)}
            >
              <Text style={[styles.toggleText, filterAllTime && styles.toggleTextActive]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>

          {!filterAllTime && (
            <View style={styles.monthNavigator}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={styles.navArrowBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.monthTitleText}>
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </Text>

              <TouchableOpacity
                onPress={handleNextMonth}
                style={styles.navArrowBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Transactions in this category */}
        <View style={styles.historySection}>
          <Text style={styles.historyHeading}>
            Transaction History ({categoryTransactions.length})
          </Text>

          {categoryTransactions.length > 0 ? (
            categoryTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => navigation.navigate('EditTransaction', { transactionId: tx.id })}
              />
            ))
          ) : (
            <EmptyState
              icon="receipt-outline"
              title="No transactions"
              message={`No recorded transactions in ${category.name} for the selected period.`}
              actionTitle="Add Transaction"
              onAction={() => navigation.navigate('AddTransaction')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    maxWidth: '70%',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.subtitle1,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  backBtnText: {
    ...typography.button,
    color: colors.textWhite,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  heroIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  heroSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroAmount: {
    ...typography.currencyLarge,
    color: colors.textPrimary,
    marginVertical: spacing.md,
  },
  budgetCardInner: {
    width: '100%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  budgetStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  budgetStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  budgetStatVal: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  budgetTrack: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  budgetFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  budgetPercentText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.subtle,
  },
  toggleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navArrowBtn: {
    padding: spacing.xs,
  },
  monthTitleText: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  historySection: {
    marginTop: spacing.sm,
  },
  historyHeading: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
