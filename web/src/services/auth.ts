import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMessageApi } from '@src/lib/ant_message';
import type { IUser } from '@src/types/user';
import { clearToken, setToken, TOKEN_KEY } from '@src/utils/token';

import { apiGet, apiPost } from './axios';

const apiBase = '/api/v1/auth';
const queryKey = 'me';

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ITokenResponse {
  accessToken: string;
  tokenType: string;
}

const loginApi = (body: ILoginRequest) => apiPost<ITokenResponse>(`${apiBase}/login`, body);
const getMe = () => apiGet<IUser>(`${apiBase}/me`);

export const useCurrentUser = () =>
  useQuery({
    queryKey: [queryKey],
    queryFn:  getMe,
    retry:    false,
    enabled:  !!localStorage.getItem(TOKEN_KEY),
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess:  (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSettled:  () => {
      clearToken();
      queryClient.clear();
    },
  });
};

