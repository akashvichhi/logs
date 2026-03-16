import { useQuery } from '@tanstack/react-query';

import type { LogEntry } from '@src/types/log';

import { apiGet } from './axios';

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
  apiGet<LogsSearchResponse>('/api/v1/logs/search', params);

export const useLogs = (params: LogsSearchParams) =>
  useQuery({
    queryKey: ['logs', params],
    queryFn:  () => searchLogs(params),
  });

