import { request } from '@/utils/request'
import type { ApiResponse, PaginatedData, ClassesDto } from '../types'

export function getClassesApi(params?: {
  page?: number
  pageSize?: number
  grade?: string
  name?: string
}) {
  return request.get<ApiResponse<PaginatedData<ClassesDto>>>('/api/classes/', { params })
}

export function getClassByIdApi(id: string) {
  return request.get<ApiResponse<ClassesDto>>(`/api/classes/${id}/`)
}

export function createClassApi(data: { grade: string; name: string; headmaster?: string }) {
  return request.post<ApiResponse<ClassesDto>>('/api/classes/', data)
}

export function updateClassApi(id: string, data: { grade?: string; name?: string; headmaster?: string }) {
  return request.put<ApiResponse<ClassesDto>>(`/api/classes/${id}/`, data)
}

export function deleteClassApi(id: string) {
  return request.delete<ApiResponse<null>>(`/api/classes/${id}/`)
}
