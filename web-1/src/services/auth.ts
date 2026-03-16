import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post } from './axios';
import { clearToken, setToken } from '../utils/token';
import { ROUTES } from '../constants/routes';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const loginApi = (body: LoginRequest) => post<TokenResponse>('/api/v1/auth/login', body);
const getMe = () => get<UserResponse>('/api/v1/auth/me');

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    enabled: !!localStorage.getItem('access_token'),
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSettled: () => {
      clearToken();
      queryClient.clear();
      window.location.href = ROUTES.LOGIN;
    },
  });
};

