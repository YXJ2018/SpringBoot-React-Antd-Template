import request from './request';
import type { PageResult, PageQuery } from '@/types/api';
import type { UserVO, UserDTO, UserImportResult } from '@/types/user';
import { getToken } from '@/utils/auth';

export function getUserListApi(data: PageQuery & { username?: string; nickname?: string; phone?: string; email?: string; roleIds?: number[]; status?: number }) {
  return request.post<unknown, PageResult<UserVO>>('/system/user/list', data);
}

export function getUserByIdApi(userId: number) {
  return request.get<unknown, UserVO>(`/system/user/${userId}`);
}

export function createUserApi(data: UserDTO) {
  return request.post('/system/user', data);
}

export function updateUserApi(data: UserDTO) {
  return request.put('/system/user', data);
}

export function deleteUserApi(userId: number) {
  return request.delete(`/system/user/${userId}`);
}

export function deleteUserBatchApi(ids: number[]) {
  return request.delete('/system/user/batch', { data: ids });
}

export function resetPwdApi(userId: number, password: string) {
  return request.put('/system/user/resetPwd', { userId, password });
}

export function changeStatusApi(userId: number, status: number) {
  return request.put('/system/user/changeStatus', { userId, status });
}

export function assignRolesApi(userId: number, roleIds: number[]) {
  return request.put('/system/user/assignRoles', { userId, roleIds });
}

export function importUsersApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<unknown, UserImportResult>('/system/user/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
}

export async function downloadTemplateApi() {
  const token = getToken();
  const res = await fetch('/api/system/user/import/template', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = '用户导入模板.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
