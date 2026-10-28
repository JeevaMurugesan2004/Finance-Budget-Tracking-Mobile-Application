import { Transaction } from '../types';

/**
 * Returns formatted date string 'YYYY-MM-DD' offset by days from today
 */
export const getDateOffset = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialSampleTransactions = (): Transaction[] => [
  // Today's transactions
  {
    id: 'tx-001',
    title: 'Cafe Coffee Day & Snacks',
    amount: 350,
    type: 'expense',
    categoryId: 'cat-food',
    categoryName: 'Food & Dining',
    date: getDateOffset(0), // Today
    notes: 'Coffee with colleagues',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-002',
    title: 'Fresh Vegetables & Milk',
    amount: 450,
    type: 'expense',
    categoryId: 'cat-groceries',
    categoryName: 'Groceries',
    date: getDateOffset(0), // Today
    notes: 'Weekly fresh veggies from Reliance Fresh',
    createdAt: new Date().toISOString(),
  },

  // Yesterday
  {
    id: 'tx-003',
    title: 'Metro Smart Card Recharge',
    amount: 500,
    type: 'expense',
    categoryId: 'cat-transport',
    categoryName: 'Transportation',
    date: getDateOffset(-1),
    notes: 'Monthly metro pass',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-004',
    title: 'Pharmacy & Health Vitamins',
    amount: 800,
    type: 'expense',
    categoryId: 'cat-health',
    categoryName: 'Health',
    date: getDateOffset(-1),
    notes: 'Apollo Pharmacy purchase',
    createdAt: new Date().toISOString(),
  },

  // 3-5 days ago (This week)
  {
    id: 'tx-005',
    title: 'Dinner at Barbeque Nation',
    amount: 2500,
    type: 'expense',
    categoryId: 'cat-food',
    categoryName: 'Food & Dining',
    date: getDateOffset(-3),
    notes: 'Family dinner outing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-006',
    title: 'Electricity & Water Bill (Bescom)',
    amount: 1500,
    type: 'expense',
    categoryId: 'cat-bills',
    categoryName: 'Bills & Utilities',
    date: getDateOffset(-4),
    notes: 'Monthly power and water utilities',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-007',
    title: 'Weekend Groceries at D-Mart',
    amount: 2000,
    type: 'expense',
    categoryId: 'cat-groceries',
    categoryName: 'Groceries',
    date: getDateOffset(-5),
    notes: 'Household pantry supplies',
    createdAt: new Date().toISOString(),
  },

  // 7-14 days ago (This month)
  {
    id: 'tx-008',
    title: 'Zara Festive Clothing & Apparel',
    amount: 3000,
    type: 'expense',
    categoryId: 'cat-shopping',
    categoryName: 'Shopping',
    date: getDateOffset(-8),
    notes: 'Diwali festive shopping',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-009',
    title: 'Intercity Cab Booking (Ola/Uber)',
    amount: 1200,
    type: 'expense',
    categoryId: 'cat-travel',
    categoryName: 'Travel',
    date: getDateOffset(-10),
    notes: 'Travel to airport',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-010',
    title: 'Online Course Subscription (Udemy)',
    amount: 999,
    type: 'expense',
    categoryId: 'cat-education',
    categoryName: 'Education',
    date: getDateOffset(-12),
    notes: 'React Native & TypeScript Masterclass',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-011',
    title: 'Movie Tickets (PVR Cinemas)',
    amount: 750,
    type: 'expense',
    categoryId: 'cat-entertainment',
    categoryName: 'Entertainment',
    date: getDateOffset(-14),
    notes: 'Weekend movie with popcorn',
    createdAt: new Date().toISOString(),
  },

  // Income transactions this month
  {
    id: 'tx-012',
    title: 'Monthly Salary Credit',
    amount: 35000,
    type: 'income',
    categoryId: 'cat-salary',
    categoryName: 'Salary / Income',
    date: getDateOffset(-18),
    notes: 'Tech Corp monthly payroll transfer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-013',
    title: 'Freelance UI/UX Consultation',
    amount: 8500,
    type: 'income',
    categoryId: 'cat-freelance',
    categoryName: 'Freelance & Bonus',
    date: getDateOffset(-9),
    notes: 'Mobile app design review client project',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-014',
    title: 'Mutual Funds Dividend Yield',
    amount: 1800,
    type: 'income',
    categoryId: 'cat-investment',
    categoryName: 'Investments & Returns',
    date: getDateOffset(-6),
    notes: 'Quarterly equity mutual fund returns',
    createdAt: new Date().toISOString(),
  },

  // Transactions for previous month to support month selector testing
  {
    id: 'tx-015',
    title: 'Previous Month Salary',
    amount: 35000,
    type: 'income',
    categoryId: 'cat-salary',
    categoryName: 'Salary / Income',
    date: getDateOffset(-45),
    notes: 'Previous month base salary',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-016',
    title: 'Broadband Wi-Fi & Mobile Recharge',
    amount: 1299,
    type: 'expense',
    categoryId: 'cat-bills',
    categoryName: 'Bills & Utilities',
    date: getDateOffset(-42),
    notes: 'Airtel Fiber 100 Mbps',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-017',
    title: 'Footwear & Sports Shoes',
    amount: 2499,
    type: 'expense',
    categoryId: 'cat-shopping',
    categoryName: 'Shopping',
    date: getDateOffset(-40),
    notes: 'Running shoes from Decathlon',
    createdAt: new Date().toISOString(),
  },
];
