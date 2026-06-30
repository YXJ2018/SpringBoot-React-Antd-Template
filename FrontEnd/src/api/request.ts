import axios from 'axios';
import { message } from '@/store/slices/staticFunctionSlice';
import { getToken, removeToken } from '@/utils/auth';
import type { ApiResult } from '@/types/api';

const HTTP_UNAUTHORIZED = 401; // 未认证
const HTTP_FORBIDDEN = 403; // 已认证，未授权

/** 处理认证/授权失败，返回 true 表示已拦截 */
function handleAuthError(code: number): boolean {
  if (code === HTTP_UNAUTHORIZED) {
    sessionStorage.setItem('authError', '登录已失效，请重新登录');
    removeToken();
    window.location.href = '/login';
    return true;
  }
  if (code === HTTP_FORBIDDEN) {
    message.error('权限不足，请联系管理员');
    return true;
  }
  return false;
}

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
    if (handleAuthError(res.code)) {
      return Promise.reject(new Error(res.msg));
    }
    return res.data as any;
  },
  (error) => {
    if (!handleAuthError(error.response?.status)) {
      message.error(error.message || '网络错误，请联系管理员');
    }
    return Promise.reject(error);
  },
);

export default service;
