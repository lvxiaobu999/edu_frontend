import { httpClient } from '@/utils'
import type { SemesterDto } from '../types'

export function getSemestersApi(params?: { page?: number; pageSize?: number; name?: string }) {
  return httpClient.getPaginated<SemesterDto>('/api/semesters', params)
}

export function getSemesterByIdApi(id: string) {
  return httpClient.get<SemesterDto>(`/api/semesters/${id}`)
}

export function createSemesterApi(data: { name: string; display_name: string }) {
  return httpClient.post<SemesterDto>('/api/semesters', data)
}

export function updateSemesterApi(id: string, data: { name?: string; display_name?: string }) {
  return httpClient.put<SemesterDto>(`/api/semesters/${id}`, data)
}

export function deleteSemesterApi(id: string) {
  return httpClient.delete<null>(`/api/semesters/${id}`)
}
