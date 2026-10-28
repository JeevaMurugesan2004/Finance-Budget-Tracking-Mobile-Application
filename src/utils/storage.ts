import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Transaction, UserProfile, UserRole } from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { getInitialSampleTransactions } from '../data/sampleTransactions';

// Versioned storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: '@finance_tracker_v1_transactions',
  CATEGORIES: '@finance_tracker_v1_categories',
  PROFILE: '@finance_tracker_v1_profile',
  AUTH_SESSION: '@finance_tracker_v1_auth_session',
  SETTINGS: '@finance_tracker_v1_settings',
};

export const defaultCustomerProfile: UserProfile = {
  id: 'usr-customer-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.in',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  memberSince: 'March 2026',
};

export const defaultAdminProfile: UserProfile = {
  id: 'usr-admin-1',
  name: 'Priya Patel',
  email: 'admin.priya@financetracker.in',
  phone: '+91 91234 56789',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  memberSince: 'January 2026',
};

/**
 * Loads transactions from AsyncStorage or seeds initial sample data
 */
export const loadStoredTransactions = async (): Promise<Transaction[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed initial data if none exists
    const initial = getInitialSampleTransactions();
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Error loading stored transactions:', err);
    return getInitialSampleTransactions();
  }
};

/**
 * Saves transactions to AsyncStorage
 */
export const saveStoredTransactions = async (transactions: Transaction[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return true;
  } catch (err) {
    console.error('Error saving transactions:', err);
    return false;
  }
};

/**
 * Loads categories from AsyncStorage or seeds defaults
 */
export const loadStoredCategories = async (): Promise<Category[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  } catch (err) {
    console.error('Error loading categories:', err);
    return INITIAL_CATEGORIES;
  }
};

/**
 * Saves categories to AsyncStorage
 */
export const saveStoredCategories = async (categories: Category[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (err) {
    console.error('Error saving categories:', err);
    return false;
  }
};

import { normalizeRole } from './roleUtils';

/**
 * Loads user profile for given role
 */
export const loadStoredProfile = async (role: UserRole = 'customer'): Promise<UserProfile> => {
  try {
    const normalizedRole = normalizeRole(role);
    const key = `${STORAGE_KEYS.PROFILE}_${normalizedRole}`;
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return {
          ...parsed,
          role: normalizedRole,
        };
      }
    }
    const defaultProfile = normalizedRole === 'admin' ? defaultAdminProfile : defaultCustomerProfile;
    await AsyncStorage.setItem(key, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (err) {
    console.error('Error loading profile:', err);
    const normalizedRole = normalizeRole(role);
    return normalizedRole === 'admin' ? defaultAdminProfile : defaultCustomerProfile;
  }
};

/**
 * Saves user profile for role
 */
export const saveStoredProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    const normalizedRole = normalizeRole(profile.role);
    const cleanProfile = {
      ...profile,
      role: normalizedRole,
    };
    const key = `${STORAGE_KEYS.PROFILE}_${normalizedRole}`;
    await AsyncStorage.setItem(key, JSON.stringify(cleanProfile));
    return true;
  } catch (err) {
    console.error('Error saving profile:', err);
    return false;
  }
};

/**
 * Loads active auth session
 */
export const loadStoredAuthSession = async (): Promise<{
  isAuthenticated: boolean;
  role: 'admin' | 'customer' | null;
  user: UserProfile | null;
}> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const normRole = parsed.role ? normalizeRole(parsed.role) : null;
        const normUser = parsed.user
          ? { ...parsed.user, role: normalizeRole(parsed.user.role) }
          : null;
        return {
          isAuthenticated: Boolean(parsed.isAuthenticated),
          role: normRole,
          user: normUser,
        };
      }
    }
  } catch (err) {
    console.error('Error loading auth session:', err);
  }
  return { isAuthenticated: false, role: null, user: null };
};

/**
 * Saves active auth session
 */
export const saveStoredAuthSession = async (
  session: { isAuthenticated: boolean; role: UserRole | null; user: UserProfile | null }
): Promise<boolean> => {
  try {
    const cleanSession = {
      isAuthenticated: Boolean(session.isAuthenticated),
      role: session.role ? normalizeRole(session.role) : null,
      user: session.user ? { ...session.user, role: normalizeRole(session.user.role) } : null,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(cleanSession));
    return true;
  } catch (err) {
    console.error('Error saving auth session:', err);
    return false;
  }
};

/**
 * Clears data to reset demo environment
 */
export const resetDemoData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TRANSACTIONS,
      STORAGE_KEYS.CATEGORIES,
      `${STORAGE_KEYS.PROFILE}_customer`,
      `${STORAGE_KEYS.PROFILE}_admin`,
      STORAGE_KEYS.AUTH_SESSION,
    ]);
  } catch (err) {
    console.error('Error resetting demo data:', err);
  }
};
