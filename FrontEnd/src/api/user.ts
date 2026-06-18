import request from './request';
import type { PageResult, PageQuery } from '@/types/api';
import type { UserVO, UserDTO } from '@/types/user';

export function getUserListApi(params: PageQuery & { username?: string; nickname?: string; phone?: string; status?: number }) {
  return request.get<unknown, PageResult<UserVO>>('/system/user/list', { params });
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

export function resetPwdApi(userId: number, password: string) {
  return request.put('/system/user/resetPwd', { userId, password });
}

export function changeStatusApi(userId: number, status: number) {
  return request.put('/system/user/changeStatus', { userId, status });
}

export function assignRolesApi(userId: number, roleIds: number[]) {
  return request.put('/system/user/assignRoles', { userId, roleIds });
}
