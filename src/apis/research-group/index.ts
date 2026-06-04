import { httpClient } from '@/utils'
import type { ResearchGroupDto } from '../types'

export function getResearchGroupsApi(params?: { page?: number; pageSize?: number; name?: string }) {
  return httpClient.getPaginated<ResearchGroupDto>('/api/research-groups', params)
}

export function getResearchGroupByIdApi(id: string) {
  return httpClient.get<ResearchGroupDto>(`/api/research-groups/${id}`)
}

export function createResearchGroupApi(data: { name: string }) {
  return httpClient.post<ResearchGroupDto>('/api/research-groups', data)
}

export function updateResearchGroupApi(id: string, data: { name: string }) {
  return httpClient.put<ResearchGroupDto>(`/api/research-groups/${id}`, data)
}

export function deleteResearchGroupApi(id: string) {
  return httpClient.delete<null>(`/api/research-groups/${id}`)
}
