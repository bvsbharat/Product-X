/**
 * Utility functions for formatting time strings
 */

/**
 * Formats email time strings to be more readable
 * @param timeString - The time string from the email (e.g., '2 hours ago', '4 hours ago')
 * @returns Formatted time string
 */
export const formatEmailTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // If it's already a relative time (contains 'ago'), format it nicely
  if (timeString.includes('ago')) {
    const parts = timeString.split(' ');
    if (parts.length >= 3) {
      const number = parts[0];
      const unit = parts[1];
      
      // Convert to shorter format
      switch (unit) {
        case 'minute':
        case 'minutes':
          return `${number}m ago`;
        case 'hour':
        case 'hours':
          return `${number}h ago`;
        case 'day':
        case 'days':
          return `${number}d ago`;
        case 'week':
        case 'weeks':
          return `${number}w ago`;
        default:
          return timeString;
      }
    }
  }
  
  // If it's a timestamp, try to parse and format it
  const date = new Date(timeString);
  if (!isNaN(date.getTime())) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) {
      return 'now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // Format as date for older emails
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
  
  // Return original string if no formatting applied
  return timeString;
};

/**
 * Formats event time strings
 * @param timeString - The time string from the event
 * @returns Formatted time string
 */
export const formatEventTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // If it contains a time range (e.g., "10:00 AM - 11:00 AM")
  if (timeString.includes(' - ')) {
    const [start, end] = timeString.split(' - ');
    return `${start} - ${end}`;
  }
  
  return timeString;
};