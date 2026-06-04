import { httpClient } from '@/utils'
import type { TeacherProfileDto } from '../types'

export function getTeacherProfileApi() {
  return httpClient.get<TeacherProfileDto>('/api/profile/teacher')
}

export function saveTeacherProfileApi(data: Partial<TeacherProfileDto>) {
  return httpClient.post<TeacherProfileDto>('/api/profile/teacher', data)
}

export function updateTeacherProfileApi(data: Partial<TeacherProfileDto>) {
  return httpClient.put<TeacherProfileDto>('/api/profile/teacher', data)
}
