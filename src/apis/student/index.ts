import { httpClient } from '@/utils'
import type { StudentDto } from '../types'

export function getAllStudentsApi(params?: { page?: number; pageSize?: number }) {
  return httpClient.getPaginated<StudentDto>('/api/students', params)
}

export function getStudentByIdApi(id: string) {
  return httpClient.get<StudentDto>(`/api/students/${id}`)
}

export function saveStudentApi(data: Partial<StudentDto>) {
  return httpClient.post<StudentDto>('/api/students', data)
}

export function updateStudentApi(data: Partial<StudentDto>) {
  return httpClient.put<StudentDto>(`/api/students/${data.id}`, data)
}

export function deleteStudentApi(id: string) {
  return httpClient.delete<null>(`/api/students/${id}`)
}
