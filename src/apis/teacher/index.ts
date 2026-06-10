import { httpClient } from '@/utils'
import type { TeacherDto } from '../types'

export function getAllTeachersApi(params?: { page?: number; pageSize?: number }) {
  return httpClient.getPaginated<TeacherDto>('/api/teachers', params)
}

export function getTeacherByIdApi(id: string) {
  return httpClient.get<TeacherDto>(`/api/teachers/${id}`)
}

export function saveTeacherApi(data: Partial<TeacherDto>) {
  return httpClient.post<TeacherDto>('/api/teachers', data)
}

export function updateTeacherApi(data: Partial<TeacherDto>) {
  return httpClient.put<TeacherDto>(`/api/teachers/${data.id}`, data)
}

export function deleteTeacherApi(id: string) {
  return httpClient.delete<null>(`/api/teachers/${id}`)
}
