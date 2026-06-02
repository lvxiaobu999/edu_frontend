import { request } from '@/utils/request'
import type { ApiResponse, PaginatedData, ResearchGroupDto } from '../types'

export function getResearchGroupsApi(params?: {
  page?: number
  pageSize?: number
  name?: string
}) {
  return request.get<ApiResponse<PaginatedData<ResearchGroupDto>>>('/api/research-groups/', { params })
}

export function getResearchGroupByIdApi(id: string) {
  return request.get<ApiResponse<ResearchGroupDto>>(`/api/research-groups/${id}/`)
}

export function createResearchGroupApi(data: { name: string }) {
  return request.post<ApiResponse<ResearchGroupDto>>('/api/research-groups/', data)
}

export function updateResearchGroupApi(id: string, data: { name: string }) {
  return request.put<ApiResponse<ResearchGroupDto>>(`/api/research-groups/${id}/`, data)
}

export function deleteResearchGroupApi(id: string) {
  return request.delete<ApiResponse<null>>(`/api/research-groups/${id}/`)
}
