/**
 * Date utility functions for formatting and relative time display
 */

/**
 * Get relative time string (e.g., "5 days ago", "just now")
 */
export function getRelativeTime(date: string | null): string {
  if (!date) return 'Never';

  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get number of days since a date
 */
export function getDaysSince(date: string | null): number | null {
  if (!date) return null;

  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if equipment needs cleaning (>25 days since last cleaned)
 */
export function needsCleaning(lastCleanedDate: string | null): boolean {
  const days = getDaysSince(lastCleanedDate);
  return days !== null && days > 25;
}

/**
 * Format date for display (e.g., "22/02/2026")
 */
export function formatDate(date: string | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
}

/**
 * Format date with relative time (e.g., "22/02/2026 (5 days ago)")
 */
export function formatDateWithRelative(date: string | null): string {
  if (!date) return 'N/A';
  const formatted = formatDate(date);
  const relative = getRelativeTime(date);
  return `${formatted} (${relative})`;
}
