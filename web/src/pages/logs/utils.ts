import dayjs from 'dayjs';

import type { TLogLevel } from '@src/types/log';

import { LOG_LEVEL_COLORS } from './constants';

/** Maps a log level to its Ant Design Tag color string. */
export const getLevelColor = (level: TLogLevel): string =>
  LOG_LEVEL_COLORS[level] ?? 'default';

/** Formats an ISO timestamp string into a readable local time. */
export const formatLogTimestamp = (ts: string): string =>
  dayjs(ts).format('MMM D, YYYY HH:mm:ss');
