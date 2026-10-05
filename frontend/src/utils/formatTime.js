/**
 * Formats a time string into 12-hour AM/PM format.
 * e.g., '10:00:00' or '10:00' -> '10:00 AM'
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—';

  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12

    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
}

/**
 * Formats slot range: e.g. start='10:00:00', end='11:00:00' -> '10:00 AM - 11:00 AM'
 */
export function formatSlotTime(startTime, endTime) {
  if (!startTime || !endTime) return '—';
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}
