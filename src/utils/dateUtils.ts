export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns 'YYYY-MM-DD' from a Date object
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date string 'YYYY-MM-DD' to 'DD MMM YYYY', e.g. '28 Oct 2026'
 */
export const formatDateReadable = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parts[2];
  const monthName = MONTH_NAMES_SHORT[monthIndex] || parts[1];
  return `${day} ${monthName} ${year}`;
};

/**
 * Formats a date string 'YYYY-MM-DD' with time, e.g. '28 Oct, 10:30 AM'
 */
export const formatDateWithTime = (dateStr: string, createdAt?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parts[2];
  const monthName = MONTH_NAMES_SHORT[monthIndex] || parts[1];

  let timePart = '10:30 AM';
  if (createdAt) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        timePart = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      }
    } catch {}
  }

  return `${day} ${monthName}, ${timePart}`;
};

/**
 * Formats a date string 'YYYY-MM-DD' to 'DD MMM'
 */
export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parts[2];
  const monthName = MONTH_NAMES_SHORT[monthIndex] || parts[1];
  return `${day} ${monthName}`;
};

/**
 * Returns start and end of current week (Monday to Sunday) for a given date
 */
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date);
  const day = d.getDay();
  // Monday as start of week:
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};

/**
 * Returns start and end of PREVIOUS week (Monday to Sunday)
 */
export const getPreviousWeekRange = (date: Date = new Date()): { start: Date; end: Date } => {
  const currentWeek = getWeekRange(date);
  const prevMonday = new Date(currentWeek.start);
  prevMonday.setDate(prevMonday.getDate() - 7);
  prevMonday.setHours(0, 0, 0, 0);

  const prevSunday = new Date(prevMonday);
  prevSunday.setDate(prevMonday.getDate() + 6);
  prevSunday.setHours(23, 59, 59, 999);

  return { start: prevMonday, end: prevSunday };
};

/**
 * Checks if a date string 'YYYY-MM-DD' falls on the same calendar day as targetDate
 */
export const isSameDay = (dateStr: string, targetDate: Date = new Date()): boolean => {
  const targetISO = formatDateToISO(targetDate);
  return dateStr === targetISO;
};

/**
 * Checks if a date string 'YYYY-MM-DD' is within the current week (Monday - Sunday)
 */
export const isCurrentWeek = (dateStr: string, targetDate: Date = new Date()): boolean => {
  const { start, end } = getWeekRange(targetDate);
  const itemDate = new Date(`${dateStr}T00:00:00`);
  return itemDate >= start && itemDate <= end;
};

/**
 * Checks if a date string 'YYYY-MM-DD' is within the previous week
 */
export const isPreviousWeek = (dateStr: string, targetDate: Date = new Date()): boolean => {
  const { start, end } = getPreviousWeekRange(targetDate);
  const itemDate = new Date(`${dateStr}T00:00:00`);
  return itemDate >= start && itemDate <= end;
};

/**
 * Checks if a date string 'YYYY-MM-DD' is within the current month & year
 */
export const isCurrentMonth = (dateStr: string, targetDate: Date = new Date()): boolean => {
  if (!dateStr) return false;
  const [yearStr, monthStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  return year === targetDate.getFullYear() && month === targetDate.getMonth() + 1;
};

/**
 * Checks if a date string 'YYYY-MM-DD' is in a specific month (1-12) and year
 */
export const isInMonthAndYear = (dateStr: string, month: number, year: number): boolean => {
  if (!dateStr) return false;
  const [yearStr, monthStr] = dateStr.split('-');
  return parseInt(yearStr, 10) === year && parseInt(monthStr, 10) === month;
};
