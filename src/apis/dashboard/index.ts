import { httpClient } from '@/utils'
import type { DashboardStats } from '../types'

export function getDashboardStatsApi(grade?: string) {
  return httpClient.get<DashboardStats>('/api/dashboard/stats', grade ? { grade } : undefined)
}
