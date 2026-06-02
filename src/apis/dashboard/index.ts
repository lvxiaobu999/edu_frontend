import { request } from '@/utils/request'
import type { ApiResponse, DashboardStats } from '../types'

export function getDashboardStatsApi(grade?: string) {
  return request.get<ApiResponse<DashboardStats>>('/api/dashboard/stats/', {
    params: grade ? { grade } : undefined,
  })
}
