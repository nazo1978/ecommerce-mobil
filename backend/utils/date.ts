/**
 * Date utility functions
 */

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add hours to a date
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Add minutes to a date
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

/**
 * Get start of day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get start of week
 */
export const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  result.setDate(diff);
  return startOfDay(result);
};

/**
 * Get end of week
 */
export const endOfWeek = (date: Date): Date => {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
};

/**
 * Get start of month
 */
export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
};

/**
 * Get end of month
 */
export const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Get difference in days between two dates
 */
export const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in hours between two dates
 */
export const differenceInHours = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

/**
 * Get difference in minutes between two dates
 */
export const differenceInMinutes = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60));
};

/**
 * Format date to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format date to Turkish locale
 */
export const formatToTurkish = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date to short format
 */
export const formatShort = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format time only
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'şimdi';
  } else if (diffMins < 60) {
    return `${diffMins} dakika önce`;
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`;
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`;
  } else {
    return formatShort(date);
  }
};

/**
 * Check if date is within range
 */
export const isWithinRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

/**
 * Get next occurrence of a specific day of week
 */
export const getNextDayOfWeek = (dayOfWeek: number, fromDate: Date = new Date()): Date => {
  const result = new Date(fromDate);
  const currentDay = result.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  
  if (daysUntilTarget === 0) {
    result.setDate(result.getDate() + 7); // Next week if it's the same day
  } else {
    result.setDate(result.getDate() + daysUntilTarget);
  }
  
  return result;
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Parse date from various formats
 */
export const parseDate = (input: string | Date): Date => {
  if (input instanceof Date) {
    return input;
  }
  
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${input}`);
  }
  
  return date;
};
