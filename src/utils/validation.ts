/**
 * Validate a Syrian phone number
 * @param phoneNumber The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const isValidSyrianPhoneNumber = (phoneNumber: string): boolean => {
  return /^09\d{8}$/.test(phoneNumber);
};

/**
 * Check if a string is a valid URL
 * @param url The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if a date string is in the future
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is in the future
 */
export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

/**
 * Check if a date string is a valid date
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is valid
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};