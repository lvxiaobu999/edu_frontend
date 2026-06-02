import { request } from '@/utils/request'
import type { ApiResponse, PaginatedData, UserDto } from '../types'

export function getUsersApi(params: {
  page?: number
  pageSize?: number
  username?: string
  role?: string
}) {
  return request.get<ApiResponse<PaginatedData<UserDto>>>('/api/', { params })
}

export function getUserByIdApi(id: string) {
  return request.get<ApiResponse<UserDto>>(`/api/${id}/`)
}

export function createUserApi(data: Record<string, unknown>) {
  return request.post<ApiResponse<UserDto>>('/api/', data)
}

export function updateUserApi(id: string, data: Record<string, unknown>) {
  return request.put<ApiResponse<UserDto>>(`/api/${id}/`, data)
}

export function deleteUserApi(id: string) {
  return request.delete<ApiResponse<null>>(`/api/${id}/`)
}

export function approveUserApi(id: string) {
  return request.post<ApiResponse<UserDto>>(`/api/${id}/approve/`)
}

export function getPendingUsersApi(params?: { page?: number; pageSize?: number }) {
  return request.get<ApiResponse<PaginatedData<UserDto>>>('/api/pending/', { params })
}

export function registerApi(data: { username: string; password: string; email?: string; role?: string }) {
  return request.post<ApiResponse<UserDto>>('/api/register/', data)
}
