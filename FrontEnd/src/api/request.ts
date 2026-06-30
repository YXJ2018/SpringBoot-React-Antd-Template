import axios from 'axios';
import { message } from '@/store/slices/staticFunctionSlice';
import { getToken, removeToken } from '@/utils/auth';
import type { ApiResult } from '@/types/api';

const service = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResult<unknown>;
    if (res.code !== 200) {
      if (res.code === 401 || res.code === 403) {
        sessionStorage.setItem('authError', res.msg || '登录已过期，请重新登录');
        removeToken();
        window.location.href = '/login';
        return Promise.reject(new Error(res.msg));
      }
      return Promise.reject(new Error(res.msg));
    }
    return res.data as any;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.setItem('authError', '登录已过期，请重新登录');
      removeToken();
      window.location.href = '/login';
    } else {
      message.error(error.message || 'Network error');
    }
    return Promise.reject(error);
  },
);

export default service;
