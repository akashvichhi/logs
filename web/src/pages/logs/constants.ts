import type { DefaultOptionType } from "antd/es/select";

export const DEFAULT_PAGE_SIZE = 25;

export const PAGE_SIZE_OPTIONS: DefaultOptionType[] = [
  { label: '25 / page', value: 25 },
  { label: '50 / page', value: 50 },
  { label: '100 / page', value: 100 },
] as const;

export const LOG_LEVEL_OPTIONS: DefaultOptionType[] = [
  { label: 'All Levels', value: '' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'WARN', value: 'WARN' },
  { label: 'INFO', value: 'INFO' },
  { label: 'DEBUG', value: 'DEBUG' },
  { label: 'TRACE', value: 'TRACE' },
] as const;

/**
 * Tag color map for Ant Design `<Tag color={...}>`.
 * Kept here so color decisions are auditable in one place.
 */
export const LOG_LEVEL_COLORS = {
  ERROR: 'error',
  WARN:  'warning',
  INFO:  'processing',
  DEBUG: 'default',
  TRACE: 'cyan',
} as const;
