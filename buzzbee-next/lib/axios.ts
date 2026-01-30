/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  config.headers = config.headers ?? {};

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        (error.response.data as any)?.message ||
        'Something went wrong. Please try again.';

      switch (status) {
        case 401:
          // Unauthorized → logout
          console.error('Unauthorized:', message);

          // Cookies.remove('token');
          // window.location.href = '/sign-in';
          break;

        case 403:
          console.error('Forbidden:', message);
          break;

        case 404:
          console.error('Resource not found:', message);
          break;

        case 500:
          console.error('Server error:', message);
          break;

        default:
          console.error(`API error (${status}):`, message);
          break;
      }

      return Promise.reject({
        status,
        message,
        data: error.response.data,
      });
    }

    return Promise.reject({
      status: 0,
      message: 'Network error. Please check your internet connection.',
    });
  }
);

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((res) => res.data);

export const post = <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => api.post<T>(url, data, config).then((res) => res.data);

export const put = <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => api.put<T>(url, data, config).then((res) => res.data);

export const patch = <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => api.patch<T>(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config).then((res) => res.data);

export default api;
