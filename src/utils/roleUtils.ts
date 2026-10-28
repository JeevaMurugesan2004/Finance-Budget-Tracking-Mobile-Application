import { UserRole } from '../types';

/**
 * Normalizes any role string ('customer', 'Customer', 'admin', 'Admin', 'Administrator', etc.)
 * to strict lowercase UserRole ('admin' | 'customer').
 */
export const normalizeRole = (role?: string | null): 'admin' | 'customer' => {
  if (!role || typeof role !== 'string') {
    return 'customer';
  }
  const clean = role.trim().toLowerCase();
  if (clean === 'admin' || clean === 'administrator') {
    return 'admin';
  }
  return 'customer';
};

/**
 * Returns true if the provided role represents a Customer account
 */
export const isCustomerRole = (role?: string | null): boolean => {
  return normalizeRole(role) === 'customer';
};

/**
 * Returns true if the provided role represents an Admin / Administrator account
 */
export const isAdminRole = (role?: string | null): boolean => {
  return normalizeRole(role) === 'admin';
};

/**
 * Formats a role for display in badges and headers ('Admin' or 'Customer')
 */
export const formatRoleDisplay = (role?: string | null): 'Admin' | 'Customer' => {
  return isAdminRole(role) ? 'Admin' : 'Customer';
};
