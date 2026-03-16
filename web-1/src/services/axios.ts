import axios from 'axios';
import { clearToken, getToken } from '../utils/token';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const get = async <T>(url: string, params?: object): Promise<T> => {
  const response = await instance.get<T>(url, { params });
  return response.data;
};

export const post = async <T>(url: string, body?: object): Promise<T> => {
  const response = await instance.post<T>(url, body);
  return response.data;
};

export const put = async <T>(url: string, body?: object): Promise<T> => {
  const response = await instance.put<T>(url, body);
  return response.data;
};

export const del = async <T>(url: string): Promise<T> => {
  const response = await instance.delete<T>(url);
  return response.data;
};

