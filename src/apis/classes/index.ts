import { httpClient } from '@/utils'
import type { ClassesDto, GradeClassDto } from '../types'

export function getClassesApi(params?: {
  page?: number
  pageSize?: number
  grade?: string
  name?: string
  headmaster?: string
}) {
  return httpClient.getPaginated<ClassesDto>('/api/classes', params)
}

export function getClassByIdApi(id: string) {
  return httpClient.get<ClassesDto>(`/api/classes/${id}`)
}

export function createClassApi(data: { grade: string; name: string; headmaster?: string }) {
  return httpClient.post<ClassesDto>('/api/classes', data)
}

export function updateClassApi(
  id: string,
  data: { grade?: string; name?: string; headmaster?: string },
) {
  return httpClient.put<ClassesDto>(`/api/classes/${id}`, data)
}

export function deleteClassApi(id: string) {
  return httpClient.delete<null>(`/api/classes/${id}`)
}

export function getGradeClassApi() {
  return httpClient.get<GradeClassDto>(`/api/classes/grade-classes`).then(res => {
    console.log('getGradeClassApi res', res)
    return res
  })
}
