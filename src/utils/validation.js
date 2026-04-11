/**
 * Validation Utilities
 * Common validation functions for forms
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate mobile number (10 digits)
 */
export const isValidMobileNumber = (number) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(number);
};

/**
 * Validate password strength
 * At least 6 characters
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Check if passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate full name (at least 2 characters)
 */
export const isValidFullName = (name) => {
  return name && name.trim().length >= 2;
};
