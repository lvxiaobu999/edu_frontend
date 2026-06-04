import { httpClient } from '@/utils'
import type { UserDto } from '../types'

export function getUsersApi(params: {
  page?: number
  pageSize?: number
  username?: string
  role?: string
}) {
  return httpClient.getPaginated<UserDto>('/api/users', params)
}

export function getUserByIdApi(id: string) {
  return httpClient.get<UserDto>(`/api/users/${id}`)
}

export function createUserApi(data: Record<string, unknown>) {
  return httpClient.post<UserDto>('/api/users', data)
}

export function updateUserApi(id: string, data: Record<string, unknown>) {
  return httpClient.put<UserDto>(`/api/users/${id}`, data)
}

export function deleteUserApi(id: string) {
  return httpClient.delete<null>(`/api/users/${id}`)
}

export function approveUserApi(id: string) {
  return httpClient.post<UserDto>(`/api/users/${id}/approve`)
}

export function getPendingUsersApi(params?: { page?: number; pageSize?: number }) {
  return httpClient.getPaginated<UserDto>('/api/users/pending', params)
}

export function registerApi(data: {
  username: string
  password: string
  email?: string
  role?: string
}) {
  return httpClient.post<UserDto>('/api/users/register', data)
}
