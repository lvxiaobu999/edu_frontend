import { httpClient } from '@/utils'
import type { LoginResponse } from '../types'

export function loginApi(data: { username: string; password: string }) {
  return httpClient.post<LoginResponse>('/api/login', data)
}

export function logoutApi(data: { refreshToken: string }) {
  return httpClient.post<null>('/api/logout', data)
}
