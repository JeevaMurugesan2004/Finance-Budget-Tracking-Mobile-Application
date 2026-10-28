import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { EmptyState } from "../components/EmptyState";
import { AdminRestrictedView } from "../components/AdminRestrictedView";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { MainDrawerParamList, RootStackParamList } from "../types";
import { formatCurrency } from "../utils/currency";
import { isCustomerRole } from "../utils/roleUtils";

type CategoryIconName = React.ComponentProps<typeof Ionicons>["name"];
type DateFilter = "all" | "today" | "week" | "month" | "custom";

const getCategoryIcon = (name: string): CategoryIconName => {
  const value = name.toLowerCase();
  if (value.includes("food") || value.includes("dining"))
    return "restaurant-outline";
  if (value.includes("grocery")) return "basket-outline";
  if (value.includes("shopping")) return "cart-outline";
  if (value.includes("rent") || value.includes("home")) return "home-outline";
  if (value.includes("salary")) return "wallet-outline";
  if (value.includes("transport")) return "car-outline";
  if (value.includes("health") || value.includes("medical"))
    return "medkit-outline";
  if (value.includes("bill") || value.includes("utilit"))
    return "receipt-outline";
  if (value.includes("education")) return "school-outline";
  if (value.includes("entertainment")) return "film-outline";
  if (value.includes("saving")) return "cash-outline";
  if (value.includes("travel")) return "airplane-outline";
  return "grid-outline";
};

