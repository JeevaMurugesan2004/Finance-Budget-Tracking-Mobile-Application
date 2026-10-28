import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackParamList, TransactionType } from '../types';
import { formatCurrency } from '../utils/currency';
import { validateTransaction } from '../utils/validation';

type EditTransactionScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'EditTransaction'>;
type EditTransactionScreenRouteProp = RouteProp<RootStackParamList, 'EditTransaction'>;

interface EditTransactionScreenProps {
  navigation: EditTransactionScreenNavProp;
  route: EditTransactionScreenRouteProp;
}

export const EditTransactionScreen: React.FC<EditTransactionScreenProps> = ({
  navigation,
  route,
}) => {
  const { transactionId } = route.params;
  const { getTransactionById, categories, updateTransaction, deleteTransaction } = useFinance();

  const existingTx = getTransactionById(transactionId);

  const [type, setType] = useState<TransactionType>(existingTx?.type || 'expense');
  const [title, setTitle] = useState(existingTx?.title || '');
  const [amount, setAmount] = useState(existingTx?.amount ? String(existingTx.amount) : '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(existingTx?.categoryId || '');
  const [date, setDate] = useState(existingTx?.date || '');
  const [notes, setNotes] = useState(existingTx?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!existingTx) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorHeading}>Transaction Not Found</Text>
          <AppButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const availableCategories = categories.filter((c) => c.type === type);

  const handleUpdate = async () => {
    setGeneralError(null);
    const valResult = validateTransaction({
      title,
      amount,
      categoryId: selectedCategoryId,
      date,
    });

    if (!valResult.isValid) {
      setErrors(valResult.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
      const res = await updateTransaction(transactionId, {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId: selectedCategoryId,
        categoryName: selectedCategory ? selectedCategory.name : existingTx.categoryName,
        date: date.trim(),
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        navigation.goBack();
      } else {
        setGeneralError(res.error || 'Failed to update transaction');
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Error occurred while saving changes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${existingTx.title}" of ${formatCurrency(existingTx.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transactionId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Transaction</Text>
            <TouchableOpacity
              style={styles.deleteIconBtn}
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={22} color={colors.expense} />
            </TouchableOpacity>
          </View>

          {/* Income / Expense Switcher */}
          <View style={styles.typeSwitcher}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
              onPress={() => setType('expense')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={type === 'expense' ? colors.expense : colors.textMuted}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  type === 'expense' && styles.typeBtnTextExpenseActive,
                ]}
              >
                Expense (-)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
              onPress={() => setType('income')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-down"
                size={18}
                color={type === 'income' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  type === 'income' && styles.typeBtnTextIncomeActive,
                ]}
              >
                Income (+)
              </Text>
            </TouchableOpacity>
          </View>

          {generalError && (
            <View style={styles.generalErrorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.expense} />
              <Text style={styles.generalErrorText}>{generalError}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.card}>
            <AppInput
              label="Amount in Indian Rupees (₹)"
              placeholder="e.g. 500"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              leftIcon="cash-outline"
              error={errors.amount}
            />

            <AppInput
              label="Description / Title"
              placeholder="e.g. Coffee & snacks"
              value={title}
              onChangeText={setTitle}
              leftIcon="receipt-outline"
              error={errors.title}
            />

            {/* Category Selector Grid */}
            <View style={styles.categoryPickerSection}>
              <Text style={styles.categoryPickerLabel}>Category *</Text>
              {errors.categoryId && (
                <Text style={styles.categoryErrorText}>{errors.categoryId}</Text>
              )}

              <View style={styles.categoryGrid}>
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catChip,
                        isSelected && { borderColor: cat.color, backgroundColor: cat.bgColor },
                      ]}
                      onPress={() => setSelectedCategoryId(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={cat.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={isSelected ? cat.color : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.catChipText,
                          isSelected && { color: cat.color, fontWeight: '700' },
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <AppInput
              label="Date (YYYY-MM-DD)"
              placeholder="2026-10-28"
              value={date}
              onChangeText={setDate}
              leftIcon="calendar-outline"
              error={errors.date}
            />

            <AppInput
              label="Notes (Optional)"
              placeholder="Additional details"
              value={notes}
              onChangeText={setNotes}
              leftIcon="document-text-outline"
              multiline
              numberOfLines={2}
            />

            <View style={styles.btnRow}>
              <AppButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.cancelBtn}
              />
              <AppButton
                title={loading ? 'Saving...' : 'Update Transaction'}
                onPress={handleUpdate}
                loading={loading}
                variant="primary"
                style={styles.saveBtn}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
  },
  deleteIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.expenseBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorHeading: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.md,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.expenseBg,
    ...shadows.subtle,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.incomeBg,
    ...shadows.subtle,
  },
  typeBtnText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeBtnTextExpenseActive: {
    color: colors.expense,
    fontWeight: '700',
  },
  typeBtnTextIncomeActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.expenseBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  generalErrorText: {
    ...typography.body2,
    color: colors.expense,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  categoryPickerSection: {
    marginBottom: spacing.md,
  },
  categoryPickerLabel: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  categoryErrorText: {
    ...typography.caption,
    color: colors.expense,
    marginBottom: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
    maxWidth: '48%',
  },
  catChipText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});
