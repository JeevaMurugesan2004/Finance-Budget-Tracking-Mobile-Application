export type UserRole = 'admin' | 'customer' | 'Admin' | 'Customer' | 'Administrator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  memberSince?: string;
}

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  type: TransactionType;
  budget?: number; // In INR
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export interface PeriodReport {
  period: PeriodType;
  startDate: string;
  endDate: string;
  label: string;
  totalIncome: number;
  totalExpense: number;
  netChange: number; // Income - Expense for period
  transactionCount: number;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  bgColor: string;
  totalAmount: number;
  percentage: number;
  budget?: number;
  budgetProgress?: number; // 0 to 1
  transactionCount: number;
}

export interface PersonalizedAlert {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timestamp: number;
}

// Navigation Param Lists
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainDrawer: undefined;
  AddTransaction: undefined;
  EditTransaction: { transactionId: string };
  EditProfile: undefined;
  CategoryDetails: { categoryId: string };
};

export type MainDrawerParamList = {
  MainTabs: undefined;
  DrawerHome: undefined;
  DrawerAnalysis: undefined;
  DrawerTransactions: undefined;
  DrawerCategories: undefined;
  DrawerProfile: undefined;
  DrawerEditProfile: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  AnalysisTab: undefined;
  TransactionsTab: undefined;
  CategoriesTab: undefined;
  ProfileTab: undefined;
};
