import { request } from '@/utils/request'
import type { ApiResponse, TeacherProfileDto } from '../types'

export function getTeacherProfileApi() {
  return request.get<ApiResponse<TeacherProfileDto>>('/api/profile/teacher/')
}

export function saveTeacherProfileApi(data: Partial<TeacherProfileDto>) {
  return request.post<ApiResponse<TeacherProfileDto>>('/api/profile/teacher/', data)
}

export function updateTeacherProfileApi(data: Partial<TeacherProfileDto>) {
  return request.put<ApiResponse<TeacherProfileDto>>('/api/profile/teacher/', data)
}
