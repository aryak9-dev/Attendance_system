/**
 * Formats a date string into readable formats.
 * e.g., '2026-09-13' -> '13 Sep 2026'
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch (err) {
    return dateString;
  }
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