const getCategoryColor = (name: string): string => {
  const value = name.toLowerCase();
  if (value.includes("food") || value.includes("dining")) return "#FFEEE8";
  if (value.includes("grocery")) return "#E2F8E9";
  if (value.includes("shopping")) return "#F0E8FF";
  if (value.includes("rent") || value.includes("home")) return "#E5F1FF";
  if (value.includes("salary")) return "#DDF8E4";
  if (value.includes("transport")) return "#FFF0D9";
  if (value.includes("health")) return "#FFE6EB";
  if (value.includes("bill") || value.includes("utilit")) return "#E5F8F7";
  return colors.primaryUltraLight;
};

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const CategoriesScreen: React.FC = () => {
  const { role, user } = useAuth();
  const isCustomer = isCustomerRole(role || user?.role);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const drawerNavigation =
    useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  // Assumes FinanceContext exposes transactions.
  const { transactions } = useFinance();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [startDate, setStartDate] = useState(dateKey(new Date()));
  const [endDate, setEndDate] = useState(dateKey(new Date()));
  const [datePickerTarget, setDatePickerTarget] = useState<
    "start" | "end" | null
  >(null);

  const today = dateKey(new Date());

  const range = useMemo(() => {
    const now = new Date();
    let start = "";
    let end = today;

    if (dateFilter === "today") {
      start = today;
    } else if (dateFilter === "week") {
      const monday = new Date(now);
      const day = monday.getDay();
      monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
      start = dateKey(monday);
    } else if (dateFilter === "month") {
      start = dateKey(new Date(now.getFullYear(), now.getMonth(), 1));
    } else if (dateFilter === "custom") {
      start = startDate;
      end = endDate;
    }

    return { start, end };
  }, [dateFilter, startDate, endDate, today]);

  const validRange = dateFilter !== "custom" || range.start <= range.end;

  const filteredTransactions = useMemo(() => {
    if (!validRange) return [];

    return transactions.filter((transaction) => {
      if (transaction.type !== "expense") return false;
      if (dateFilter === "all") return true;

      return transaction.date >= range.start && transaction.date <= range.end;
    });
  }, [transactions, dateFilter, range.start, range.end, validRange]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return filteredTransactions
      .reduce<
        {
          categoryId: string;
          categoryName: string;
          totalAmount: number;
          transactionCount: number;
        }[]
      >((result, transaction) => {
        const name = transaction.categoryName || "Other";
        const existing = result.find(
          (item) => item.categoryId === transaction.categoryId,
        );

        if (existing) {
          existing.totalAmount += transaction.amount;
          existing.transactionCount += 1;
        } else {
          result.push({
            categoryId: transaction.categoryId,
            categoryName: name,
            totalAmount: transaction.amount,
            transactionCount: 1,
          });
        }

        return result;
      }, [])
      .filter((category) => category.categoryName.toLowerCase().includes(query))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, searchQuery]);

  const totalExpense = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  if (!isCustomer) {
    return <AdminRestrictedView featureName="Overall Categories" />;
  }

  const dateOptions: { label: string; value: DateFilter }[] = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.drawerToggle}
          onPress={() => drawerNavigation.openDrawer()}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu-outline" size={27} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>Explore date-wise spending</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="grid-outline" size={22} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryBanner}>
          <View style={styles.summaryIcon}>
            <Ionicons name="wallet-outline" size={26} color={colors.primary} />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(totalExpense)}
            </Text>
            <Text style={styles.summaryCaption}>
              {filteredTransactions.length} transactions
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Filter by Date</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {dateOptions.map((option) => {
            const selected = dateFilter === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                ]}
                onPress={() => setDateFilter(option.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {dateFilter === "custom" && (
          <View style={styles.customDateCard}>
            <Text style={styles.dateLabel}>Start date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDatePickerTarget("start")}
            >
              <Ionicons
                name="calendar-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={styles.dateButtonText}>
                {formatDateLabel(startDate)}
              </Text>
            </TouchableOpacity>

            <Text style={styles.dateLabel}>End date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDatePickerTarget("end")}
            >
              <Ionicons
                name="calendar-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={styles.dateButtonText}>
                {formatDateLabel(endDate)}
              </Text>
            </TouchableOpacity>

            {!validRange && (
              <Text style={styles.errorText}>
                End date must be on or after the start date.
              </Text>
            )}

            {datePickerTarget && (
              <DateTimePicker
                value={
                  new Date(
                    ...((datePickerTarget === "start" ? startDate : endDate)
                      .split("-")
                      .map(Number)
                      .map((value, index) =>
                        index === 1 ? value - 1 : value,
                      ) as [number, number, number]),
                  )
                }
                mode="date"
                maximumDate={new Date()}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selectedDate) => {
                  setDatePickerTarget(null);
                  if (!selectedDate) return;

                  const selectedKey = dateKey(selectedDate);

                  if (datePickerTarget === "start") {
                    setStartDate(selectedKey);
                  } else {
                    setEndDate(selectedKey);
                  }
                }}
              />
            )}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Expense Categories</Text>
            <Text style={styles.sectionHint}>
              {dateFilter === "all"
                ? "Showing all recorded expenses"
                : validRange
                  ? `${formatDateLabel(range.start)} – ${formatDateLabel(range.end)}`
                  : "Please correct your date range"}
            </Text>
          </View>
          <Text style={styles.countBadgeText}>
            {filteredCategories.length} categories
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {filteredCategories.length > 0 && validRange ? (
          <View style={styles.categoryGrid}>
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={category.categoryId}
                style={styles.categoryCard}
                activeOpacity={0.75}
                onPress={() =>
                  navigation.navigate("CategoryDetails", {
                    categoryId: category.categoryId,
                  })
                }
              >
                <View
                  style={[
                    styles.categoryIconCircle,
                    {
                      backgroundColor: getCategoryColor(category.categoryName),
                    },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(category.categoryName)}
                    size={27}
                    color={colors.primaryDark}
                  />
                </View>

                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.categoryName}
                </Text>

                <Text style={styles.categoryAmount} numberOfLines={1}>
                  {formatCurrency(category.totalAmount)}
                </Text>

                <Text style={styles.categoryHint}>
                  {category.transactionCount}{" "}
                  {category.transactionCount === 1
                    ? "transaction"
                    : "transactions"}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetails}>View details</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <EmptyState
            title={validRange ? "No expenses found" : "Invalid date range"}
            message={
              validRange
                ? "No expense transactions match the selected period."
                : "Choose an end date on or after the start date."
            }
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  drawerToggle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  headerTitles: { flex: 1 },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryUltraLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  summaryBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryUltraLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  summaryInfo: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  summaryAmount: {
    ...typography.h2,
    color: colors.expenseDark,
    marginTop: 3,
  },
  summaryCaption: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  filterRow: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  filterChipTextSelected: { color: "#FFFFFF" },
  customDateCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  dateButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
  },
  dateButtonText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  errorText: {
    color: "#D93025",
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  countBadgeText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    minHeight: 50,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body1,
    paddingVertical: spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    minHeight: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  categoryName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  categoryAmount: {
    ...typography.body1,
    color: colors.expenseDark,
    fontWeight: "700",
  },
  categoryHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: 4,
  },
  viewDetails: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
});
