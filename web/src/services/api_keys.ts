import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { IApiKey, IApiKeyWithSecret } from '@src/types/api_key';
import { getMessageApi } from '@src/utils/ant_message';

import { apiDelete, apiGet, apiPost } from './axios';

const API_BASE  = '/api/v1/api-keys';
const QUERY_KEY = 'api-keys';

// Private request functions — never exported
const getApiKeys = (): Promise<IApiKey[]> =>
  apiGet<IApiKey[]>(API_BASE);

const createApiKey = (name: string): Promise<IApiKeyWithSecret> =>
  apiPost<IApiKeyWithSecret>(API_BASE, { name });

const revokeApiKey = (id: number): Promise<void> =>
  apiDelete<void>(`${API_BASE}/${id}`);

// Exported React Query hooks
export const useGetApiKeys = () =>
  useQuery({
    queryKey: [QUERY_KEY],
    queryFn:  getApiKeys,
  });

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKey,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};
