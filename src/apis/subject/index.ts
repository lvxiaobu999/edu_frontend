import { httpClient } from '@/utils'
import type { SubjectDto } from '../types'

export function getSubjectsApi(params?: { page?: number; pageSize?: number; name?: string }) {
  return httpClient.getPaginated<SubjectDto>('/api/subjects', params)
}

export function getSubjectByIdApi(id: string) {
  return httpClient.get<SubjectDto>(`/api/subjects/${id}`)
}

export function createSubjectApi(data: { name: string }) {
  return httpClient.post<SubjectDto>('/api/subjects', data)
}

export function updateSubjectApi(id: string, data: { name: string }) {
  return httpClient.put<SubjectDto>(`/api/subjects/${id}`, data)
}

export function deleteSubjectApi(id: string) {
  return httpClient.delete<null>(`/api/subjects/${id}`)
}
