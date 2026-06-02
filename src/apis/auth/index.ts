import { request } from '@/utils/request'
import type { ApiResponse, LoginResponse } from '../types'

export function loginApi(data: { username: string; password: string }) {
  return request.post<ApiResponse<LoginResponse>>('/api/login', data)
}

export function logoutApi() {
  return request.post<ApiResponse<null>>('/api/auth/logout')
}
