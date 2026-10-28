import React, { useMemo } from 'react';
import {
  Image,
  RefreshControl,
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
import { BalanceCard } from '../components/BalanceCard';
import { EmptyState } from '../components/EmptyState';
import { NotificationBanner } from '../components/NotificationBanner';
import { PeriodSelector } from '../components/PeriodSelector';
import { TransactionItem } from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainDrawerParamList, RootStackParamList } from '../types';
import {
  calculatePreviousWeekSummary,
  calculateSavingsGoalProgress,
} from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import { isCurrentMonth, isCurrentWeek, isSameDay } from '../utils/dateUtils';
import {
  formatRoleDisplay,
  isAdminRole,
  isCustomerRole,
  normalizeRole,
} from '../utils/roleUtils';

export const HomeScreen: React.FC = () => {
  const { user, role } = useAuth();
  const activeRole = normalizeRole(role || user?.role);
  const isCustomer = isCustomerRole(activeRole);
  const isAdmin = isAdminRole(activeRole);

  const {
    transactions,
    activePeriod,
    setActivePeriod,
    activeAlert,
    dismissAlert,
    currentReport,
  } = useFinance();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  // Compute live calculations from actual transactions for the top card
  const prevWeekSummary = useMemo(() => {
    return calculatePreviousWeekSummary(transactions);
  }, [transactions]);

  const savingsGoal = useMemo(() => {
    return calculateSavingsGoalProgress(transactions, 35000);
  }, [transactions]);

  // Filter transactions based on activePeriod (Daily, Weekly, Monthly)
  const filteredPeriodTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (activePeriod === 'daily') {
        return isSameDay(tx.date);
      }
      if (activePeriod === 'weekly') {
        return isCurrentWeek(tx.date);
      }
      if (activePeriod === 'monthly') {
        return isCurrentMonth(tx.date);
      }
      return true;
    });
  }, [transactions, activePeriod]);

  // If filtered period has transactions, show them; otherwise fallback to recent with note
  const displayedTransactions =
    filteredPeriodTransactions.length > 0
      ? filteredPeriodTransactions
      : transactions.slice(0, 6);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Floating In-App Personalized Alert Banner */}
      <NotificationBanner alert={activeAlert} onDismiss={dismissAlert} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Top Header Row with Drawer Toggle and User Avatar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.drawerToggle}
            onPress={() => drawerNavigation.openDrawer()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hi, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
            </Text>
            <Text style={styles.dateText}>{todayStr}</Text>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: isAdmin ? colors.textPrimary : colors.surfaceMint },
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: isAdmin ? colors.textWhite : colors.primaryDark },
                ]}
              >
                {formatRoleDisplay(activeRole)}
              </Text>
            </View>

            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 1. Bright Teal Top Financial Summary Card */}
        <BalanceCard
          savingsProgress={savingsGoal.percent}
          revenueLastWeek={prevWeekSummary.revenueLastWeek}
          foodLastWeek={prevWeekSummary.foodLastWeek}
        />

        {/* 2. Horizontal Daily / Weekly / Monthly Segmented Control */}
        <PeriodSelector
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {/* Period Summary Metric Pill */}
        <View style={styles.periodSummaryPill}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Period Revenue</Text>
            <Text style={styles.summaryValueIncome}>
              +{formatCurrency(currentReport.totalIncome)}
            </Text>
          </View>
          <View style={styles.pillDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Period Expense</Text>
            <Text style={styles.summaryValueExpense}>
              -{formatCurrency(currentReport.totalExpense)}
            </Text>
          </View>
          <View style={styles.pillDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net Change</Text>
            <Text
              style={[
                styles.summaryValueNet,
                {
                  color:
                    currentReport.netChange >= 0 ? colors.incomeDark : colors.expenseRed,
                },
              ]}
            >
              {formatCurrency(currentReport.netChange)}
            </Text>
          </View>
        </View>

        {/* Quick Action Floating Bar for Customer */}
        {isCustomer && (
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.quickActionLabel}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. Transaction List Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>
              {activePeriod === 'daily'
                ? "Today's Transactions"
                : activePeriod === 'weekly'
                ? 'This Week Transactions'
                : 'This Month Transactions'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredPeriodTransactions.length > 0
                ? `${filteredPeriodTransactions.length} transaction${filteredPeriodTransactions.length === 1 ? '' : 's'} recorded`
                : 'Showing recent activity'}
            </Text>
          </View>

          {isCustomer && (
            <TouchableOpacity onPress={() => (navigation as any).navigate('MainTabs', { screen: 'TransactionsTab' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Compact Transaction Rows Matching Reference */}
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => {
                if (isCustomer) {
                  navigation.navigate('EditTransaction', { transactionId: tx.id });
                }
              }}
            />
          ))
        ) : (
          <EmptyState
            title="No transactions for this period"
            message="No transactions recorded for the selected period."
            actionTitle={isCustomer ? 'Add Transaction' : undefined}
            onAction={
              isCustomer ? () => navigation.navigate('AddTransaction') : undefined
            }
          />
        )}

        {/* Administrator Notice if Admin */}
        {isAdmin && (
          <View style={styles.adminInfoCard}>
            <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            <View style={styles.adminInfoTextWrap}>
              <Text style={styles.adminInfoTitle}>Administrator Console</Text>
              <Text style={styles.adminInfoDesc}>
                Viewing aggregates and analysis. Transaction modification is restricted to Customer accounts.
              </Text>
            </View>
          </View>
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

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 110,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  drawerToggle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  greetingContainer: {
    flex: 1,
  },

  greetingText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
  },

  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },

  roleBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 10,
  },

  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    ...typography.subtitle2,
    color: colors.textWhite,
    fontWeight: '700',
  },

  // Revenue / expense summary
  periodSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },

  pillDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
  },

  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },

  summaryValueIncome: {
    ...typography.caption,
    color: colors.textBlue,
    fontWeight: '700',
    fontSize: 12,
  },

  summaryValueExpense: {
    ...typography.caption,
    color: colors.expenseRed,
    fontWeight: '700',
    fontSize: 12,
  },

  summaryValueNet: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },

  // Add transaction
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },

  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickActionLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },

  // Transactions section
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  sectionHeading: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 17,
  },

  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  seeAllText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },

  // Admin information
  adminInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  adminInfoTextWrap: {
    flex: 1,
  },

  adminInfoTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  adminInfoDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 18,
  },
});
