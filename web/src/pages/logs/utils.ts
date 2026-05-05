import dayjs from 'dayjs';

import type { ILogEntry, TLogLevel } from '@src/types/log';
import { generateAndDownloadCsv } from '@src/utils/download';

import { LOG_LEVEL_COLORS } from './constants';

/** Maps a log level to its Ant Design Tag color string. */
export const getLevelColor = (level: TLogLevel): string =>
  LOG_LEVEL_COLORS[level] ?? 'default';

/** Formats an ISO timestamp string into a readable local time. */
export const formatLogTimestamp = (ts: string): string =>
  dayjs(ts).format('MMM D, YYYY HH:mm:ss');

/** Column headers for the logs CSV export. */
const CSV_HEADERS = ['ID', 'Timestamp', 'Level', 'Service', 'Message', 'Metadata'] as const;

/**
 * Maps an array of ILogEntry objects into formatted string rows and delegates
 * to the generic generateAndDownloadCsv utility to build and download the file.
 *
 * @param rows     - The log entries to export.
 * @param filename - Optional download filename (defaults to 'logs_export.csv').
 */
export const exportLogsToCsv = (rows: ILogEntry[], filename: string = 'logs_export.csv'): void => {
  const dataRows: string[][] = rows.map((row) => [
    String(row.id),
    formatLogTimestamp(row.timestamp),
    row.level ?? '',
    row.service ?? '',
    row.message,
    row.metadata ? JSON.stringify(row.metadata) : '',
  ]);

  generateAndDownloadCsv([...CSV_HEADERS], dataRows, filename);
};
