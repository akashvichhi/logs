import { useQuery } from '@tanstack/react-query';
import { get } from './axios';

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel | null;
  service: string | null;
  message: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface LogsSearchResponse {
  total: number;
  page: number;
  limit: number;
  results: LogEntry[];
}

export interface LogsSearchParams {
  query?: string;
  from?: string;
  to?: string;
  level?: string;
  service?: string;
  page?: number;
  limit?: number;
}

export const searchLogs = (params: LogsSearchParams) =>
  get<LogsSearchResponse>('/api/v1/logs/search', params);

export const useLogs = (params: LogsSearchParams) =>
  useQuery({
    queryKey: ['logs', params],
    queryFn: () => searchLogs(params),
    keepPreviousData: true,
  });

