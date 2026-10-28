import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Category,
  CategorySpending,
  FinancialSummary,
  PeriodReport,
  PeriodType,
  PersonalizedAlert,
  Transaction,
} from '../types';
import {
  calculateCategorySpendings,
  calculateFinancialSummary,
  calculatePeriodReport,
} from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import {
  loadStoredCategories,
  loadStoredTransactions,
  resetDemoData as resetStorageData,
  saveStoredCategories,
  saveStoredTransactions,
} from '../utils/storage';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  activePeriod: PeriodType;
  setActivePeriod: (period: PeriodType) => void;
  activeAlert: PersonalizedAlert | null;
  financialSummary: FinancialSummary;
  currentReport: PeriodReport;
  categorySpendings: CategorySpending[];
  isLoading: boolean;

  // Actions
  addTransaction: (txData: Omit<Transaction, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (id: string, txData: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateCategoryBudget: (categoryId: string, budget: number) => Promise<{ success: boolean; error?: string }>;
  triggerAlert: (message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  dismissAlert: () => void;
  resetAllData: () => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');
  const [activeAlert, setActiveAlert] = useState<PersonalizedAlert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted transactions & categories on boot
  useEffect(() => {
    const initData = async () => {
      try {
        const [loadedTxs, loadedCats] = await Promise.all([
          loadStoredTransactions(),
          loadStoredCategories(),
        ]);
        setTransactions(loadedTxs);
        setCategories(loadedCats);
      } catch (err) {
        console.error('Failed to load initial finance data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Compute live calculations
  const financialSummary = calculateFinancialSummary(transactions);
  const currentReport = calculatePeriodReport(transactions, activePeriod, new Date());
  const categorySpendings = calculateCategorySpendings(transactions, categories);

  const triggerAlert = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'danger' = 'success'
  ) => {
    const alertItem: PersonalizedAlert = {
      id: `alert-${Date.now()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    setActiveAlert(alertItem);
  };

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  const addTransaction = async (
    txData: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
        amount: Number(txData.amount),
        createdAt: new Date().toISOString(),
      };

      const updated = [newTx, ...transactions];
      setTransactions(updated);
      await saveStoredTransactions(updated);

      // Trigger personalized alert
      const formattedAmount = formatCurrency(newTx.amount);
      const actionType = newTx.type === 'expense' ? 'expense' : 'income';
      const alertMsg = `Your ${formattedAmount} ${newTx.categoryName} ${actionType} was added successfully!`;
      triggerAlert(alertMsg, 'success');

      // Check if expense budget exceeded
      if (newTx.type === 'expense') {
        const category = categories.find((c) => c.id === newTx.categoryId);
        if (category && typeof category.budget === 'number' && category.budget > 0) {
          const budgetLimit = category.budget;
          const categoryName = category.name;
          const catTotal = updated
            .filter((t) => t.categoryId === newTx.categoryId && t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);

          if (catTotal >= budgetLimit) {
            setTimeout(() => {
              triggerAlert(
                `Budget Alert: You have exceeded the ${categoryName} monthly budget (${formatCurrency(budgetLimit)})!`,
                'warning'
              );
            }, 3500);
          } else if (catTotal >= budgetLimit * 0.8) {
            setTimeout(() => {
              triggerAlert(
                `Budget Notice: You have used ${Math.round((catTotal / budgetLimit) * 100)}% of your ${categoryName} budget.`,
                'info'
              );
            }, 3500);
          }
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add transaction' };
    }
  };

  const updateTransaction = async (
    id: string,
    txData: Partial<Transaction>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = transactions.find((t) => t.id === id);
      if (!target) {
        return { success: false, error: 'Transaction not found' };
      }

      const updatedTx: Transaction = {
        ...target,
        ...txData,
        amount: txData.amount !== undefined ? Number(txData.amount) : target.amount,
      };

      const updated = transactions.map((t) => (t.id === id ? updatedTx : t));
      setTransactions(updated);
      await saveStoredTransactions(updated);

      const formattedAmount = formatCurrency(updatedTx.amount);
      triggerAlert(`Your ${formattedAmount} ${updatedTx.categoryName} transaction was updated successfully.`, 'success');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update transaction' };
    }
  };

  const deleteTransaction = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = transactions.find((t) => t.id === id);
      if (!target) {
        return { success: false, error: 'Transaction not found' };
      }

      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      await saveStoredTransactions(updated);

      const formattedAmount = formatCurrency(target.amount);
      triggerAlert(`Your ${formattedAmount} transaction was deleted successfully.`, 'info');

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete transaction' };
    }
  };

  const updateCategoryBudget = async (
    categoryId: string,
    budget: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated = categories.map((cat) =>
        cat.id === categoryId ? { ...cat, budget: Math.max(0, budget) } : cat
      );
      setCategories(updated);
      await saveStoredCategories(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update category budget' };
    }
  };

  const resetAllData = async () => {
    await resetStorageData();
    const freshTxs = await loadStoredTransactions();
    const freshCats = await loadStoredCategories();
    setTransactions(freshTxs);
    setCategories(freshCats);
    triggerAlert('Demo data has been reset to defaults.', 'info');
  };

  const getTransactionById = (id: string) => transactions.find((t) => t.id === id);
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        activePeriod,
        setActivePeriod,
        activeAlert,
        financialSummary,
        currentReport,
        categorySpendings,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategoryBudget,
        triggerAlert,
        dismissAlert,
        resetAllData,
        getTransactionById,
        getCategoryById,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
