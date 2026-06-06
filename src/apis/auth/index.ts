import { httpClient } from '@/utils'
import axios from 'axios'
import type { LoginResponse } from '../types'

export function loginApi(data: { username: string; password: string }) {
  return httpClient.post<LoginResponse>('/api/login', data)
}

export function logoutApi(data: { refresh: string }) {
  return httpClient.post<null>('/api/logout', data)
}

/** 刷新 token — 使用原生 axios 绕开拦截器，避免 401 死循环 */
export async function refreshTokenApi(refreshToken: string): Promise<{
  access: string
  refresh: string
}> {
  try {
    return axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/token_refresh`, {
        refresh: refreshToken,
      })
      .then(res => res.data.data)
  } catch (_error) {
    console.error('刷新 Token 失败', _error)
  }

  return {
    access: '',
    refresh: '',
  }
}
