import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, get, post } from './axios';

export interface ApiKey {
  id: number;
  name: string;
  prefix: string;
  is_active: boolean;
  created_at: string;
  last_used?: string | null;
}

export interface ApiKeyWithSecret extends ApiKey {
  full_key: string;
}

const listApiKeys = () => get<ApiKey[]>('/api/v1/api-keys');

const createApiKeyApi = (name: string) =>
  post<ApiKeyWithSecret>('/api/v1/api-keys', { name });

const revokeApiKeyApi = (id: number) =>
  del<void>(`/api/v1/api-keys/${id}`);

export const useApiKeys = () =>
  useQuery({
    queryKey: ['api-keys'],
    queryFn: listApiKeys,
  });

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKeyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKeyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });
};

