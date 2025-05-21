/**
 * Format a date string to a user-friendly format
 * @param dateString ISO date string
 * @param locale Locale for date formatting (default: 'ar')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale = 'ar'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
};

/**
 * Format a date string to include time
 * @param dateString ISO date string
 * @param locale Locale for date formatting (default: 'ar')
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string, locale = 'ar'): string => {
  const date = new Date(dateString);
  return date.toLocaleString(locale);
};

/**
 * Format a date for input[type="datetime-local"]
 * @param dateString ISO date string
 * @returns Formatted date string for input
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
};

/**
 * Calculate time difference between two dates in a human-readable format
 * @param dateString ISO date string
 * @returns Time ago string
 */
export const timeAgo = (dateString: string, locale = 'ar'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'منذ لحظات';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `منذ ${diffInDays} يوم`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} شهر`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `منذ ${diffInYears} سنة`;
};