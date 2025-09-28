/**
 * Utility function to parse numeric input naturally
 * Allows users to type numbers without input field jumping around
 */
export const parseNumericInput = (value: string): number => {
  // Remove any non-digit characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  // Convert to number, return 0 if invalid
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
};

/**
 * Format number for display in input
 */
export const formatInputValue = (value: number | undefined): string => {
  return value === undefined || value === 0 ? '' : value.toString();
};