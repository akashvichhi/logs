import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMessageApi } from '@src/lib/ant_message';
import type { IApiKey, IApiKeyWithSecret } from '@src/types/api_key';

import { apiDelete, apiGet, apiPost } from './axios';

const apiBase = '/api/v1/api-keys';
const queryKey = 'api-keys';

const listApiKeys = () => apiGet<IApiKey[]>(apiBase);

const createApiKeyApi = (name: string) =>
  apiPost<IApiKeyWithSecret>(apiBase, { name });

const revokeApiKeyApi = (id: number) =>
  apiDelete<void>(`${apiBase}/${id}`);

export const useApiKeys = () =>
  useQuery({
    queryKey: [queryKey],
    queryFn:  listApiKeys,
  });

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKeyApi,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKeyApi,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};

