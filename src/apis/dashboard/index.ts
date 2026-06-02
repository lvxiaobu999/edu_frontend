import { request } from '@/utils/request'
import type { ApiResponse, DashboardStats } from '../types'

export function getDashboardStatsApi() {
  return request.get<ApiResponse<DashboardStats>>('/api/dashboard/stats')
}
