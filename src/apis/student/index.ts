import { httpClient } from '@/utils'
import type { StudentProfileDto } from '../types'

export function getStudentProfileApi() {
  return httpClient.get<StudentProfileDto>('/api/profile/student')
}

export function saveStudentProfileApi(data: Partial<StudentProfileDto>) {
  return httpClient.post<StudentProfileDto>('/api/profile/student', data)
}

export function updateStudentProfileApi(data: Partial<StudentProfileDto>) {
  return httpClient.put<StudentProfileDto>('/api/profile/student', data)
}
