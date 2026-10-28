import React, { useState } from 'react';
import {
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
import { Ionicons } from '@expo/vector-icons';
import {
  CategoryDonutChart,
  IncomeVsExpenseChart,
  SpendingTrendChart,
} from '../components/FinanceCharts';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainDrawerParamList, PeriodType } from '../types';
import { calculateCategorySpendings, calculatePeriodReport } from '../utils/calculations';
import { formatCurrency } from '../utils/currency';

export const AnalysisScreen: React.FC = () => {
  const { transactions, categories, financialSummary } = useFinance();
  const [analysisPeriod, setAnalysisPeriod] = useState<PeriodType>('monthly');
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const currentPeriodReport = calculatePeriodReport(transactions, analysisPeriod, new Date());
  const periodCategories = calculateCategorySpendings(transactions, categories);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Drawer toggle */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.drawerToggle}
            onPress={() => drawerNavigation.openDrawer()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Financial Analysis</Text>
            <Text style={styles.headerSubtitle}>Insights & Spending Distribution</Text>
          </View>
        </View>

        {/* Period Selector Tabs */}
        <View style={styles.periodSwitcher}>
          {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((period) => {
            const isActive = analysisPeriod === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => setAnalysisPeriod(period)}
                style={[styles.periodTab, isActive && styles.periodTabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodTabText, isActive && styles.periodTabTextActive]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3 Metric Cards */}
        <View style={styles.summaryCardsRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.metricDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.metricLabel}>Income</Text>
            <Text style={styles.incomeValue}>
              +{formatCurrency(currentPeriodReport.totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.metricDot, { backgroundColor: colors.expense }]} />
            <Text style={styles.metricLabel}>Expenses</Text>
            <Text style={styles.expenseValue}>
              -{formatCurrency(currentPeriodReport.totalExpense)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.metricDot,
                { backgroundColor: currentPeriodReport.netChange >= 0 ? colors.income : colors.expense },
              ]}
            />
            <Text style={styles.metricLabel}>Net Change</Text>
            <Text
              style={[
                styles.balanceValue,
                {
                  color:
                    currentPeriodReport.netChange >= 0 ? colors.incomeDark : colors.expenseDark,
                },
              ]}
            >
              {formatCurrency(currentPeriodReport.netChange)}
            </Text>
          </View>
        </View>

        {/* Overall Lifetime Balance Banner */}
        <View style={styles.overallBanner}>
          <Text style={styles.overallBannerLabel}>Overall Account Net Balance:</Text>
          <Text style={styles.overallBannerAmount}>
            {formatCurrency(financialSummary.totalBalance)}
          </Text>
        </View>

        {/* Chart 1: Income vs Expense Comparative Bar Chart */}
        <IncomeVsExpenseChart
          income={currentPeriodReport.totalIncome}
          expense={currentPeriodReport.totalExpense}
          periodLabel={currentPeriodReport.label}
        />

        {/* Chart 2: Category Donut / Spending Distribution */}
        <CategoryDonutChart categories={periodCategories} />

        {/* Chart 3: Timeline Spending Trend */}
        <SpendingTrendChart transactions={transactions} period={analysisPeriod} />
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
    paddingTop: spacing.md,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  drawerToggle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  periodSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMint,
    borderRadius: borderRadius.card,
    padding: 4,
    marginBottom: spacing.md,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.card,
  },
  periodTabActive: {
    backgroundColor: colors.primary,
    ...shadows.subtle,
  },
  periodTabText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  periodTabTextActive: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  summaryCardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  incomeValue: {
    ...typography.caption,
    color: colors.incomeDark,
    fontWeight: '700',
    marginTop: 2,
  },
  expenseValue: {
    ...typography.caption,
    color: colors.expenseDark,
    fontWeight: '700',
    marginTop: 2,
  },
  balanceValue: {
    ...typography.caption,
    fontWeight: '700',
    marginTop: 2,
  },
  overallBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryUltraLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  overallBannerLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  overallBannerAmount: {
    ...typography.subtitle2,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
