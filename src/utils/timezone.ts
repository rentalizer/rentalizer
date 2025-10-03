// Simple timezone utilities for early release
import { formatDistanceToNow, format } from 'date-fns';

/**
 * Get user's timezone abbreviation (e.g., "PST", "EST", "PHT")
 */
export const getUserTimezone = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get timezone abbreviation
    const now = new Date();
    const timeZoneName = new Intl.DateTimeFormat('en', {
      timeZone,
      timeZoneName: 'short'
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value;
    
    return timeZoneName || 'Local';
  } catch (error) {
    console.warn('Could not detect timezone:', error);
    return 'Local';
  }
};

/**
 * Format date with timezone indicator
 */
export const formatDateWithTimezone = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    const timezone = getUserTimezone();
    
    return `${timeAgo} (${timezone})`;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Unknown time';
  }
};

/**
 * Format exact date and time with timezone
 */
export const formatExactDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const timezone = getUserTimezone();
    
    return format(date, 'MMM d, yyyy h:mm a') + ` (${timezone})`;
  } catch (error) {
    console.warn('Error formatting exact date:', error);
    return 'Unknown time';
  }
};

/**
 * Get a simple timezone notice for the UI
 */
export const getTimezoneNotice = (): string => {
  const timezone = getUserTimezone();
  return `All times shown in ${timezone} timezone`;
};
