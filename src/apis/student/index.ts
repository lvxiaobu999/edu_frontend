import { request } from '@/utils/request'
import type { ApiResponse, StudentProfileDto } from '../types'

export function getStudentProfileApi() {
  return request.get<ApiResponse<StudentProfileDto>>('/api/profile/student/')
}

export function saveStudentProfileApi(data: Partial<StudentProfileDto>) {
  return request.post<ApiResponse<StudentProfileDto>>('/api/profile/student/', data)
}

export function updateStudentProfileApi(data: Partial<StudentProfileDto>) {
  return request.put<ApiResponse<StudentProfileDto>>('/api/profile/student/', data)
}
