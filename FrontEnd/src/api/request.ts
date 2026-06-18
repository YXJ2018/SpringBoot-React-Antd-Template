import axios from 'axios';
import { message } from 'antd';
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
      message.error(res.msg || 'Error');
      if (res.code === 401 || res.code === 403) {
        removeToken();
        window.location.href = '/login';
      }
      return Promise.reject(new Error(res.msg));
    }
    return res.data as any;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      removeToken();
      window.location.href = '/login';
    }
    message.error(error.message || 'Network error');
    return Promise.reject(error);
  },
);

export default service;
