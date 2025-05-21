/**
 * Truncate text to a specified length and add ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation (default: 100)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength = 100): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format a phone number to a readable format
 * @param phoneNumber The phone number to format (e.g., 0912345678)
 * @returns Formatted phone number (e.g., 091 234 5678)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // For Syrian phone numbers (starting with 09)
  if (/^09\d{8}$/.test(phoneNumber)) {
    return phoneNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4');
  }
  
  return phoneNumber;
};

/**
 * Format a number to include thousands separators
 * @param value The number to format
 * @param locale Locale for number formatting (default: 'ar')
 * @returns Formatted number string
 */
export const formatNumber = (value: number, locale = 'ar'): string => {
  return new Intl.NumberFormat(locale).format(value);
};