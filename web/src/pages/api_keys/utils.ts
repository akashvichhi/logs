import dayjs from 'dayjs';

/** Formats an ISO date string into a human-readable label. Returns an em-dash for empty values. */
export const formatApiKeyDate = (date: string | null | undefined): string => {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY HH:mm');
};
