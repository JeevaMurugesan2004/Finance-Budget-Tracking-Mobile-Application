import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { TransactionItem } from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainDrawerParamList, RootStackParamList } from '../types';
import { formatCurrency } from '../utils/currency';
import { isInMonthAndYear, MONTH_NAMES } from '../utils/dateUtils';

import { AdminRestrictedView } from '../components/AdminRestrictedView';
import { useAuth } from '../context/AuthContext';
import { isCustomerRole } from '../utils/roleUtils';

export const TransactionsScreen: React.FC = () => {
  const { role, user } = useAuth();
  const isCustomer = isCustomerRole(role || user?.role);

  if (!isCustomer) {
    return <AdminRestrictedView featureName="Month-wise Transactions" />;
  }

  const { transactions, deleteTransaction } = useFinance();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

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

  // Filter transactions
  const monthTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchMonth = isInMonthAndYear(tx.date, selectedMonth, selectedYear);
      if (!matchMonth) return false;
      if (filterType === 'all') return true;
      return tx.type === filterType;
    });
  }, [transactions, selectedMonth, selectedYear, filterType]);

  // Compute monthly totals
  const monthlySummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (isInMonthAndYear(tx.date, selectedMonth, selectedYear)) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      }
    });
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions, selectedMonth, selectedYear]);

  const handleDelete = (id: string, title: string, amount: number) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${title}" of ${formatCurrency(amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header with Drawer toggle and Add button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.drawerToggle}
          onPress={() => drawerNavigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transactions</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTransaction')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={24} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month & Year Navigator */}
        <View style={styles.monthNavigator}>
          <TouchableOpacity
            onPress={handlePrevMonth}
            style={styles.navArrowBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.monthTitleWrapper}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.monthTitleText}>
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.navArrowBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Monthly Summary Banner */}
        <View style={styles.monthlySummaryCard}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValueIncome}>+{formatCurrency(monthlySummary.income)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryValueExpense}>-{formatCurrency(monthlySummary.expense)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Net Balance</Text>
            <Text
              style={[
                styles.summaryValueNet,
                { color: monthlySummary.net >= 0 ? colors.incomeDark : colors.expenseDark },
              ]}
            >
              {formatCurrency(monthlySummary.net)}
            </Text>
          </View>
        </View>

        {/* Filter Chips: All / Income / Expense */}
        <View style={styles.filterChipsRow}>
          {(['all', 'income', 'expense'] as const).map((type) => {
            const isActive = filterType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilterType(type)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {type === 'all' ? 'All Transactions' : type === 'income' ? 'Income (+)' : 'Expenses (-)'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transaction Count indicator */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            Showing {monthTransactions.length} transaction{monthTransactions.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Transactions List */}
        {monthTransactions.length > 0 ? (
          monthTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              showActions
              onPress={() => navigation.navigate('EditTransaction', { transactionId: tx.id })}
              onEdit={() => navigation.navigate('EditTransaction', { transactionId: tx.id })}
              onDelete={() => handleDelete(tx.id, tx.title, tx.amount)}
            />
          ))
        ) : (
          <EmptyState
            title="No transactions found"
            message={`No ${filterType !== 'all' ? filterType : ''} records for ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}.`}
            actionTitle="Add New Transaction"
            onAction={() => navigation.navigate('AddTransaction')}
          />
        )}
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
  drawerToggle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
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
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 110,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  navArrowBtn: {
    padding: spacing.xs,
  },
  monthTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  monthTitleText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  monthlySummaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.subtle,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.borderLight,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
    fontSize: 11,
  },
  summaryValueIncome: {
    ...typography.caption,
    color: colors.incomeDark,
    fontWeight: '700',
    fontSize: 13,
  },
  summaryValueExpense: {
    ...typography.caption,
    color: colors.expenseDark,
    fontWeight: '700',
    fontSize: 13,
  },
  summaryValueNet: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  filterChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  countRow: {
    marginBottom: spacing.sm,
  },
  countText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
