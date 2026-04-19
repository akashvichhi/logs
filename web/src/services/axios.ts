import axios from 'axios';

import { clearToken, getToken } from '@src/utils/token';
import { keysToCamel, keysToSnake } from '@src/utils/util';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data) {
    config.data = keysToSnake(config.data)
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    response.data = keysToCamel(response.data)
    return response
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      clearToken();
      window.location.href = '/login';
    }

    // Extract messages from API response and set as error.message
    const messages = error.response?.data?.messages ?? [];
    error.message = messages[0] || 'Something went wrong. Please try again.'
    return Promise.reject(error);
  },
);

export const apiGet = async <T>(url: string, params?: object): Promise<T> => {
  const response = await instance.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, body?: object): Promise<T> => {
  const response = await instance.post<T>(url, body);
  return response.data;
};

export const apiPut = async <T>(url: string, body?: object): Promise<T> => {
  const response = await instance.put<T>(url, body);
  return response.data;
};

export const apiPatch = async <T>(url: string, body?: object): Promise<T> => {
  const response = await instance.patch<T>(url, body);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await instance.delete<T>(url);
  return response.data;
};

