export const colors = {
  // Reference Design Palette
  primary: '#00CDA0', // Bright Teal from reference
  primaryDark: '#00A680',
  primaryLight: '#E2F8EB',
  primaryUltraLight: '#EBF9F2',

  // Backgrounds
  background: '#F0FFF3', // Very light mint green matching reference screenshot
  surface: '#FFFFFF',
  surfaceVariant: '#E6F8EE',
  surfaceMint: '#DCF8E8',

  // Typography
  textPrimary: '#062D2A', // Dark teal/black text from reference
  textSecondary: '#3F6762',
  textMuted: '#7D9E9A',
  textWhite: '#FFFFFF',
  textBlue: '#00A5FF', // Bright blue text for dates, time, and financial values
  accentNavy: '#062D2A', // Reference dark teal/navy for backwards compatibility


  // Financial Semantics (Reference design uses bright blue for positive & negative amounts)
  income: '#00A5FF',
  incomeDark: '#008CD9',
  incomeBg: '#EAF6FF',
  expense: '#00A5FF',
  expenseDark: '#0284C7',
  expenseBg: '#EAF6FF',
  expenseRed: '#EF4444',

  // Alerts & Highlights
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  info: '#00A5FF',
  infoBg: '#EFF8FF',

  // Borders, Dividers & Separators
  border: '#D0F1DF',
  borderLight: '#E2F7EB',
  divider: '#E4F6ED',
  tealSeparator: 'rgba(0, 205, 160, 0.35)',
  whiteSeparator: 'rgba(255, 255, 255, 0.4)',

  // Bottom Navigation
  navBarBg: '#E6F9EE',
  navBorder: '#CCEEDD',
  navActiveBg: '#00CDA0',
  navInactive: '#062D2A',

  // Overlays
  overlay: 'rgba(6, 45, 42, 0.5)',
  cardShadow: 'rgba(6, 45, 42, 0.04)',
};

export type Colors = typeof colors;
