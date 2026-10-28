/**
 * Currency utility for Indian Rupees (INR)
 * Locale: en-IN with Indian number grouping (thousands, lakhs, crores)
 */
export const formatCurrency = (amount: number): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(safeAmount);
};

/**
 * Format currency without decimal zeroes if whole number
 */
export const formatCurrencyCompact = (amount: number): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeAmount);
};
