import { useQuery } from '@tanstack/react-query';

import type { ILogsSearchParams, ILogsSearchResponse } from '@src/types/log';

import { apiGet } from './axios';

const QUERY_KEY = 'logs';

// Private request function — never exported
const getLogs = (params: ILogsSearchParams): Promise<ILogsSearchResponse> =>
  apiGet<ILogsSearchResponse>('/api/v1/logs/search', params);

// Exported React Query hook
export const useGetLogs = (params: ILogsSearchParams) =>
  useQuery({
    queryKey:             [QUERY_KEY, params],
    queryFn:              () => getLogs(params),
    refetchOnWindowFocus: 'always',
  });
