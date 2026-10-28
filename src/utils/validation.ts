/**
 * Email format validation
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. user@example.com)' };
  }
  return { isValid: true };
};

/**
 * Indian phone number validation
 * Supports: 10 digits starting with 6, 7, 8, or 9; optionally with +91 or 0 prefix
 */
export const validateIndianPhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Matches +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, or XXXXXXXXXX
  const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210)',
    };
  }
  return { isValid: true };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};

/**
 * Password confirmation validation
 */
export const validatePasswordConfirm = (
  password: string,
  confirm: string
): { isValid: boolean; error?: string } => {
  if (!confirm) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirm) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
};

/**
 * Transaction form validation
 */
export const validateTransaction = (data: {
  title: string;
  amount: string | number;
  categoryId: string;
  date: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Transaction description is required';
  } else if (data.title.trim().length < 2) {
    errors.title = 'Description must be at least 2 characters';
  }

  const numericAmount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
  if (isNaN(numericAmount) || numericAmount <= 0) {
    errors.amount = 'Amount must be a positive number greater than 0';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Please select a category';
  }

  if (!data.date || !data.date.trim()) {
    errors.date = 'Date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Date must be in YYYY-MM-DD format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Profile form validation
 */
export const validateProfile = (data: {
  name: string;
  email: string;
  phone: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid && emailResult.error) {
    errors.email = emailResult.error;
  }

  const phoneResult = validateIndianPhone(data.phone);
  if (!phoneResult.isValid && phoneResult.error) {
    errors.phone = phoneResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
