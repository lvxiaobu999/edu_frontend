import { httpClient } from '@/utils'
import type { ExamDto } from '../types'

export function getExamsApi(params?: {
  page?: number
  pageSize?: number
  exam_type?: string
  grade?: string
  semester?: string
}) {
  return httpClient.getPaginated<ExamDto>('/api/exams', params)
}

export function getExamByIdApi(id: string) {
  return httpClient.get<ExamDto>(`/api/exams/${id}`)
}

export function createExamApi(data: {
  exam_type: string
  exam_date: string
  grade: string
  semester: string
}) {
  return httpClient.post<ExamDto>('/api/exams', data)
}

export function updateExamApi(
  id: string,
  data: {
    exam_type?: string
    exam_date?: string
    grade?: string
    semester?: string
  },
) {
  return httpClient.put<ExamDto>(`/api/exams/${id}`, data)
}

export function deleteExamApi(id: string) {
  return httpClient.delete<null>(`/api/exams/${id}`)
}
