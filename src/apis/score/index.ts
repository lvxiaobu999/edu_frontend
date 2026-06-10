import { httpClient } from '@/utils'
import type { ScoreDto } from '../types'

export function getScoresApi(params?: {
  page?: number
  pageSize?: number
  exam?: string
  subject?: string
  student?: string
}) {
  return httpClient.getPaginated<ScoreDto>('/api/scores', params)
}

export function getScoreByIdApi(id: string) {
  return httpClient.get<ScoreDto>(`/api/scores/${id}`)
}

export function createScoreApi(data: {
  student: string
  exam: string
  subject: string
  score: number
}) {
  return httpClient.post<ScoreDto>('/api/scores', data)
}

export function updateScoreApi(
  id: string,
  data: { student?: string; exam?: string; subject?: string; score?: number },
) {
  return httpClient.put<ScoreDto>(`/api/scores/${id}`, data)
}

export function deleteScoreApi(id: string) {
  return httpClient.delete<null>(`/api/scores/${id}`)
}
